import { Camera, User } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { HeroEnter } from '../motion/ScrollReveal';
import type { ProfileUser, ProfileStats } from './types';

interface ProfileHeaderProps {
  isLoading: boolean;
  user: ProfileUser | null;
  stats: ProfileStats | null;
}

function formatStatNumber(n: number): string {
  if (!Number.isFinite(n) || n < 0) return '0';
  if (n >= 1_000_000) return `${Math.round(n / 100_000) / 10}M`.replace(/\.0M$/, 'M');
  if (n >= 1000) return `${Math.round(n / 100) / 10}k`.replace(/\.0k$/, 'k');
  return String(Math.round(n));
}

export default function ProfileHeader({ isLoading, user, stats }: ProfileHeaderProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm pt-24 pb-12 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-yellow-400 to-yellow-600 opacity-20"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {!isLoading && user ? (
          <HeroEnter>
            <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.full_name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 p-2 bg-black text-white rounded-full cursor-pointer hover:bg-gray-800 transition-colors shadow-lg shadow-black/20 group-hover:scale-110">
                  <Camera className="w-4 h-4" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>

              <div className="flex-1 pb-2">
                <h1 className="text-3xl font-bold text-gray-900 mb-1">{user.full_name}</h1>
                <p className="text-gray-500 mb-2">{user.email}</p>
                <p className="text-gray-600 max-w-lg">{user.bio}</p>
              </div>

              <div className="flex gap-4 pb-2">
                <div className="text-center px-4">
                  <div className="text-2xl font-bold text-black">{formatStatNumber(stats?.recipe_count ?? 0)}</div>
                  <div className="text-sm text-gray-500 font-medium">Công thức</div>
                </div>
                <div className="text-center px-4 border-l border-r border-gray-200">
                  <div className="text-2xl font-bold text-black">{formatStatNumber(stats?.post_count ?? 0)}</div>
                  <div className="text-sm text-gray-500 font-medium">Bài viết</div>
                </div>
                <div className="text-center px-4">
                  <div className="text-2xl font-bold text-black">{formatStatNumber(stats?.recipe_views_sum ?? 0)}</div>
                  <div className="text-sm text-gray-500 font-medium">Lượt xem CT</div>
                </div>
              </div>
            </div>
          </HeroEnter>
        ) : (
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
            <div className="relative group">
              <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white">
                <Skeleton className="w-full h-full rounded-full" />
              </div>
            </div>
            <div className="flex-1 pb-2 w-full">
              <Skeleton className="h-8 w-48 mx-auto md:mx-0 mb-2" />
              <Skeleton className="h-5 w-32 mx-auto md:mx-0 mb-3" />
              <Skeleton className="h-5 w-64 mx-auto md:mx-0" />
            </div>
            <div className="flex gap-4 pb-2">
              <div className="px-4"><Skeleton className="h-8 w-12 mb-1 mx-auto" /><Skeleton className="h-4 w-16 mx-auto" /></div>
              <div className="px-4 border-l border-r border-gray-200"><Skeleton className="h-8 w-12 mb-1 mx-auto" /><Skeleton className="h-4 w-16 mx-auto" /></div>
              <div className="px-4"><Skeleton className="h-8 w-12 mb-1 mx-auto" /><Skeleton className="h-4 w-16 mx-auto" /></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
