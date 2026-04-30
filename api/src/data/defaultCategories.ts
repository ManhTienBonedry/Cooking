export const DEFAULT_RECIPE_CATEGORIES = [
  'Bữa Tối',
  'Nhanh & Gọn',
  'Món Salad',
  'Eat Clean',
  'Món Chay',
  'Nồi Áp Suất',
  'Thuần Chay',
  'Thực đơn bận rộn',
  'Súp & Canh',
  'Đồ uống',
  'Món chính',
  'Món khai vị',
  'Tráng miệng',
];

export const DEFAULT_BLOG_CATEGORIES = [
  'Mẹo Vặt',
  'Review Nhà Hàng',
  'Dinh Dưỡng',
  'Văn Hóa Ẩm Thực',
  'Kỹ Thuật Nấu',
  'An toàn',
  'Healthy',
  'Kỹ thuật',
  'Văn hóa',
];

export function slugify(input: string, maxLength = 120): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, maxLength);
}
