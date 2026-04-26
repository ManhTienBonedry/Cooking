-- File này lưu lại cấu trúc SQL mẫu dùng cho tính năng "Tìm kiếm theo nguyên liệu Tủ lạnh" (Fridge Clearing Search).
-- Hệ thống sẽ tự động ghép thêm các dòng CASE WHEN tương ứng với số lượng nguyên liệu mà người dùng nhập vào.
-- Bạn có thể lưu lại file này để đảm bảo đủ dữ liệu khi chia sẻ code cho bạn bè.

-- Ví dụ: Khi người dùng gõ tìm 3 nguyên liệu: 'trứng', 'cà chua', 'hành lá'
-- Query thực tế trên Node.js sẽ được sinh ra như sau:

SELECT 
    r.id,
    r.title,
    r.ingredients,
    r.description,
    r.image_url,
    r.views,
    r.calories,
    c.name AS category_name,
    u.full_name AS author_name,
    (
        (CASE WHEN r.ingredients ILIKE '%trứng%' THEN 1 ELSE 0 END) +
        (CASE WHEN r.ingredients ILIKE '%cà chua%' THEN 1 ELSE 0 END) +
        (CASE WHEN r.ingredients ILIKE '%hành lá%' THEN 1 ELSE 0 END)
    ) AS match_count
FROM recipes r
LEFT JOIN recipe_categories c ON r.category_id = c.id
LEFT JOIN users u ON r.author_id = u.id
WHERE r.status = 'approved'
  AND (
        r.ingredients ILIKE '%trứng%' OR 
        r.ingredients ILIKE '%cà chua%' OR 
        r.ingredients ILIKE '%hành lá%'
  )
ORDER BY match_count DESC, r.views DESC
LIMIT 20 OFFSET 0;
