import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChefHat, Home, ShoppingBag, Search, User, ArrowRight, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface KitchenCookHeroProps {
  search: string;
  onSearchChange: (val: string) => void;
  onExploreClick: () => void;
  onCookwareClick: () => void;
  cartCount: number;
  totalProducts: number;
}

export default function KitchenCookHero({
  search,
  onSearchChange,
  onExploreClick,
  onCookwareClick,
  cartCount,
  totalProducts,
}: KitchenCookHeroProps) {
  const [localSearch, setLocalSearch] = useState(search);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchChange(localSearch);
    onExploreClick();
  };

  return (
    <div className="w-full bg-[#FAF7F2] dark:bg-slate-900/95 border-b border-amber-900/5 dark:border-slate-800 transition-colors duration-300 font-vietnam">
      {/* 1. Header Bar chuẩn theo ảnh mẫu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          {/* Logo Brand KitchenCook */}
          <Link to="/shop" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-10 h-10 rounded-xl bg-[#D96B27] text-white flex items-center justify-center shadow-md shadow-orange-600/20 group-hover:scale-105 transition-transform">
              <ChefHat className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-vietnam font-black text-xl tracking-tight text-slate-900 dark:text-white leading-tight">
                Kitchen<span className="text-[#D96B27]">Cook</span>
              </span>
              <span className="text-[10px] font-semibold text-amber-900/60 dark:text-slate-400 tracking-wider uppercase -mt-0.5">
                European Cookware
              </span>
            </div>
          </Link>

          {/* Navigation Pills (Trang chủ / Sản phẩm) */}
          <div className="hidden sm:flex items-center gap-2 bg-white dark:bg-slate-800 p-1 rounded-full border border-amber-900/10 dark:border-slate-700 shadow-sm">
            <Link
              to="/"
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
              title="Quay lại Cổng Công thức ẩm thực"
            >
              <Home className="w-3.5 h-3.5" />
              Công thức
            </Link>
            <button
              onClick={onExploreClick}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#D96B27] text-white text-xs font-bold shadow-sm"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              Sản phẩm
            </button>
          </div>

          {/* Search Pill Input */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md min-w-[220px]">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  onSearchChange(e.target.value);
                }}
                placeholder="Tìm kiếm nồi niêu, xoong chảo, dao kéo..."
                className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-amber-900/10 dark:border-slate-700 rounded-full focus:outline-none focus:border-[#D96B27] focus:ring-2 focus:ring-[#D96B27]/20 text-slate-900 dark:text-white placeholder-slate-400 shadow-inner"
              />
            </div>
          </form>

          {/* Right Action Icons (Cart & Orders) */}
          <div className="flex items-center gap-3 shrink-0">
            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-full bg-white dark:bg-slate-800 border border-amber-900/10 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#D96B27] hover:border-[#D96B27]/30 transition-all shadow-sm"
              title="Giỏ hàng"
            >
              <ShoppingBag className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#D96B27] text-white text-[10px] font-black flex items-center justify-center px-1 shadow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Quick Link Đơn mua */}
            <Link
              to="/orders"
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#D96B27] hover:bg-[#C85A17] text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-transform hover:scale-105"
            >
              <User className="w-3.5 h-3.5" />
              Đơn hàng
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Hero Section chuẩn theo form ảnh mẫu */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Cột trái: Typography nghệ thuật Châu Âu & CTA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100/70 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/40 text-[#A74311] dark:text-amber-300 text-xs font-bold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#D96B27]" />
              Bộ sưu tập đồ gia dụng chuẩn Châu Âu
            </div>

            <h1 className="font-vietnam font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight text-slate-900 dark:text-white leading-[1.12]">
              Nâng tầm căn bếp, <br />
              <span className="text-[#D96B27]">tạo nên nghệ thuật</span>
            </h1>

            <p className="font-vietnam text-slate-600 dark:text-slate-300 text-base sm:text-lg leading-relaxed max-w-xl font-normal">
              Khám phá bộ sưu tập nồi niêu xoong chảo, dao kéo và phụ kiện làm bếp chuyên nghiệp từ các thương hiệu hàng đầu thế giới. Bền bỉ, tinh xảo và an toàn tuyệt đối cho sức khỏe gia đình bạn.
            </p>

            {/* Cặp nút hành động chuẩn theo ảnh mẫu */}
            <div className="flex items-center gap-3.5 pt-2 flex-wrap">
              <button
                type="button"
                onClick={onExploreClick}
                className="px-6 py-3.5 rounded-full bg-slate-900 hover:bg-black text-white font-vietnam font-bold text-sm flex items-center gap-2 shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                Khám phá sản phẩm
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onCookwareClick}
                className="px-6 py-3.5 rounded-full bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-300/80 dark:border-slate-700 font-vietnam font-bold text-sm shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all hover:border-slate-400 cursor-pointer"
              >
                Bộ sưu tập Nồi & Chảo
              </button>
            </div>

            {/* Badge chỉ số */}
            <div className="pt-4 flex items-center gap-6 text-xs text-slate-500 dark:text-slate-400 border-t border-amber-900/10 dark:border-slate-800">
              <div>
                <strong className="block text-slate-900 dark:text-white text-base font-bold">{totalProducts}+</strong>
                <span>Dụng cụ nhà bếp</span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div>
                <strong className="block text-slate-900 dark:text-white text-base font-bold">100%</strong>
                <span>Chính hãng an toàn</span>
              </div>
              <div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
              <div>
                <strong className="block text-slate-900 dark:text-white text-base font-bold">GHN Express</strong>
                <span>Giao hàng toàn quốc</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Khung ảnh bo cong lớn phong cách Châu Âu */}
          <div className="lg:col-span-5 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 bg-slate-900 aspect-[4/3] sm:aspect-[16/12] group"
            >
              <img
                src="https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80"
                alt="KitchenCook Premium Cookware"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none" />
              
              {/* Badge góc ảnh */}
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="px-2.5 py-1 rounded-full bg-[#D96B27] text-[11px] font-bold uppercase tracking-wider shadow">
                  KitchenCook Selection
                </span>
                <p className="font-vietnam font-bold text-base sm:text-lg mt-1.5 drop-shadow">
                  Nồi gang tráng men & Dao rèn thủ công
                </p>
                <p className="text-xs text-slate-200 drop-shadow">
                  Thiết kế sang trọng, gia nhiệt đồng đều và giữ trọn dưỡng chất
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
