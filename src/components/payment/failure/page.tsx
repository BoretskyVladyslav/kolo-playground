import Link from 'next/link';
import { XCircle, RefreshCw } from 'lucide-react';

export default function PaymentFailurePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020b26] p-4">
      <div className="max-w-md w-full bg-[#0a1535] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
        <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
          <XCircle size={40} className="text-red-500" />
        </div>
        
        <h1 className="text-2xl font-bold text-white mb-4">Оплата не пройшла</h1>
        <p className="text-gray-400 mb-8">
          На жаль, транзакція була відхилена або скасована. Спробуйте ще раз або зв'яжіться з нами.
        </p>

        <Link 
          href="/#booking"
          className="inline-flex items-center gap-2 bg-white/10 text-white px-6 py-3 rounded-xl font-bold hover:bg-white/20 transition-colors"
        >
          <RefreshCw size={18} />
          Спробувати ще раз
        </Link>
      </div>
    </div>
  );
}