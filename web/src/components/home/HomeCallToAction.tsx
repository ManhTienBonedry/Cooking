import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Reveal } from '../motion/ScrollReveal';

export default function HomeCallToAction() {
  useEffect(() => {
    const id = window.requestAnimationFrame(() => {
      const VT = window.VanillaTilt;
      if (VT) {
        VT.init(Array.from(document.querySelectorAll('.cta-container [data-tilt]')));
      }
    });
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <section className="py-16 sm:py-24 cta-container">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal y={24}>
          <div
            className="bg-gray-900 rounded-sm p-8 sm:p-12 md:p-16 shadow-xl flex flex-col md:flex-row items-center justify-between"
          >
            <div className="md:w-1/2 text-left mb-8 md:mb-0">
              <h2 className="text-3xl sm:text-5xl font-serif text-white mb-5 sm:mb-6 uppercase tracking-widest leading-tight">Bắt Đầu Hành Trình Của Bạn</h2>
              <p className="text-base sm:text-xl text-gray-400 max-w-2xl mx-auto font-medium mb-6 sm:mb-8">
                Tất cả công thức được yêu thích nhất của chúng tôi, được chỉnh sửa và thiết kế đẹp mắt. Chỉ cần đăng ký một tài khoản ngay cho bạn!
              </p>
              <Link
                to="/recipes"
                className="inline-flex items-center space-x-2 bg-white text-black px-8 py-3 font-bold text-xs uppercase tracking-[0.2em] hover:bg-gray-200 transition-colors duration-300 group shadow-lg"
              >
                <span>XEM NGAY</span>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </div>
            <div className="md:w-2/5 flex justify-center">
              {/* Decorative image box or something */}
              <div className="w-48 h-48 sm:w-64 sm:h-64 border-4 sm:border-8 border-gray-800 bg-gray-800 flex items-center justify-center relative overflow-hidden transform rotate-3">
                <img src="/assets/images/vietnam1.jpg" alt="Cookbook Placeholder" className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center p-4">
                  <h3 className="text-white font-serif font-black text-lg sm:text-2xl text-center uppercase tracking-widest">Tuyển Tập<br />Nấu Ăn</h3>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
