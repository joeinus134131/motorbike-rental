import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.user.deleteMany()
  await prisma.motorbike.deleteMany()
  await prisma.landingPageConfig.deleteMany()
  await prisma.systemConfig.deleteMany()

  // Create Admin
  const hashedPassword = await bcrypt.hash('admin123', 10)
  await prisma.user.create({
    data: {
      email: 'admin@sewamotor.com',
      password: hashedPassword,
      name: 'Super Admin',
      role: 'ADMIN',
    },
  })

  // Create Sample User
  const userPassword = await bcrypt.hash('user123', 10)
  await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: userPassword,
      name: 'John Doe',
      role: 'USER',
    },
  })

  // Create Motorbikes
  await prisma.motorbike.createMany({
    data: [
      {
        name: 'Vespa Sprint 150',
        brand: 'Vespa',
        model: 'Sprint',
        year: 2023,
        pricePerDay: 450000,
        imageUrl: 'https://images.unsplash.com/photo-1595111022373-c64639e443f1?auto=format&fit=crop&q=80&w=800',
        description: 'Vespa Sprint 150 i-get ABS limited edition. Perpaduan sempurna antara gaya klasik dan teknologi modern.',
        status: 'available',
      },
      {
        name: 'Honda CBR250RR',
        brand: 'Honda',
        model: 'CBR',
        year: 2022,
        pricePerDay: 750000,
        imageUrl: 'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&q=80&w=800',
        description: 'Motor sport premium untuk Anda yang menyukai kecepatan dan kestabilan berkendara.',
        status: 'available',
      },
      {
        name: 'Yamaha NMAX 155',
        brand: 'Yamaha',
        model: 'NMAX',
        year: 2024,
        pricePerDay: 250000,
        imageUrl: 'https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?auto=format&fit=crop&q=80&w=800',
        description: 'Motor matic paling nyaman untuk keliling kota atau touring jarak jauh.',
        status: 'available',
      },
    ],
  })

  // Create CMS Config
  await prisma.landingPageConfig.create({
    data: {
      heroTitle: 'Sewa Motor Premium di Kotamu',
      heroSubtitle: 'Nikmati kebebasan berkendara dengan unit motor terbaru, berasuransi, dan harga yang sangat kompetitif.',
      heroImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200',
      contactEmail: 'hi@sewamotor.com',
      contactPhone: '+6281234567890',
      address: 'Jl. Sudirman No. 123, Jakarta Selatan',
    },
  })

  // Create System Config
  await prisma.systemConfig.create({
    data: {
      paymentGatewayMode: 'dummy',
      paymentInstructions: 'Silakan transfer ke rekening BCA 1234567890 a/n PT Sewa Motor Indonesia. Kirim bukti transfer di halaman booking.',
    },
  })

  console.log('Seeding finished.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
