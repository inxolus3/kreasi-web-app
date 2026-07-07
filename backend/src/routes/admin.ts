import { Router, Request, Response } from 'express';
import prisma from '../utils/prisma';
import { authenticate } from '../middlewares/auth.middleware';
import { authorize } from '../middlewares/role.middleware';
import { logger } from '../utils/logger';

const router = Router();

// GET /api/v1/admin/export — Export all data as JSON
// Protected: admin only
router.get('/export', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  try {
    const data = {
      billboards: await prisma.billboard.findMany(),
      users: await prisma.user.findMany(),
      pages: await prisma.page.findMany({
        include: {
          sections: {
            include: {
              blocks: true,
            },
          },
        },
      }),
      settings: await prisma.setting.findMany(),
      categories: await prisma.category.findMany(),
      tags: await prisma.tag.findMany(),
      posts: await prisma.post.findMany(),
      globalComponents: await prisma.globalComponent.findMany(),
      themeSettings: await prisma.themeSetting.findMany(),
      exportedAt: new Date().toISOString(),
    };

    res.setHeader('Content-Disposition', 'attachment; filename=export.json');
    res.json({ status: 'success', data });
  } catch (error: any) {
    logger.error({ error }, 'Emergency data export failed');
    res.status(500).json({ status: 'error', message: 'Export failed: ' + error.message });
  }
});

// POST /api/v1/admin/import — Import data from JSON
// Protected: admin only
router.post('/import', authenticate, authorize(['ADMIN']), async (req: Request, res: Response) => {
  const { data } = req.body;
  if (!data) {
    res.status(400).json({ status: 'fail', message: 'No data provided for import' });
    return;
  }

  try {
    await prisma.$transaction(async (tx) => {
      // Clear tables in dependency order
      await tx.pageBlock.deleteMany();
      await tx.pageSection.deleteMany();
      await tx.pageVersion.deleteMany();
      await tx.page.deleteMany();
      await tx.post.deleteMany();
      await tx.category.deleteMany();
      await tx.tag.deleteMany();
      await tx.billboard.deleteMany();
      await tx.setting.deleteMany();
      await tx.globalComponent.deleteMany();
      await tx.themeSetting.deleteMany();

      // Upsert users (keep original to prevent lockout, but restore any others)
      if (data.users && Array.isArray(data.users)) {
        for (const user of data.users) {
          await tx.user.upsert({
            where: { email: user.email },
            update: {
              name: user.name,
              password: user.password,
              role: user.role,
              refreshToken: user.refreshToken,
            },
            create: {
              id: user.id,
              email: user.email,
              name: user.name,
              password: user.password,
              role: user.role,
            },
          });
        }
      }

      // Categories
      if (data.categories && Array.isArray(data.categories)) {
        for (const cat of data.categories) {
          await tx.category.create({ data: { id: cat.id, name: cat.name, slug: cat.slug } });
        }
      }

      // Tags
      if (data.tags && Array.isArray(data.tags)) {
        for (const tag of data.tags) {
          await tx.tag.create({ data: { id: tag.id, name: tag.name, slug: tag.slug } });
        }
      }

      // Posts
      if (data.posts && Array.isArray(data.posts)) {
        for (const post of data.posts) {
          await tx.post.create({
            data: {
              id: post.id,
              title: post.title,
              slug: post.slug,
              content: post.content,
              thumbnail: post.thumbnail,
              gallery: post.gallery,
              metaTitle: post.metaTitle,
              metaDescription: post.metaDescription,
              status: post.status,
              featured: post.featured,
              authorId: post.authorId,
              categoryId: post.categoryId,
            },
          });
        }
      }

      // Billboards
      if (data.billboards && Array.isArray(data.billboards)) {
        for (const b of data.billboards) {
          await tx.billboard.create({ data: b });
        }
      }

      // Settings
      if (data.settings && Array.isArray(data.settings)) {
        for (const s of data.settings) {
          await tx.setting.create({ data: { id: s.id, key: s.key, value: s.value, group: s.group } });
        }
      }

      // Global Components
      if (data.globalComponents && Array.isArray(data.globalComponents)) {
        for (const gc of data.globalComponents) {
          await tx.globalComponent.create({ data: gc });
        }
      }

      // Theme Settings
      if (data.themeSettings && Array.isArray(data.themeSettings)) {
        for (const ts of data.themeSettings) {
          await tx.themeSetting.create({ data: { id: ts.id, key: ts.key, value: ts.value } });
        }
      }

      // Pages, Sections, Blocks
      if (data.pages && Array.isArray(data.pages)) {
        for (const p of data.pages) {
          const pageRecord = await tx.page.create({
            data: {
              id: p.id,
              title: p.title,
              slug: p.slug,
              status: p.status,
              metaTitle: p.metaTitle,
              metaDescription: p.metaDescription,
              metaKeywords: p.metaKeywords,
              ogTitle: p.ogTitle,
              ogDescription: p.ogDescription,
              ogImage: p.ogImage,
              canonicalUrl: p.canonicalUrl,
              noIndex: p.noIndex,
              structuredData: p.structuredData,
              featuredImage: p.featuredImage,
              authorId: p.authorId,
              publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
            },
          });

          if (p.sections && Array.isArray(p.sections)) {
            for (const sec of p.sections) {
              const secRecord = await tx.pageSection.create({
                data: {
                  id: sec.id,
                  pageId: pageRecord.id,
                  order: sec.order,
                  type: sec.type,
                  props: sec.props,
                  styles: sec.styles,
                },
              });

              if (sec.blocks && Array.isArray(sec.blocks)) {
                for (const blk of sec.blocks) {
                  await tx.pageBlock.create({
                    data: {
                      id: blk.id,
                      sectionId: secRecord.id,
                      parentId: blk.parentId,
                      order: blk.order,
                      type: blk.type,
                      props: blk.props,
                      styles: blk.styles,
                    },
                  });
                }
              }
            }
          }
        }
      }
    });

    res.json({ status: 'success', message: 'Database state restored successfully' });
  } catch (error: any) {
    logger.error({ error }, 'Emergency data import failed');
    res.status(500).json({ status: 'error', message: 'Data import failed: ' + error.message });
  }
});

export default router;
