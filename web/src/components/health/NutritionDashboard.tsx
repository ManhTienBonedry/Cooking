import { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { apiJson } from '../../lib/api';
import { Activity } from 'lucide-react';

interface NutritionStat {
  date: string;
  target_calories: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function NutritionDashboard() {
  const [stats, setStats] = useState<NutritionStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await apiJson<{ success: boolean; stats: NutritionStat[] }>('/api/health/dashboard');
        if (!cancelled && res.success) {
          setStats(res.stats || []);
        }
      } catch (e) {
        console.error(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-4 border-gray-200 border-t-amber-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (stats.length === 0) {
    return (
      <div className="text-center py-12">
        <Activity className="w-16 h-16 mx-auto mb-4 text-gray-300 dark:text-slate-600" />
        <h3 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Chưa có dữ liệu dinh dưỡng</h3>
        <p className="text-gray-500 dark:text-gray-400">Hãy thêm món ăn vào Kế hoạch của bạn để xem thống kê nhé.</p>
      </div>
    );
  }

  // Calculate averages for the pie chart based on all days
  const totalMacros = stats.reduce(
    (acc, s) => {
      acc.protein += Number(s.protein);
      acc.carbs += Number(s.carbs);
      acc.fat += Number(s.fat);
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  const pieData = [
    { name: 'Protein', value: totalMacros.protein, color: '#f59e0b' },
    { name: 'Carbs', value: totalMacros.carbs, color: '#10b981' },
    { name: 'Fat', value: totalMacros.fat, color: '#ef4444' },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Line Chart */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Theo dõi Calo (14 ngày qua)</h3>
        <div className="h-80 w-full text-sm">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:opacity-20" />
              <XAxis dataKey="date" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                labelStyle={{ fontWeight: 'bold', color: '#111827' }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line 
                type="monotone" 
                name="Calo nạp vào"
                dataKey="calories" 
                stroke="#f59e0b" 
                strokeWidth={3}
                activeDot={{ r: 8 }} 
              />
              <Line 
                type="monotone" 
                name="Mục tiêu"
                dataKey="target_calories" 
                stroke="#64748b" 
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart & Macro Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Tỉ lệ Đa lượng chất (Macro)</h3>
          {pieData.length > 0 ? (
            <div className="h-64 w-full text-sm">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${Math.round(Number(value ?? 0))}g`, 'Khối lượng']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
             <div className="h-64 flex items-center justify-center text-gray-500">
               Không đủ dữ liệu
             </div>
          )}
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-6 rounded-2xl shadow-sm text-white flex flex-col justify-center">
          <h3 className="text-2xl font-bold mb-2">Trung bình mỗi ngày</h3>
          <p className="text-amber-100 mb-8">Dựa trên dữ liệu các ngày đã chọn</p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-amber-100 text-sm font-medium mb-1">Protein</div>
              <div className="text-3xl font-bold">{stats.length ? Math.round(totalMacros.protein / stats.length) : 0}g</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-amber-100 text-sm font-medium mb-1">Carbs</div>
              <div className="text-3xl font-bold">{stats.length ? Math.round(totalMacros.carbs / stats.length) : 0}g</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-amber-100 text-sm font-medium mb-1">Chất béo (Fat)</div>
              <div className="text-3xl font-bold">{stats.length ? Math.round(totalMacros.fat / stats.length) : 0}g</div>
            </div>
            <div className="bg-white/20 rounded-xl p-4 backdrop-blur-sm">
              <div className="text-amber-50 text-sm font-medium mb-1">Tổng Calo</div>
              <div className="text-3xl font-bold">
                {stats.length ? Math.round(stats.reduce((acc, s) => acc + Number(s.calories), 0) / stats.length) : 0}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
