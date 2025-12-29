import Link from 'next/link';
import { CheckCircle, Home } from 'lucide-react';

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020b26] p-4">
      <div className="max-w-md w-full bg-[#0a1535] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        <div className="mx-auto w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Оплата успішна!</h1>
        <p className="text-gray-400 mb-8">
          Дякуємо! Ваше бронювання підтверджено. Ми надіслали деталі вам на пошту.
        </p>

        <Link 
          href="/"
          className="inline-flex items-center gap-2 bg-[#d4ff00] text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors"
        >
          <Home size={18} />
          На головну
        </Link>
      </div>
    </div>
  );
}