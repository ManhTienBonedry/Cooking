export interface ProfileUser {
  full_name: string;
  email: string;
  avatar: string | null;
  bio: string;
}

export interface ProfileStats {
  recipe_count: number;
  post_count: number;
  recipe_views_sum: number;
}
