const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const doctors = await prisma.doctor.findMany();
  console.log(JSON.stringify(doctors, null, 2));
  await prisma.$disconnect();
}
main().catch(console.error);
