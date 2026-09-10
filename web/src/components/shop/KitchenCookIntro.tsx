import { ShieldCheck, Flame, Truck, Award } from 'lucide-react';
import { motion } from 'framer-motion';

const CORE_VALUES = [
  {
    icon: ShieldCheck,
    title: 'Vật Liệu An Toàn Tuyệt Đối',
    desc: 'Inox 304 cao cấp, gang đúc nguyên khối và lớp chống dính chuẩn y tế — 100% không chứa PFOA, an toàn trọn vẹn cho sức khỏe.',
    color: 'from-orange-500 to-amber-600',
    bg: 'bg-orange-50/80 dark:bg-orange-950/20',
  },
  {
    icon: Flame,
    title: 'Truyền Nhiệt Đều & Giữ Nhiệt Lâu',
    desc: 'Cấu trúc đáy đa lớp bắt từ siêu nhạy, tản nhiệt đồng đều giúp thức ăn chín đều, giữ trọn vẹn hương vị và dưỡng chất tự nhiên.',
    color: 'from-amber-500 to-orange-600',
    bg: 'bg-amber-50/80 dark:bg-amber-950/20',
  },
  {
    icon: Truck,
    title: 'Giao Hàng Hỏa Tốc GHN Express',
    desc: 'Đóng gói chuẩn chống va đập đa lớp. Kết nối hệ thống GHN Express giao hàng tận tay và cập nhật trạng thái đơn hàng thời gian thực.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-50/80 dark:bg-blue-950/20',
  },
  {
    icon: Award,
    title: 'Bảo Hành Chính Hãng Uy Tín',
    desc: 'Cam kết 100% sản phẩm chính hãng. Chính sách 1 đổi 1 trong 7 ngày nếu lỗi sản xuất và bảo hành dài hạn lên đến 24 tháng.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-50/80 dark:bg-emerald-950/20',
  },
];

export default function KitchenCookIntro() {
  return (
    <section className="py-12 sm:py-16 font-vietnam">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header giới thiệu */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800/40 text-[#A74311] dark:text-amber-300 text-xs font-bold uppercase tracking-wider">
            Về KitchenCook
          </span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Nơi Khởi Nguồn Cảm Hứng <span className="text-[#D96B27]">Căn Bếp Hiện Đại</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            Chúng tôi tin rằng căn bếp là trái tim của mỗi ngôi nhà, và những dụng cụ nấu ăn chuẩn xác chính là chìa khóa mở ra những bữa ăn đong đầy yêu thương. KitchenCook đồng hành cùng bạn trên từng món ngon.
          </p>
        </div>

        {/* 4 Card giá trị cốt lõi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CORE_VALUES.map((val, idx) => {
            const Icon = val.icon;
            return (
              <motion.div
                key={val.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
                className={`p-6 rounded-3xl ${val.bg} border border-amber-900/10 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${val.color} text-white flex items-center justify-center shadow-md mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
                    {val.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
