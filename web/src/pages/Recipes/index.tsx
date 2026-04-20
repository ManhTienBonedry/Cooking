import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import AuthModal from '../../components/AuthModal';
import { apiJson } from '../../lib/api';
import { Reveal } from '../../components/motion/ScrollReveal';

import RecipeFilterBar from '../../components/recipes/RecipeFilterBar';
import RecipeList from '../../components/recipes/RecipeList';
import CreateRecipeModal from '../../components/recipes/CreateRecipeModal';
import type { RecipeListRow, RecipeCategory } from '../../components/recipes/types';

const LEGACY_RECIPE_CATEGORIES = ['Món chính', 'Món khai vị', 'Tráng miệng', 'Đồ uống'];

export default function Recipes() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const [categoryOptions, setCategoryOptions] = useState<RecipeCategory[]>([]);
  const [categories, setCategories] = useState<string[]>(['Tất cả']);
  
  const [recipes, setRecipes] = useState<RecipeListRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load Categories
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await apiJson<{ categories: RecipeCategory[] }>('/api/recipes/categories');
        const options = data.categories ?? [];
        const names = options.length ? options.map((c) => c.name) : LEGACY_RECIPE_CATEGORIES;
        if (!cancelled) {
          setCategoryOptions(options);
          setCategories(['Tất cả', ...names]);
        }
      } catch {
        if (!cancelled) {
          setCategoryOptions([]);
          setCategories((c) => (c.length ? c : ['Tất cả']));
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Fetch Recipes
  const fetchRecipes = useCallback(async (hideLoading = false) => {
    if (!hideLoading) setIsLoading(true);
    try {
      const q = new URLSearchParams();
      if (searchQuery.trim()) q.set('q', searchQuery.trim());
      if (selectedCategory && selectedCategory !== 'Tất cả') q.set('category', selectedCategory);
      q.set('limit', '24');
      q.set('offset', '0');
      const data = await apiJson<{ recipes: RecipeListRow[] }>(`/api/recipes/search?${q.toString()}`);
      setRecipes(data.recipes ?? []);
    } catch {
      setRecipes([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, selectedCategory]);

  useEffect(() => {
    const t = window.setTimeout(() => fetchRecipes(), 350);
    return () => clearTimeout(t);
  }, [fetchRecipes]);

  // Auth & Modal handling
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '8px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isModalOpen]);

  const openCreateModal = async () => {
    try {
      const me = await apiJson<{ authenticated?: boolean }>('/api/auth/me');
      if (!me.authenticated) {
        setIsAuthOpen(true);
        return;
      }
      setIsModalOpen(true);
    } catch {
      setIsAuthOpen(true);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white/60 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Reveal y={16}>
            <h1 className="text-4xl font-bold text-black mb-4">Công Thức Nấu Ăn</h1>
            <p className="text-gray-600 text-lg">
              Khám phá <strong className="text-black">{recipes.length}</strong> công thức nấu ăn đa dạng
            </p>
          </Reveal>
        </div>
      </div>

      <RecipeFilterBar 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <button onClick={openCreateModal} className="bg-yellow-400 text-black px-6 py-3 rounded-full font-semibold hover:bg-yellow-300 transition-all duration-300 inline-flex items-center space-x-2">
            <Plus className="h-5 w-5" />
            <span>Đăng công thức</span>
          </button>
        </div>

        <RecipeList 
          isLoading={isLoading} 
          recipes={recipes} 
          onClearFilters={() => {
            setSearchQuery('');
            setSelectedCategory('Tất cả');
          }} 
        />
      </div>

      <CreateRecipeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryOptions={categoryOptions}
        onSuccess={() => {
          setIsModalOpen(false);
          void fetchRecipes(true);
        }}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={() => {
          setIsAuthOpen(false);
          setIsModalOpen(true);
        }}
      />
    </main>
  );
}
