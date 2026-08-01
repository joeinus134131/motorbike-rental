# Architecture & Diagrams — SewaMotor Platform

> Diagram di dokumen ini pakai sintaks [Mermaid](https://mermaid.js.org/) — akan render otomatis di GitHub, GitLab, VS Code (dengan ekstensi Mermaid), dan sebagian besar viewer Markdown modern.
> Dokumen terkait: [PRD](./PRD.md) · [Gap Analysis](./GAP-ANALYSIS.md) · [Roadmap](./ROADMAP.md)

## 1. System Context (kondisi saat ini)

```mermaid
flowchart TB
    subgraph Client["Browser"]
        Guest["Pengunjung / Guest"]
        Customer["Customer (login)"]
        Admin["Admin"]
    end

    subgraph Vercel["Vercel — Next.js 14 App Router"]
        Pages["Pages: landing, katalog, booking, dashboard, admin/*"]
        API["Route Handlers: /api/**"]
        MW["middleware.ts (NextAuth withAuth)\ncover: /admin/*, /dashboard/*\nTIDAK cover /api/*"]
    end

    DB[("PostgreSQL\n(Prisma ORM)")]
    FS["public/uploads\n(filesystem lokal — EPHEMERAL di Vercel)"]

    Guest -->|browsing| Pages
    Customer -->|login, booking| Pages
    Admin -->|kelola armada/CMS/user| Pages
    Pages --> API
    MW -.proteksi page.-> Pages
    API -->|Prisma Client| DB
    API -->|base64 upload| FS

    classDef gap fill:#3a1a1a,stroke:#e05252,color:#f3d9d9
    class FS gap
```

**Catatan arsitektur kondisi saat ini:**
- `middleware.ts` hanya melindungi **halaman** (`/admin/*`, `/dashboard/*`), bukan `/api/*` — proteksi API dilakukan manual per-route dan **tidak konsisten** (lihat GAP P1-2).
- Penyimpanan file upload memakai filesystem lokal container Vercel yang **ephemeral** — bukan solusi produksi (GAP P1-4).
- Belum ada payment gateway eksternal, object storage, email/notification service, atau observability service tersambung.

## 2. Target Architecture (setelah Roadmap Fase 0-3)

```mermaid
flowchart TB
    subgraph Client["Browser"]
        Guest["Pengunjung"]
        Customer["Customer"]
        Admin["Admin"]
    end

    subgraph Vercel["Vercel — Next.js 14 App Router"]
        Pages["Pages"]
        PublicAPI["/api/motorbikes, /api/cms/*\n(publik, read-only)"]
        AuthAPI["/api/bookings/*, /api/auth/*\n(butuh session + ownership check)"]
        AdminAPI["/api/admin/**\n(role ADMIN wajib, guard terpusat)"]
        MW["middleware.ts\nproteksi page + guard role dasar"]
        RateLimit["Rate limiter\n(mis. Upstash Ratelimit)"]
    end

    DB[("PostgreSQL (Prisma)\n+ unique/exclusion constraint\nanti double-booking")]
    Blob["Object Storage\n(Vercel Blob / Cloudinary / S3)"]
    Payment["Payment Gateway\n(mis. Midtrans) + Webhook handler"]
    Observability["Error tracking & structured logs\n(mis. Sentry)"]

    Guest --> Pages
    Customer --> Pages
    Admin --> Pages
    Pages --> PublicAPI & AuthAPI & AdminAPI
    MW -.proteksi.-> Pages
    RateLimit -.guard.-> AuthAPI
    AuthAPI -->|ownership check + server-side price calc| DB
    AdminAPI -->|role check terpusat| DB
    AdminAPI -->|upload| Blob
    AuthAPI -->|create transaction| Payment
    Payment -->|webhook: payment settled| AuthAPI
    AuthAPI & AdminAPI -.errors.-> Observability

    classDef new fill:#12331f,stroke:#3fa66b,color:#d9f3e2
    class Blob,Payment,Observability,RateLimit new
```

## 3. Entity Relationship Diagram (skema aktual)

```mermaid
erDiagram
    User ||--o{ Booking : "membuat"
    Motorbike ||--o{ Booking : "disewakan pada"

    User {
        string id PK
        string name
        string email UK
        string password
        Role role "USER | ADMIN"
        string image
        datetime createdAt
        datetime updatedAt
    }

    Motorbike {
        string id PK
        string name
        string brand
        string model
        int year
        float pricePerDay
        string imageUrl
        string description
        string status "TIDAK enum — free text (gap P1-5)"
        datetime createdAt
        datetime updatedAt
    }

    Booking {
        string id PK
        string userId FK
        string motorbikeId FK
        datetime startDate
        datetime endDate
        float totalPrice "diterima mentah dari client (gap P0-3)"
        BookingStatus status "PENDING|PAID|CANCELLED|COMPLETED"
        string paymentId "dummy"
        datetime createdAt
        datetime updatedAt
    }

    LandingPageConfig {
        string id PK "single-row: default"
        string heroTitle
        string brandName
        string contactEmail
        string feature1Title
        string stat1Value
    }

    SystemConfig {
        string id PK "single-row: default"
        string paymentGatewayMode "dummy | production"
        string paymentInstructions
        boolean maintenanceMode "tidak pernah dibaca (gap P2-4)"
    }
```

**Entity yang belum ada tapi dibutuhkan untuk fitur yang sudah "terlihat" di UI** (lihat GAP P2-8): `Review`/`Rating`, `PaymentTransaction` (log detail, terpisah dari `Booking.paymentId`), `Notification`, `AuditLog`.

## 4. Sequence — Alur Booking & Pembayaran (kondisi saat ini, ada gap)

```mermaid
sequenceDiagram
    actor C as Customer
    participant FE as bookings/new/page.tsx
    participant API as POST /api/bookings
    participant DB as PostgreSQL
    participant Dash as dashboard/page.tsx
    actor A as Admin

    C->>FE: pilih motor + tanggal
    FE->>FE: hitung totalPrice DI CLIENT (rawan manipulasi)
    FE->>API: POST { motorbikeId, startDate, endDate, totalPrice }
    Note over API: TIDAK cek overlap tanggal<br/>TIDAK hitung ulang harga
    API->>DB: create Booking(status=PENDING)
    API-->>FE: 201 Created
    FE-->>C: redirect ke dashboard

    C->>Dash: buka dashboard, lihat booking PENDING
    Note over Dash: tombol "Bayar Sekarang"<br/>TIDAK PUNYA onClick (gap P0-4)
    Dash-->>C: (tidak terjadi apa-apa)

    A->>A: buka admin/transactions
    A->>DB: PATCH booking.status = PAID (approval manual)
    Note over A,DB: Ini satu-satunya jalur yang<br/>benar-benar berfungsi end-to-end
```

## 5. Sequence — Alur Booking & Pembayaran (target setelah Roadmap Fase 1)

```mermaid
sequenceDiagram
    actor C as Customer
    participant FE as bookings/new/page.tsx
    participant API as POST /api/bookings
    participant DB as PostgreSQL
    participant Pay as POST /api/bookings/:id/payment
    actor A as Admin

    C->>FE: pilih motor + tanggal
    FE->>API: POST { motorbikeId, startDate, endDate }
    API->>DB: cek overlap booking aktif pada motorbikeId
    alt tanggal bentrok
        API-->>FE: 409 Conflict — tanggal tidak tersedia
    else tanggal tersedia
        API->>DB: ambil pricePerDay, hitung totalPrice server-side
        API->>DB: create Booking(status=PENDING, totalPrice terhitung)
        API-->>FE: 201 Created
    end

    C->>FE: klik "Bayar Sekarang" di dashboard
    FE->>Pay: POST /api/bookings/:id/payment
    Pay->>DB: verifikasi booking.userId === session.user.id
    alt bukan pemilik booking
        Pay-->>FE: 403 Forbidden
    else pemilik sah
        Pay->>DB: update status = PAID, simpan paymentId
        Pay-->>FE: 200 OK
    end

    A->>A: admin/transactions tetap tersedia sebagai jalur alternatif/verifikasi manual
```

## 6. Authorization Flow (target — guard terpusat)

```mermaid
flowchart TD
    Req["Request masuk"] --> IsPage{"Request halaman\natau API?"}
    IsPage -->|Halaman /admin/* atau /dashboard/*| MW["middleware.ts\ncek session + role"]
    IsPage -->|API /api/**| Guard["Guard function terpusat\n(mis. requireRole/requireOwner)"]

    MW --> MWok{"Lolos?"}
    MWok -->|tidak| Redirect["redirect ke / atau /login"]
    MWok -->|ya| Page["Render halaman"]

    Guard --> Kind{"Jenis endpoint"}
    Kind -->|Publik read-only| Public["Tidak perlu session\n(mis. GET /api/motorbikes)"]
    Kind -->|Butuh login, resource milik user| Owner["requireSession + cek\nresource.userId === session.user.id"]
    Kind -->|Admin-only| RoleCheck["requireSession + role === ADMIN"]

    Owner --> Ok1{"Cocok?"}
    Ok1 -->|tidak| E403a["403 Forbidden"]
    Ok1 -->|ya| Handler1["Jalankan handler"]

    RoleCheck --> Ok2{"role ADMIN?"}
    Ok2 -->|tidak| E403b["401/403"]
    Ok2 -->|ya| Handler2["Jalankan handler"]
```

## 7. Deployment View

```mermaid
flowchart LR
    Dev["Developer\n(local, .env dari .env.example)"] -->|git push| GitHub["GitHub repo\njoeinus134131/motorbike-rental"]
    GitHub -->|CI: lint, typecheck, test\n(Roadmap Fase 4)| CI["GitHub Actions"]
    CI -->|deploy| Vercel["Vercel Production"]
    Vercel --> DB[("Managed PostgreSQL\n(Vercel Postgres/Neon/Supabase, dsb)")]
    Vercel --> Blob["Object Storage"]
    Vercel --> Payment["Payment Gateway"]

    subgraph EnvVars["Environment Variables (Vercel Project Settings, BUKAN di git)"]
        E1["DATABASE_URL"]
        E2["DIRECT_URL"]
        E3["NEXTAUTH_SECRET (rotated)"]
        E4["NEXTAUTH_URL"]
        E5["Payment gateway keys"]
        E6["Object storage token"]
    end
    Vercel -.baca dari.-> EnvVars
```
