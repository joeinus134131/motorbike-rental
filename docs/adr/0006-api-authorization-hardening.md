# ADR-0006: Pengerasan Otorisasi API (Ownership Check & Guard Terpusat)

| | |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 2026-08-01 |

## Konteks

Tiga pola masalah otorisasi ditemukan di audit ([Gap Analysis](../GAP-ANALYSIS.md)):

1. **IDOR (P0-2)**: `POST /api/bookings/[id]/payment` hanya cek `!!session`, tidak membandingkan `session.user.id` dengan `booking.userId` — user manapun bisa "melunasi" booking milik user lain.
2. **Missing auth (P1-2)**: `GET /api/admin/motorbikes` tidak melakukan pengecekan apapun meski berada di namespace `/api/admin/*`, lalu dipakai sebagai API publik oleh halaman booking.
3. **Inconsistent pattern**: sebagian route admin sudah benar menerapkan cek role (`admin/motorbikes/[id]/route.ts`, `admin/users/route.ts`, `admin/cms/route.ts`), tapi polanya diulang manual di tiap file tanpa helper terpusat — rawan ada yang terlewat (seperti kasus #2).

`middleware.ts` saat ini hanya melindungi page routes (`/admin/:path*`, `/dashboard/:path*`), tidak menyentuh `/api/*` sama sekali — jadi seluruh tanggung jawab proteksi API ada di masing-masing route handler.

## Keputusan

1. **Buat dua helper terpusat** di `src/lib/api-guard.ts` (atau nama serupa):
   - `requireAdmin()` — ambil session, pastikan `role === "ADMIN"`, lempar response 401/403 jika gagal. Dipakai di **semua** route `/api/admin/**` tanpa kecuali.
   - `requireOwnerOrAdmin(resourceUserId)` — ambil session, izinkan jika `session.user.id === resourceUserId` **atau** `role === "ADMIN"`. Dipakai di route yang mengubah resource milik user (booking, payment).
2. **Pisahkan endpoint publik dari namespace admin**: buat `GET /api/motorbikes` (publik, read-only, tanpa data sensitif) sebagai pengganti pemakaian `/api/admin/motorbikes` oleh halaman booking publik. Endpoint `/api/admin/motorbikes` tetap ada untuk kebutuhan admin (dengan field/kapabilitas lebih lengkap) dan **wajib** memakai `requireAdmin()`.
3. Audit ulang **setiap** route handler di `src/app/api/**` untuk memastikan memakai salah satu dari dua helper di atas — tidak ada route yang mengandalkan asumsi "namespace-nya sudah aman".

## Alasan

- Helper terpusat mencegah kelas bug ini terulang — pengecekan jadi eksplisit dan reviewable di satu tempat, bukan duplikasi manual yang bisa lupa ditulis di route baru.
- Memisahkan endpoint publik vs admin bukan cuma soal keamanan, tapi juga desain API yang benar: endpoint di path `/api/admin/*` seharusnya *selalu* berarti "butuh privilege admin", tanpa pengecualian tersembunyi.

## Konsekuensi

- Setiap file di `src/app/api/**` yang menangani data milik user (booking, payment) perlu disentuh untuk pakai `requireOwnerOrAdmin`.
- Halaman `bookings/new/page.tsx` perlu diubah untuk fetch dari endpoint publik baru, bukan `/api/admin/motorbikes`.
- Menambah satu lapis test yang perlu ditulis: memastikan setiap endpoint sensitif menolak request dari user yang bukan pemilik/bukan admin (lihat [Roadmap Fase 4](../ROADMAP.md) untuk testing).

## Alternatif yang dipertimbangkan

- **Pindahkan proteksi ke `middleware.ts` untuk `/api/*` juga** — dipertimbangkan tapi ditolak sebagai satu-satunya solusi, karena middleware hanya bisa cek role secara umum (admin vs bukan), tidak bisa melakukan ownership check yang butuh query ke database (`booking.userId`) — itu tetap harus terjadi di level route handler. Middleware tetap bisa dipakai sebagai lapisan tambahan untuk blok akses role secara kasar ke `/api/admin/*`, sebagai defense-in-depth di atas `requireAdmin()`, bukan pengganti.
