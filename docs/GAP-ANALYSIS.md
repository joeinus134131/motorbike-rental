# Gap Analysis — SewaMotor Platform

> Sumber: audit kode langsung terhadap kondisi repo per **2026-08-01**, commit `276307b`.
> Tujuan dokumen: daftar temuan konkret (bukan asumsi) dengan referensi `file:line`, dikelompokkan berdasarkan severity, sebagai input untuk [PRD](./PRD.md), [ADR](./adr/), dan [Roadmap](./ROADMAP.md).

## Cara membaca severity

| Level | Arti | Harus selesai sebelum... |
|---|---|---|
| **P0 — Critical** | Kebocoran data/keamanan aktif, atau fitur inti rusak/menyesatkan pengguna | Sebelum publish, tanpa negosiasi |
| **P1 — High** | Bisa dieksploitasi/menyebabkan kerugian bisnis (harga dimanipulasi, double booking) | Sebelum publish |
| **P2 — Medium** | Merusak pengalaman atau maintainability, tapi tidak langsung merugikan | Idealnya sebelum publish, minimal di rilis awal pasca-publish |
| **P3 — Low** | Technical debt / housekeeping | Bisa menyusul |

---

## P0 — Critical

| # | Temuan | Lokasi | Detail |
|---|---|---|---|
| P0-1 | **Secret ter-commit ke git & ter-push ke GitHub** | `.env` (tracked sejak commit `e4b99b9`), `.gitignore` | `.gitignore` hanya berisi `node_modules`. `.env` berisi `DATABASE_URL`, `DIRECT_URL`, `NEXTAUTH_SECRET` — semuanya ada di riwayat git repo publik/private `joeinus134131/motorbike-rental`. **Wajib rotate credential** (lihat [ADR-0002](./adr/0002-secret-leak-remediation.md)). |
| P0-2 | **IDOR pada endpoint pembayaran** | `src/app/api/bookings/[id]/payment/route.ts:6-22` | Endpoint hanya cek `!!session` (user login), tidak membandingkan `session.user.id` dengan `booking.userId`. User A bisa melunasi booking milik User B. |
| P0-3 | **Harga booking dipercaya mentah dari client** | `src/app/api/bookings/route.ts:12,20`, dihitung di `src/app/bookings/new/page.tsx:49` | `totalPrice` dihitung di browser lalu dikirim apa adanya. Request bisa dimodifikasi (devtools/curl) untuk booking dengan harga berapapun. |
| P0-4 | **Tombol pembayaran di dashboard user tidak berfungsi** | `src/app/dashboard/page.tsx:64-67` | Tombol "Bayar Sekarang" tidak punya `onClick`. Alur pembayaran mandiri oleh user **tidak pernah bisa dicapai dari UI** — satu-satunya jalur yang berfungsi adalah approval manual oleh admin. |

## P1 — High

| # | Temuan | Lokasi | Detail |
|---|---|---|---|
| P1-1 | **Tidak ada pencegahan double booking** | `src/app/api/bookings/route.ts:6-26` | Tidak ada pengecekan overlap `startDate`/`endDate` terhadap booking lain pada `motorbikeId` yang sama sebelum create. Dua user bisa booking unit yang sama di tanggal yang sama. |
| P1-2 | **Endpoint `/api/admin/*` publik tanpa auth** | `src/app/api/admin/motorbikes/route.ts:37-46` (fungsi `GET`) | Tidak ada pengecekan session/role, padahal berada di namespace admin. Dipakai sebagai API publik oleh `src/app/bookings/new/page.tsx:30` — arsitektur "meminjam" endpoint admin, bukan endpoint publik yang didesain. |
| P1-3 | **Upload file tanpa validasi tipe/ukuran** | `src/app/api/upload/route.ts:14-32` | Menerima base64 image tanpa validasi MIME type atau batas ukuran; ekstensi file diambil mentah dari nama file client. Dilindungi role ADMIN, tapi tetap rawan untuk hardening produksi. |
| P1-4 | **Upload gambar tidak persisten di Vercel** | `src/app/api/upload/route.ts`, `public/uploads/` | Filesystem serverless Vercel bersifat ephemeral — gambar yang di-upload admin akan **hilang** setelah redeploy/cold start baru. Sudah diakui di `DEPLOYMENT.md` sebagai known issue. |
| P1-5 | **`Motorbike.status` bukan enum** | `prisma/schema.prisma:47` | Field `String` bebas dengan konvensi `"available"/"maintenance"/"rented"` hanya dijaga oleh UI, tidak dijamin di level database — rawan typo/nilai tidak konsisten yang merusak logic ketersediaan unit. |
| P1-6 | **Tidak ada rate limiting** | Semua route di `src/app/api/**` | Endpoint login, register, booking, upload tidak dibatasi rate — rawan brute force credential dan spam booking. |

## P2 — Medium

| # | Temuan | Lokasi | Detail |
|---|---|---|---|
| P2-1 | **Validasi input minim di semua form** | `src/app/register/page.tsx`, form admin motorbike/CMS | `zod`, `react-hook-form`, `@hookform/resolvers` sudah terpasang di `package.json` tapi **tidak dipakai sama sekali**. Validasi hanya `required` HTML, tanpa cek format email, panjang password minimum, tipe angka, dsb. |
| P2-2 | **Tautan admin rusak** | `src/app/admin/page.tsx:77` | Link "Semua Transaksi" mengarah ke `/admin/bookings` (tidak ada), padahal halaman sebenarnya `/admin/transactions`. |
| P2-3 | **Form kontak palsu** | `src/app/contact/page.tsx:22-29` | `handleSubmit` hanya `setTimeout` 1.5 detik lalu tampilkan "terkirim" — tidak pernah memanggil API atau mengirim data kemanapun. |
| P2-4 | **`maintenanceMode` setengah jadi** | `prisma/schema.prisma:127` (`SystemConfig.maintenanceMode`) | Field ada di schema dan (kemungkinan) di form admin, tapi tidak pernah dibaca di middleware atau logic manapun — flag tanpa efek. |
| P2-5 | **Tidak ada `next/image`** | `src/app/page.tsx`, `CatalogList.tsx`, dll | Semua gambar pakai `<img>` biasa, kehilangan lazy-loading & optimasi bawaan Next.js. Juga tidak ada `images.remotePatterns` di `next.config.mjs` untuk domain eksternal (Unsplash dll). |
| P2-6 | **Error handling generik** | Banyak file admin, contoh `src/app/admin/motorbikes/page.tsx:41` | Kegagalan API ditangani dengan `alert("Terjadi kesalahan.")` generik tanpa detail, dan server-side error hanya `console.error` tanpa structured logging/tracking (Sentry dsb). |
| P2-7 | **Tidak ada demote/hapus user & proteksi admin terakhir** | `src/app/admin/users/page.tsx`, `src/app/api/admin/users/route.ts` | Admin hanya bisa dipromosikan, tidak ada jalur demote/hapus, dan tidak ada guard agar admin terakhir tidak bisa didemote sampai 0 admin tersisa. |
| P2-8 | **Data model belum menampung fitur yang diklaim di UI** | `prisma/schema.prisma` | UI menampilkan rating "4.9" hardcoded di beberapa tempat, tapi tidak ada tabel review/rating. Tidak ada tabel payment transaction log/refund/notifikasi/audit log. |

## P3 — Low / Housekeeping

| # | Temuan | Lokasi | Detail |
|---|---|---|---|
| P3-1 | **Dokumentasi database keliru** | `README.md`, `DEPLOYMENT.md` vs `prisma/schema.prisma:9` | README & DEPLOYMENT.md menyebut MySQL; schema aktual `postgresql`. Mengikuti README apa adanya akan gagal. |
| P3-2 | **Klaim "Shadcn UI" tidak akurat** | `README.md` | Tidak ada instalasi shadcn/Radix di project; hanya konvensi CSS variable ala shadcn di `tailwind.config.ts`. |
| P3-3 | **Tidak ada `.env.example`** | root repo | Menyulitkan onboarding developer baru — harus menebak dari `.env` asli (yang harusnya tidak boleh dibaca/di-commit) atau dokumentasi yang keliru (lihat P3-1). |
| P3-4 | **Tidak ada test & CI** | seluruh repo | Tidak ada folder test, `*.test.ts`, atau `.github/workflows`. Tidak ada script `test` di `package.json`. |
| P3-5 | **Dependency terpasang tapi tidak dipakai** | `package.json` | `zod`, `react-hook-form`, `@hookform/resolvers` nganggur — lihat P2-1, solusinya sekalian pakai dependency ini, bukan hapus. |

---

**Total temuan: 4 P0, 6 P1, 8 P2, 5 P3.**
Lanjut ke [PRD.md](./PRD.md) untuk requirement yang dirumuskan dari temuan ini, atau langsung ke [ROADMAP.md](./ROADMAP.md) untuk urutan eksekusi.
