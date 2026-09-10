import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag, ArrowRight, Star, Flame, Package, UtensilsCrossed
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Reveal, RevealStaggerItem } from '../motion/ScrollReveal';
import { apiJson } from '../../lib/api';

/* ── types ─────────────────────────────────────── */
interface FeaturedProduct {
  id: number;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  image_url: string | null;
  product_type: string;
  rating: number;
  total_sold: number;
  store_name: string;
}

function fmt(n: number) {
  return n.toLocaleString('vi-VN') + 'đ';
}

/* ── static showcase categories ──────────────── */
const SHOP_CATEGORIES = [
  {
    icon: Flame,
    title: 'Nồi & Xoong chảo',
    desc: 'Nồi gang tráng men, nồi inox 304, chảo chống dính sâu lòng chuẩn Âu',
    color: 'from-stone-700 to-slate-900',
    bg: 'bg-white dark:bg-slate-800/80',
    link: '/shop?type=equipment',
  },
  {
    icon: UtensilsCrossed,
    title: 'Dao kéo & Thớt',
    desc: 'Thép tôi cao cấp sắc bén, thớt gỗ kháng khuẩn bền bỉ theo năm tháng',
    color: 'from-stone-800 to-stone-900',
    bg: 'bg-white dark:bg-slate-800/80',
    link: '/shop?type=equipment',
  },
  {
    icon: Package,
    title: 'Dụng cụ & Phụ kiện',
    desc: 'Bộ xẻng vá chịu nhiệt, cân điện tử, phụ kiện bàn ăn tinh tế',
    color: 'from-slate-800 to-slate-950',
    bg: 'bg-white dark:bg-slate-800/80',
    link: '/shop?type=equipment',
  },
];

/* ── component ───────────────────────────────── */
export default function HomeMarketplace() {
  const [products, setProducts] = useState<FeaturedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiJson<{ products: FeaturedProduct[] }>('/api/marketplace/products?sort=popular&limit=6&status=approved')
      .then(d => setProducts(d.products ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden font-vietnam">
      {/* Decorative BG */}
      <div className="absolute inset-0 bg-stone-50/50 dark:bg-slate-950/30" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ─── Header ─── */}
        <Reveal className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-stone-200 bg-stone-100 px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-800 shadow-xs dark:border-slate-700 dark:bg-slate-800 dark:text-stone-300">
              <ShoppingBag className="h-4 w-4" />
              KitchenCook · Cửa Hàng Đồ Gia Dụng
            </span>
            <h2 className="text-4xl font-black text-black dark:text-white md:text-5xl tracking-tight">
              Trang bị đồ bếp <span className="text-stone-600 dark:text-stone-300 font-serif italic">chuẩn Châu Âu</span>
            </h2>
            <p className="mt-4 max-w-2xl text-base font-medium leading-7 text-gray-600 dark:text-slate-300 md:text-lg">
              Bộ sưu tập nồi niêu xoong chảo, dao kéo cao cấp chính hãng từ KitchenCook — Bền bỉ, an toàn, nâng niu từng bữa cơm gia đình.
            </p>
          </div>
          <Link
            to="/shop"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-900 hover:bg-black dark:bg-white dark:hover:bg-slate-100 px-6 py-3.5 text-sm font-bold text-white dark:text-slate-900 shadow-lg transition hover:-translate-y-0.5"
          >
            Ghé KitchenCook Store
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Reveal>

        {/* ─── 3 Category Showcase Cards ─── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {SHOP_CATEGORIES.map((cat, idx) => (
            <RevealStaggerItem key={cat.title} index={idx} stagger={0.08} y={20}>
              <Link to={cat.link} className="block h-full">
                <motion.div
                  whileHover={{ y: -4, scale: 1.01 }}
                  className={`relative group h-full flex flex-col p-6 sm:p-8 rounded-2xl ${cat.bg} border border-white/60 dark:border-slate-700/50 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden`}
                >
                  {/* Gradient orb */}
                  <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${cat.color} opacity-20 blur-2xl group-hover:opacity-30 transition-opacity duration-500`} />

                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${cat.color} shadow-lg mb-4`}>
                    <cat.icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-xl font-serif font-bold text-gray-900 dark:text-white mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed mb-4 flex-1">
                    {cat.desc}
                  </p>

                  <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gray-900 dark:text-white group-hover:gap-3 transition-all duration-300 mt-auto">
                    Khám phá
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </motion.div>
              </Link>
            </RevealStaggerItem>
          ))}
        </div>

        {/* ─── Featured Products Grid ─── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 dark:bg-slate-700 rounded-2xl aspect-[4/3]" />
                <div className="mt-3 space-y-2 px-1">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <Reveal className="mb-6">
              <h3 className="text-lg font-black uppercase tracking-wider text-gray-900 dark:text-white border-b border-gray-200 dark:border-slate-700 pb-4">
                Sản phẩm được yêu thích
              </h3>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
              {products.map((p, idx) => {
                const hasDiscount = p.sale_price != null && p.sale_price < p.price;
                const discountPct = hasDiscount ? Math.round((1 - p.sale_price! / p.price) * 100) : 0;
                
                return (
                  <RevealStaggerItem key={p.id} index={idx} stagger={0.06} y={18}>
                    <Link to={`/shop/${p.slug}`} className="block h-full">
                      <motion.div
                        whileHover={{ y: -5 }}
                        className="group flex h-full flex-col bg-white dark:bg-slate-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all duration-300"
                      >
                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100 dark:bg-slate-700">
                          {p.image_url ? (
                            <img
                              src={p.image_url}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-amber-100 to-orange-100 dark:from-slate-700 dark:to-slate-600">
                              <ShoppingBag className="w-10 h-10 text-amber-300 dark:text-slate-500" />
                            </div>
                          )}

                          {hasDiscount && (
                            <span className="absolute top-2.5 left-2.5 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                              -{discountPct}%
                            </span>
                          )}
                        </div>
                        {/* Details */}
                        <div className="flex flex-1 flex-col p-3 sm:p-4">
                          <h4 className="text-sm sm:text-base font-bold text-gray-800 dark:text-slate-100 line-clamp-2 flex-1">
                            {p.name}
                          </h4>
                          <div className="mt-2">
                            {hasDiscount ? (
                              <>
                                <span className="text-sm sm:text-base font-bold text-red-600 dark:text-red-500">{fmt(p.sale_price!)}</span>
                                <span className="ml-2 text-xs sm:text-sm text-gray-400 line-through">{fmt(p.price)}</span>
                              </>
                            ) : (
                              <span className="text-sm sm:text-base font-bold text-gray-800 dark:text-slate-200">{fmt(p.price)}</span>
                            )}
                          </div>
                          <div className="mt-2 flex items-center gap-1 text-xs text-amber-500">
                            <Star className="w-3 h-3 fill-current" />
                            <span className="font-bold">{p.rating.toFixed(1)}</span>
                            <span className="text-gray-400">({p.total_sold})</span>
                          </div>
                        </div>
                      </motion.div>
                    </Link>
                  </RevealStaggerItem>
                );
              })}
            </div>
          </>
        ) : null}

      </div>
    </section>
  );
}
