# ADR-0002: Remediasi Kebocoran Secret (.env ter-commit ke Git)

| | |
|---|---|
| **Status** | Proposed — perlu eksekusi segera |
| **Tanggal** | 2026-08-01 |
| **Severity** | P0 — Critical (lihat [Gap Analysis P0-1](../GAP-ANALYSIS.md)) |

## Konteks

`.gitignore` di root repo hanya berisi satu baris: `node_modules`. Akibatnya file `.env` — yang berisi `DATABASE_URL`, `DIRECT_URL`, dan `NEXTAUTH_SECRET` — **tercatat di git** sejak commit `e4b99b9` ("fix(init): first commit") dan ter-push ke remote `https://github.com/joeinus134131/motorbike-rental.git`.

Dampak jika credential ini bocor:
- `NEXTAUTH_SECRET` bocor → siapapun bisa memalsukan/forge session JWT NextAuth, termasuk **memalsukan diri sebagai ADMIN** tanpa perlu login sungguhan.
- `DATABASE_URL`/`DIRECT_URL` bocor → akses langsung ke database produksi dari luar, bypass semua application-level authorization.

Ini adalah insiden keamanan aktif, bukan sekadar technical debt — level urgensinya berbeda dari item roadmap lain.

## Keputusan

1. **Rotate semua credential yang pernah ada di `.env`** — ini adalah langkah wajib dan tidak bisa digantikan oleh pembersihan history saja, karena begitu credential pernah publik/tercatat di remote git, dia harus dianggap kompromis permanen:
   - Generate `NEXTAUTH_SECRET` baru (mis. `openssl rand -base64 32`).
   - Reset password/rotate connection string database di provider (Vercel Postgres/Neon/Supabase, dsb).
2. **Hapus `.env` dari tracking git** (`git rm --cached .env`) dan tambahkan `.env` ke `.gitignore`.
3. **Sediakan `.env.example`** berisi nama variabel tanpa nilai, sebagai pengganti dokumentasi env var yang aman untuk dibagikan.
4. **(Opsional, tergantung visibilitas repo)** Bersihkan `.env` dari seluruh riwayat git dengan `git filter-repo` atau BFG Repo-Cleaner, lalu force-push — hanya relevan jika ingin menghapus jejak historis credential lama dari publik. Ini **tidak menggantikan langkah rotasi**, hanya kebersihan tambahan.

## Alasan

- Rotasi adalah satu-satunya mitigasi yang benar-benar menghilangkan risiko — membersihkan git history tanpa rotasi tetap meninggalkan credential lama valid dan bisa saja sudah di-scrape oleh bot/scanner otomatis yang memantau GitHub public commits.
- Membersihkan history (filter-repo/BFG) bersifat destruktif (rewrite history, perlu force-push, berdampak ke semua collaborator yang harus re-clone) — sehingga statusnya opsional dan perlu keputusan eksplisit dari Anda, bukan dieksekusi otomatis.

## Konsekuensi

- Setelah rotasi, deployment Vercel yang sedang berjalan (jika ada) perlu update environment variable di dashboard Vercel, lalu redeploy.
- Semua session user yang sedang login akan invalid setelah `NEXTAUTH_SECRET` diganti (harus login ulang) — dampak minor, bisa dikomunikasikan sebagai maintenance singkat.
- Jika memilih membersihkan history: siapa pun yang sudah clone repo harus re-clone dari awal.

## Alternatif yang dipertimbangkan

- **Cukup hapus `.env` dari commit terbaru tanpa rotasi** — ditolak keras. Credential yang pernah ter-expose di git history harus dianggap bocor permanen; menyembunyikannya di commit baru tidak menghapusnya dari history lama yang tetap bisa diakses lewat `git log`.

## Tindakan yang perlu Anda lakukan secara manual

Rotasi credential menyentuh sistem live (database, auth secret produksi) sehingga **tidak dieksekusi otomatis oleh asisten** — ini di luar scope perubahan kode biasa. Checklist:

- [ ] Generate & set `NEXTAUTH_SECRET` baru di environment (local `.env` dan Vercel project settings)
- [ ] Rotate password/connection string database, update `DATABASE_URL` & `DIRECT_URL`
- [ ] Konfirmasi visibilitas repo GitHub (public/private) untuk menentukan urgensi pembersihan history
- [ ] Putuskan apakah akan menjalankan `git filter-repo`/BFG (destruktif, perlu koordinasi force-push)
