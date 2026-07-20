import fetch from 'node-fetch'
import fs from 'fs'
import path from 'path'

async function main() {
  const base = process.env.E2E_API_BASE || 'http://localhost:4000'
  const email = process.env.TEST_ADMIN_EMAIL || 'admin@test.local'
  const res = await fetch(`${base}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password: process.env.TEST_ADMIN_PASSWORD || 'password123' })
  })
  const json = await res.json()
  const token = json?.data?.token
  const state = { cookies: [], origins: [{ origin: process.env.E2E_BASE_URL || 'http://localhost:5173', localStorage: [{ name: 'token', value: token }] }] }
  const out = path.join(process.cwd(), 'e2e', '.auth')
  fs.mkdirSync(out, { recursive: true })
  fs.writeFileSync(path.join(out, 'admin.json'), JSON.stringify(state))
  console.log('saved storage state to e2e/.auth/admin.json')
}

main().catch((e) => { console.error(e); process.exit(1) })
