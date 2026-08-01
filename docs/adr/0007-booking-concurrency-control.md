# ADR-0007: Pencegahan Double-Booking (Concurrency Control)

| | |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 2026-08-01 |

## Konteks

`POST /api/bookings` (`src/app/api/bookings/route.ts:6-26`) membuat `Booking` baru tanpa mengecek apakah `motorbikeId` yang sama sudah punya booking `PENDING`/`PAID` yang overlap dengan `startDate`/`endDate` yang diminta ([Gap Analysis P1-1](../GAP-ANALYSIS.md)). Dua request nyaris bersamaan (mis. dua customer klik "booking" di detik yang sama untuk motor yang sama) bisa lolos keduanya, menciptakan dua booking aktif yang bentrok secara fisik — motor yang sama tidak bisa dipakai dua orang sekaligus.

## Keputusan

Terapkan dua lapis proteksi:

1. **Application-level check** di dalam Prisma transaction (`prisma.$transaction`): sebelum create, query booking existing pada `motorbikeId` yang sama dengan status `PENDING`/`PAID` yang overlap rentang tanggal (`startDate < requested.endDate AND endDate > requested.startDate`). Jika ada, tolak dengan `409 Conflict`.
2. **Database-level safety net**: karena application-level check saja tetap punya celah race condition di bawah concurrency tinggi (dua transaction membaca "belum ada overlap" di waktu hampir bersamaan sebelum salah satunya commit), tambahkan constraint di level database — PostgreSQL exclusion constraint (`EXCLUDE USING gist`) pada kombinasi `motorbikeId` + rentang tanggal (butuh extension `btree_gist`), atau minimal unique constraint yang lebih sederhana jika exclusion constraint dianggap overkill untuk skala aplikasi ini saat ini.

**Untuk v1.0, minimal item #1 (application-level check dalam transaction) wajib ada** — ini menutup mayoritas kasus nyata (concurrency yang benar-benar bersamaan hingga milidetik jarang terjadi di skala UMKM rental motor). Item #2 (exclusion constraint) dicatat sebagai hardening lanjutan jika volume transaksi bertambah signifikan.

## Alasan

- Application-level check dalam transaction cukup untuk skala awal dan tidak butuh perubahan schema/migration yang lebih rumit (exclusion constraint butuh extension PostgreSQL tambahan).
- Menyediakan exclusion constraint sebagai item lanjutan (bukan langsung di v1.0) menghindari over-engineering di tahap awal — sesuai prinsip "jangan desain untuk kebutuhan hipotetis", tapi tetap dicatat sebagai keputusan sadar, bukan terlupakan.

## Konsekuensi

- `POST /api/bookings` perlu dibungkus `prisma.$transaction` dan query overlap tambahan sebelum `create`.
- Response API baru: `409 Conflict` dengan pesan jelas ("Motor tidak tersedia pada tanggal yang dipilih") — perlu penyesuaian UI di `bookings/new/page.tsx` untuk menampilkan pesan ini alih-alih error generik.
- Jika ke depan volume booking bersamaan meningkat signifikan (mis. saat promo/high season), revisit untuk menambahkan exclusion constraint di database.

## Alternatif yang dipertimbangkan

- **Optimistic locking dengan version field** — dipertimbangkan tapi tidak sesuai kasus ini karena masalahnya bukan "update konflik pada satu row", melainkan "dua insert baru yang saling bentrok secara logis" — exclusion constraint atau application-level range check lebih tepat untuk pola ini.
- **Row-level lock (`SELECT ... FOR UPDATE`) pada `Motorbike`** — valid secara teknis, tapi menambah kompleksitas locking manual yang tidak dibutuhkan; overlap check di dalam transaction Prisma sudah cukup untuk isolation level default PostgreSQL (`READ COMMITTED`) dengan constraint tambahan sebagai safety net di masa depan.
