require('dotenv').config({ path: '.env.local' })
const { createClient } = require('@supabase/supabase-js')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey)

async function setRole(role, email) {
  const allowed = ['admin', 'seller', 'customer']
  if (!allowed.includes(role)) {
    console.error(`Role must be one of: ${allowed.join(', ')}`)
    process.exit(1)
  }
  if (!email) {
    console.error('Usage: node scripts/set-role.js <role> <email>')
    process.exit(1)
  }

  console.log(`Setting role for ${email} → ${role}`)

  // Check profile
  const { data: profile, error: fetchErr } = await supabase
    .from('profiles')
    .select('id, email, role')
    .eq('email', email)
    .single()

  if (fetchErr) {
    console.error('Fetch profile error:', fetchErr)
    process.exit(1)
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({ role })
    .eq('email', email)
    .select('id, email, role')
    .single()

  if (error) {
    console.error('Update role error:', error)
    process.exit(1)
  }

  console.log('Updated profile:', data)
}

const [,, role, email] = process.argv
setRole(role, email).catch((e) => {
  console.error(e)
  process.exit(1)
})








































