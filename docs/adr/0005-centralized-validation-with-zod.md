# ADR-0005: Validasi Input Terpusat dengan Zod

| | |
|---|---|
| **Status** | Accepted |
| **Tanggal** | 2026-08-01 |

## Konteks

`zod`, `react-hook-form`, dan `@hookform/resolvers` sudah terpasang di `package.json` tapi **tidak dipakai sama sekali** di kode (lihat [Gap Analysis P2-1](../GAP-ANALYSIS.md)). Semua form (register, booking, motorbike admin, CMS) memvalidasi hanya lewat atribut `required` HTML, dan API route menerima payload tanpa skema validasi eksplisit — berkontribusi langsung ke gap P0-3 (harga booking dipercaya mentah dari client) dan berbagai `alert("Terjadi kesalahan.")` generik yang tidak informatif.

## Keputusan

Adopsi **zod sebagai skema validasi tunggal**, didefinisikan sekali per entity di `src/lib/validations/` (mis. `booking.ts`, `motorbike.ts`, `auth.ts`), lalu dipakai di **dua tempat dengan skema yang sama**:

1. **Server**: di awal setiap Route Handler, `schema.safeParse(body)` sebelum logic bisnis apapun dijalankan. Request tidak valid → `400` dengan detail field yang gagal.
2. **Client**: via `react-hook-form` + `@hookform/resolvers/zod` untuk form yang sudah ada, memberi pesan error inline per-field alih-alih `alert()` generik.

## Alasan

- Dependency sudah terpasang — ini bukan penambahan baru, melainkan menuntaskan yang sudah direncanakan sebelumnya oleh setup awal project.
- Skema yang sama dipakai di client & server menghindari duplikasi aturan validasi (dan mencegah drift antara apa yang divalidasi di UI vs yang sebenarnya diterima server).
- Validasi server-side adalah prasyarat untuk menutup gap P0-3 (recalculated price) dan P1-5 (status motor harus dari nilai yang valid) — zod `.enum()` bisa langsung dipakai untuk membatasi nilai `Motorbike.status`.

## Konsekuensi

- Setiap Route Handler yang menerima body (`POST`/`PUT`/`PATCH`) perlu disentuh untuk menambahkan validasi — pekerjaan tersebar di banyak file, dikerjakan bertahap per fitur sesuai [Roadmap](../ROADMAP.md).
- Form admin (motorbike, CMS) perlu direfactor dari `useState` manual ke `useForm` — perubahan struktur, bukan sekadar tambahan.
- Pesan error jadi lebih granular, butuh sedikit penyesuaian UI untuk menampilkan error per-field.

## Alternatif yang dipertimbangkan

- **Validasi manual per-field tanpa skema library** — ditolak karena tidak reusable antara client/server dan sudah terbukti minim (kondisi saat ini).
- **Yup** sebagai alternatif zod — ditolak karena zod sudah terpasang dan terintegrasi baik dengan TypeScript (type inference dari schema), sementara Yup tidak ada di dependency saat ini.
