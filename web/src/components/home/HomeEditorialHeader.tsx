import { Link } from 'react-router-dom';
import { Reveal, RevealStaggerItem } from '../motion/ScrollReveal';
import ImageWithFallback from '../../lib/ImageWithFallback';


const FEATURED_TALL_CATEGORIES = [
  { name: 'Bữa Tối', image: '/assets/images/monchinh.jpg' },
  { name: 'Nhanh & Gọn', image: '/assets/images/monkhaivi.jpg' },
  { name: 'Món Salad', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=2070&auto=format&fit=crop' },
  { name: 'Eat Clean', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=2053&auto=format&fit=crop' },
];

const CIRCLE_CATEGORIES = [
  { name: 'Nhanh & Gọn', image: '/assets/images/monkhaivi.jpg' },
  { name: 'Bữa Tối', image: '/assets/images/monchinh.jpg' },
  { name: 'Món Chay', image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1968&auto=format&fit=crop' },
  { name: 'Eat Clean', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=2053&auto=format&fit=crop' },
  { name: 'Nồi Áp Suất', image: '/assets/images/vietnam1.jpg' },
  { name: 'Thuần Chay', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=2070&auto=format&fit=crop' },
  { name: 'Thực đơn bận rộn', image: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=2070&auto=format&fit=crop' },
  { name: 'Súp & Canh', image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=2071&auto=format&fit=crop' },
  { name: 'Món Salad', image: 'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=1990&auto=format&fit=crop' },
];

export default function HomeEditorialHeader() {
  return (
    <section className="pt-12 sm:pt-24 pb-6 sm:pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Typographic Top */}
        <Reveal className="text-center py-8 sm:py-20 mb-6 sm:mb-12 border-b border-gray-100 dark:border-slate-800 flex flex-col items-center justify-center">
          {/* Dòng này đã được tăng size lên text-base và md:text-xl */}
          <span className="block max-w-[22rem] sm:max-w-[36rem] mx-auto text-[11px] sm:text-base md:text-xl font-bold text-gray-400 uppercase tracking-[0.12em] sm:tracking-[0.3em] mb-3 sm:mb-6 leading-relaxed break-words">
            Công thức nấu ăn đơn giản dành cho
          </span>

          <h1 className="max-w-[24rem] sm:max-w-[42rem] mx-auto font-serif italic text-2xl sm:text-5xl md:text-7xl text-gray-900 dark:text-white leading-snug sm:leading-[1.1] tracking-tight break-words">
            cuộc sống đời thực mỗi ngày.
          </h1>
        </Reveal>

        {/* 4 Tall Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-16">
          {FEATURED_TALL_CATEGORIES.map((cat, idx) => (
            <RevealStaggerItem key={idx} index={idx} stagger={0.08} y={20}>
              <Link to={`/recipes?category=${encodeURIComponent(cat.name)}`} className="group block relative w-full h-[18rem] sm:h-[28rem] md:h-[28rem] lg:h-[24rem] xl:h-[28rem] rounded-sm mb-4 sm:mb-8 md:mb-0">
                <div className="w-full h-full overflow-hidden rounded-sm">
                  <ImageWithFallback
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="eager"
                  />
                </div>
                <div className="absolute inset-x-0 bottom-0 flex justify-center translate-y-1/2 z-10 px-4">
                  <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur font-serif text-xs sm:text-sm tracking-widest font-bold uppercase py-2.5 sm:py-3 px-4 sm:px-6 shadow-md text-black dark:text-white border border-gray-200 dark:border-slate-800 min-w-[75%] sm:min-w-[70%] max-w-full text-center group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors break-words">
                    {cat.name}
                  </div>
                </div>
              </Link>
            </RevealStaggerItem>
          ))}
        </div>

        {/* Circle Categories */}
        <div className="pt-4 sm:pt-8 overflow-x-auto pb-2 sm:pb-4 hide-scrollbar">
          <div className="flex items-start md:justify-center space-x-4 sm:space-x-6 md:space-x-8 px-2 min-w-max">
            {CIRCLE_CATEGORIES.map((cat, idx) => (
              <RevealStaggerItem key={idx} index={idx} stagger={0.05} y={15} className="flex flex-col items-center group w-20 sm:w-24">
                <Link to={`/recipes?category=${encodeURIComponent(cat.name)}`} className="flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-transparent group-hover:border-black dark:group-hover:border-white transition-colors duration-300 p-1 mb-3">
                    <ImageWithFallback src={cat.image} alt={cat.name} className="w-full h-full object-cover rounded-full group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <span className="text-[11px] sm:text-xs font-bold uppercase text-center text-gray-800 dark:text-gray-300 tracking-wider h-9 sm:h-10 group-hover:text-black dark:group-hover:text-white">
                    {cat.name}
                  </span>
                </Link>
              </RevealStaggerItem>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
