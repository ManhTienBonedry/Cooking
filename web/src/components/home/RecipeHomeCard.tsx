import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock, ChefHat, Star, ArrowRight } from 'lucide-react';
import type { FeaturedRecipe } from './types';

export default function RecipeHomeCard({ recipe }: { recipe: FeaturedRecipe }) {
  const [imageFailed, setImageFailed] = useState(false);
  const hasImage = Boolean(recipe.image_url && !imageFailed);

  return (
    <div className="group overflow-hidden border-b border-gray-200/80 bg-white/95 pb-6 transition-all duration-300 sm:rounded-lg sm:border sm:pb-0 sm:shadow-sm hover:-translate-y-1 hover:border-gray-300 hover:shadow-md dark:border-slate-700/80 dark:bg-slate-900/85 dark:hover:border-slate-600 dark:hover:shadow-none flex flex-col h-full">
      <div className="relative overflow-hidden">
        {hasImage ? (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="flex h-64 w-full flex-col items-center justify-center gap-3 bg-gray-100 text-gray-400 dark:bg-slate-800 dark:text-slate-500">
            <ChefHat className="h-16 w-16" />
            <span className="text-xs font-bold uppercase tracking-widest">Ảnh món ăn</span>
          </div>
        )}

        <div className="absolute left-4 top-4 flex max-w-[calc(100%-5rem)] flex-wrap gap-2">
          {recipe.is_featured && (
            <span className="rounded-full bg-rose-500 px-3 py-1 text-sm font-bold text-white shadow-lg">
              <Star className="mr-1 inline h-3 w-3 fill-current" />
              Nổi bật
            </span>
          )}
          <span className="rounded-full bg-black/75 px-3 py-1 text-sm font-semibold text-white backdrop-blur dark:bg-white/15">
            {recipe.category_name || 'Món chính'}
          </span>
        </div>

        <div className="absolute right-4 top-4">
          <span className="bg-white/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-black shadow-sm dark:bg-slate-950/90 dark:text-white">
            {recipe.difficulty || 'Trung bình'}
          </span>
        </div>
      </div>

      <div className="pt-6 sm:p-5 flex-1 flex flex-col">
        <h3 className="mb-3 line-clamp-2 text-xl font-bold font-serif text-black transition-colors duration-300 group-hover:text-gray-600 dark:text-white dark:group-hover:text-slate-200 min-h-[3.5rem]">
          {recipe.title}
        </h3>
        <div className="mb-4 flex items-center justify-between text-sm text-gray-600 dark:text-slate-400">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.cooking_time != null ? `${recipe.cooking_time} phút` : '-'}</span>
          </div>
        </div>
        <Link
          to={`/recipes/detail/${recipe.id}`}
          className="inline-flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-black transition-colors duration-300 hover:text-gray-500 group/link dark:text-white dark:hover:text-slate-300 mt-auto"
        >
          <span>ĐỌC TIẾP</span>
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
        </Link>
      </div>
    </div>
  );
}
