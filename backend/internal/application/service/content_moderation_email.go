package service

import (
	"fmt"
	"html"
	"strings"
	"time"
)

func buildContentModerationViolationEmailBody(siteName string, log *ContentModerationLog) string {
	if log == nil {
		return ""
	}
	return fmt.Sprintf(`<!doctype html>
<html>
<body style="margin:0;padding:0;background:#f5f6fb;color:#222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:680px;margin:0 auto;padding:32px 20px;">
    <div style="height:8px;background:#ef4444;border-radius:14px 14px 0 0;"></div>
    <div style="background:#fff;border-radius:0 0 14px 14px;padding:40px 48px;box-shadow:0 8px 28px rgba(15,23,42,.08);">
      <div style="letter-spacing:4px;color:#999;font-size:14px;text-transform:uppercase;">Risk Control / 风控提醒</div>
	  <h1 style="margin:20px 0 28px;font-size:30px;line-height:1.25;">网关请求触发内容审计规则</h1>
	  <p style="font-size:17px;line-height:1.9;margin:0 0 24px;">管理员您好，一次网关请求命中了内容审计策略。请求已按当前风控模式处理，详情如下。</p>
      <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:12px;padding:22px 28px;margin:28px 0;">
        <h2 style="margin:0 0 18px;color:#b91c1c;font-size:18px;">触发详情</h2>
        <table style="width:100%%;border-collapse:collapse;font-size:16px;">
          <tr><td style="padding:12px 0;color:#888;border-bottom:1px solid #fee2e2;">触发时间</td><td style="padding:12px 0;border-bottom:1px solid #fee2e2;">%s</td></tr>
		  <tr><td style="padding:12px 0;color:#888;border-bottom:1px solid #fee2e2;">请求 ID</td><td style="padding:12px 0;border-bottom:1px solid #fee2e2;">%s</td></tr>
		  <tr><td style="padding:12px 0;color:#888;border-bottom:1px solid #fee2e2;">API Key</td><td style="padding:12px 0;border-bottom:1px solid #fee2e2;">%s</td></tr>
          <tr><td style="padding:12px 0;color:#888;border-bottom:1px solid #fee2e2;">所属分组</td><td style="padding:12px 0;border-bottom:1px solid #fee2e2;">%s</td></tr>
		  <tr><td style="padding:12px 0;color:#888;border-bottom:1px solid #fee2e2;">端点</td><td style="padding:12px 0;border-bottom:1px solid #fee2e2;">%s</td></tr>
		  <tr><td style="padding:12px 0;color:#888;border-bottom:1px solid #fee2e2;">上游 / 模型</td><td style="padding:12px 0;border-bottom:1px solid #fee2e2;">%s / %s</td></tr>
		  <tr><td style="padding:12px 0;color:#888;">命中类别</td><td style="padding:12px 0;color:#dc2626;font-weight:700;">%s / %.3f</td></tr>
        </table>
      </div>
	  <p style="font-size:15px;line-height:1.8;color:#666;">请在风控记录中查看完整审计上下文，并按需调整规则、分组范围或调用方 API Key。</p>
      <p style="font-size:14px;line-height:1.8;color:#777;margin-top:28px;">此邮件由 %s 自动发送，请勿回复。</p>
    </div>
  </div>
</body>
</html>`,
		html.EscapeString(time.Now().Format("2006-01-02 15:04:05")),
		html.EscapeString(defaultContentModerationString(log.RequestID, "-")),
		html.EscapeString(defaultContentModerationString(log.APIKeyName, "-")),
		html.EscapeString(defaultContentModerationString(log.GroupName, "-")),
		html.EscapeString(defaultContentModerationString(log.Endpoint, "-")),
		html.EscapeString(defaultContentModerationString(log.Provider, "-")),
		html.EscapeString(defaultContentModerationString(log.Model, "-")),
		html.EscapeString(defaultContentModerationString(log.HighestCategory, "-")),
		log.HighestScore,
		html.EscapeString(siteName),
	)
}

func defaultContentModerationString(value string, fallback string) string {
	if strings.TrimSpace(value) == "" {
		return fallback
	}
	return strings.TrimSpace(value)
}

// buildCyberPolicyNoticeEmailBody 是 cyber_policy 通知邮件的内置兜底正文，
// 当 notification email 模板渲染失败时使用（与 sendViolationEmail 的兜底同理）。
func buildCyberPolicyNoticeEmailBody(siteName string, log *ContentModerationLog) string {
	if log == nil {
		return ""
	}
	return fmt.Sprintf(`<!doctype html>
<html><body style="margin:0;padding:0;background:#f5f6fb;color:#222;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
  <div style="max-width:680px;margin:0 auto;padding:32px 20px;">
    <div style="height:8px;background:#ef4444;border-radius:14px 14px 0 0;"></div>
    <div style="background:#fff;border-radius:0 0 14px 14px;padding:40px 48px;box-shadow:0 8px 28px rgba(15,23,42,.08);">
      <div style="letter-spacing:4px;color:#999;font-size:14px;text-transform:uppercase;">Risk Control / 网络安全策略</div>
      <h1 style="margin:20px 0 28px;font-size:30px;line-height:1.25;">请求被网络安全策略拦截</h1>
	  <p style="font-size:17px;line-height:1.9;margin:0 0 24px;">管理员您好，一次网关请求被上游网络安全策略（cyber policy）拦截。</p>
      <div style="background:#fff1f2;border:1px solid #fecdd3;border-radius:12px;padding:22px 28px;margin:28px 0;">
        <table style="width:100%%;border-collapse:collapse;font-size:16px;">
          <tr><td style="padding:12px 0;color:#888;border-bottom:1px solid #fee2e2;">触发时间</td><td style="padding:12px 0;border-bottom:1px solid #fee2e2;">%s</td></tr>
          <tr><td style="padding:12px 0;color:#888;border-bottom:1px solid #fee2e2;">模型</td><td style="padding:12px 0;border-bottom:1px solid #fee2e2;">%s</td></tr>
          <tr><td style="padding:12px 0;color:#888;">上游说明</td><td style="padding:12px 0;">%s</td></tr>
        </table>
      </div>
      <p style="font-size:15px;line-height:1.8;color:#666;">如认为系误判，可调整请求措辞后重试，或申请获得授权的安全访问权限。</p>
      <p style="font-size:14px;line-height:1.8;color:#777;margin-top:28px;">此邮件由 %s 自动发送，请勿回复。</p>
    </div>
  </div>
</body></html>`,
		html.EscapeString(log.CreatedAt.Format("2006-01-02 15:04:05")),
		html.EscapeString(defaultContentModerationString(log.Model, "-")),
		html.EscapeString(defaultContentModerationString(log.Error, "-")),
		html.EscapeString(siteName),
	)
}
