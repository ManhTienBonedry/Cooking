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
    <div className="relative overflow-hidden border-b border-gray-200 bg-white pb-12 pt-24 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="absolute left-0 top-0 h-32 w-full bg-yellow-200/70 dark:bg-slate-800" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {!isLoading && user ? (
          <HeroEnter>
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:text-left">
              <div className="group relative">
                <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl dark:border-slate-900 dark:bg-slate-800">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.full_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-700 dark:to-slate-800">
                      <User className="h-16 w-16 text-gray-400 dark:text-slate-400" />
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 cursor-pointer rounded-full bg-black p-2 text-white shadow-lg shadow-black/20 transition-colors hover:bg-gray-800 group-hover:scale-110 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
                  <Camera className="h-4 w-4" />
                  <input type="file" className="hidden" accept="image/*" />
                </label>
              </div>

              <div className="flex-1 pb-2">
                <h1 className="mb-1 text-3xl font-bold font-serif text-gray-900 dark:text-white">{user.full_name}</h1>
                <p className="mb-2 text-gray-600 dark:text-slate-300">{user.email}</p>
                <p className="max-w-lg text-gray-700 dark:text-slate-300">{user.bio}</p>
              </div>

              <div className="flex gap-4 pb-2">
                <div className="px-4 text-center">
                  <div className="text-2xl font-bold text-black dark:text-white">{formatStatNumber(stats?.recipe_count ?? 0)}</div>
                  <div className="text-sm font-medium text-gray-600 dark:text-slate-300">Công thức</div>
                </div>
                <div className="border-l border-r border-gray-300 px-4 text-center dark:border-slate-700">
                  <div className="text-2xl font-bold text-black dark:text-white">{formatStatNumber(stats?.post_count ?? 0)}</div>
                  <div className="text-sm font-medium text-gray-600 dark:text-slate-300">Bài viết</div>
                </div>
                <div className="px-4 text-center">
                  <div className="text-2xl font-bold text-black dark:text-white">{formatStatNumber(stats?.recipe_views_sum ?? 0)}</div>
                  <div className="text-sm font-medium text-gray-600 dark:text-slate-300">Lượt xem CT</div>
                </div>
              </div>
            </div>
          </HeroEnter>
        ) : (
          <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:text-left">
            <div className="group relative">
              <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-white bg-white shadow-xl dark:border-slate-900 dark:bg-slate-800">
                <Skeleton className="h-full w-full rounded-full" />
              </div>
            </div>
            <div className="w-full flex-1 pb-2">
              <Skeleton className="mx-auto mb-2 h-8 w-48 md:mx-0" />
              <Skeleton className="mx-auto mb-3 h-5 w-32 md:mx-0" />
              <Skeleton className="mx-auto h-5 w-64 md:mx-0" />
            </div>
            <div className="flex gap-4 pb-2">
              <div className="px-4">
                <Skeleton className="mx-auto mb-1 h-8 w-12" />
                <Skeleton className="mx-auto h-4 w-16" />
              </div>
              <div className="border-l border-r border-gray-300 px-4 dark:border-slate-700">
                <Skeleton className="mx-auto mb-1 h-8 w-12" />
                <Skeleton className="mx-auto h-4 w-16" />
              </div>
              <div className="px-4">
                <Skeleton className="mx-auto mb-1 h-8 w-12" />
                <Skeleton className="mx-auto h-4 w-16" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
