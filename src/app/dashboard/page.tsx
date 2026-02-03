import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Calendar, CreditCard, ChevronRight } from "lucide-react";

export default async function UserDashboard() {
  const session = await getServerSession(authOptions);
  
  const bookings = await prisma.booking.findMany({
    where: { userId: session?.user.id },
    include: { motorbike: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900">Riwayat Booking</h1>
          <p className="text-gray-500 mt-2">Lihat status penyewaan dan detail pembayaran Anda.</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white p-16 rounded-3xl border border-dashed border-gray-300 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
              <Calendar size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Belum ada booking</h3>
            <p className="text-gray-500 mb-8 max-w-xs mx-auto">Anda belum melakukan penyewaan motor apapun saat ini.</p>
            <a href="/#bikes" className="px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
              Sewa Motor Sekarang
            </a>
          </div>
        ) : (
          <div className="grid gap-6">
            {bookings.map((booking) => (
              <div key={booking.id} className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/50 p-6 flex flex-col md:flex-row md:items-center gap-6 group hover:border-primary/20 transition-all">
                <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden shrink-0">
                  <img src={booking.motorbike.imageUrl} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-bold text-gray-900">{booking.motorbike.name}</h3>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      booking.status === "PAID" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-primary" />
                      <span>{booking.startDate.toLocaleDateString()} - {booking.endDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-primary" />
                      <span className="font-bold text-gray-900">Rp {booking.totalPrice.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    {booking.status === "PENDING" && (
                      <button className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-lg shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all">
                        Bayar Sekarang
                      </button>
                    )}
                    <button className="px-6 py-2 bg-gray-50 text-gray-600 text-sm font-bold rounded-lg hover:bg-gray-100 transition-all flex items-center gap-2">
                      Detail Booking <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
