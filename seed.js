const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({});

async function main() {
  const doctors = [
    {
      name: 'Dr. Julian Vance',
      specialty: 'Cardiology',
      rating: 4.8,
      nextAvailable: 'Tomorrow, 9:00 AM',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-jDqr_RFrMvmw7Gym74DumuxYkkB0HV8EgFdxsC_nTdw5gw8yZcF09eiqJun1wl-S9986GUU_G87KjPvz-WxiNzNCLOqlpgnG_xF68x4Vzsx_wz-Mu28cIWM9813UDSX7bmtJ4wUsBP3k6xVr3qgIzwZzg2TAJq9KS-m7eACM9K4Gmd6tbaFERcvthOuGmeeCka_elJc_hfUMaLo5R124Qwo7CjJBPUcDb7C8lCrP43mEEXe9m1S34Nx-mGFE7Ayd1TbR37mqr3A',
      availableToday: false
    },
    {
      name: 'Dr. Elena Rodriguez',
      specialty: 'Dermatology',
      rating: 4.9,
      nextAvailable: 'Today, 2:00 PM',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC263jRIJmG2dtEtB2lxqwnGf2t9Y4_hKwroidpvbsLxY64-iOckgUKNJYrh8bWBTST4Ehbp5iOa5mlH9uip18S8xY1cogOpFsCeWZfJJYmohyZd9WIU2X3pCEywo9LZeM8BEFdjuj5Z8icbSCqkH3V0sEsfRFubV5M4w2RrMK7neb1ho2C27njWkL4SwlgYqgYqW7S4EXO79YWHxUshUzULa8NgiAbzhKDvY9eqxDgYndpaVyuCS_1MTcrXgao74CARBWv8xD_F_c',
      availableToday: true
    },
    {
      name: 'Dr. Sarah Smith',
      specialty: 'Pediatrics',
      rating: 4.7,
      nextAvailable: 'Today, 4:30 PM',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBAsxppNhqZdwx3jBfAZPrmMs-VIE_rdFm5q9TC8DV6r3McYmvmU1XziM2Wgpb31LsxfgXsv0aq35aWhT92p1hypBj_5lrJ01DNFH_wgLb0H2zYF11tk2N6xEzcxHs6KnqiD7IcnlBDmUoLWNlgSY5uUNLkFQkbJOwjSHnhsmc1Xa7GnauLx_wLX63vlDAz3S-NGsdoI0Y0Vz88xYQAO1qTnCvKRKbc01jPGU1q6P1WKuhQrmopt-VyUJUuiWxSTNoh_bnddSZuynw',
      availableToday: true
    }
  ];

  for (const doc of doctors) {
    await prisma.doctor.create({
      data: doc
    });
  }
  console.log('Database seeded with 3 doctors.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
