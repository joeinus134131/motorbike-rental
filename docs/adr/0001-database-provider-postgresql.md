# ADR-0001: Konfirmasi Database Provider — PostgreSQL

| | |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 2026-08-01 |

## Konteks

`prisma/schema.prisma:9` mendefinisikan `provider = "postgresql"`, dan variabel environment (`DATABASE_URL`, `DIRECT_URL`, `PRISMA_DATABASE_URL`) mengikuti pola Prisma Postgres/Accelerate di Vercel. Namun `README.md` dan `DEPLOYMENT.md` secara konsisten menyebut **MySQL** sebagai database, lengkap dengan instruksi setup provider MySQL eksternal (TiDB Cloud/PlanetScale).

Ini bukan sekadar typo dokumentasi — developer baru yang mengikuti README akan mengonfigurasi provider yang salah dan gagal migrasi.

## Keputusan

**PostgreSQL adalah provider database resmi** untuk project ini, sesuai `schema.prisma` yang aktif dipakai. Dokumentasi (`README.md`, `DEPLOYMENT.md`) akan diperbarui untuk konsisten dengan ini, bukan sebaliknya — karena mengubah provider di schema berarti migrasi data/schema ulang tanpa alasan teknis yang jelas, sementara memperbaiki dokumentasi tidak berisiko.

## Alasan

- Schema Prisma adalah source of truth yang benar-benar dieksekusi; dokumentasi yang salah lebih murah untuk diperbaiki daripada mengganti database.
- Pola env var (`DIRECT_URL` terpisah dari `DATABASE_URL`) khas setup Prisma Accelerate/connection pooling yang lazim dipakai dengan Postgres di Vercel — mengindikasikan keputusan provider ini sudah diambil sebelumnya, dokumentasi saja yang tertinggal.

## Konsekuensi

- Update `README.md` bagian setup database dan `DEPLOYMENT.md` bagian provider database rekomendasi (ganti rekomendasi TiDB/PlanetScale dengan Vercel Postgres/Neon/Supabase).
- Tidak ada perubahan kode/schema.

## Alternatif yang dipertimbangkan

- **Migrasi ke MySQL** agar sesuai dokumentasi lama — ditolak karena tidak ada alasan teknis yang mendorongnya, hanya akan menambah pekerjaan migrasi tanpa manfaat, dan mengubah pola koneksi (`directUrl`) yang sudah didesain untuk Postgres.
