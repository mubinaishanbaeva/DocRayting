const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const surgeons = [
    {
      name: "Dr. Marcus Sterling",
      specialty: "Neurosurgery",
      rating: 5.0,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400",
      nextAvailable: "Tomorrow, 10:00 AM",
      availableToday: false
    },
    {
      name: "Dr. Sophia Thorne",
      specialty: "Cardiothoracic Surgery",
      rating: 4.9,
      image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?w=400",
      nextAvailable: "Today, 3:30 PM",
      availableToday: true
    },
    {
      name: "Dr. Kenji Sato",
      specialty: "Orthopedic Surgery",
      rating: 4.8,
      image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400",
      nextAvailable: "Today, 5:00 PM",
      availableToday: true
    }
  ];

  console.log("Seeding surgeons into SQLite...");
  for (const surgeon of surgeons) {
    const existing = await prisma.doctor.findFirst({
      where: { name: surgeon.name }
    });
    if (!existing) {
      await prisma.doctor.create({ data: surgeon });
      console.log(`Created surgeon: ${surgeon.name}`);
    } else {
      console.log(`Surgeon already exists: ${surgeon.name}`);
    }
  }
  console.log("Seeding completed successfully.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
