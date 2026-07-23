require('dotenv').config();
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('.prisma/client');

async function test() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
  const p = new PrismaClient({ adapter });
  try {
    const r = await p.user.findMany();
    console.log('OK: found', r.length, 'users');
  } catch(e) {
    console.error('DB Error:', e.message);
  } finally {
    await p.$disconnect();
  }
}
test();
