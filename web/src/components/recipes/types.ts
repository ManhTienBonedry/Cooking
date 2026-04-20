export interface RecipeListRow {
  id: number;
  title: string;
  image_url?: string | null;
  category_name?: string | null;
  difficulty?: string | null;
  cooking_time?: number | null;
  is_featured?: boolean | number;
}

export interface RecipeCategory {
  id: number;
  name: string;
}
