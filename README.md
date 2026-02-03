# SewaMotor Fullstack Boilerplate

Selamat datang di boilerplate aplikasi penyewaan motor profesional berbasis **Next.js**, **MySQL**, dan **Prisma**. Aplikasi ini dirancang dengan standar kode yang bersih, performa tinggi, dan UI/UX yang premium.

## Fitur Utama

- 🏠 **Dynamic Landing Page**: Konten hero, teks, dan gambar bisa diatur langsung melalui CMS.
- 🔐 **Role-based Authentication**: Manajemen akses berbeda untuk Admin dan User menggunakan NextAuth.
- 🏍️ **Fleet Management**: Admin dapat mengelola unit motor (CRUD), harga per hari, dan status ketersediaan.
- 📅 **Booking System**: Alur pemesanan lengkap mulai dari pemilihan unit hingga manajemen reservasi.
- 💳 **Dummy Payment Gateway**: Mekanisme pembayaran skema dummy (bisa dikonfigurasi via CMS) yang siap diintegrasikan dengan Production API (Midtrans/Stripe).
- 📊 **Admin Dashboard**: Overview statistik pendapatan, booking aktif, dan manajemen pelanggan.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), Tailwind CSS, Lucide React, Shadcn UI.
- **Backend**: Next.js API Routes.
- **ORM**: Prisma.
- **Database**: MySQL.
- **Auth**: NextAuth.js.

## Cara Menggunakan (Setup)

### 1. Prasyarat
Pastikan Anda memiliki Node.js (v18+) dan MySQL terinstal di sistem Anda.

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Konfigurasi Environment
Buat file `.env` di root direktori:

```env
DATABASE_URL="mysql://username:password@localhost:3306/sewa_motor"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Migration & Seed
Jalankan perintah berikut untuk membuat tabel dan mengisi data awal (Admin & Contoh Motor):

```bash
npx prisma db push
npx prisma db seed
```

### 5. Jalankan Aplikasi
```bash
npm run dev
```

### 6. Akses Login
- **Admin**: `admin@sewamotor.com` / `admin123`
- **User**: `user@example.com` / `user123`

## Konfigurasi CMS
Seluruh pengaturan dapat ditemukan di halaman `/admin/cms`. Anda bisa mengubah:
- Judul & Subtitle Hero
- Gambar Hero
- Informasi Kontak & Alamat
- Instruksi Pembayaran (Script Dummy Gateway)

---
*Dibuat dengan ❤️ sebagai solusi profesional penyewaan motor.*
