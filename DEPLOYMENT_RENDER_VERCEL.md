# Hướng Dẫn Triển Khai Production (Render & Vercel)

Tài liệu này hướng dẫn chi tiết từng bước để triển khai hệ thống **CookingBoy & KitchenCook** lên môi trường thực tế (Production):
- **Backend API & PostgreSQL Database**: Chạy trên **Render.com**
- **Frontend Web Application**: Chạy trên **Vercel.com**

---

## BƯỚC 1: TẠO DATABASE POSTGRESQL MỚI TRÊN RENDER

1. Đăng nhập vào [Render.com Dashboard](https://dashboard.render.com).
2. Bấm nút **New +** ở góc trên cùng bên phải -> chọn **PostgreSQL**.
3. Điền các thông tin:
   - **Name**: `cookapp-postgres` (hoặc tên tùy thích)
   - **Database**: `cookingdb`
   - **User**: `cooking`
   - **Region**: `Singapore` (hoặc khu vực gần bạn nhất)
   - **PostgreSQL Version**: `16` (mặc định)
   - **Instance Type**: Chọn gói **Free**
4. Bấm **Create Database**.
5. Chờ Render tạo xong (khoảng 1-2 phút).
6. Khi Database đã ở trạng thái **Available**:
   - Tìm đến mục **Connections**.
   - Copy giá trị **Internal Database URL** (nếu Backend deploy cùng tài khoản trên Render) hoặc **External Database URL**.
   - URL sẽ có dạng:  
     `postgresql://cooking:password@dpg-xxxxxx.singapore-postgres.render.com/cookingdb`

---

## BƯỚC 2: DEPLOY BACKEND API LÊN RENDER

1. Trên Render Dashboard, bấm **New +** -> chọn **Web Service**.
2. Kết nối với Git Repository của bạn (GitHub/GitLab).
3. Điền các thông số cấu hình:
   - **Name**: `cookapp-api`
   - **Region**: `Singapore` (chọn cùng Region với Database đã tạo ở Bước 1)
   - **Branch**: `main`
   - **Root Directory**: `api`
   - **Runtime**: `Node`
   - **Build Command**:  
     ```bash
     npm install && npm run build && npm run db:setup -- --no-create-db
     ```
     > *Lệnh này sẽ tự động build code TypeScript và chạy toàn bộ các migration để tạo bảng, tạo trigger và nạp sẵn dữ liệu mẫu (sản phẩm đồ bếp, công thức, tài khoản admin/seller/buyer) vào Database mới.*
   - **Start Command**:  
     ```bash
     npm start
     ```
   - **Plan**: Chọn gói **Free**
4. Kéo xuống mục **Environment Variables** và bấm **Add Environment Variable** để thêm các biến sau:

| Tên Biến (Key) | Giá Trị (Value) | Ghi Chú |
| :--- | :--- | :--- |
| `NODE_ENV` | `production` | Bắt buộc |
| `DATABASE_URL` | *(Dán Internal Database URL từ Bước 1)* | Chuỗi kết nối Postgres của Render |
| `SESSION_SECRET` | *(Bấm Generate hoặc nhập chuỗi ngẫu nhiên dài)* | Bảo mật cookie phiên đăng nhập |
| `CORS_ORIGIN` | `https://your-app.vercel.app` *(sẽ cập nhật sau khi có domain Vercel)* | Tạm thời có thể để domain Vercel hoặc tạm thời test |
| `MAIL_BRAND` | `KitchenCook & CookingBoy` | Thương hiệu hiển thị |
| `RECAPTCHA_MIN_SCORE` | `0.5` | Ngưỡng bảo mật chống bot |

5. Bấm **Deploy Web Service**.
6. Render sẽ bắt đầu build và tự động khởi tạo database. Khi hoàn tất, bạn sẽ nhận được địa chỉ Backend API, ví dụ:  
   👉 `https://cookapp-api.onrender.com`

---

## BƯỚC 3: DEPLOY FRONTEND LÊN VERCEL

1. Đăng nhập vào [Vercel Dashboard](https://vercel.com).
2. Bấm **Add New...** -> **Project**.
3. Import cùng Git Repository chứa dự án.
4. Trong màn hình **Configure Project**:
   - **Project Name**: `cookapp` (hoặc tên tùy thích)
   - **Framework Preset**: Chọn **Vite**
   - **Root Directory**: Bấm Edit -> chọn thư mục `web`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Mở rộng mục **Environment Variables** và thêm biến môi trường kết nối Backend:

| Tên Biến (Key) | Giá Trị (Value) | Ghi Chú |
| :--- | :--- | :--- |
| `VITE_API_URL` | `https://cookapp-api.onrender.com` | Địa chỉ Backend trên Render (không có dấu gạch chéo `/` ở cuối) |
| `VITE_GOOGLE_CLIENT_ID` | *(Tùy chọn)* | Client ID nếu bạn dùng Google Sign-In |

6. Bấm **Deploy**.
7. Sau khoảng 1 phút, Vercel sẽ cấp cho bạn một domain thật, ví dụ:  
   👉 `https://cookapp-web.vercel.app`

---

## BƯỚC 4: KẾT NỐI HAI BÊN (CẬP NHẬT CORS TRÊN RENDER)

1. Copy tên miền Vercel của bạn (ví dụ: `https://cookapp-web.vercel.app`).
2. Quay lại [Render Dashboard](https://dashboard.render.com) -> vào Web Service `cookapp-api` -> chọn tab **Environment**.
3. Sửa biến `CORS_ORIGIN`:
   ```
   CORS_ORIGIN = https://cookapp-web.vercel.app
   ```
4. Bấm **Save Changes**. Render sẽ tự động lưu và khởi động lại dịch vụ trong vài giây.

---

## BƯỚC 5: TÀI KHOẢN MẪU KHỞI TẠO SẴN

Sau khi Render chạy xong lệnh `npm run db:setup`, Database mới đã có sẵn các tài khoản sau để bạn đăng nhập thử nghiệm ngay:

- **Tài khoản Quản trị (Admin Portal `/admin`)**:
  - Email: `admin@cook.local`
  - Mật khẩu: `Admin@Cook123456`
- **Tài khoản Người bán / Seller**:
  - Email: `demo-seller@cook.local`
  - Mật khẩu: `Demo@Cook123456`
- **Tài khoản Khách hàng / Buyer**:
  - Email: `demo-buyer@cook.local`
  - Mật khẩu: `Demo@Cook123456`

---

## KIỂM TRA HOẠT ĐỘNG
1. Mở trang web Vercel trên trình duyệt.
2. Thử truy cập `/shop` (KitchenCook Store):
   - Bấm **Đăng nhập** -> Modal Be - Trắng mới mở lên.
   - Thử tạo tài khoản mới với Số điện thoại di động Việt Nam.
   - Thử thêm sản phẩm đồ bếp vào giỏ hàng và đặt đơn hàng.
3. Thử chuyển sang trang chủ CookingBoy (`/`):
   - Đọc công thức, lưu công thức và kiểm tra trạng thái đăng nhập liên thông (SSO).
