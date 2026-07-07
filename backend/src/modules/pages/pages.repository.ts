import prisma from '../../utils/prisma';
import { Prisma, Page, PageVersion, PageTemplate, GlobalComponent, ThemeSetting } from '@prisma/client';

export class PagesRepository {
  // Page CRUD
  async createPage(data: Prisma.PageCreateInput): Promise<Page> {
    return prisma.page.create({
      data,
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async findPages(params: {
    skip?: number;
    take?: number;
    where?: Prisma.PageWhereInput;
    orderBy?: Prisma.PageOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;
    return prisma.page.findMany({
      skip,
      take,
      where,
      orderBy,
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    });
  }

  async countPages(where?: Prisma.PageWhereInput): Promise<number> {
    return prisma.page.count({ where });
  }

  async findPageById(id: number) {
    return prisma.page.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            blocks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  async findPageBySlug(slug: string) {
    return prisma.page.findUnique({
      where: { slug },
      include: {
        author: { select: { id: true, name: true, email: true } },
        sections: {
          orderBy: { order: 'asc' },
          include: {
            blocks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  async updatePage(id: number, data: Prisma.PageUpdateInput): Promise<Page> {
    return prisma.page.update({
      where: { id },
      data,
    });
  }

  async deletePage(id: number): Promise<Page> {
    return prisma.page.delete({
      where: { id },
    });
  }

  // Builder (Save sections and nested blocks)
  async savePageBuilder(
    pageId: number,
    sectionsData: Array<{
      order: number;
      type: string;
      props: string;
      styles: string;
      blocks: Array<{
        id: string;
        parentId: string | null;
        order: number;
        type: string;
        props: string;
        styles: string;
      }>;
    }>
  ) {
    // We execute inside a transaction to ensure atomic update of sections and blocks
    return prisma.$transaction(async (tx) => {
      // 1. Delete all existing sections and blocks of the page to rebuild them
      const existingSections = await tx.pageSection.findMany({
        where: { pageId },
        select: { id: true },
      });
      const sectionIds = existingSections.map((s) => s.id);

      await tx.pageBlock.deleteMany({
        where: { sectionId: { in: sectionIds } },
      });

      await tx.pageSection.deleteMany({
        where: { pageId },
      });

      // 2. Insert new sections and their blocks
      for (const sec of sectionsData) {
        const createdSection = await tx.pageSection.create({
          data: {
            pageId,
            order: sec.order,
            type: sec.type,
            props: sec.props,
            styles: sec.styles,
          },
        });

        // Insert blocks flat but containing parentId so they form a tree on the frontend/service layer
        if (sec.blocks && sec.blocks.length > 0) {
          // Sort blocks to guarantee that parents are created before children (though Prisma relaxed string primary key allow insert)
          // Actually, we can insert blocks. To be safe with parent-child foreign key constraints, we can create them in batches:
          // Batch 1: Root blocks (parentId is null)
          // Batch 2+: Nested blocks level by level, or simply deferred creation of relationships.
          // Since parentId is PageBlock.id, and parentId references a block in the same section,
          // let's do recursive or level-by-level insertion to respect the self-referencing foreign key constraint.
          
          const rootBlocks = sec.blocks.filter((b) => !b.parentId);
          const childBlocks = sec.blocks.filter((b) => b.parentId);

          // Create roots
          for (const rb of rootBlocks) {
            await tx.pageBlock.create({
              data: {
                id: rb.id,
                sectionId: createdSection.id,
                parentId: null,
                order: rb.order,
                type: rb.type,
                props: rb.props,
                styles: rb.styles,
              },
            });
          }

          // Create children iteratively. Since child levels could be deep, we insert them.
          // Since child parentIds are generated on the client, they will be present in either rootBlocks or previous child layers.
          // We can repeatedly scan and insert child blocks whose parent already exists in DB.
          let attempts = 0;
          let remaining = [...childBlocks];
          const createdBlockIds = new Set(rootBlocks.map(b => b.id));

          while (remaining.length > 0 && attempts < 10) {
            const nextBatch: typeof remaining = [];
            const toInsert: typeof remaining = [];

            for (const b of remaining) {
              if (b.parentId && createdBlockIds.has(b.parentId)) {
                toInsert.push(b);
              } else {
                nextBatch.push(b);
              }
            }

            for (const b of toInsert) {
              await tx.pageBlock.create({
                data: {
                  id: b.id,
                  sectionId: createdSection.id,
                  parentId: b.parentId,
                  order: b.order,
                  type: b.type,
                  props: b.props,
                  styles: b.styles,
                },
              });
              createdBlockIds.add(b.id);
            }

            remaining = nextBatch;
            attempts++;
          }

          // If any remain due to deep nesting or client-side integrity mismatch, insert them as roots to prevent failing
          for (const b of remaining) {
            await tx.pageBlock.create({
              data: {
                id: b.id,
                sectionId: createdSection.id,
                parentId: null,
                order: b.order,
                type: b.type,
                props: b.props,
                styles: b.styles,
              },
            });
          }
        }
      }

      // Return updated page with sections/blocks
      return tx.page.findUnique({
        where: { id: pageId },
        include: {
          sections: {
            orderBy: { order: 'asc' },
            include: {
              blocks: {
                orderBy: { order: 'asc' },
              },
            },
          },
        },
      });
    });
  }

  // Version Control
  async createVersion(pageId: number, version: number, data: string): Promise<PageVersion> {
    return prisma.pageVersion.create({
      data: {
        pageId,
        version,
        data,
      },
    });
  }

  async findVersions(pageId: number): Promise<PageVersion[]> {
    return prisma.pageVersion.findMany({
      where: { pageId },
      orderBy: { version: 'desc' },
    });
  }

  async findLatestVersion(pageId: number): Promise<PageVersion | null> {
    return prisma.pageVersion.findFirst({
      where: { pageId },
      orderBy: { version: 'desc' },
    });
  }

  async findVersionById(id: number): Promise<PageVersion | null> {
    return prisma.pageVersion.findUnique({
      where: { id },
    });
  }

  // Templates
  async createTemplate(data: Prisma.PageTemplateCreateInput): Promise<PageTemplate> {
    return prisma.pageTemplate.create({
      data,
    });
  }

  async findTemplates(): Promise<PageTemplate[]> {
    return prisma.pageTemplate.findMany({
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            blocks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  async findTemplateById(id: number) {
    return prisma.pageTemplate.findUnique({
      where: { id },
      include: {
        sections: {
          orderBy: { order: 'asc' },
          include: {
            blocks: {
              orderBy: { order: 'asc' },
            },
          },
        },
      },
    });
  }

  // Global Components
  async createGlobalComponent(data: Prisma.GlobalComponentCreateInput): Promise<GlobalComponent> {
    return prisma.globalComponent.create({
      data,
    });
  }

  async findGlobalComponents(): Promise<GlobalComponent[]> {
    return prisma.globalComponent.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async updateGlobalComponent(id: number, data: Prisma.GlobalComponentUpdateInput): Promise<GlobalComponent> {
    return prisma.globalComponent.update({
      where: { id },
      data,
    });
  }

  async deleteGlobalComponent(id: number): Promise<GlobalComponent> {
    return prisma.globalComponent.delete({
      where: { id },
    });
  }

  // Theme Settings
  async upsertThemeSetting(key: string, value: string): Promise<ThemeSetting> {
    return prisma.themeSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }

  async findThemeSettings(): Promise<ThemeSetting[]> {
    return prisma.themeSetting.findMany();
  }

  async findThemeSettingByKey(key: string): Promise<ThemeSetting | null> {
    return prisma.themeSetting.findUnique({
      where: { key },
    });
  }
}
