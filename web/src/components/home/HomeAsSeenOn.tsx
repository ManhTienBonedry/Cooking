import { Reveal } from '../motion/ScrollReveal';

const SPONSOR_LOGOS = [
  { name: 'BuzzFeed', class: 'font-bold text-2xl tracking-tighter' },
  { name: 'PureWow', class: 'font-serif italic text-2xl' },
  { name: 'BRIT+CO', class: 'font-sans font-black tracking-widest text-xl' },
  { name: 'POPSUGAR.', class: 'font-medium tracking-widest text-xl' },
  { name: 'THE EVERYGIRL', class: 'font-light tracking-[0.2em] text-sm' },
  { name: 'kitchn', class: 'font-medium text-2xl lowercase tracking-tight' },
];

export default function HomeAsSeenOn() {
  return (
    <section className="py-12 bg-white border-t border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="text-center mb-8">
            <h3 className="text-xs font-bold text-amber-600 uppercase tracking-[0.2em]">
              Như đã xuất hiện trên
            </h3>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            {SPONSOR_LOGOS.map((logo, idx) => (
              <div key={idx} className={`text-gray-800 hover:text-black transition-colors ${logo.class}`}>
                {logo.name}
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
