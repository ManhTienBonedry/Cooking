import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { ChefHat, Home, ShoppingBag, Search, Package, User, LogOut, Sun, Moon } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useTheme } from '../../hooks/useTheme';
import { apiJson, apiFetch, resetCsrfCache } from '../../lib/api';
import { AUTH_CHANGE_EVENT, getAuthChangeDetail, notifyAuthChanged } from '../../lib/authEvents';
import AuthModal from '../AuthModal';
import toast from 'react-hot-toast';

interface MeState {
  authenticated: boolean;
  user?: {
    id: number;
    full_name: string;
    email: string;
    avatar_url: string | null;
  };
}

export default function KitchenCookNavbar() {
  const { count: cartCount } = useCart();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchVal, setSearchVal] = useState(searchParams.get('search') || '');
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [me, setMe] = useState<MeState>({ authenticated: false });
  const [showUserMenu, setShowUserMenu] = useState(false);

  const refreshMe = useCallback(async () => {
    try {
      const data = await apiJson<MeState>('/api/auth/me');
      setMe(data);
    } catch {
      setMe({ authenticated: false });
    }
  }, []);

  useEffect(() => {
    void refreshMe();
  }, [refreshMe]);

  useEffect(() => {
    const onAuth = (event: Event) => {
      const detail = getAuthChangeDetail(event);
      if (detail.authenticated === false) {
        setMe({ authenticated: false });
        return;
      }
      void refreshMe();
    };
    window.addEventListener(AUTH_CHANGE_EVENT, onAuth);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, onAuth);
  }, [refreshMe]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = searchVal.trim();
    if (trimmed) {
      navigate(`/shop/products?q=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/shop/products');
    }
  };

  const handleLogout = async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
      resetCsrfCache();
      notifyAuthChanged({ authenticated: false });
      setShowUserMenu(false);
      toast.success('Đã đăng xuất');
    } catch {
      toast.error('Lỗi khi đăng xuất');
    }
  };

  const isHomeActive = location.pathname === '/shop';
  const isProductsActive = location.pathname.startsWith('/shop/products') || (location.pathname.startsWith('/shop/') && location.pathname !== '/shop');
  const isOrdersActive = location.pathname.startsWith('/orders');
  const isAccountActive = location.pathname.startsWith('/account');

  return (
    <>
      <header className="w-full bg-[#FAF7F2] dark:bg-slate-900 border-b border-amber-900/10 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors duration-300 font-vietnam">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            {/* Logo Thương hiệu KitchenCook */}
            <Link to="/shop" className="flex items-center gap-2.5 group shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#D96B27] text-white flex items-center justify-center shadow-md shadow-orange-600/20 group-hover:scale-105 transition-transform">
                <ChefHat className="w-6 h-6" />
              </div>
              <span className="font-vietnam font-black text-xl tracking-tight text-slate-900 dark:text-white leading-tight">
                Kitchen<span className="text-[#D96B27]">Cook</span>
              </span>
            </Link>

            {/* Cụm Điều hướng Dạng Viên Thuốc (Pill Navigation) */}
            <div className="flex items-center gap-1.5 bg-white dark:bg-slate-800 p-1 rounded-full border border-amber-900/10 dark:border-slate-700 shadow-sm shrink-0">
              <Link
                to="/shop"
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isHomeActive
                    ? 'bg-[#D96B27] text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Trang chủ KitchenCook"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Trang chủ</span>
              </Link>
              <Link
                to="/shop/products"
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isProductsActive
                    ? 'bg-[#D96B27] text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
                title="Xem tất cả sản phẩm KitchenCook"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Sản phẩm</span>
              </Link>
            </div>

            {/* Thanh Tìm Kiếm Dạng Viên Thuốc */}
            <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md min-w-[200px] order-last sm:order-none w-full sm:w-auto">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Tìm kiếm nồi niêu, xoong chảo, dao kéo..."
                  className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-white dark:bg-slate-800 border border-amber-900/10 dark:border-slate-700 rounded-full focus:outline-none focus:border-[#D96B27] focus:ring-2 focus:ring-[#D96B27]/20 text-slate-900 dark:text-white placeholder-slate-400 shadow-inner"
                />
              </div>
            </form>

            {/* Cụm Tiện Ích Phải (Theme, Cart, Orders, Auth) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Theme Toggle */}
              <button
                type="button"
                onClick={toggleTheme}
                className="p-2 rounded-full bg-white dark:bg-slate-800 border border-amber-900/10 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-[#D96B27] transition-colors shadow-sm cursor-pointer"
                title={isDark ? 'Chuyển sang giao diện sáng' : 'Chuyển sang giao diện tối'}
              >
                {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Nút Giỏ Hàng với Badge số lượng */}
              <Link
                to="/cart"
                className="relative p-2.5 rounded-full bg-white dark:bg-slate-800 border border-amber-900/10 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#D96B27] hover:border-[#D96B27]/30 transition-all shadow-sm"
                title="Giỏ hàng KitchenCook"
              >
                <ShoppingBag className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full bg-[#D96B27] text-white text-[10px] font-black flex items-center justify-center px-1 shadow animate-pulse">
                    {cartCount > 99 ? '99+' : cartCount}
                  </span>
                )}
              </Link>

              {/* Nút Đơn Hàng */}
              <Link
                to="/orders"
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isOrdersActive
                    ? 'bg-[#D96B27] text-white shadow-md shadow-orange-600/20'
                    : 'bg-white dark:bg-slate-800 border border-amber-900/10 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:text-[#D96B27]'
                }`}
                title="Quản lý & tra cứu đơn mua hàng"
              >
                <Package className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Đơn hàng</span>
              </Link>

              {/* Nút Tài Khoản / Đăng Nhập */}
              {me.authenticated && me.user ? (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={`flex items-center gap-2 p-1 pl-2 pr-2.5 rounded-full border transition-colors shadow-sm cursor-pointer ${
                      isAccountActive
                        ? 'border-[#D96B27] bg-orange-50/40 dark:bg-slate-800'
                        : 'border-amber-900/10 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#D96B27]/30'
                    }`}
                  >
                    {me.user.avatar_url ? (
                      <img
                        src={me.user.avatar_url}
                        alt={me.user.full_name}
                        className="w-6 h-6 rounded-full object-cover border border-[#D96B27]/30"
                      />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-[#D96B27]/10 text-[#D96B27] flex items-center justify-center text-xs font-bold">
                        {me.user.full_name?.charAt(0) || 'U'}
                      </div>
                    )}
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200 max-w-[80px] truncate hidden lg:inline">
                      {me.user.full_name}
                    </span>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-amber-900/10 dark:border-slate-700 py-1.5 z-50 text-xs font-semibold animate-in fade-in zoom-in-95 duration-150">
                      <div className="px-3.5 py-2.5 border-b border-slate-100 dark:border-slate-700/60">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{me.user.full_name}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-[11px] truncate">{me.user.email}</p>
                      </div>
                      <Link
                        to="/account"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-amber-50/60 dark:hover:bg-slate-700/50"
                      >
                        <User className="w-3.5 h-3.5 text-[#D96B27]" />
                        Tài khoản & Sổ địa chỉ
                      </Link>
                      <Link
                        to="/orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-amber-50/60 dark:hover:bg-slate-700/50"
                      >
                        <Package className="w-3.5 h-3.5 text-[#D96B27]" />
                        Lịch sử đơn hàng
                      </Link>
                      <Link
                        to="/"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-2.5 px-3.5 py-2 text-slate-700 dark:text-slate-200 hover:bg-amber-50/60 dark:hover:bg-slate-700/50 border-t border-slate-100 dark:border-slate-700/60"
                      >
                        <ChefHat className="w-3.5 h-3.5 text-amber-600" />
                        Cổng Công thức (CookingBoy)
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-left border-t border-slate-100 dark:border-slate-700/60 cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(true)}
                  className="px-4 py-2 rounded-full bg-[#D96B27] hover:bg-[#C85A17] text-white text-xs font-bold transition-all shadow-md shadow-orange-600/20 cursor-pointer"
                >
                  Đăng nhập
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
          void refreshMe();
        }}
      />
    </>
  );
}
