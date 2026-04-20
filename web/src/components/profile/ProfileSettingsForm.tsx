import { useState } from 'react';
import { Skeleton } from '../ui/Skeleton';
import type { ProfileUser } from './types';
import { apiFetch } from '../../lib/api';

interface ProfileSettingsFormProps {
  isLoading: boolean;
  user: ProfileUser | null;
  onSuccessSubmit: () => void;
}

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
    <div className="space-y-12 pb-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Thông tin cơ bản</h2>
        {isLoading ? (
          <div className="space-y-6 max-w-lg">
            <div><Skeleton className="h-5 w-24 mb-2"/><Skeleton className="h-10 w-full rounded-lg"/></div>
            <div><Skeleton className="h-5 w-24 mb-2"/><Skeleton className="h-10 w-full rounded-lg"/></div>
            <div><Skeleton className="h-5 w-24 mb-2"/><Skeleton className="h-24 w-full rounded-lg"/></div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        ) : (
          <form className="space-y-6 max-w-lg" onSubmit={handleProfileSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
              <input name="full_name" type="text" defaultValue={user?.full_name} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all font-medium" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input type="email" defaultValue={user?.email} disabled className="w-full px-4 py-2 border border-gray-200 bg-gray-50 rounded-lg text-gray-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiểu sử</label>
              <textarea name="bio" defaultValue={user?.bio} rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all font-medium"></textarea>
            </div>
            {profileMsg && (
              <div className={`p-3 rounded-md text-sm ${profileMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {profileMsg.text}
              </div>
            )}
            <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">Lưu thông tin</button>
          </form>
        )}
      </div>

      <div className="pt-8 border-t border-gray-200">
        <h2 className="text-2xl font-bold mb-6">Đổi mật khẩu</h2>
        {isLoading ? (
          <div className="space-y-6 max-w-lg">
            <div><Skeleton className="h-5 w-24 mb-2"/><Skeleton className="h-10 w-full rounded-lg"/></div>
            <div><Skeleton className="h-5 w-24 mb-2"/><Skeleton className="h-10 w-full rounded-lg"/></div>
            <div><Skeleton className="h-5 w-24 mb-2"/><Skeleton className="h-10 w-full rounded-lg"/></div>
            <Skeleton className="h-10 w-32 rounded-lg" />
          </div>
        ) : (
          <form className="space-y-6 max-w-lg" onSubmit={handlePasswordSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu hiện tại</label>
              <input name="current_password" type="password" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu mới</label>
              <input name="new_password" type="password" required minLength={8} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Xác nhận mật khẩu mới</label>
              <input name="confirm_password" type="password" required minLength={8} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all" />
            </div>
            {passMsg && (
              <div className={`p-3 rounded-md text-sm ${passMsg.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {passMsg.text}
              </div>
            )}
            <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors">Đổi mật khẩu</button>
          </form>
        )}
      </div>
    </div>
  );
}
