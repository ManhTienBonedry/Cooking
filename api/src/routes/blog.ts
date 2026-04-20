import { Router } from 'express';
import * as blogRepo from '../repos/blogRepo.js';
import { requireAuth } from '../middleware/requireAuth.js';
import { requireCsrf } from '../middleware/csrf.js';
import { processImageBase64 } from '../lib/processImage.js';

export const blogRouter = Router();

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 180);
}

blogRouter.get('/categories', async (_req, res) => {
  const categories = await blogRepo.getCategories();
  res.json({ categories });
});

blogRouter.get('/posts/mine', requireAuth, async (req, res) => {
  const userId = req.session.userId!;
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
  const offset = Math.max(0, Number(req.query.offset) || 0);
  const posts = await blogRepo.getPostsByAuthor(userId, limit, offset);
  res.json({ posts, limit, offset });
});

blogRouter.get('/posts/:id', async (req, res) => {
  const id = Number(req.params.id);
  const viewerId = req.session.userId ?? null;
  if (!id) {
    res.status(400).json({ error: 'Invalid id' });
    return;
  }
  const post = await blogRepo.getPostById(id, viewerId);
  if (!post) {
    res.status(404).json({ error: 'Not found' });
    return;
  }
  res.json({ post });
});

blogRouter.get('/posts', async (req, res) => {
  const search = req.query.q ? String(req.query.q).trim() || null : null;
  const category = req.query.category ? String(req.query.category) : null;
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 12));
  const offset = Math.max(0, Number(req.query.offset) || 0);
  const viewerId = req.session.userId ?? null;
  const [posts, total] = await Promise.all([
    viewerId
      ? blogRepo.searchPostsWithViewer(search, category, viewerId, limit, offset)
      : blogRepo.searchPosts(search, category, limit, offset),
    viewerId
      ? blogRepo.countSearchPostsWithViewer(search, category, viewerId)
      : blogRepo.countSearchPosts(search, category),
  ]);
  res.json({ posts, total, limit, offset });
});

blogRouter.post('/posts', requireAuth, requireCsrf, async (req, res) => {
  const userId = req.session.userId!;
  const title = String(req.body?.title ?? '').trim();
  const content = String(req.body?.content ?? '').trim();
  const excerptRaw = String(req.body?.excerpt ?? '').trim();
  const imageUrlRaw = String(req.body?.image_url ?? '').trim();
  const categoryName = String(req.body?.category_name ?? '').trim();
  let categoryId = Number(req.body?.category_id ?? 0);

  if (title.length < 3) {
    res.status(422).json({ success: false, message: 'Tiêu đề phải có ít nhất 3 ký tự.' });
    return;
  }

  if (content.length < 10) {
    res.status(422).json({ success: false, message: 'Nội dung bài viết quá ngắn (tối thiểu 10 ký tự).' });
    return;
  }

  if (!categoryId && categoryName) {
    categoryId = (await blogRepo.ensureCategoryExists(categoryName)) ?? 0;
  }

  if (!categoryId) {
    res.status(422).json({ success: false, message: 'Vui lòng chọn danh mục bài viết.' });
    return;
  }

  const finalImageUrl = processImageBase64(imageUrlRaw || null);

  const slugBase = slugify(title) || `post-${Date.now()}`;
  const slug = `${slugBase}-${Date.now().toString(36)}`;
  const id = await blogRepo.createPost({
    title,
    content,
    excerpt: excerptRaw || null,
    imageUrl: finalImageUrl,
    categoryId,
    authorId: userId,
    slug,
  });

  if (!id) {
    res.status(400).json({ success: false, message: 'Không thể tạo bài viết.' });
    return;
  }

  res.status(201).json({ success: true, id, status: 'pending' });
});
