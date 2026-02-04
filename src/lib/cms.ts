import prisma from "@/lib/prisma";

export async function getCMSConfig() {
  const config = await prisma.landingPageConfig.findFirst();
  return config || {
    brandName: "SEWA MOTOR",
    brandDescription: "Platform penyewaan motor terbaik yang memberikan kenyamanan #1 untuk perjalanan Anda.",
    contactEmail: "hello@sewamotor.com",
    contactPhone: "+62 812 3456 7890",
    address: "Jl. Sudirman No 1-2, Jakarta",
    instagramUrl: "#",
    twitterUrl: "#",
    facebookUrl: "#",
    heroTitle: "Sewa Motor Impian dengan Mudah",
    heroSubtitle: "Pilihan motor terlengkap, harga terjangkau, dan pelayanan 24 jam untuk perjalanan Anda.",
    heroImage: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=1200",
    
    // Features
    feature1Title: "Unit Terbaru",
    feature1Description: "Seluruh unit motor kami dijamin dalam kondisi prima dengan perawatan rutin berkala.",
    feature2Title: "Proteksi Penuh",
    feature2Description: "Nikmati perjalanan tanpa cemas dengan proteksi asuransi komprehensif di setiap kilometer.",
    feature3Title: "Booking Kilat",
    feature3Description: "Proses verifikasi dan pengambilan unit yang efisien, langsung berangkat dalam 15 menit.",

    // Stats
    stat1Value: "500+",
    stat1Label: "Units Available",
    stat2Value: "15k+",
    stat2Label: "Happy Riders",
    stat3Value: "24h",
    stat3Label: "Support Service",
    stat4Value: "4.9",
    stat4Label: "Trustpilot Score",

    // Hero Extras
    heroBadge: "Premium Rental Experience",
    heroButtonText: "Jelajahi Armada",

    // Featured Section
    featuredSectionTitle: "Armada Favorit Musim Ini",
    featuredSectionSubtitle: "Fleet selection",

    // CTA Section
    ctaTitle: "Butuh Motor Custom Berbeda?",
    ctaDescription: "Hubungi admin kami untuk permintaan unit khusus atau penyewaan jangka panjang.",
    ctaButtonText: "Chat WhatsApp Admin",
  };
}
