import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Search, X, SlidersHorizontal, ChevronDown, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';

import ProductCard from '../../components/shop/ProductCard';
import { KitchenToRecipeBanner } from '../../components/common/CrossPromotionBanners';
import Pagination from '../../components/ui/Pagination';
import { apiJson } from '../../lib/api';
import { useCart } from '../../contexts/CartContext';
import type { Product, ProductCategory } from '../../types/marketplace';

const PAGE_SIZE = 12;
const SORT_OPTIONS = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'popular', label: 'Bán chạy' },
  { value: 'price_asc', label: 'Giá tăng dần' },
  { value: 'price_desc', label: 'Giá giảm dần' },
  { value: 'rating', label: 'Đánh giá cao' },
];

export default function ShopProducts() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const [searchParams, setSearchParams] = useSearchParams();

  const [showFilters, setShowFilters] = useState(() => {
    return !!(searchParams.get('q') || searchParams.get('category') || searchParams.get('type'));
  });

  const filterRef = useRef<HTMLDivElement>(null);

  /* Filters */
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [productType, setProductType] = useState(searchParams.get('type') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const q = searchParams.get('q');
    const c = searchParams.get('category');
    const t = searchParams.get('type');
    const s = searchParams.get('sort');
    if (q !== null) setSearch(q);
    if (c !== null) setCategory(c);
    if (t !== null) setProductType(t);
    if (s !== null) setSort(s);

    if (q || c || t) {
      setShowFilters(true);
    }
  }, [searchParams]);

  /* Load categories */
  useEffect(() => {
    apiJson<{ categories: ProductCategory[] }>('/api/marketplace/categories')
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  const handleProductType = useCallback((typeVal: string) => {
    setProductType(typeVal);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (typeVal) params.set('type', typeVal); else params.delete('type');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handleCategory = useCallback((catVal: string) => {
    setCategory(catVal);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (catVal) params.set('category', catVal); else params.delete('category');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  const handleSort = useCallback((sortVal: string) => {
    setSort(sortVal);
    setPage(1);
    const params = new URLSearchParams(searchParams);
    if (sortVal !== 'newest') params.set('sort', sortVal); else params.delete('sort');
    setSearchParams(params);
  }, [searchParams, setSearchParams]);

  /* Fetch products */
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const q = new URLSearchParams();
      if (search.trim()) q.set('q', search.trim());
      if (category) q.set('category', category);
      if (productType) q.set('type', productType);
      q.set('sort', sort);
      q.set('limit', String(PAGE_SIZE));
      q.set('offset', String((page - 1) * PAGE_SIZE));

      const data = await apiJson<{ products: Product[]; total: number }>(
        `/api/marketplace/products?${q.toString()}`
      );
      setProducts(data.products ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setProducts([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [search, category, productType, sort, page]);

  useEffect(() => {
    const t = setTimeout(() => void fetchProducts(), 250);
    return () => clearTimeout(t);
  }, [fetchProducts]);

  const handleAddToCart = useCallback(async (productId: number) => {
    try {
      await addItem(productId);
      toast.success('Đã thêm vào giỏ hàng!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Không thể thêm vào giỏ');
    }
  }, [addItem]);

  const onClearFilters = useCallback(() => {
    setSearchParams({});
    setSearch('');
    setCategory('');
    setProductType('');
    setSort('newest');
    setPage(1);
  }, [setSearchParams]);

  const hasActiveFilters = useMemo(() => 
    !!(search || category || productType || sort !== 'newest'),
    [search, category, productType, sort]
  );

  const equipCategories = useMemo(() => categories.filter((c) => c.type === 'equipment'), [categories]);
  const foodCategories = useMemo(() => categories.filter((c) => c.type === 'food'), [categories]);
  const activeCategories = useMemo(() => {
    if (productType === 'equipment') return equipCategories;
    if (productType === 'food') return foodCategories;
    return categories;
  }, [productType, categories, foodCategories, equipCategories]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-slate-900 transition-colors duration-300 font-vietnam">
      {/* Header trang sản phẩm */}
      <div className="bg-white dark:bg-slate-800/80 border-b border-amber-900/10 dark:border-slate-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#D96B27] text-xs font-bold uppercase tracking-wider mb-2">
                <ShoppingBag className="w-3.5 h-3.5" />
                Danh Mục KitchenCook
              </span>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                Tất Cả Sản Phẩm & Dụng Cụ Bếp
              </h1>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                Bộ sưu tập nồi niêu xoong chảo, dao rèn và phụ kiện làm bếp chất lượng cao ({total} sản phẩm)
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" ref={filterRef}>
        {/* Search + Filter Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 mb-8">
          {/* Search */}
          <div className="relative w-full max-w-lg">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                const val = e.target.value;
                setSearch(val);
                setPage(1);
                const params = new URLSearchParams(searchParams);
                if (val.trim()) params.set('q', val.trim()); else params.delete('q');
                setSearchParams(params);
              }}
              placeholder="Tìm kiếm nồi chảo, dao kéo, phụ kiện làm bếp..."
              className="w-full pl-10 pr-10 py-2.5 text-sm border border-amber-900/15 dark:border-slate-700 rounded-full focus:outline-none focus:border-[#D96B27] focus:ring-2 focus:ring-[#D96B27]/20 bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs"
            />
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  const params = new URLSearchParams(searchParams);
                  params.delete('q');
                  setSearchParams(params);
                }}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="relative">
            <select
              value={sort}
              onChange={(e) => handleSort(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 border border-amber-900/15 dark:border-slate-700 rounded-full bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#D96B27] cursor-pointer shadow-xs"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Filter toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs sm:text-sm font-bold transition-all border cursor-pointer shadow-xs ${
              showFilters
                ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-amber-900/15 dark:border-slate-700 hover:border-slate-400'
            }`}
          >
            <SlidersHorizontal className="w-4 h-4" />
            Bộ lọc
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-xs sm:text-sm text-[#D96B27] hover:underline font-bold cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mb-8"
            >
              <div className="p-6 bg-white dark:bg-slate-800/90 rounded-3xl border border-amber-900/10 dark:border-slate-700/60 shadow-sm space-y-5">
                {/* Loại sản phẩm */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                    Phân loại sản phẩm
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: '', label: 'Tất cả' },
                      { value: 'equipment', label: '🍳 Dụng cụ & Đồ bếp' },
                      { value: 'ingredient', label: '🥬 Gia vị & Nguyên liệu' },
                    ].map((t) => (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => handleProductType(t.value)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all border cursor-pointer ${
                          productType === t.value
                            ? 'bg-[#D96B27] text-white border-[#D96B27] shadow-sm'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 border-amber-900/10 dark:border-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Danh mục */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2.5">
                    Danh mục chuyên sâu
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleCategory('')}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                        !category
                          ? 'bg-[#D96B27] text-white border-[#D96B27]'
                          : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-amber-900/10 dark:border-slate-600 hover:border-slate-400'
                      }`}
                    >
                      Tất cả danh mục
                    </button>
                    {activeCategories.map((c) => (
                      <button
                        key={c.slug}
                        type="button"
                        onClick={() => handleCategory(c.slug)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all border cursor-pointer ${
                          category === c.slug
                            ? 'bg-[#D96B27] text-white border-[#D96B27]'
                            : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border-amber-900/10 dark:border-slate-600 hover:border-slate-400'
                        }`}
                      >
                        {c.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-3xl bg-white dark:bg-slate-800/80 overflow-hidden animate-pulse border border-amber-900/5 dark:border-slate-700">
                <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-700" />
                <div className="p-4 space-y-3">
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800/60 rounded-3xl border border-amber-900/10 dark:border-slate-700">
            <div className="text-6xl mb-4">🍳</div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Không tìm thấy dụng cụ bếp phù hợp
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6 text-sm">
              Thử thay đổi từ khóa hoặc xóa bớt tiêu chí trong bộ lọc
            </p>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={onClearFilters}
                className="px-6 py-2.5 bg-[#D96B27] hover:bg-[#C85A17] text-white rounded-full text-xs font-bold transition-all shadow-md shadow-orange-600/20 cursor-pointer"
              >
                Xóa tất cả bộ lọc
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p, i) => (
              <ProductCard
                key={p.id}
                product={p}
                index={i}
                onAddToCart={handleAddToCart}
              />
            ))}
          </div>
        )}

        {/* Pagination */}
        {!loading && (
          <Pagination
            currentPage={page}
            totalItems={total}
            pageSize={PAGE_SIZE}
            onPageChange={setPage}
          />
        )}

        {/* Lời mời sang Cổng Công Thức CookingBoy */}
        <div className="mt-16">
          <KitchenToRecipeBanner />
        </div>
      </div>
    </div>
  );
}
