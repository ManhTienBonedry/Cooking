import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { apiJson } from '../../lib/api';

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => Promise<void>;
  defaultDates: { today: string; nextWeek: string };
}

function parsePositiveNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(',', '.');
  const n = Number(cleaned);
  if (!Number.isFinite(n) || n <= 0) return null;
  return n;
}

function parseHeightToCm(raw: string): number | null {
  const value = raw.trim().toLowerCase();
  if (!value) return null;

  const meterMatch = value.match(/^(\d(?:\.\d+)?)\s*m\s*(\d{1,2})?$/i);
  if (meterMatch) {
    const m = Number(meterMatch[1]);
    const cmTail = Number(meterMatch[2] ?? '0');
    if (Number.isFinite(m) && Number.isFinite(cmTail)) {
      return Math.round(m * 100 + cmTail);
    }
  }

  const n = Number(value.replace(/[^0-9.]/g, ''));
  if (!Number.isFinite(n) || n <= 0) return null;
  if (n <= 3) return Math.round(n * 100);
  return Math.round(n);
}

export default function CreatePlanModal({ isOpen, onClose, onSuccess, defaultDates }: CreatePlanModalProps) {
  const [isSubmittingPlan, setIsSubmittingPlan] = useState(false);
  const [planError, setPlanError] = useState<string | null>(null);
  const [isCalorieLoading, setIsCalorieLoading] = useState(false);
  const [calorieNotes, setCalorieNotes] = useState('');

  const [planForm, setPlanForm] = useState(() => ({
    name: '',
    description: '',
    startDate: defaultDates.today,
    endDate: defaultDates.nextWeek,
    dietType: '',
    targetCalories: '',
    age: '',
    heightCm: '',
    weightKg: '',
    gender: 'female',
    activityLevel: 'light',
    goal: 'maintain',
  }));

  if (!isOpen) return null;

  const handleCreatePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setPlanError(null);

    if (!planForm.name.trim()) {
      setPlanError('Vui lòng nhập tên kế hoạch.');
      return;
    }
    if (!planForm.startDate || !planForm.endDate) {
      setPlanError('Vui lòng chọn ngày bắt đầu và kết thúc.');
      return;
    }
    if (planForm.endDate < planForm.startDate) {
      setPlanError('Ngày kết thúc phải sau ngày bắt đầu.');
      return;
    }
    if (!planForm.dietType) {
      setPlanError('Vui lòng chọn chế độ ăn.');
      return;
    }

    const days = Math.max(
      1,
      Math.ceil((new Date(planForm.endDate).getTime() - new Date(planForm.startDate).getTime()) / (24 * 60 * 60 * 1000)) + 1
    );

    setIsSubmittingPlan(true);
    try {
      await apiJson('/api/health/plans', {
        method: 'POST',
        body: JSON.stringify({
          name: planForm.name.trim(),
          description: planForm.description.trim(),
          start_date: planForm.startDate,
          end_date: planForm.endDate,
          diet_type: planForm.dietType,
          target_calories: planForm.targetCalories ? Number(planForm.targetCalories) : 0,
          meal_count: days * 3,
        }),
      });

      setPlanForm({
          name: '',
          description: '',
          startDate: defaultDates.today,
          endDate: defaultDates.nextWeek,
          dietType: '',
          targetCalories: '',
          age: '',
          heightCm: '',
          weightKg: '',
          gender: 'female',
          activityLevel: 'light',
          goal: 'maintain',
      });
      await onSuccess();
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : 'Không thể tạo kế hoạch.');
    } finally {
      setIsSubmittingPlan(false);
    }
  };

  const handleSuggestCalories = async () => {
    setPlanError(null);
    setCalorieNotes('');

    const age = parsePositiveNumber(planForm.age);
    const heightCm = parseHeightToCm(planForm.heightCm);
    const weightKg = parsePositiveNumber(planForm.weightKg);
    if (!age || !heightCm || !weightKg) {
      setPlanError('Vui lòng nhập đủ tuổi, chiều cao và cân nặng hợp lệ (ví dụ chiều cao: 168 hoặc 1m68).');
      return;
    }

    setIsCalorieLoading(true);
    try {
      const result = await apiJson<{
        success: boolean;
        data?: {
          target_calories?: number;
          notes?: string;
          source?: string;
        };
      }>('/api/health/ai/calorie-target', {
        method: 'POST',
        body: JSON.stringify({
          age,
          height_cm: heightCm,
          weight_kg: weightKg,
          gender: planForm.gender,
          activity_level: planForm.activityLevel,
          goal: planForm.goal,
          diet_type: planForm.dietType,
        }),
      });

      const suggested = Number(result.data?.target_calories ?? 0);
      if (suggested > 0) {
        setPlanForm((prev) => ({ ...prev, targetCalories: String(suggested) }));
        const sourceLabel = result.data?.source === 'gemini' ? 'Gemini' : 'Fallback';
        setCalorieNotes(`${result.data?.notes ?? 'Đã tính xong.'} (${sourceLabel})`);
      } else {
        setPlanError('Không nhận được gợi ý calo hợp lệ.');
      }
    } catch (err) {
      setPlanError(err instanceof Error ? err.message : 'Không thể gợi ý calo.');
    } finally {
      setIsCalorieLoading(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-2xl w-full max-w-xl max-h-[85vh] overflow-hidden flex flex-col my-4 shadow-2xl">
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-black">Tạo kế hoạch mới</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-black transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <div className="overflow-y-auto flex-1 p-6">
          <form className="space-y-4" onSubmit={handleCreatePlan}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tên kế hoạch</label>
              <input type="text" value={planForm.name} onChange={(e) => setPlanForm((prev) => ({ ...prev, name: e.target.value }))} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all" placeholder="Ví dụ: Kế hoạch tuần này" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
              <textarea value={planForm.description} onChange={(e) => setPlanForm((prev) => ({ ...prev, description: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all" rows={3} placeholder="Mô tả về kế hoạch của bạn"></textarea>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày bắt đầu</label>
                <input type="date" value={planForm.startDate} onChange={(e) => setPlanForm((prev) => ({ ...prev, startDate: e.target.value }))} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày kết thúc</label>
                <input type="date" value={planForm.endDate} onChange={(e) => setPlanForm((prev) => ({ ...prev, endDate: e.target.value }))} required className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Chế độ ăn</label>
              <select value={planForm.dietType} onChange={(e) => setPlanForm((prev) => ({ ...prev, dietType: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all" required>
                <option value="">-- Chọn chế độ ăn --</option>
                <option value="Cân bằng">Cân bằng</option>
                <option value="Giảm cân">Giảm cân</option>
                <option value="Tăng cân">Tăng cân</option>
                <option value="Chay">Chay</option>
                <option value="Keto">Keto</option>
                <option value="Low-carb">Low-carb</option>
                <option value="High-protein">High-protein</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mục tiêu Calo (kcal/ngày)</label>
              <input type="number" min={1000} max={6000} value={planForm.targetCalories} onChange={(e) => setPlanForm((prev) => ({ ...prev, targetCalories: e.target.value }))} className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all" placeholder="Ví dụ: 2000" />
              <p className="text-xs text-gray-500 mt-1">Lượng calo tối thiểu khuyến nghị là 1000 kcal để đảm bảo sức khỏe.</p>
            </div>

            <div className="rounded-xl border border-gray-200 p-4 bg-gray-50">
              <h4 className="font-semibold text-sm text-black mb-3">Gợi ý calo bằng Gemini AI</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input type="number" min={10} value={planForm.age} onChange={(e) => setPlanForm((prev) => ({ ...prev, age: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Tuổi" />
                <select value={planForm.gender} onChange={(e) => setPlanForm((prev) => ({ ...prev, gender: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="female">Nữ</option>
                  <option value="male">Nam</option>
                </select>
                <input type="text" value={planForm.heightCm} onChange={(e) => setPlanForm((prev) => ({ ...prev, heightCm: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Chiều cao (168 hoặc 1m68)" />
                <input type="number" min={20} value={planForm.weightKg} onChange={(e) => setPlanForm((prev) => ({ ...prev, weightKg: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Cân nặng (kg)" />
                <select value={planForm.activityLevel} onChange={(e) => setPlanForm((prev) => ({ ...prev, activityLevel: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="sedentary">Ít vận động</option>
                  <option value="light">Vận động nhẹ</option>
                  <option value="moderate">Vận động vừa</option>
                  <option value="active">Vận động nhiều</option>
                  <option value="very_active">Rất vận động</option>
                </select>
                <select value={planForm.goal} onChange={(e) => setPlanForm((prev) => ({ ...prev, goal: e.target.value }))} className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                  <option value="lose">Giảm cân</option>
                  <option value="maintain">Giữ cân</option>
                  <option value="gain">Tăng cân</option>
                </select>
              </div>
              <button type="button" onClick={handleSuggestCalories} disabled={isCalorieLoading} className="mt-3 px-4 py-2 rounded-full border border-black text-black hover:bg-black hover:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed">{isCalorieLoading ? 'Đang tính...' : 'Gợi ý calo bằng AI'}</button>
              {calorieNotes && <p className="text-xs text-gray-600 mt-2">{calorieNotes}</p>}
            </div>

            {planError && <p className="text-sm text-red-600">{planError}</p>}
            <div className="pt-4">
              <div className="flex justify-end space-x-3">
                <button type="button" onClick={onClose} className="px-6 py-3 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors">Hủy</button>
                <button type="submit" disabled={isSubmittingPlan} className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-60 disabled:cursor-not-allowed">{isSubmittingPlan ? 'Đang tạo...' : 'Tạo kế hoạch'}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>,
    document.body
  );
}
