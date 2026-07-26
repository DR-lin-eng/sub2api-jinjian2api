# Release signing

## Automatic release

Run the `Release` workflow without inputs. It reads the default version from
`backend/cmd/server/VERSION`, creates that tag when unused, or increments the patch
number until it finds an unused tag. The GitHub Release body is intentionally empty
and can be edited after publishing.

Binary releases from this repository are authenticated with an Ed25519 signature over
`checksums.txt`. The updater and installer reject a release when `checksums.txt`,
`checksums.txt.sig`, or the signature verification is missing or invalid.

The public key is committed in:

- `deploy/update-signing-public-key.txt` for the Go updater and release workflow.
- `deploy/update-signing-public-key.pem` for the installation script.

The matching private key must only be stored as the GitHub Actions secret
`UPDATE_SIGNING_PRIVATE_KEY`. For the initial local key generated during repository
migration, configure the secret from the ignored file without printing it:

```bash
gh secret set UPDATE_SIGNING_PRIVATE_KEY --repo DR-lin-eng/sub2api-no2api < .release-secrets/update-signing-key.pem
```

Back up the private key in an approved secret manager before removing the local copy.
Do not commit the private key or paste it into workflow files, issues, or logs. The
release workflow fails closed when the secret is absent or does not match the committed
public key.
