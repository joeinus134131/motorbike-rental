# PRD — SewaMotor Platform v1.0 (Production Readiness)

| | |
|---|---|
| **Status** | Draft |
| **Owner** | Made Agus Andi Gunawan |
| **Terakhir diperbarui** | 2026-08-01 |
| **Dokumen terkait** | [Gap Analysis](./GAP-ANALYSIS.md) · [Roadmap](./ROADMAP.md) · [Architecture](./ARCHITECTURE.md) · [ADR index](./adr/) |

## 1. Latar Belakang

SewaMotor adalah aplikasi web penyewaan motor (Next.js 14 App Router + Prisma + PostgreSQL + NextAuth) dengan tiga peran utama: pengunjung publik yang browsing katalog, customer terdaftar yang melakukan booking, dan admin yang mengelola armada, transaksi, user, dan konten landing page lewat CMS internal.

Kondisi saat ini (lihat [Gap Analysis](./GAP-ANALYSIS.md)) adalah **boilerplate fungsional untuk demo**, bukan produk yang siap menerima transaksi nyata dari publik: ada kebocoran secret, celah otorisasi (IDOR), harga booking yang bisa dimanipulasi client, alur pembayaran yang UI-nya buntu, dan sejumlah tombol/link yang tidak berfungsi.

## 2. Tujuan

Membawa platform dari status "boilerplate/demo" ke **"siap publish end-to-end"** — didefinisikan sebagai: pengguna publik dapat browsing → daftar → booking → bayar → dilayani admin, tanpa celah keamanan kritis, tanpa data yang bisa dimanipulasi, dan tanpa fitur yang terlihat ada di UI tapi sebenarnya tidak berfungsi.

## 3. Target Pengguna

| Persona | Kebutuhan utama |
|---|---|
| **Calon penyewa (guest)** | Lihat katalog & harga motor tanpa perlu daftar dulu |
| **Penyewa terdaftar (customer)** | Daftar, booking motor, bayar, lihat riwayat & status booking |
| **Admin/Operator armada** | Kelola stok motor, approve/tolak booking, kelola user, edit konten landing page |
| **Pemilik bisnis (Anda)** | Platform bisa dipercaya untuk transaksi nyata, tidak bocor data, mudah dioperasikan |

## 4. Prinsip & Non-Goals

- **Prinsip**: perbaikan dilakukan bertahap sesuai [Roadmap](./ROADMAP.md), setiap fase harus tetap membuat aplikasi berjalan (tidak ada fase yang meninggalkan aplikasi dalam kondisi rusak).
- **Non-goal v1.0**: ekspansi fitur besar (multi-cabang, aplikasi mobile, program loyalti). Fokus v1.0 adalah **mengeraskan dan menuntaskan alur yang sudah ada**, bukan menambah fitur baru di luar yang disebut eksplisit di bawah.

## 5. Scope v1.0 — Functional Requirements

Setiap requirement dipetakan ke temuan gap terkait (kolom "Ref") dan harus punya acceptance criteria yang bisa diverifikasi manual maupun otomatis.

### 5.1 Keamanan & Integritas Data (Must-have, blocking publish)

| ID | Requirement | Acceptance Criteria | Ref |
|---|---|---|---|
| FR-1 | Secret (`NEXTAUTH_SECRET`, DB credential) tidak lagi ada di riwayat git, dan tidak bisa digunakan lagi (sudah di-rotate) | `git log -p -- .env` di history baru tidak menunjukkan nilai valid; login dengan secret lama gagal | GAP P0-1 |
| FR-2 | User hanya bisa mengubah status pembayaran booking miliknya sendiri | Request `POST /api/bookings/[id]/payment` dengan `id` booking milik user lain → `403` | GAP P0-2 |
| FR-3 | Harga total booking dihitung ulang di server dari `pricePerDay × durasi`, bukan dipercaya dari client | Kirim `totalPrice` palsu dari client → server mengabaikannya dan pakai hasil hitung sendiri | GAP P0-3 |
| FR-4 | Tidak ada dua booking `PENDING`/`PAID` yang overlap tanggal untuk motor yang sama | Booking kedua pada rentang tanggal bentrok untuk unit yang sama → ditolak dengan pesan jelas | GAP P1-1 |
| FR-5 | Semua endpoint di bawah `/api/admin/*` memverifikasi role ADMIN, tanpa kecuali | Request tanpa session/role non-admin ke seluruh endpoint `/api/admin/**` → `401`/`403` | GAP P1-2 |
| FR-6 | Endpoint publik untuk data katalog motor dipisah dari namespace admin | `GET` katalog publik punya endpoint sendiri (mis. `/api/motorbikes`), tidak lagi memanggil `/api/admin/motorbikes` | GAP P1-2 |
| FR-7 | Upload gambar divalidasi tipe MIME & ukuran maksimum | Upload file non-image atau > batas ukuran → ditolak dengan pesan jelas | GAP P1-3 |
| FR-8 | Login, register, booking, dan upload dilindungi rate limiting | Percobaan login berulang melebihi ambang batas dalam window waktu tertentu → diblokir sementara | GAP P1-6 |

### 5.2 Alur Booking & Pembayaran (Must-have)

| ID | Requirement | Acceptance Criteria | Ref |
|---|---|---|---|
| FR-9 | Customer bisa menyelesaikan pembayaran booking miliknya sendiri dari dashboard | Tombol "Bayar Sekarang" di dashboard memanggil endpoint payment dan mengubah status booking menjadi `PAID` | GAP P0-4 |
| FR-10 | Tombol "Detail Booking" di dashboard menampilkan detail booking terkait | Klik tombol → navigasi ke halaman/detail yang menampilkan data booking lengkap | GAP #12 |
| FR-11 | Status motor (`available`/`maintenance`/`rented`) konsisten dan tervalidasi | Field status hanya menerima nilai dari enum yang terdefinisi, tervalidasi di level DB & API | GAP P1-5 |
| FR-12 | Semua tautan navigasi admin mengarah ke halaman yang benar-benar ada | Klik "Semua Transaksi" di admin dashboard → menuju `/admin/transactions`, bukan 404 | GAP P2-2 |

### 5.3 Validasi & UX (Should-have, target sebelum publish)

| ID | Requirement | Acceptance Criteria | Ref |
|---|---|---|---|
| FR-13 | Semua form (register, booking, motorbike, CMS) tervalidasi dengan skema terpusat (zod) di client & server | Input tidak valid (email salah format, password < 8 karakter, harga negatif) ditolak dengan pesan spesifik, bukan `alert` generik | GAP P2-1, P2-6 |
| FR-14 | Form kontak benar-benar mengirim data (ke email/DB) atau dihapus/ditandai "coming soon" jika belum diimplementasi | Submit form kontak menghasilkan entri tersimpan atau notifikasi terkirim, bukan simulasi `setTimeout` | GAP P2-3 |
| FR-15 | Gambar (produk & CMS) persisten setelah deploy ulang | Upload gambar tetap ada setelah redeploy ke Vercel | GAP P1-4 |
| FR-16 | Admin bisa menonaktifkan (demote/nonaktifkan) user lain, dengan guard agar admin terakhir tidak bisa dihapus/didemote | Aksi demote pada admin terakhir yang tersisa → ditolak dengan pesan jelas | GAP P2-7 |

### 5.4 Dokumentasi & Developer Experience (Should-have)

| ID | Requirement | Acceptance Criteria | Ref |
|---|---|---|---|
| FR-17 | README & DEPLOYMENT.md mencerminkan stack aktual (PostgreSQL, bukan MySQL) | Mengikuti README dari nol berhasil menjalankan aplikasi tanpa error konfigurasi DB | GAP P3-1 |
| FR-18 | Tersedia `.env.example` dengan semua variabel env yang dibutuhkan (tanpa nilai rahasia) | File ada di root repo, developer baru bisa `cp .env.example .env` lalu isi sendiri | GAP P3-3 |

## 6. Out of Scope v1.0 (kandidat v1.1+)

- Integrasi payment gateway sungguhan (Midtrans/Stripe) dengan webhook — lihat [ADR-0003](./adr/0003-payment-gateway-strategy.md), diusulkan sebagai fase terpisah setelah alur dummy/manual solid.
- Sistem review & rating motor.
- Notifikasi email/WhatsApp otomatis (konfirmasi booking, reminder).
- Refund flow.
- Multi-cabang/multi-lokasi armada.
- Aplikasi mobile / PWA.
- Reporting & analytics lanjutan (revenue forecast, dsb).
- Audit log aktivitas admin.

## 7. Non-Functional Requirements

| Kategori | Requirement |
|---|---|
| **Keamanan** | Tidak ada secret di git; semua endpoint state-changing memverifikasi kepemilikan resource; upload file tervalidasi; rate limiting di endpoint sensitif |
| **Reliability** | Tidak ada race condition yang menyebabkan double booking (transaksi DB/constraint) |
| **Observability** | Error server dicatat terstruktur (minimal request ID + stack trace), siap diintegrasikan ke Sentry/log aggregator |
| **Performance** | Gambar katalog memakai `next/image` dengan lazy loading; query admin (list booking/motor) tidak N+1 |
| **Maintainability** | Validasi input terpusat (zod schema per entity), dipakai ulang di client & server |
| **Testability** | Alur kritis (booking, payment, auth) punya test otomatis minimal di level integrasi API |

## 8. Definition of Done — "Siap Publish"

Platform dianggap siap publish (v1.0) ketika:

1. Semua item **FR-1 s.d. FR-12** (kategori Must-have) selesai dan terverifikasi manual sesuai acceptance criteria.
2. Tidak ada temuan **P0** atau **P1** tersisa di [Gap Analysis](./GAP-ANALYSIS.md).
3. Secret lama sudah di-rotate dan `.env` tidak lagi tercatat di git.
4. Minimal smoke test manual end-to-end (register → login → browse → booking → bayar → admin approve) dijalankan tanpa error.
5. README & DEPLOYMENT.md akurat terhadap kondisi kode aktual.

Item FR-13 s.d. FR-18 (Should-have) **direkomendasikan** selesai sebelum publish tapi tidak memblokir — bisa menyusul di rilis cepat (v1.0.1) jika tenggat mendesak, dengan catatan eksplisit di komunikasi ke stakeholder.

## 9. Risiko & Asumsi

| Risiko | Mitigasi |
|---|---|
| Rotasi secret mengganggu environment production yang sudah berjalan (jika sudah live) | Jadwalkan rotasi di luar jam sibuk, siapkan rollback plan, koordinasi jika ada environment lain yang memakai secret sama |
| Perbaikan overlap booking & recalculated price berpotensi mengubah behavior yang sudah "dianggap normal" oleh admin saat ini | Komunikasikan perubahan ke admin sebelum rilis, sediakan pesan error yang jelas |
| Repo GitHub kemungkinan sudah memuat secret lama secara permanen di history publik | Rotasi credential menghilangkan risiko meski history tidak dibersihkan; pembersihan history (BFG/filter-repo) opsional, lihat [ADR-0002](./adr/0002-secret-leak-remediation.md) |

## 10. Pertanyaan Terbuka untuk Anda (perlu keputusan sebelum eksekusi penuh)

1. Payment gateway sungguhan: prioritas sekarang (masuk v1.0) atau ditunda ke v1.1 dengan alur manual admin-approval sebagai jalan sementara yang **benar-benar berfungsi**? → lihat [ADR-0003](./adr/0003-payment-gateway-strategy.md).
2. Penyimpanan gambar: pindah ke object storage (Vercel Blob/Cloudinary/S3) — provider mana yang mau dipakai? → lihat [ADR-0004](./adr/0004-file-storage-strategy.md).
3. Apakah repo GitHub ini **private**? Ini menentukan urgensi & pendekatan mitigasi kebocoran `.env` (rotate saja vs rotate + bersihkan history + evaluasi apakah perlu membuat repo baru).
4. Target tanggal publish, untuk membantu memprioritaskan antara menyelesaikan semua Should-have vs rilis cepat dengan Must-have saja.
