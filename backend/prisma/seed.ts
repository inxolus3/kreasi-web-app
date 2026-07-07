import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const seedData = [
    {
      code: "B-PDG-001",
      name: "Simpang Tinju",
      description: "Billboard di Simpang Tinju",
      city: "Padang",
      district: "Padang Barat",
      address: "Jl. Jhoni Anwar, Kampung Lapai",
      type: "Billboard",
      size: "4x8",
      lighting: "Front Light",
      orientation: "Dua Sisi",
      latitude: -0.900,
      longitude: 100.358,
      price: 15000000,
      province: "Sumatera Barat",
      status: "AVAILABLE",
      googleMapsUrl: "",
      traffic: "",
      thumbnail: "",
      gallery: [],
      availableFrom: new Date(),
      availableUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    },
    {
      code: "B-PDG-002",
      name: "Jl. Khatib Sulaiman",
      description: "Billboard di depan Masjid Raya Sumbar",
      city: "Padang",
      district: "Padang Utara",
      address: "Jl. Khatib Sulaiman",
      type: "Billboard",
      size: "5x10",
      lighting: "Front Light",
      orientation: "Dua Sisi",
      latitude: -0.923,
      longitude: 100.361,
      price: 25000000,
      province: "Sumatera Barat",
      status: "AVAILABLE",
      googleMapsUrl: "",
      traffic: "",
      thumbnail: "",
      gallery: [],
      availableFrom: new Date(),
      availableUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    }
  ];

  for (const b of seedData) {
    const slug = b.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);
    await prisma.billboard.upsert({
      where: { code: b.code },
      update: {},
      create: {
        ...b,
        slug,
        status: b.status as any,
      },
    });
  }

  console.log("Seed data imported successfully.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
