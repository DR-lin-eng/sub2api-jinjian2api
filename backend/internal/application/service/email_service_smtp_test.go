//go:build unit

package service

import (
	"bufio"
	"crypto/ecdsa"
	"crypto/elliptic"
	"crypto/rand"
	"crypto/tls"
	"crypto/x509"
	"crypto/x509/pkix"
	"math/big"
	"net"
	"strings"
	"sync"
	"sync/atomic"
	"testing"
	"time"
)

func newSMTPTestCert(t *testing.T) (tls.Certificate, *x509.CertPool) {
	t.Helper()
	privateKey, err := ecdsa.GenerateKey(elliptic.P256(), rand.Reader)
	if err != nil {
		t.Fatalf("generate key: %v", err)
	}
	template := x509.Certificate{
		SerialNumber:          big.NewInt(1),
		Subject:               pkix.Name{CommonName: "127.0.0.1"},
		NotBefore:             time.Now().Add(-time.Hour),
		NotAfter:              time.Now().Add(time.Hour),
		KeyUsage:              x509.KeyUsageDigitalSignature | x509.KeyUsageKeyEncipherment,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
		IPAddresses:           []net.IP{net.ParseIP("127.0.0.1")},
		DNSNames:              []string{"localhost"},
	}
	der, err := x509.CreateCertificate(rand.Reader, &template, &template, &privateKey.PublicKey, privateKey)
	if err != nil {
		t.Fatalf("create certificate: %v", err)
	}
	leaf, err := x509.ParseCertificate(der)
	if err != nil {
		t.Fatalf("parse certificate: %v", err)
	}
	pool := x509.NewCertPool()
	pool.AddCert(leaf)
	return tls.Certificate{Certificate: [][]byte{der}, PrivateKey: privateKey}, pool
}

type fakeSMTPServer struct {
	listener          net.Listener
	tlsConfig         *tls.Config
	advertiseStartTLS bool

	mu       sync.Mutex
	commands []string
	conns    atomic.Int64
	wg       sync.WaitGroup
}

func startFakeSMTPServer(t *testing.T, implicitTLS, advertiseStartTLS bool) (*fakeSMTPServer, int) {
	t.Helper()
	cert, pool := newSMTPTestCert(t)
	previousPool := smtpTestRootCAs
	smtpTestRootCAs = pool
	t.Cleanup(func() { smtpTestRootCAs = previousPool })

	listener, err := net.Listen("tcp", "127.0.0.1:0")
	if err != nil {
		t.Fatalf("listen: %v", err)
	}
	server := &fakeSMTPServer{
		listener:          listener,
		tlsConfig:         &tls.Config{Certificates: []tls.Certificate{cert}, MinVersion: tls.VersionTLS12},
		advertiseStartTLS: advertiseStartTLS,
	}
	if implicitTLS {
		server.listener = tls.NewListener(listener, server.tlsConfig)
	}
	t.Cleanup(func() {
		_ = server.listener.Close()
		server.wg.Wait()
	})

	server.wg.Add(1)
	go func() {
		defer server.wg.Done()
		for {
			conn, err := server.listener.Accept()
			if err != nil {
				return
			}
			server.conns.Add(1)
			server.wg.Add(1)
			go func() {
				defer server.wg.Done()
				defer func() { _ = conn.Close() }()
				_ = conn.SetDeadline(time.Now().Add(10 * time.Second))
				server.serve(conn)
			}()
		}
	}()

	return server, listener.Addr().(*net.TCPAddr).Port
}

func (s *fakeSMTPServer) record(command string) {
	s.mu.Lock()
	s.commands = append(s.commands, command)
	s.mu.Unlock()
}

func (s *fakeSMTPServer) sawCommand(prefix string) bool {
	s.mu.Lock()
	defer s.mu.Unlock()
	for _, command := range s.commands {
		if strings.HasPrefix(strings.ToUpper(command), prefix) {
			return true
		}
	}
	return false
}

func (s *fakeSMTPServer) serve(conn net.Conn) {
	reader := bufio.NewReader(conn)
	writer := bufio.NewWriter(conn)
	if !writeSMTPTestLine(writer, "220 fake.test ESMTP ready") {
		return
	}
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			return
		}
		command := strings.TrimSpace(line)
		s.record(command)
		upper := strings.ToUpper(command)
		switch {
		case strings.HasPrefix(upper, "EHLO"), strings.HasPrefix(upper, "HELO"):
			if !writeSMTPTestLine(writer, "250-fake.test") {
				return
			}
			if s.advertiseStartTLS && !writeSMTPTestLine(writer, "250-STARTTLS") {
				return
			}
			if !writeSMTPTestLine(writer, "250-AUTH PLAIN LOGIN") || !writeSMTPTestLine(writer, "250 8BITMIME") {
				return
			}
		case upper == "STARTTLS" && s.advertiseStartTLS:
			if !writeSMTPTestLine(writer, "220 2.0.0 ready to start TLS") {
				return
			}
			tlsConn := tls.Server(conn, s.tlsConfig)
			if err := tlsConn.Handshake(); err != nil {
				return
			}
			s.serveCommands(bufio.NewReader(tlsConn), bufio.NewWriter(tlsConn))
			return
		case strings.HasPrefix(upper, "AUTH"):
			if !writeSMTPTestLine(writer, "235 2.7.0 authentication successful") {
				return
			}
		case strings.HasPrefix(upper, "MAIL"), strings.HasPrefix(upper, "RCPT"):
			if !writeSMTPTestLine(writer, "250 ok") {
				return
			}
		case upper == "DATA":
			if !s.acceptSMTPTestData(reader, writer) {
				return
			}
		case upper == "QUIT":
			_ = writeSMTPTestLine(writer, "221 bye")
			return
		default:
			if !writeSMTPTestLine(writer, "250 ok") {
				return
			}
		}
	}
}

func (s *fakeSMTPServer) serveCommands(reader *bufio.Reader, writer *bufio.Writer) {
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			return
		}
		command := strings.TrimSpace(line)
		s.record(command)
		upper := strings.ToUpper(command)
		switch {
		case strings.HasPrefix(upper, "EHLO"), strings.HasPrefix(upper, "HELO"):
			if !writeSMTPTestLine(writer, "250-fake.test") || !writeSMTPTestLine(writer, "250-AUTH PLAIN LOGIN") || !writeSMTPTestLine(writer, "250 8BITMIME") {
				return
			}
		case strings.HasPrefix(upper, "AUTH"):
			if !writeSMTPTestLine(writer, "235 2.7.0 authentication successful") {
				return
			}
		case strings.HasPrefix(upper, "MAIL"), strings.HasPrefix(upper, "RCPT"):
			if !writeSMTPTestLine(writer, "250 ok") {
				return
			}
		case upper == "DATA":
			if !s.acceptSMTPTestData(reader, writer) {
				return
			}
		case upper == "QUIT":
			_ = writeSMTPTestLine(writer, "221 bye")
			return
		default:
			if !writeSMTPTestLine(writer, "250 ok") {
				return
			}
		}
	}
}

func (s *fakeSMTPServer) acceptSMTPTestData(reader *bufio.Reader, writer *bufio.Writer) bool {
	if !writeSMTPTestLine(writer, "354 go ahead") {
		return false
	}
	for {
		line, err := reader.ReadString('\n')
		if err != nil {
			return false
		}
		if strings.TrimRight(line, "\r\n") == "." {
			return writeSMTPTestLine(writer, "250 message accepted")
		}
	}
}

func writeSMTPTestLine(writer *bufio.Writer, line string) bool {
	if _, err := writer.WriteString(line + "\r\n"); err != nil {
		return false
	}
	return writer.Flush() == nil
}

func smtpTestConfig(port int, useTLS bool) *SMTPConfig {
	return &SMTPConfig{
		Host:     "127.0.0.1",
		Port:     port,
		Username: "user",
		Password: "pass",
		From:     "noreply@example.com",
		FromName: "Test",
		UseTLS:   useTLS,
	}
}

func TestSMTPConnectionImplicitTLS(t *testing.T) {
	server, port := startFakeSMTPServer(t, true, false)
	requireSMTPTestSuccess(t, (&EmailService{}).TestSMTPConnectionWithConfig(smtpTestConfig(port, true)))
	if !server.sawCommand("EHLO") {
		t.Fatal("expected EHLO")
	}
}

func TestSMTPConnectionStartTLSFallbackWhenTLSEnabled(t *testing.T) {
	server, port := startFakeSMTPServer(t, false, true)
	requireSMTPTestSuccess(t, (&EmailService{}).TestSMTPConnectionWithConfig(smtpTestConfig(port, true)))
	if !server.sawCommand("STARTTLS") || server.conns.Load() < 2 {
		t.Fatalf("expected implicit TLS attempt followed by STARTTLS, connections=%d", server.conns.Load())
	}
}

func TestSMTPConnectionMandatoryStartTLSRefusesPlaintext(t *testing.T) {
	server, port := startFakeSMTPServer(t, false, false)
	err := (&EmailService{}).TestSMTPConnectionWithConfig(smtpTestConfig(port, true))
	if err == nil || !strings.Contains(err.Error(), "STARTTLS") {
		t.Fatalf("expected STARTTLS error, got %v", err)
	}
	if server.sawCommand("AUTH") {
		t.Fatal("credentials must not be sent over plaintext")
	}
}

func TestSMTPConnectionOpportunisticStartTLSWhenTLSDisabled(t *testing.T) {
	server, port := startFakeSMTPServer(t, false, true)
	requireSMTPTestSuccess(t, (&EmailService{}).TestSMTPConnectionWithConfig(smtpTestConfig(port, false)))
	if !server.sawCommand("STARTTLS") {
		t.Fatal("expected STARTTLS")
	}
}

func TestSMTPConnectionPlainWhenNoStartTLS(t *testing.T) {
	server, port := startFakeSMTPServer(t, false, false)
	requireSMTPTestSuccess(t, (&EmailService{}).TestSMTPConnectionWithConfig(smtpTestConfig(port, false)))
	if server.sawCommand("STARTTLS") {
		t.Fatal("did not expect STARTTLS")
	}
}

func TestSendEmailWithConfigStartTLSFallback(t *testing.T) {
	server, port := startFakeSMTPServer(t, false, true)
	err := (&EmailService{}).SendEmailWithConfig(smtpTestConfig(port, true), "rcpt@example.com", "subject", "<p>body</p>")
	requireSMTPTestSuccess(t, err)
	if !server.sawCommand("STARTTLS") || !server.sawCommand("DATA") {
		t.Fatal("expected STARTTLS and DATA")
	}
}

func TestSendEmailWithConfigImplicitTLS(t *testing.T) {
	server, port := startFakeSMTPServer(t, true, false)
	err := (&EmailService{}).SendEmailWithConfig(smtpTestConfig(port, true), "rcpt@example.com", "subject", "<p>body</p>")
	requireSMTPTestSuccess(t, err)
	if !server.sawCommand("DATA") {
		t.Fatal("expected DATA")
	}
}

func requireSMTPTestSuccess(t *testing.T, err error) {
	t.Helper()
	if err != nil {
		t.Fatalf("expected SMTP operation to succeed: %v", err)
	}
}
