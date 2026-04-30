import { useState } from 'react';
import { Skeleton } from '../ui/Skeleton';
import type { ProfileUser } from './types';
import { apiFetch } from '../../lib/api';

interface ProfileSettingsFormProps {
  isLoading: boolean;
  user: ProfileUser | null;
  onSuccessSubmit: () => void;
}

const inputClass =
  'w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-900 transition-all placeholder:text-gray-400 focus:border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400/20 dark:border-slate-600 dark:bg-slate-950/40 dark:text-white dark:placeholder:text-slate-500';
const labelClass = 'mb-2 block text-sm font-semibold text-gray-700 dark:text-slate-200';

export default function ProfileSettingsForm({ isLoading, user, onSuccessSubmit }: ProfileSettingsFormProps) {
  const [profileMsg, setProfileMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);
  const [passMsg, setPassMsg] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setProfileMsg(null);
    const fd = new FormData(e.currentTarget);
    const full_name = fd.get('full_name') as string;
    const bio = fd.get('bio') as string;

    try {
      await apiFetch('/api/auth/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name, bio }),
      });
      setProfileMsg({ text: 'Cập nhật hồ sơ thành công!', type: 'success' });
      onSuccessSubmit();
    } catch (err: unknown) {
      setProfileMsg({ text: err instanceof Error ? err.message : 'Lỗi cập nhật hồ sơ', type: 'error' });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPassMsg(null);
    const form = e.currentTarget;
    const fd = new FormData(form);
    const current_password = fd.get('current_password') as string;
    const new_password = fd.get('new_password') as string;
    const confirm_password = fd.get('confirm_password') as string;

    if (new_password !== confirm_password) {
      setPassMsg({ text: 'Mật khẩu xác nhận không khớp.', type: 'error' });
      return;
    }

    try {
      await apiFetch('/api/auth/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ current_password, new_password }),
      });
      setPassMsg({ text: 'Đổi mật khẩu thành công!', type: 'success' });
      form.reset();
    } catch (err: unknown) {
      setPassMsg({ text: err instanceof Error ? err.message : 'Lỗi đổi mật khẩu', type: 'error' });
    }
  };

  return (
    <div className="space-y-12 pb-8 text-gray-900 dark:text-slate-100">
      <div>
        <h2 className="mb-6 text-2xl font-bold text-gray-950 dark:text-white">Thông tin cơ bản</h2>
        {isLoading ? (
          <div className="max-w-lg space-y-6">
            <div><Skeleton className="mb-2 h-5 w-24" /><Skeleton className="h-10 w-full rounded-lg" /></div>
            <div><Skeleton className="mb-2 h-5 w-24" /><Skeleton className="h-10 w-full rounded-lg" /></div>
            <div><Skeleton className="mb-2 h-5 w-24" /><Skeleton className="h-24 w-full rounded-lg" /></div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        ) : (
          <form className="max-w-lg space-y-6" onSubmit={handleProfileSubmit}>
            <div>
              <label className={labelClass}>Họ và tên</label>
              <input name="full_name" type="text" defaultValue={user?.full_name} required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input
                type="email"
                defaultValue={user?.email}
                disabled
                className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-gray-600 disabled:cursor-not-allowed dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              />
            </div>
            <div>
              <label className={labelClass}>Tiểu sử</label>
              <textarea name="bio" defaultValue={user?.bio} rows={4} className={inputClass} />
            </div>
            {profileMsg && (
              <div className={`rounded-md border p-3 text-sm ${profileMsg.type === 'success' ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300' : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300'}`}>
                {profileMsg.text}
              </div>
            )}
            <button type="submit" className="rounded-lg bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              Lưu thông tin
            </button>
          </form>
        )}
      </div>

      <div className="border-t border-gray-200 pt-8 dark:border-slate-700">
        <h2 className="mb-6 text-2xl font-bold text-gray-950 dark:text-white">Đổi mật khẩu</h2>
        {isLoading ? (
          <div className="max-w-lg space-y-6">
            <div><Skeleton className="mb-2 h-5 w-24" /><Skeleton className="h-10 w-full rounded-lg" /></div>
            <div><Skeleton className="mb-2 h-5 w-24" /><Skeleton className="h-10 w-full rounded-lg" /></div>
            <div><Skeleton className="mb-2 h-5 w-24" /><Skeleton className="h-10 w-full rounded-lg" /></div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        ) : (
          <form className="max-w-lg space-y-6" onSubmit={handlePasswordSubmit}>
            <div>
              <label className={labelClass}>Mật khẩu hiện tại</label>
              <input name="current_password" type="password" required className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Mật khẩu mới</label>
              <input name="new_password" type="password" required minLength={8} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Xác nhận mật khẩu mới</label>
              <input name="confirm_password" type="password" required minLength={8} className={inputClass} />
            </div>
            {passMsg && (
              <div className={`rounded-md border p-3 text-sm ${passMsg.type === 'success' ? 'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-300' : 'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300'}`}>
                {passMsg.text}
              </div>
            )}
            <button type="submit" className="rounded-lg bg-black px-6 py-2 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200">
              Đổi mật khẩu
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
