const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

function verifyWebhookSignature(raw, signature, secret) {
  if (!secret || !signature) return false
  const computedHex = crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('hex')
  const computedBase64 = Buffer.from(computedHex, 'hex').toString('base64')
  const provided = String(signature).trim().replace(/^sha256=/i, '')

  function safeEqual(a, b) {
    const aBuf = Buffer.from(a, 'utf8')
    const bBuf = Buffer.from(b, 'utf8')
    if (aBuf.length !== bBuf.length) return false
    return crypto.timingSafeEqual(aBuf, bBuf)
  }
  const looksHex = /^[a-f0-9]{64}$/i.test(provided)
  if (looksHex && safeEqual(provided, computedHex)) return true
  return safeEqual(provided, computedBase64)
}

const file = process.argv[2] || path.join(__dirname, 'sample.json')
const secret = process.env.DELHIVERY_WEBHOOK_SECRET || process.argv[3] || 'your_test_secret_here'
const signature = process.env.SIGNATURE || process.argv[4] || 'paste_signature_here'
const raw = fs.readFileSync(file, 'utf8')

console.log('Valid? ->', verifyWebhookSignature(raw, signature, secret))

