# Dokumentasi Perencanaan — SewaMotor Platform

Dokumen di folder ini menyusun rencana pembenahan platform SewaMotor dari kondisi *boilerplate/demo* menjadi *siap publish end-to-end*. Disusun dari audit langsung terhadap kode per **2026-08-01**.

## Mulai dari mana?

1. **[GAP-ANALYSIS.md](./GAP-ANALYSIS.md)** — Apa saja yang salah/belum lengkap saat ini, dengan referensi file & baris kode. Baca ini dulu untuk memahami kondisi nyata platform.
2. **[PRD.md](./PRD.md)** — Requirement yang dirumuskan dari gap analysis: apa yang harus ada agar platform dianggap "siap publish", termasuk Definition of Done dan pertanyaan yang butuh keputusan Anda.
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Diagram sistem (context, ERD, sequence booking/payment, authorization flow, deployment) — kondisi saat ini vs target.
4. **[ROADMAP.md](./ROADMAP.md)** — Urutan eksekusi bertahap (Fase 0–6) untuk mewujudkan PRD, dengan estimasi effort per tugas.
5. **[adr/](./adr/)** — Keputusan arsitektur untuk isu yang butuh pertimbangan trade-off (bukan sekadar "perbaiki bug"):
   - [0001 — Database Provider: PostgreSQL](./adr/0001-database-provider-postgresql.md)
   - [0002 — Remediasi Kebocoran Secret](./adr/0002-secret-leak-remediation.md) ⚠️ **paling urgent**
   - [0003 — Strategi Payment Gateway](./adr/0003-payment-gateway-strategy.md)
   - [0004 — Strategi Penyimpanan File](./adr/0004-file-storage-strategy.md)
   - [0005 — Validasi Input Terpusat (Zod)](./adr/0005-centralized-validation-with-zod.md)
   - [0006 — Pengerasan Otorisasi API](./adr/0006-api-authorization-hardening.md)
   - [0007 — Pencegahan Double-Booking](./adr/0007-booking-concurrency-control.md)

## Ringkasan Status Saat Ini

**4 temuan Critical (P0)**, **6 High (P1)**, **8 Medium (P2)**, **5 Low (P3)** — detail lengkap di [GAP-ANALYSIS.md](./GAP-ANALYSIS.md).

Yang paling mendesak di luar kerja rutin coding: **`.env` berisi `NEXTAUTH_SECRET` dan kredensial database sudah ter-commit ke git dan ter-push ke GitHub** (`joeinus134131/motorbike-rental`). Ini butuh tindakan manual Anda (rotasi credential) — lihat [ADR-0002](./adr/0002-secret-leak-remediation.md) untuk checklist-nya.

## Cara Pakai Dokumen Ini Secara Bertahap

Dokumen ini dirancang untuk dikerjakan **incremental**, bukan sekali jadi:

1. Kerjakan [ROADMAP.md](./ROADMAP.md) fase demi fase, mulai dari Fase 0.
2. Setiap tugas di roadmap merujuk ke temuan spesifik di Gap Analysis dan (jika relevan) ke ADR yang menjelaskan alasan pendekatannya.
3. Setelah satu fase selesai, cek ulang **Exit Criteria** fase tersebut di Roadmap sebelum lanjut ke fase berikutnya.
4. PRD adalah "kontrak" — dipakai untuk memverifikasi apakah suatu fase benar-benar menuntaskan requirement, bukan cuma "terasa sudah diperbaiki".

Dokumen-dokumen ini adalah *living document* — perbarui bila ada keputusan baru (terutama ADR) atau bila gap baru ditemukan saat implementasi berjalan.
