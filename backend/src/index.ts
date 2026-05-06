import app from './app';

const PORT = parseInt(process.env.PORT || '3001', 10);

app.listen(PORT, () => {
  console.log(`
  ✅ Backend running on http://localhost:${PORT}
  📊 Prisma Studio: run "npx prisma studio"
  🔗 Health check: http://localhost:${PORT}/api/health
  `);
});
