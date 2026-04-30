import bcrypt from 'bcryptjs';
import { randomBytes } from 'node:crypto';
import { pool } from '../db/pool.js';
import {
  DEFAULT_BLOG_CATEGORIES,
  DEFAULT_RECIPE_CATEGORIES,
  slugify,
} from '../data/defaultCategories.js';

const DEFAULT_OWNER_EMAIL = '2311061636@hunre.edu.vn';

type RecipeSeed = {
  title: string;
  description: string;
  ingredients: string;
  instructions: string;
  difficulty: string;
  cookingTime: number;
  servings: number;
  imageUrl: string;
  categoryName: string;
  views: number;
  isFeatured?: boolean;
};

type BlogSeed = {
  title: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  categoryName: string;
  likes: number;
  daysAgo: number;
};

const RECIPE_SEEDS: RecipeSeed[] = [
  {
    title: 'Cá Hồi Áp Chảo Sốt Bơ Tỏi',
    description: 'Cá hồi áp chảo mềm ngọt, dùng cùng sốt bơ tỏi thơm lừng cho bữa tối dinh dưỡng.',
    ingredients: '2 lát cá hồi\n2 muỗng canh bơ lạt\n3 tép tỏi băm\n1 muỗng canh nước cốt chanh\nMuối, tiêu, mùi tây',
    instructions: 'Ướp cá với muối tiêu. Áp chảo mỗi mặt 3-4 phút. Phi thơm bơ tỏi, thêm nước cốt chanh rồi rưới lên cá.',
    difficulty: 'Dễ',
    cookingTime: 20,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1485921325833-c519f76c4927?w=800&auto=format&fit=crop',
    categoryName: 'Eat Clean',
    views: 1205,
    isFeatured: true,
  },
  {
    title: 'Salad Ức Gà Nướng Mật Ong',
    description: 'Salad thanh mát với ức gà nướng đậm đà, hợp thực đơn eat clean hoặc giảm cân.',
    ingredients: '200g ức gà\nXà lách romaine\nCà chua bi, dưa leo\nMật ong\nNước tương\nDầu oliu, giấm táo',
    instructions: 'Ướp gà với mật ong và nước tương. Nướng hoặc áp chảo chín vàng, thái lát rồi trộn cùng rau củ và sốt dầu giấm.',
    difficulty: 'Dễ',
    cookingTime: 25,
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop',
    categoryName: 'Món Salad',
    views: 890,
  },
  {
    title: 'Bò Lúc Lắc Khoai Tây Chiên',
    description: 'Bò lúc lắc kiểu Việt với thịt bò mềm, khoai tây chiên giòn và rau củ xào nhanh.',
    ingredients: '300g thịt thăn bò\nHành tây\nỚt chuông\nKhoai tây\nNước tương, dầu hào, tiêu, tỏi',
    instructions: 'Ướp bò. Chiên khoai tây. Xào rau củ vừa chín tới, sau đó xào bò lửa lớn và trộn đều.',
    difficulty: 'Trung bình',
    cookingTime: 30,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1544378730-8b5d03ba6d14?w=800&auto=format&fit=crop',
    categoryName: 'Bữa Tối',
    views: 3421,
    isFeatured: true,
  },
  {
    title: 'Canh Rong Biển Nấu Đậu Hũ',
    description: 'Món canh thanh mát, giải nhiệt, nấu nhanh cho những ngày bận rộn.',
    ingredients: 'Rong biển khô\nĐậu hũ non\nThịt băm hoặc nấm\nHành lá\nHạt nêm, dầu mè',
    instructions: 'Ngâm rong biển. Xào sơ thịt băm, thêm nước, đậu hũ và rong biển rồi nêm vừa ăn.',
    difficulty: 'Dễ',
    cookingTime: 15,
    servings: 3,
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop',
    categoryName: 'Súp & Canh',
    views: 1500,
  },
  {
    title: 'Mì Ý Sốt Cà Chua Thịt Băm',
    description: 'Spaghetti sốt cà chua thịt băm dễ làm, hợp bữa tối gia đình.',
    ingredients: 'Mì Ý\nThịt bò băm\nCà chua chín\nHành tây\nTỏi, oregano, dầu oliu',
    instructions: 'Luộc mì chín tới. Xào thịt bò với hành tỏi, thêm cà chua xay và oregano, đun sệt rồi rưới lên mì.',
    difficulty: 'Trung bình',
    cookingTime: 35,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800&auto=format&fit=crop',
    categoryName: 'Bữa Tối',
    views: 4520,
    isFeatured: true,
  },
  {
    title: 'Cơm Chiên Dương Châu',
    description: 'Cơm chiên nhiều màu với lạp xưởng, tôm, trứng và rau củ.',
    ingredients: 'Cơm nguội\nLạp xưởng\nTôm\nTrứng gà\nĐậu cô ve, cà rốt, hành lá',
    instructions: 'Chiên trứng, xào lạp xưởng và tôm. Đảo tơi cơm rồi cho toàn bộ nguyên liệu vào xào đều.',
    difficulty: 'Dễ',
    cookingTime: 20,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=800&auto=format&fit=crop',
    categoryName: 'Nhanh & Gọn',
    views: 2210,
  },
  {
    title: 'Gà Hầm Sâm Hàn Quốc',
    description: 'Gà hầm bổ dưỡng với nhân sâm, táo đỏ và gạo nếp.',
    ingredients: 'Gà tre hoặc gà ác\nNhân sâm\nTáo đỏ\nGạo nếp\nTỏi, hành lá',
    instructions: 'Nhồi gạo nếp, táo đỏ và sâm vào bụng gà. Hầm trong nồi áp suất đến khi thịt mềm.',
    difficulty: 'Khó',
    cookingTime: 60,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1585931668832-6a695dbbf77c?w=800&auto=format&fit=crop',
    categoryName: 'Nồi Áp Suất',
    views: 1100,
  },
  {
    title: 'Đậu Hũ Tứ Xuyên Thuần Chay',
    description: 'Phiên bản thuần chay cay nồng, đậm vị với đậu hũ non và nấm.',
    ingredients: 'Đậu hũ non\nNấm đùi gà\nSa tế chay\nNước tương\nGừng, tỏi',
    instructions: 'Chần đậu hũ. Phi thơm gừng tỏi, xào nấm với sa tế, thêm đậu hũ và đun nhẹ đến khi thấm vị.',
    difficulty: 'Trung bình',
    cookingTime: 20,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=800&auto=format&fit=crop',
    categoryName: 'Thuần Chay',
    views: 840,
  },
  {
    title: 'Trứng Chiên Bọt Biển',
    description: 'Trứng chiên bồng bềnh, mềm mịn và đẹp mắt chỉ với vài nguyên liệu.',
    ingredients: '2 quả trứng gà\nĐường\nBơ lạt\nMuối',
    instructions: 'Tách lòng đỏ và lòng trắng. Đánh bông lòng trắng, trộn nhẹ với lòng đỏ rồi áp chảo lửa nhỏ.',
    difficulty: 'Dễ',
    cookingTime: 10,
    servings: 1,
    imageUrl: 'https://images.unsplash.com/photo-1525640788966-69bdb028aa73?w=800&auto=format&fit=crop',
    categoryName: 'Nhanh & Gọn',
    views: 3100,
  },
  {
    title: 'Miến Trộn Hàn Quốc Japchae',
    description: 'Miến dai trộn thịt bò và rau củ, thơm dầu mè.',
    ingredients: 'Miến Hàn Quốc\nThịt bò\nCà rốt\nNấm đông cô\nCải bó xôi\nDầu mè, nước tương',
    instructions: 'Luộc miến. Xào riêng rau củ và thịt bò, sau đó trộn cùng nước tương ngọt và dầu mè.',
    difficulty: 'Trung bình',
    cookingTime: 35,
    servings: 3,
    imageUrl: 'https://images.unsplash.com/photo-1583224964978-225ddb3ea354?w=800&auto=format&fit=crop',
    categoryName: 'Thực đơn bận rộn',
    views: 1800,
  },
];

const BLOG_SEEDS: BlogSeed[] = [
  {
    title: '5 Bí Quyết Giữ Rau Củ Tươi Lâu Trong Tủ Lạnh',
    excerpt: 'Những mẹo nhỏ giúp rau củ tươi lâu hơn và hạn chế lãng phí thực phẩm.',
    content: '<p>Rau củ nên được bảo quản theo từng nhóm. Dùng giấy thấm ẩm bọc rau lá, không rửa trước khi cất nếu chưa dùng ngay, để riêng trái cây sinh khí ethylene như táo và chuối, đồng thời tận dụng hộp kín để giữ độ ẩm ổn định.</p>',
    imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop',
    categoryName: 'Mẹo Vặt',
    likes: 342,
    daysAgo: 2,
  },
  {
    title: 'Review 3 Quán Phở Thìn Lò Đúc Gốc Tại Hà Nội',
    excerpt: 'Dạo quanh các cơ sở Phở Thìn để xem đâu là hương vị đáng thử.',
    content: '<p>Phở Thìn Lò Đúc nổi bật với thịt bò xào lăn, nước dùng béo và mùi hành tỏi đặc trưng. Mỗi cơ sở có ưu điểm riêng về không gian, nhưng hương vị gốc vẫn là lựa chọn đáng trải nghiệm khi ghé Hà Nội.</p>',
    imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cb438?w=800&auto=format&fit=crop',
    categoryName: 'Review Nhà Hàng',
    likes: 1024,
    daysAgo: 5,
  },
  {
    title: 'Eat Clean Là Gì? Bắt Đầu Eat Clean Dễ Dàng Cho Người Mới',
    excerpt: 'Cách bắt đầu ăn sạch mà không bị nản trong tuần đầu tiên.',
    content: '<p>Eat clean ưu tiên thực phẩm tươi, ít chế biến và hạn chế đường tinh luyện. Người mới nên bắt đầu bằng những thay đổi nhỏ như tăng rau xanh, chọn tinh bột tốt và chuẩn bị sẵn bữa ăn đơn giản.</p>',
    imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&auto=format&fit=crop',
    categoryName: 'Dinh Dưỡng',
    likes: 560,
    daysAgo: 10,
  },
  {
    title: 'Sự Thật Thú Vị Về Nước Mắm Truyền Thống Việt Nam',
    excerpt: 'Từ cá cơm tươi đến giọt nước mắm nhĩ là cả một quá trình lên men.',
    content: '<p>Nước mắm truyền thống được ủ chượp từ cá và muối trong nhiều tháng. Hương vị chuẩn thường có độ đạm rõ, mùi thơm đặc trưng và hậu vị mặn ngọt cân bằng.</p>',
    imageUrl: 'https://images.unsplash.com/photo-1628191010210-a59de33e5941?w=800&auto=format&fit=crop',
    categoryName: 'Văn Hóa Ẩm Thực',
    likes: 415,
    daysAgo: 12,
  },
  {
    title: 'Kỹ Thuật Thái Hạt Lựu Brunoise Chuẩn Đầu Bếp',
    excerpt: 'Cách cầm dao và thái hạt lựu đều tay khi sơ chế nguyên liệu.',
    content: '<p>Brunoise là kỹ thuật cắt khối nhỏ đều. Hãy tạo mặt phẳng cho nguyên liệu, thái lát, thái sợi rồi cắt ngang thành hạt lựu, luôn giữ tay theo dáng claw grip để an toàn.</p>',
    imageUrl: 'https://images.unsplash.com/photo-1556910103-1c02745a805f?w=800&auto=format&fit=crop',
    categoryName: 'Kỹ Thuật Nấu',
    likes: 290,
    daysAgo: 15,
  },
  {
    title: 'Làm Sao Để Nấu Cơm Niêu Cháy Đáy Giòn Tan?',
    excerpt: 'Bí quyết căn lửa để có lớp cháy cơm vàng giòn mà không khét.',
    content: '<p>Muốn cơm niêu có lớp cháy đẹp, cần ngâm gạo trước, đun lửa vừa đến khi cạn nước rồi hạ lửa nhỏ. Xoay nồi đều để nhiệt phân bố, có thể thêm chút dầu để lớp cháy bong dễ hơn.</p>',
    imageUrl: 'https://images.unsplash.com/photo-1536622204620-22c6762332bc?w=800&auto=format&fit=crop',
    categoryName: 'Kỹ Thuật Nấu',
    likes: 180,
    daysAgo: 18,
  },
  {
    title: 'Sai Lầm Khi Sử Dụng Thớt Gỗ Trong Bếp',
    excerpt: 'Các bước vệ sinh thớt gỗ đúng cách để tránh nhiễm khuẩn chéo.',
    content: '<p>Không nên dùng chung thớt cho thực phẩm sống và chín. Sau khi thái thịt cá, hãy rửa kỹ, sát khuẩn bằng chanh muối hoặc giấm, lau khô và đặt nơi thoáng để hạn chế nứt mốc.</p>',
    imageUrl: 'https://images.unsplash.com/photo-1596647262274-0f2d72561939?w=800&auto=format&fit=crop',
    categoryName: 'An toàn',
    likes: 852,
    daysAgo: 22,
  },
  {
    title: 'Tại Sao Cần Uống Đủ Nước Khi Ăn Kiêng Keto?',
    excerpt: 'Keto dễ làm cơ thể mất nước và thiếu điện giải nếu chuẩn bị chưa đúng.',
    content: '<p>Khi giảm mạnh carb, cơ thể mất bớt glycogen và nước đi kèm. Vì vậy người ăn keto cần uống đủ nước, bổ sung điện giải và theo dõi phản ứng cơ thể trong giai đoạn đầu.</p>',
    imageUrl: 'https://images.unsplash.com/photo-1523362628745-0c100150b504?w=800&auto=format&fit=crop',
    categoryName: 'Healthy',
    likes: 310,
    daysAgo: 25,
  },
  {
    title: 'Top 4 Quán Bún Bò Huế Cay Tại Sài Gòn',
    excerpt: 'Những địa chỉ bún bò đậm vị Huế dành cho người thích món cay.',
    content: '<p>Bún bò ngon cần nước dùng thơm sả, vị ruốc cân bằng và topping đầy đặn. Khi chọn quán, hãy chú ý độ trong của nước, mùi thơm và cách phục vụ sa tế riêng theo khẩu vị.</p>',
    imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=800&auto=format&fit=crop',
    categoryName: 'Review Nhà Hàng',
    likes: 670,
    daysAgo: 28,
  },
  {
    title: 'Sự Khác Biệt Giữa Ẩm Thực Miền Bắc Và Miền Tây',
    excerpt: 'Từ vị thanh tao miền Bắc đến vị ngọt đậm đà của miền Tây Nam Bộ.',
    content: '<p>Ẩm thực miền Bắc thường chú trọng sự thanh nhã và cân bằng. Miền Tây lại phóng khoáng hơn, hay dùng vị ngọt, nước dừa và nhiều loại rau đồng quê, tạo cảm giác gần gũi trong bữa ăn.</p>',
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&auto=format&fit=crop',
    categoryName: 'Văn hóa',
    likes: 911,
    daysAgo: 30,
  },
];

async function ensureOwnerUser(): Promise<number> {
  const email = (process.env.SEED_OWNER_EMAIL || DEFAULT_OWNER_EMAIL).trim().toLowerCase();
  const existing = await pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [email]);
  if (existing.rows[0]?.id) return Number(existing.rows[0].id);

  const password = process.env.SEED_USER_PASSWORD || randomBytes(24).toString('base64url');
  const passwordHash = await bcrypt.hash(password, 10);
  const created = await pool.query(
    `INSERT INTO users (full_name, email, password_hash, bio)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    ['Tài khoản nội dung', email, passwordHash, 'Tài khoản sở hữu dữ liệu seed của website.']
  );
  return Number(created.rows[0].id);
}

async function ensureCategories(table: 'recipe_categories' | 'blog_categories', names: string[]): Promise<Map<string, number>> {
  const ids = new Map<string, number>();
  for (const name of names) {
    const slug = slugify(name);
    const result = await pool.query(
      `INSERT INTO ${table} (name, slug)
       VALUES ($1, $2)
       ON CONFLICT (slug) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`,
      [name, slug]
    );
    ids.set(name, Number(result.rows[0].id));
  }
  return ids;
}

async function seedRecipes(authorId: number, categoryIds: Map<string, number>): Promise<number> {
  let count = 0;
  for (const recipe of RECIPE_SEEDS) {
    const categoryId = categoryIds.get(recipe.categoryName);
    if (!categoryId) throw new Error(`Missing recipe category: ${recipe.categoryName}`);

    const existing = await pool.query('SELECT id FROM recipes WHERE title = $1 LIMIT 1', [recipe.title]);
    if (existing.rows[0]?.id) {
      await pool.query(
        `UPDATE recipes
         SET description = $2,
             ingredients = $3,
             instructions = $4,
             difficulty = $5,
             cooking_time = $6,
             servings = $7,
             image_url = $8,
             category_id = $9,
             author_id = $10,
             status = 'approved',
             views = $11,
             is_featured = $12,
             updated_at = CURRENT_TIMESTAMP
         WHERE id = $1`,
        [
          Number(existing.rows[0].id),
          recipe.description,
          recipe.ingredients,
          recipe.instructions,
          recipe.difficulty,
          recipe.cookingTime,
          recipe.servings,
          recipe.imageUrl,
          categoryId,
          authorId,
          recipe.views,
          Boolean(recipe.isFeatured),
        ]
      );
    } else {
      await pool.query(
        `INSERT INTO recipes (
           title, description, ingredients, instructions, difficulty,
           cooking_time, servings, image_url, category_id, author_id,
           status, views, is_featured
         )
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'approved',$11,$12)`,
        [
          recipe.title,
          recipe.description,
          recipe.ingredients,
          recipe.instructions,
          recipe.difficulty,
          recipe.cookingTime,
          recipe.servings,
          recipe.imageUrl,
          categoryId,
          authorId,
          recipe.views,
          Boolean(recipe.isFeatured),
        ]
      );
    }
    count += 1;
  }
  return count;
}

async function seedBlogs(authorId: number, categoryIds: Map<string, number>): Promise<number> {
  let count = 0;
  for (const post of BLOG_SEEDS) {
    const categoryId = categoryIds.get(post.categoryName);
    if (!categoryId) throw new Error(`Missing blog category: ${post.categoryName}`);

    const createdAt = new Date(Date.now() - post.daysAgo * 24 * 60 * 60 * 1000);
    const slug = `seed-${slugify(post.title, 170)}`;
    await pool.query(
      `INSERT INTO blog_posts (
         title, slug, excerpt, content, image_url,
         likes, status, category_id, author_id, created_at, updated_at
       )
       VALUES ($1,$2,$3,$4,$5,$6,'approved',$7,$8,$9,$9)
       ON CONFLICT (slug) DO UPDATE SET
         title = EXCLUDED.title,
         excerpt = EXCLUDED.excerpt,
         content = EXCLUDED.content,
         image_url = EXCLUDED.image_url,
         likes = EXCLUDED.likes,
         status = 'approved',
         category_id = EXCLUDED.category_id,
         author_id = EXCLUDED.author_id,
         updated_at = CURRENT_TIMESTAMP`,
      [
        post.title,
        slug,
        post.excerpt,
        post.content,
        post.imageUrl,
        post.likes,
        categoryId,
        authorId,
        createdAt,
      ]
    );
    count += 1;
  }
  return count;
}

async function main(): Promise<void> {
  const authorId = await ensureOwnerUser();
  const recipeCategoryIds = await ensureCategories('recipe_categories', DEFAULT_RECIPE_CATEGORIES);
  const blogCategoryIds = await ensureCategories('blog_categories', DEFAULT_BLOG_CATEGORIES);
  const recipeCount = await seedRecipes(authorId, recipeCategoryIds);
  const blogCount = await seedBlogs(authorId, blogCategoryIds);

  if (process.env.SEED_REASSIGN_EXISTING !== 'false') {
    await pool.query('UPDATE recipes SET author_id = $1 WHERE author_id <> $1', [authorId]);
    await pool.query('UPDATE blog_posts SET author_id = $1 WHERE author_id <> $1', [authorId]);
  }

  console.log(`Seeded ${recipeCount} recipes and ${blogCount} blog posts for ${process.env.SEED_OWNER_EMAIL || DEFAULT_OWNER_EMAIL}.`);
  console.log(`Recipe categories: ${DEFAULT_RECIPE_CATEGORIES.length}; blog categories: ${DEFAULT_BLOG_CATEGORIES.length}.`);
}

main()
  .catch((err: unknown) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
