import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/sitemap.xml', async (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'https://kreasi-cms.com';
  
  const pages = await prisma.page.findMany({
    where: { status: 'PUBLISHED', noIndex: false },
    select: { slug: true, updatedAt: true },
  });
  
  const billboards = await prisma.billboard.findMany({
    where: { status: 'AVAILABLE' },
    select: { slug: true, updatedAt: true },
  });
  
  const urls = [
    ...pages.map(p => ({ loc: `${baseUrl}/${p.slug}`, lastmod: p.updatedAt })),
    ...billboards.map(b => ({ loc: `${baseUrl}/billboard/${b.slug}`, lastmod: b.updatedAt })),
    { loc: `${baseUrl}/`, lastmod: new Date() },
    { loc: `${baseUrl}/blog`, lastmod: new Date() },
    { loc: `${baseUrl}/kontak`, lastmod: new Date() },
  ];
  
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod.toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;
  
  res.setHeader('Content-Type', 'application/xml');
  res.send(xml);
});

router.get('/robots.txt', (req, res) => {
  const baseUrl = process.env.FRONTEND_URL || 'https://kreasi-cms.com';
  res.type('text/plain');
  res.send(`User-agent: *
Allow: /
Sitemap: ${baseUrl}/sitemap.xml`);
});

export default router;
