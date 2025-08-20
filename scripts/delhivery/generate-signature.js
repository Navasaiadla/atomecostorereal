const crypto = require('crypto')
const fs = require('fs')
const path = require('path')

const secret = process.env.DELHIVERY_WEBHOOK_SECRET || process.argv[2]
if (!secret) {
  console.error('Usage: DELHIVERY_WEBHOOK_SECRET=secret node scripts/delhivery/generate-signature.js [secret] [file]')
  process.exit(1)
}
const file = process.argv[3] || path.join(__dirname, 'sample.json')
const raw = fs.readFileSync(file, 'utf8')
const hex = crypto.createHmac('sha256', secret).update(raw, 'utf8').digest('hex')
console.log('hex:', hex)
console.log('base64:', Buffer.from(hex, 'hex').toString('base64'))

