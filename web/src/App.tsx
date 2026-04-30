import { lazy, Suspense, useLayoutEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';

import Layout from './components/Layout';
import { scrollWindowToTop } from './lib/scroll';

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Recipes = lazy(() => import('./pages/Recipes'));
const FridgeSearch = lazy(() => import('./pages/Recipes/FridgeSearch'));
const RecipeDetail = lazy(() => import('./pages/Recipes/Detail'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetail = lazy(() => import('./pages/Blog/Detail'));
const Health = lazy(() => import('./pages/Health'));
const HealthDetail = lazy(() => import('./pages/Health/Detail'));
const Profile = lazy(() => import('./pages/Profile'));
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminLayout = lazy(() => import('./pages/Admin/Layout'));
const DashboardTab = lazy(() => import('./pages/Admin/tabs/DashboardTab'));
const ApprovalsTab = lazy(() => import('./pages/Admin/tabs/ApprovalsTab'));
const UsersTab = lazy(() => import('./pages/Admin/tabs/UsersTab'));
const RecipesTab = lazy(() => import('./pages/Admin/tabs/RecipesTab'));
const BlogsTab = lazy(() => import('./pages/Admin/tabs/BlogsTab'));
const FeedbackTab = lazy(() => import('./pages/Admin/tabs/FeedbackTab'));
const CommentsTab = lazy(() => import('./pages/Admin/tabs/CommentsTab'));
const CategoriesTab = lazy(() => import('./pages/Admin/tabs/CategoriesTab'));

const EASE_PAGE = [0.22, 1, 0.36, 1] as const;

function PageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="w-10 h-10 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-yellow-500 animate-spin" />
    </div>
  );
}

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const reduceMotion = useReducedMotion();

  /* location.key đổi mỗi lần navigate → luôn cuộn về đầu (kể cả bấm lại cùng mục nav) */
  useLayoutEffect(() => {
    scrollWindowToTop();
  }, [location.key, location.pathname]);

  if (isAdminRoute) {
    return (
      <>
        <Toaster position="top-right" />
        <Suspense fallback={<PageFallback />}>
          <Routes location={location}>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<DashboardTab />} />
              <Route path="approvals" element={<ApprovalsTab />} />
              <Route path="users" element={<UsersTab />} />
              <Route path="recipes" element={<RecipesTab />} />
              <Route path="blogs" element={<BlogsTab />} />
              <Route path="comments" element={<CommentsTab />} />
              <Route path="categories" element={<CategoriesTab />} />
              <Route path="feedback" element={<FeedbackTab />} />
            </Route>
          </Routes>
        </Suspense>
      </>
    );
  }

  const enterDur = reduceMotion ? 0.12 : 0.56;
  const exitDur = reduceMotion ? 0.1 : 0.44;

  return (
    <Layout>
      <Toaster position="top-right" />
      {/*
        Grid: mọi trang con cùng ô → chồng lên nhau khi sync.
        Trang mới fade in đè trang cũ → không còn khoảng trống như mode="wait".
      */}
      <div className="grid [&>*]:col-start-1 [&>*]:row-start-1 [&>*]:col-end-2 [&>*]:w-full isolate">
        <AnimatePresence mode="sync" initial={false}>
          <motion.div
            key={location.pathname}
            role="presentation"
            className="motion-page-root"
            initial={
              reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.992 }
            }
            animate={
              reduceMotion
                ? { opacity: 1 }
                : {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: enterDur, ease: EASE_PAGE },
                  }
            }
            exit={
              reduceMotion
                ? { opacity: 0 }
                : {
                    opacity: 0,
                    y: -14,
                    scale: 0.99,
                    transition: { duration: exitDur, ease: EASE_PAGE },
                  }
            }
            style={{
              willChange: reduceMotion ? 'opacity' : 'opacity, transform',
            }}
          >
            <Suspense fallback={<PageFallback />}>
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/fridge" element={<FridgeSearch />} />
                <Route path="/recipes/detail/:id" element={<RecipeDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/detail/:id" element={<BlogDetail />} />
                <Route path="/health" element={<Health />} />
                <Route path="/health/detail/:id" element={<HealthDetail />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>
    </Layout>
  );
}
