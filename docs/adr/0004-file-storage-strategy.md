# ADR-0004: Strategi Penyimpanan File/Gambar

| | |
|---|---|
| **Status** | Proposed — menunggu pilihan provider dari Anda |
| **Tanggal** | 2026-08-01 |

## Konteks

`src/app/api/upload/route.ts` saat ini menerima gambar base64 dari admin dan menyimpannya ke `public/uploads/` di filesystem lokal container. Ini punya dua masalah:

1. **Tidak persisten di Vercel** — sudah diakui eksplisit di `DEPLOYMENT.md` sebagai known issue: filesystem serverless Vercel bersifat ephemeral, gambar hilang setelah redeploy/cold start baru.
2. **Tidak divalidasi** — tidak ada pengecekan tipe MIME atau batas ukuran file (lihat [Gap Analysis P1-3](../GAP-ANALYSIS.md)).

## Keputusan

Pindahkan penyimpanan gambar dari filesystem lokal ke **object storage terkelola**, dengan validasi tipe & ukuran di endpoint upload.

**Rekomendasi default: Vercel Blob** — karena:
- Native terintegrasi dengan deployment target yang sudah dipakai (Vercel), tanpa perlu setup akun/kredensial provider terpisah.
- API sederhana (`@vercel/blob`), cocok untuk skala aplikasi ini (upload gambar motor & CMS, bukan file besar/volume tinggi).

**Alternatif yang setara validitasnya**: Cloudinary (jika butuh transformasi gambar otomatis — resize/crop/format on-the-fly) atau AWS S3 (jika sudah/akan punya infrastruktur AWS lain).

## Alasan

- Vercel Blob menghilangkan satu vendor/akun tambahan yang perlu dikelola, konsisten dengan keputusan deployment yang sudah ada.
- Cloudinary lebih unggul jika kebutuhan ke depan mencakup image transformation (thumbnail otomatis, watermark) — worth dipertimbangkan ulang jika kebutuhan itu muncul di roadmap fitur lanjutan.

## Konsekuensi

- `src/app/api/upload/route.ts` diubah untuk upload ke object storage, menyimpan URL hasil upload (bukan path lokal) ke `Motorbike.imageUrl` / `LandingPageConfig.heroImage`, dst.
- Tambah validasi: whitelist MIME type (`image/jpeg`, `image/png`, `image/webp`), batas ukuran (mis. maks 5MB).
- Perlu environment variable baru (`BLOB_READ_WRITE_TOKEN` untuk Vercel Blob, atau kredensial provider lain) — ditambahkan ke `.env.example` tanpa nilai.
- Gambar lama di `public/uploads/` (yang masih ada di working tree) perlu dimigrasikan manual atau di-upload ulang oleh admin.
- `next.config.mjs` perlu `images.remotePatterns` diarahkan ke domain object storage yang dipilih, plus adopsi `next/image` (lihat [Gap Analysis P2-5](../GAP-ANALYSIS.md)).

## Alternatif yang dipertimbangkan

- **Tetap pakai `public/uploads` tapi mount volume persisten** — tidak berlaku di Vercel serverless (tidak ada persistent volume), jadi bukan opsi valid untuk deployment target saat ini.
- **AWS S3** — valid secara teknis, tapi menambah kompleksitas setup (IAM, bucket policy, CORS) yang tidak sebanding dengan skala kebutuhan saat ini; disimpan sebagai opsi jika di masa depan infrastruktur pindah dari Vercel.

## Pertanyaan terbuka

Konfirmasi Anda: setuju dengan Vercel Blob sebagai default, atau ada preferensi lain (mis. sudah punya akun Cloudinary/S3 dari project lain)?
