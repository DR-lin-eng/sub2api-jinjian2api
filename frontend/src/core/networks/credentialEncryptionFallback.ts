import forge from 'node-forge'

interface JavaScriptEncryptionInput {
  publicKeySPKI: Uint8Array
  aesKey: Uint8Array
  iv: Uint8Array
  plaintext: Uint8Array
  additionalData: Uint8Array
  oaepSeed: Uint8Array
}

interface JavaScriptEncryptionResult {
  encryptedKey: Uint8Array
  ciphertext: Uint8Array
}

function toBinary(bytes: Uint8Array): string {
  let result = ''
  const chunkSize = 0x8000
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    result += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize))
  }
  return result
}

function fromBinary(value: string): Uint8Array {
  const bytes = new Uint8Array(value.length)
  for (let index = 0; index < value.length; index += 1) {
    bytes[index] = value.charCodeAt(index)
  }
  return bytes
}

export function encryptCredentialWithJavaScript(
  input: JavaScriptEncryptionInput
): JavaScriptEncryptionResult {
  const publicKeyASN1 = forge.asn1.fromDer(toBinary(input.publicKeySPKI))
  const publicKey = forge.pki.publicKeyFromAsn1(publicKeyASN1)
  const encryptedKey = publicKey.encrypt(toBinary(input.aesKey), 'RSA-OAEP', {
    md: forge.md.sha256.create(),
    mgf1: { md: forge.md.sha256.create() },
    seed: toBinary(input.oaepSeed)
  })

  const cipher = forge.cipher.createCipher('AES-GCM', toBinary(input.aesKey))
  cipher.start({
    iv: toBinary(input.iv),
    additionalData: toBinary(input.additionalData),
    tagLength: 128
  })
  cipher.update(forge.util.createBuffer(toBinary(input.plaintext), 'raw'))
  if (!cipher.finish()) {
    throw new Error('Credential encryption failed')
  }

  const ciphertext = cipher.output.getBytes() + cipher.mode.tag.getBytes()
  return {
    encryptedKey: fromBinary(encryptedKey),
    ciphertext: fromBinary(ciphertext)
  }
}
