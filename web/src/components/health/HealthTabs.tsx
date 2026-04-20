interface HealthTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function HealthTabs({ activeTab, setActiveTab }: HealthTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="flex flex-wrap">
        <button 
          onClick={() => setActiveTab('plans')}
          className={`px-6 py-4 text-sm font-medium ${activeTab === 'plans' ? 'text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
        >
          Kế hoạch của tôi
        </button>
        <button 
          onClick={() => setActiveTab('shopping')}
          className={`px-6 py-4 text-sm font-medium ${activeTab === 'shopping' ? 'text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
        >
          Danh sách mua sắm
        </button>
        <button 
          onClick={() => setActiveTab('nutrition')}
          className={`px-6 py-4 text-sm font-medium ${activeTab === 'nutrition' ? 'text-black border-b-2 border-black' : 'text-gray-600 hover:text-black'}`}
        >
          Dinh dưỡng
        </button>
      </nav>
    </div>
  );
}
