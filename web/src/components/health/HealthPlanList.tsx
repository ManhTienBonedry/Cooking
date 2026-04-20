import { Link } from 'react-router-dom';
import { Calendar } from 'lucide-react';
import { Skeleton } from '../ui/Skeleton';
import { RevealStaggerItem } from '../motion/ScrollReveal';
import type { HealthPlanCard } from './types';

interface HealthPlanListProps {
  isLoading: boolean;
  plans: HealthPlanCard[];
}

export default function HealthPlanList({ isLoading, plans }: HealthPlanListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex flex-col">
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-full mb-4" />
            <div className="mt-auto flex items-center justify-between">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-6 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (plans.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-300" />
        <h3 className="text-xl font-bold mb-2">Chưa có kế hoạch nào</h3>
        <p className="text-gray-500">Hãy tạo kế hoạch đầu tiên của bạn để bắt đầu.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {plans.map((plan, idx) => (
        <RevealStaggerItem key={plan.id} index={idx} stagger={0.055} maxStaggerIndex={9} className="h-full">
          <Link
            to={`/health/detail/${plan.id}`}
            className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 flex flex-col group h-full"
          >
            <h4 className="text-xl font-bold text-black group-hover:text-yellow-600 transition-colors mb-2">
              {plan.name}
            </h4>
            <p className="text-gray-500 text-sm mb-4">{plan.description}</p>
            <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{plan.dateRange}</span>
              </div>
              <span className="bg-gray-100 text-black px-2 py-1 rounded text-xs">{plan.tag}</span>
            </div>
          </Link>
        </RevealStaggerItem>
      ))}
    </div>
  );
}
