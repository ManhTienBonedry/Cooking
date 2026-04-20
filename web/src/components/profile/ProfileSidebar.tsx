import { LogOut } from 'lucide-react';
import type { ElementType } from 'react';

interface TabConfig {
  id: string;
  label: string;
  icon: ElementType;
}

interface ProfileSidebarProps {
  tabs: TabConfig[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export default function ProfileSidebar({ tabs, activeTab, setActiveTab, onLogout }: ProfileSidebarProps) {
  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-sm border border-white/20 p-2 lg:sticky lg:top-20 lg:max-h-[calc(100vh-5.5rem)] lg:overflow-y-auto">
      <nav className="space-y-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                activeTab === tab.id 
                ? 'bg-black text-white shadow-md' 
                : 'text-gray-600 hover:bg-white hover:text-black hover:shadow-sm'
              }`}
            >
              <Icon className="w-5 h-5" />
              {tab.label}
            </button>
          );
        })}
        <hr className="my-2 border-gray-100" />
        <button
          type="button"
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </nav>
    </div>
  );
}
