import HomeEditorialHeader from '../components/home/HomeEditorialHeader';
import FeaturedRecipes from '../components/home/FeaturedRecipes';
import HomeCategories from '../components/home/HomeCategories';
import { RecipeToKitchenBanner } from '../components/common/CrossPromotionBanners';
import HomeCallToAction from '../components/home/HomeCallToAction';

declare global {
  interface Window {
    VanillaTilt?: { init: (elements: Element[]) => void };
  }
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-br from-blue-50 to-indigo-50 transition-colors duration-300 dark:from-slate-900 dark:to-slate-800">
      <HomeEditorialHeader />
      <FeaturedRecipes />
      <HomeCategories />
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <RecipeToKitchenBanner />
      </section>
      <HomeCallToAction />
    </div>
  );
}
