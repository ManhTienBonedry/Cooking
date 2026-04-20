export interface BlogPostRow {
  id: number;
  title: string;
  excerpt?: string | null;
  image_url?: string | null;
  category_name?: string | null;
  created_at?: string | null;
  author_name?: string | null;
}

export interface BlogCategory {
  id: number;
  name: string;
}

export const LEGACY_BLOG_CATEGORIES = ['An toàn', 'Healthy', 'Kỹ thuật', 'Mẹo vặt', 'Văn hóa'];
