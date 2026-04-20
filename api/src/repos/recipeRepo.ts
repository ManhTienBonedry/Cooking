import { pool } from '../db/pool.js';

type DbRow = Record<string, unknown>;

const DEFAULT_RECIPE_CATEGORIES = ['Món chính', 'Món khai vị', 'Tráng miệng', 'Đồ uống'];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 120);
}

async function ensureDefaultCategories(): Promise<void> {
  for (const name of DEFAULT_RECIPE_CATEGORIES) {
    const slug = slugify(name);
    await pool.query(
      `INSERT INTO recipe_categories (name, slug)
       VALUES ($1, $2)
       ON CONFLICT (slug) DO NOTHING`,
      [name, slug]
    );
  }
}

function parseTotal(v: unknown): number {
  return Number(v ?? 0);
}

function isAllCategory(category: string | null): boolean {
  return !category || category === 'Tat ca' || category === 'Tất cả';
}

export async function getFeaturedRecipes(limit = 6): Promise<DbRow[]> {
  const { rows } = await pool.query(
    `SELECT r.*, r.calories, c.name AS category_name, u.full_name AS author_name, u.avatar_url AS author_avatar
     FROM recipes r
     LEFT JOIN recipe_categories c ON r.category_id = c.id
     LEFT JOIN users u ON r.author_id = u.id
     WHERE r.status = 'approved'
     ORDER BY r.is_featured DESC, r.views DESC, r.created_at DESC
     LIMIT $1`,
    [limit]
  );
  return rows;
}

export async function searchRecipes(search: string | null, category: string | null, limit: number, offset: number): Promise<DbRow[]> {
  const conditions: string[] = ["r.status = 'approved'"];
  const params: (string | number)[] = [];

  if (search) {
    conditions.push(`(r.title ILIKE $${params.length + 1} OR r.description ILIKE $${params.length + 1} OR r.ingredients ILIKE $${params.length + 1})`);
    params.push(`%${search}%`);
  }
  if (!isAllCategory(category)) {
    conditions.push(`c.name = $${params.length + 1}`);
    params.push(category as string);
  }

  const sql = `SELECT r.*, r.calories, r.protein, r.carbs, r.fat, c.name AS category_name, u.full_name AS author_name, u.avatar_url AS author_avatar
     FROM recipes r
     LEFT JOIN recipe_categories c ON r.category_id = c.id
     LEFT JOIN users u ON r.author_id = u.id
     WHERE ${conditions.join(' AND ')}
     ORDER BY r.created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function searchRecipesWithViewer(
  search: string | null,
  category: string | null,
  viewerId: number,
  limit: number,
  offset: number
): Promise<DbRow[]> {
  const conditions: string[] = ["(r.status = 'approved' OR r.author_id = $1)"];
  const params: (string | number)[] = [viewerId];

  if (search) {
    conditions.push(`(r.title ILIKE $${params.length + 1} OR r.description ILIKE $${params.length + 1} OR r.ingredients ILIKE $${params.length + 1})`);
    params.push(`%${search}%`);
  }
  if (!isAllCategory(category)) {
    conditions.push(`c.name = $${params.length + 1}`);
    params.push(category as string);
  }

  const sql = `SELECT r.*, r.calories, r.protein, r.carbs, r.fat, c.name AS category_name, u.full_name AS author_name, u.avatar_url AS author_avatar
     FROM recipes r
     LEFT JOIN recipe_categories c ON r.category_id = c.id
     LEFT JOIN users u ON r.author_id = u.id
     WHERE ${conditions.join(' AND ')}
     ORDER BY r.created_at DESC
     LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
  params.push(limit, offset);

  const { rows } = await pool.query(sql, params);
  return rows;
}

export async function countSearchRecipes(search: string | null, category: string | null): Promise<number> {
  const conditions: string[] = ["r.status = 'approved'"];
  const params: string[] = [];

  if (search) {
    conditions.push(`(r.title ILIKE $${params.length + 1} OR r.description ILIKE $${params.length + 1} OR r.ingredients ILIKE $${params.length + 1})`);
    params.push(`%${search}%`);
  }
  if (!isAllCategory(category)) {
    conditions.push(`c.name = $${params.length + 1}`);
    params.push(category as string);
  }

  const sql = `SELECT COUNT(*) AS total
     FROM recipes r
     LEFT JOIN recipe_categories c ON r.category_id = c.id
     WHERE ${conditions.join(' AND ')}`;

  const { rows } = await pool.query(sql, params);
  return parseTotal(rows[0]?.total);
}

export async function countSearchRecipesWithViewer(
  search: string | null,
  category: string | null,
  viewerId: number
): Promise<number> {
  const conditions: string[] = ["(r.status = 'approved' OR r.author_id = $1)"];
  const params: (string | number)[] = [viewerId];

  if (search) {
    conditions.push(`(r.title ILIKE $${params.length + 1} OR r.description ILIKE $${params.length + 1} OR r.ingredients ILIKE $${params.length + 1})`);
    params.push(`%${search}%`);
  }
  if (!isAllCategory(category)) {
    conditions.push(`c.name = $${params.length + 1}`);
    params.push(category as string);
  }

  const sql = `SELECT COUNT(*) AS total
     FROM recipes r
     LEFT JOIN recipe_categories c ON r.category_id = c.id
     WHERE ${conditions.join(' AND ')}`;

  const { rows } = await pool.query(sql, params);
  return parseTotal(rows[0]?.total);
}

export async function getRecipeById(id: number, viewerId: number | null): Promise<DbRow | null> {
  const v = viewerId ?? 0;
  const { rows } = await pool.query(
    `SELECT r.*, r.calories, c.name AS category_name, u.full_name AS author_name, u.avatar_url AS author_avatar, u.email AS author_email
     FROM recipes r
     LEFT JOIN recipe_categories c ON r.category_id = c.id
     LEFT JOIN users u ON r.author_id = u.id
     WHERE r.id = $1 AND (r.status = 'approved' OR r.author_id = $2)`,
    [id, v]
  );
  return rows[0] ?? null;
}

export async function incrementViews(recipeId: number, userId: number | null): Promise<boolean> {
  if (userId) {
    const dup = await pool.query('SELECT id FROM recipe_views WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);
    if (dup.rows.length > 0) return false;
    await pool.query('INSERT INTO recipe_views (user_id, recipe_id) VALUES ($1, $2)', [userId, recipeId]);
  }
  await pool.query('UPDATE recipes SET views = views + 1 WHERE id = $1', [recipeId]);
  return true;
}

export async function getCategories(): Promise<DbRow[]> {
  await ensureDefaultCategories();
  const { rows } = await pool.query('SELECT id, name FROM recipe_categories ORDER BY name ASC');
  return rows;
}

export async function isSaved(userId: number, recipeId: number): Promise<boolean> {
  const { rows } = await pool.query('SELECT id FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);
  return rows.length > 0;
}

export async function toggleSave(userId: number, recipeId: number): Promise<boolean> {
  if (await isSaved(userId, recipeId)) {
    await pool.query('DELETE FROM saved_recipes WHERE user_id = $1 AND recipe_id = $2', [userId, recipeId]);
    return false;
  }
  await pool.query('INSERT INTO saved_recipes (user_id, recipe_id) VALUES ($1, $2)', [userId, recipeId]);
  return true;
}

export async function searchRecipesApprovedNoPagination(): Promise<DbRow[]> {
  const { rows } = await pool.query(
    `SELECT r.*, r.calories, r.protein, r.carbs, r.fat, c.name AS category_name, u.full_name AS author_name, u.avatar_url AS author_avatar
     FROM recipes r
     LEFT JOIN recipe_categories c ON r.category_id = c.id
     LEFT JOIN users u ON r.author_id = u.id
     WHERE r.status = 'approved'
     ORDER BY r.created_at DESC`
  );
  return rows;
}

export async function createRecipe(data: {
  title: string;
  description: string | null;
  ingredients: string;
  instructions: string;
  difficulty: string;
  cookingTime: number | null;
  servings: number | null;
  imageUrl: string | null;
  categoryId: number;
  authorId: number;
}): Promise<number | null> {
  const r = await pool.query(
    `INSERT INTO recipes (
      title, description, ingredients, instructions, difficulty,
      cooking_time, servings, image_url, category_id, author_id, status
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'pending')
    RETURNING id`,
    [
      data.title,
      data.description,
      data.ingredients,
      data.instructions,
      data.difficulty,
      data.cookingTime,
      data.servings,
      data.imageUrl,
      data.categoryId,
      data.authorId,
    ]
  );
  return Number(r.rows[0]?.id ?? 0) || null;
}

export async function getRecipesByAuthor(authorId: number, limit: number, offset: number): Promise<DbRow[]> {
  const { rows } = await pool.query(
    `SELECT r.*, c.name AS category_name
     FROM recipes r
     LEFT JOIN recipe_categories c ON r.category_id = c.id
     WHERE r.author_id = $1
     ORDER BY r.created_at DESC
     LIMIT $2 OFFSET $3`,
    [authorId, limit, offset]
  );
  return rows;
}

export async function getSavedRecipesByUser(userId: number, limit: number, offset: number): Promise<DbRow[]> {
  const { rows } = await pool.query(
    `SELECT r.*, c.name AS category_name, s.created_at AS saved_at
     FROM saved_recipes s
     JOIN recipes r ON r.id = s.recipe_id
     LEFT JOIN recipe_categories c ON r.category_id = c.id
     WHERE s.user_id = $1
     ORDER BY s.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset]
  );
  return rows;
}
