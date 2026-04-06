import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import bodyParser from 'koa-bodyparser';
import { initDatabase } from './database/init.js';
import authRoutes from './routes/auth.js';
import dashboardRoutes from './routes/dashboard.js';
import courseRoutes from './routes/courses.js';
import studentRoutes from './routes/students.js';
import summaryRoutes from './routes/summary.js';
import staticRoutes from './routes/static.js';
import path from 'path';
import serve from 'koa-static';
import { fileURLToPath } from 'url';
import fs from 'fs';

const app = new Koa();
const router = new Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔥 🔥 🔥 最重要：这里写对 dist 路径 🔥 🔥 🔥
const distPath = path.resolve(__dirname, '../../client/dist');

initDatabase();

app.use(cors({ credentials: true }));
app.use(bodyParser());

// 托管静态资源
app.use(serve(distPath));

// 前端路由 fallback（必须）
app.use(async (ctx, next) => {
  await next();
  if (ctx.status === 404 && !ctx.path.startsWith('/api')) {
    try {
      ctx.type = 'html';
      ctx.body = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
    } catch (e) {
      ctx.body = "前端dist未找到，请检查目录";
    }
  }
});

// 错误处理
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    const status = err.status || 500;
    ctx.status = status;
    ctx.body = { code: status, msg: err.message || '服务器错误', data: null };
  }
});

// 接口
router.use('/api/auth', authRoutes.routes());
router.use('/api/dashboard', dashboardRoutes.routes());
router.use('/api/courses', courseRoutes.routes());
router.use('/api/students', studentRoutes.routes());
router.use('/api/summary', summaryRoutes.routes());
router.use('/api/static', staticRoutes.routes());

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`服务已启动：http://localhost:${PORT}`);
  console.log(`前端dist路径：`, distPath);
});