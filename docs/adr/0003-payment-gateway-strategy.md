# ADR-0003: Strategi Payment Gateway

| | |
|---|---|
| **Status** | Proposed — menunggu keputusan Anda soal timing (v1.0 vs v1.1) |
| **Tanggal** | 2026-08-01 |

## Konteks

Saat ini `SystemConfig.paymentGatewayMode` di schema sudah menyediakan slot `"dummy" | "production"`, dan ada endpoint dummy (`/api/bookings/[id]/payment`) yang men-generate `paymentId` palsu (`DUMMY-PAY-...`). Belum ada integrasi payment gateway sungguhan. Alur pembayaran nyata yang berfungsi saat ini hanya "admin approve manual" via `admin/transactions`.

Untuk publish, platform butuh **minimal satu jalur pembayaran yang benar-benar bisa diselesaikan end-to-end oleh customer**, entah itu dummy-tapi-tersambung-utuh atau gateway sungguhan.

## Keputusan

**Dua tahap:**

1. **v1.0 (wajib sebelum publish)**: perbaiki alur dummy/manual agar *benar-benar berfungsi utuh* — tombol "Bayar Sekarang" di dashboard memanggil endpoint payment dengan ownership check yang benar (lihat FR-9 di [PRD](../PRD.md), ADR terkait: ownership check di [ADR-0006](./0006-api-authorization-hardening.md)). Ini membuat platform bisa "menerima pembayaran" secara operasional (walau prosesnya semi-manual/dikonfirmasi admin), tanpa dependency ke pihak ketiga.
2. **v1.1 (setelah v1.0 stabil)**: integrasi payment gateway sungguhan. **Rekomendasi: Midtrans** sebagai pilihan utama karena dominan untuk use case Indonesia (dukungan QRIS, e-wallet lokal, virtual account bank lokal, dokumentasi Bahasa Indonesia yang baik untuk Snap/Core API). Stripe sebagai alternatif jika target pasar meluas ke internasional atau butuh subscription billing.

## Alasan

- Memisahkan "membuat alur pembayaran yang berfungsi" dari "mengintegrasikan gateway pihak ketiga" mengurangi risiko — v1.0 tidak digantungkan ke proses approval/API key vendor eksternal yang makan waktu.
- Midtrans direkomendasikan karena metode pembayaran lokal Indonesia (QRIS, VA BCA/BNI/Mandiri, e-wallet GoPay/OVO/Dana) yang relevan untuk target pasar sewa motor domestik, dibanding Stripe yang lebih kuat di kartu kredit internasional.

## Konsekuensi jika integrasi gateway (v1.1) dijalankan

- Perlu tabel `PaymentTransaction` baru (terpisah dari `Booking.paymentId` yang saat ini cuma string) untuk mencatat detail transaksi, status callback, raw payload webhook.
- Perlu endpoint webhook (`/api/payments/webhook`) yang memverifikasi signature dari gateway, idempotent terhadap notifikasi duplikat.
- Perlu penanganan status tambahan: `EXPIRED`, `FAILED`, `REFUNDED` — saat ini `BookingStatus` enum hanya punya `PENDING/PAID/CANCELLED/COMPLETED`.
- Biaya transaksi (fee gateway) perlu masuk pertimbangan bisnis.

## Alternatif yang dipertimbangkan

- **Langsung integrasi Midtrans di v1.0** — ditolak untuk saat ini karena menambah dependency eksternal (perlu akun merchant, API key, sandbox testing) di tengah pekerjaan hardening keamanan yang lebih mendesak (P0/P1). Bisa dipercepat ke v1.0 jika Anda punya urgensi bisnis untuk pembayaran otomatis penuh sejak hari pertama — beri tahu jika ini prioritasnya.
- **Stripe sebagai default** — disimpan sebagai alternatif, bukan default, karena metode pembayaran lokal Indonesia lebih relevan untuk target pengguna platform ini.

## Pertanyaan terbuka

Perlu konfirmasi Anda: apakah pembayaran gateway sungguhan **wajib ada di hari publish**, atau alur manual admin-approval yang sudah diperbaiki (v1.0) cukup untuk fase awal go-live? Ini menentukan apakah Fase 3 di [Roadmap](../ROADMAP.md) masuk sebelum atau sesudah publish.
