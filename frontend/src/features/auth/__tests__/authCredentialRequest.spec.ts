import { beforeEach, describe, expect, it, vi } from 'vitest'
import { apiClient } from '@/core/networks/client'
import { login } from '../data/datasources/authDatasource'
import { createCredentialEnvelope } from '@/core/networks/credentialEncryption'
import type { CredentialEnvelope } from '@/types'

vi.mock('@/core/networks/credentialEncryption', () => ({
  createCredentialEnvelope: vi.fn()
}))

const envelope: CredentialEnvelope = {
  algorithm: 'RSA-OAEP-256+A256GCM',
  key_id: 'key-1',
  encrypted_key: 'encrypted-key',
  iv: 'random-iv',
  ciphertext: 'encrypted-credentials'
}

describe('authentication credential requests', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(createCredentialEnvelope).mockResolvedValue(envelope)
  })

  it('does not send plaintext email or password during login', async () => {
    const post = vi.spyOn(apiClient, 'post').mockResolvedValue({
      data: { requires_2fa: true, temp_token: 'temporary-token' }
    })

		await login({
			email: 'user@example.com',
			password: 'secret-123'
		})

    expect(createCredentialEnvelope).toHaveBeenCalledWith('user@example.com', 'secret-123')
		expect(post).toHaveBeenCalledWith('/auth/login', {
			credential_envelope: envelope
    })
    const request = post.mock.calls[0]?.[1] as Record<string, unknown>
    expect(request).not.toHaveProperty('email')
    expect(request).not.toHaveProperty('password')
  })
})
