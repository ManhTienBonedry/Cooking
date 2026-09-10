import { Link } from 'react-router-dom';
import { ChefHat, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

/**
 * Banner hiển thị tại Cửa hàng KitchenCook -> Gợi ý khách ghé thăm Trang Công Thức ẩm thực
 */
export function KitchenToRecipeBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-600/5 border border-amber-300/60 dark:border-amber-700/40 p-6 sm:p-8 shadow-sm font-vietnam">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#D96B27] to-[#C85A17] text-white flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-orange-600/25">
            <BookOpen className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#A74311] dark:text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              Nguồn Cảm Hứng Bếp Việt & Âu
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Vừa sắm đồ bếp xịn nhưng chưa biết tối nay nấu món gì?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Khám phá ngay hơn 500+ công thức nấu ăn độc quyền với hướng dẫn chi tiết từng bước, giúp bạn khai phá trọn vẹn công năng của chiếc nồi, chảo mới trổ tài cùng gia đình!
            </p>
          </div>
        </div>

        <Link
          to="/recipes"
          className="shrink-0 px-6 py-3.5 rounded-full bg-[#D96B27] hover:bg-[#C85A17] text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          Khám phá Công Thức Nấu Ăn
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Subtle background decoration */}
      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-amber-400/10 dark:bg-amber-400/5 blur-2xl pointer-events-none" />
    </div>
  );
}

/**
 * Banner hiển thị tại Trang Công Thức / Chi tiết Công Thức -> Gợi ý người xem mua đồ bếp tại KitchenCook
 */
export function RecipeToKitchenBanner() {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/15 via-orange-500/10 to-amber-600/5 border border-amber-300/60 dark:border-amber-700/40 p-6 sm:p-8 shadow-sm font-vietnam">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="flex items-start gap-4 sm:gap-5">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-[#D96B27] to-[#C85A17] text-white flex items-center justify-center text-2xl shrink-0 shadow-lg shadow-orange-600/25">
            <ChefHat className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-[#A74311] dark:text-amber-300 text-[11px] font-extrabold uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3" />
              KitchenCook Store · Đồ Gia Dụng Cao Cấp
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Nấu ăn ngon cần dụng cụ chuẩn! Bạn muốn mua đồ bếp xịn?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Ghé thăm ngay <strong>KitchenCook</strong> để trang bị những bộ nồi niêu xoong chảo chống dính, dao kéo rèn chuẩn Châu Âu, giúp từng thao tác chế biến của bạn mượt mà và chuẩn vị như bếp trưởng.
            </p>
          </div>
        </div>

        <Link
          to="/shop"
          className="shrink-0 px-6 py-3.5 rounded-full bg-[#D96B27] hover:bg-[#C85A17] text-white font-bold text-xs sm:text-sm shadow-xl shadow-orange-600/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          Ghé thăm KitchenCook Store
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="absolute -right-10 -bottom-10 w-48 h-48 rounded-full bg-orange-400/10 dark:bg-orange-400/5 blur-2xl pointer-events-none" />
    </div>
  );
}
