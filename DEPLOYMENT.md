# Panduan Deployment Vercel (Next.js + Prisma + MySQL)

Ikuti langkah-langkah di bawah ini untuk merilis aplikasi **Sewa Motor** ke Vercel agar bisa diakses secara publik.

## 1. Persiapan Database (MySQL)
Karena Vercel tidak menyediakan database MySQL bawaan, Anda perlu menggunakan provider database eksternal seperti:
- **Tidb Cloud** (Sangat disarankan, gratis untuk tier awal)
- **PlanetScale**
- **Aiven**
- **DigitalOcean Managed MySQL**

Setelah mendapatkan koneksi string, simpan sebagai `DATABASE_URL`. Formatnya:
`mysql://USER:PASSWORD@HOST:PORT/DATABASE`

## 2. Setup Environment Variables di Vercel
Buka dashboard Vercel Anda, masuk ke **Settings > Environment Variables**, dan tambahkan key berikut:

| Key | Value / Contoh | Deskripsi |
| :--- | :--- | :--- |
| `DATABASE_URL` | `mysql://...` | Connection string MySQL Anda |
| `NEXTAUTH_SECRET` | `KetikApaSajaYangSangatRahasia` | Kode enkripsi untuk sesi login |
| `NEXTAUTH_URL` | `https://nama-proyek-anda.vercel.app` | URL domain produksi Anda |

## 3. Konfigurasi Build di Vercel
Aplikasi ini sudah dikonfigurasi dengan script `postinstall` di `package.json` untuk menjalankan `prisma generate`.

Jika Anda ingin Vercel otomatis melakukan sinkronisasi tabel database setiap kali deploy, Anda bisa mengubah **Build Command** di Vercel Dashboard menjadi:
`npx prisma generate && npx prisma db push && next build`

## 4. Penting: Masalah Upload Gambar (Peringatan!)
⚠️ **Sistem file Vercel bersifat "Immutable" (Hanya Baca).**

Fitur **"Upload Manual"** yang baru saja kita tambahkan menyimpan gambar di folder `public/uploads`.
- Di komputer lokal, ini akan berhasil.
- **Di Vercel**, gambar yang Anda upload akan **HILANG** setiap kali aplikasi melakukan redeploy atau fungsi serverless beristirahat (cold start).

### Solusi untuk Produksi:
Agar gambar permanen di Vercel, Anda disarankan menggunakan provider storage eksternal:
1. **Cloudinary**: Gunakan library `cloudinary` untuk simpan gambar.
2. **Vercel Blob**: Gunakan `@vercel/blob` (Sangat mudah untuk proyek Next.js).
3. **AWS S3** atau **Google Cloud Storage**.

*Jika Anda hanya menggunakan URL eksternal (Unsplash/Pinterest), fitur tersebut akan bekerja 100% normal di Vercel.*

## 5. Deployment Step
1. Hubungkan GitHub repository Anda ke Vercel.
2. Masukkan semua Environment Variables.
3. Klik **Deploy**.
4. Selesai!

---
*Jika ada kendala "Prisma Client not found", pastikan script `postinstall` sudah ada di `package.json` dan jalankan redeploy.*
