import { Link } from 'react-router-dom';
import { ChefHat, ShieldCheck, Truck, RefreshCw, Award, ArrowRight, Heart } from 'lucide-react';

export default function KitchenCookFooter() {
  return (
    <footer className="w-full bg-[#1A1D20] text-slate-300 font-vietnam border-t border-slate-800 transition-colors duration-300">
      {/* 1. Thanh 4 Giá Trị Cam Kết Của KitchenCook */}
      <div className="border-b border-slate-800/80 bg-[#141618]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#D96B27]/15 border border-[#D96B27]/30 flex items-center justify-center text-[#D96B27] shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">100% Chính Hãng</h4>
                <p className="text-xs text-slate-400">Đạt chuẩn an toàn Châu Âu</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">Giao Hàng GHN Express</h4>
                <p className="text-xs text-slate-400">Đóng gói chuẩn, giao toàn quốc</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">Đổi Trả 7 Ngày</h4>
                <p className="text-xs text-slate-400">1 đổi 1 nếu lỗi sản xuất</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-white text-sm font-bold">Bảo Hành 24 Tháng</h4>
                <p className="text-xs text-slate-400">Bảo hành chính hãng uy tín</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Nội dung chính của Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Cột 1 & 2: Thương hiệu KitchenCook & Cầu nối CookingBoy */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#D96B27] text-white flex items-center justify-center shadow-md shadow-orange-600/30">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <span className="font-vietnam font-black text-xl tracking-tight text-white leading-tight">
                  Kitchen<span className="text-[#D96B27]">Cook</span>
                </span>
                <p className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
                  European Cookware Store
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              KitchenCook là cửa hàng chuyên cung cấp dụng cụ nhà bếp, nồi niêu xoong chảo cao cấp tiêu chuẩn Châu Âu. Nơi biến việc nấu nướng thành trải nghiệm nghệ thuật mỗi ngày.
            </p>

            {/* Box kết nối Cổng Công Thức CookingBoy */}
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-amber-400" />
                  Bạn muốn tìm cảm hứng nấu ăn?
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Khám phá kho 500+ công thức ẩm thực chuẩn vị tại CookingBoy.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D96B27] hover:text-[#f38641] transition-colors"
              >
                Ghé thăm Cổng Công Thức CookingBoy <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Cột 3: Danh Mục Sản Phẩm */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Danh Mục Nổi Bật</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/shop?category=noi-chao" className="hover:text-white transition-colors">
                  Nồi & Chảo gang Châu Âu
                </Link>
              </li>
              <li>
                <Link to="/shop?category=dao-keo" className="hover:text-white transition-colors">
                  Bộ dao thép rèn thủ công
                </Link>
              </li>
              <li>
                <Link to="/shop?category=phu-kien" className="hover:text-white transition-colors">
                  Dụng cụ & Phụ kiện làm bếp
                </Link>
              </li>
              <li>
                <Link to="/shop?sort=popular" className="hover:text-white transition-colors">
                  Sản phẩm bán chạy nhất
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Hỗ Trợ & Mua Hàng */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Hỗ Trợ Mua Sắm</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link to="/cart" className="hover:text-white transition-colors">
                  Giỏ hàng KitchenCook
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-white transition-colors">
                  Tra cứu vận đơn GHN Express
                </Link>
              </li>
              <li>
                <span className="text-slate-400">Hotline hỗ trợ: 1900 8888 (8h - 21h)</span>
              </li>
              <li>
                <span className="text-slate-400">Email: support@kitchencook.vn</span>
              </li>
            </ul>
          </div>

          {/* Cột 5: Phương Thức Thanh Toán & Vận Chuyển */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">Thanh Toán & Vận Chuyển</h4>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2 text-[11px] font-semibold">
                <span className="px-2.5 py-1 rounded-lg bg-pink-500/10 border border-pink-500/30 text-pink-400">
                  Ví MoMo
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400">
                  VietQR 24/7
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                  COD Tiền mặt
                </span>
              </div>
              <p className="text-[11px] text-slate-400 pt-1">
                Giao hàng toàn quốc thông qua đối tác vận chuyển hỏa tốc <strong>GHN Express</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Dòng Bản Quyền Cuối Trang */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© 2026 KitchenCook · Thương hiệu đồ bếp gia dụng Châu Âu cao cấp.</p>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-slate-400 transition-colors">CookingBoy</Link>
            <span>•</span>
            <Link to="/shop" className="hover:text-slate-400 transition-colors">KitchenCook</Link>
            <span>•</span>
            <Link to="/admin" className="hover:text-slate-400 transition-colors">Admin Portal</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
