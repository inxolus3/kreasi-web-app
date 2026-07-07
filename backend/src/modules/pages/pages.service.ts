import { PagesRepository } from './pages.repository';
import { PageStatus, Prisma } from '@prisma/client';

export class PagesService {
  private pagesRepo = new PagesRepository();

  async createPage(title: string, slug: string, authorId: number, options?: Partial<Prisma.PageCreateInput>) {
    const formattedSlug = slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
    
    // Check if slug is unique
    const existing = await this.pagesRepo.findPageBySlug(formattedSlug);
    if (existing) {
      throw new Error(`A page with slug '${formattedSlug}' already exists.`);
    }

    return this.pagesRepo.createPage({
      title,
      slug: formattedSlug,
      status: PageStatus.DRAFT,
      author: { connect: { id: authorId } },
      metaTitle: options?.metaTitle || title,
      metaDescription: options?.metaDescription || '',
      featuredImage: options?.featuredImage || '',
    });
  }

  async getPages(params: { skip?: number; take?: number; search?: string; status?: PageStatus }) {
    const where: Prisma.PageWhereInput = {};

    if (params.search) {
      where.OR = [
        { title: { contains: params.search, mode: 'insensitive' } },
        { slug: { contains: params.search, mode: 'insensitive' } },
      ];
    }

    if (params.status) {
      where.status = params.status;
    }

    const pages = await this.pagesRepo.findPages({
      skip: params.skip,
      take: params.take,
      where,
      orderBy: { updatedAt: 'desc' },
    });

    const total = await this.pagesRepo.countPages(where);

    return { pages, total };
  }

  async getPageById(id: number) {
    const page = await this.pagesRepo.findPageById(id);
    if (!page) {
      throw new Error('Page not found');
    }
    return page;
  }

  async getPageBySlug(slug: string) {
    const page = await this.pagesRepo.findPageBySlug(slug);
    if (!page) {
      throw new Error('Page not found');
    }
    return page;
  }

  async updatePage(id: number, data: Partial<Prisma.PageUpdateInput>) {
    // If slug is updated, check uniqueness
    if (data.slug && typeof data.slug === 'string') {
      const formattedSlug = data.slug.toLowerCase().trim().replace(/[^a-z0-9-_]/g, '-');
      const existing = await this.pagesRepo.findPageBySlug(formattedSlug);
      if (existing && existing.id !== id) {
        throw new Error(`A page with slug '${formattedSlug}' already exists.`);
      }
      data.slug = formattedSlug;
    }

    return this.pagesRepo.updatePage(id, data);
  }

  async deletePage(id: number) {
    return this.pagesRepo.deletePage(id);
  }

  // Builder Core
  async saveBuilder(
    id: number,
    sectionsData: Array<{
      order: number;
      type: string;
      props: any;
      styles: any;
      blocks: Array<{
        id: string;
        parentId: string | null;
        order: number;
        type: string;
        props: any;
        styles: any;
      }>;
    }>
  ) {
    // Standardize input into stringified JSON database properties
    const dbSections = sectionsData.map((sec) => ({
      order: sec.order,
      type: sec.type,
      props: typeof sec.props === 'string' ? sec.props : JSON.stringify(sec.props || {}),
      styles: typeof sec.styles === 'string' ? sec.styles : JSON.stringify(sec.styles || {}),
      blocks: (sec.blocks || []).map((b) => ({
        id: b.id,
        parentId: b.parentId,
        order: b.order,
        type: b.type,
        props: typeof b.props === 'string' ? b.props : JSON.stringify(b.props || {}),
        styles: typeof b.styles === 'string' ? b.styles : JSON.stringify(b.styles || {}),
      })),
    }));

    // Save
    const page = await this.pagesRepo.savePageBuilder(id, dbSections);
    return page;
  }

  // Publish workflow
  async publishPage(id: number) {
    const page = await this.pagesRepo.findPageById(id);
    if (!page) {
      throw new Error('Page not found');
    }

    return this.pagesRepo.updatePage(id, {
      status: PageStatus.PUBLISHED,
      publishedAt: new Date(),
    });
  }

  // Autosave & Version History Control
  async autosave(
    id: number,
    sectionsData: Array<{
      order: number;
      type: string;
      props: any;
      styles: any;
      blocks: Array<{
        id: string;
        parentId: string | null;
        order: number;
        type: string;
        props: any;
        styles: any;
      }>;
    }>
  ) {
    // 1. Save latest state
    const page = await this.saveBuilder(id, sectionsData);

    // 2. Increment version number from latest save or default to 1
    const latestVersion = await this.pagesRepo.findLatestVersion(id);
    const nextVer = (latestVersion?.version || 0) + 1;

    // 3. Serialized full snapshot JSON
    const snapshot = JSON.stringify(sectionsData);

    // Create PageVersion record
    await this.pagesRepo.createVersion(id, nextVer, snapshot);

    return { page, version: nextVer };
  }

  async getVersions(pageId: number) {
    return this.pagesRepo.findVersions(pageId);
  }

  async restoreVersion(pageId: number, versionId: number) {
    const pageVersion = await this.pagesRepo.findVersionById(versionId);
    if (!pageVersion || pageVersion.pageId !== pageId) {
      throw new Error('Version snapshot not found');
    }

    const sectionsData = JSON.parse(pageVersion.data);
    
    // Save state back to builder
    const updatedPage = await this.saveBuilder(pageId, sectionsData);
    
    // Update page title/status or let client control it
    return updatedPage;
  }

  // Seeding / Managing Templates
  async getTemplates() {
    const templates = await this.pagesRepo.findTemplates();
    if (templates.length === 0) {
      // Seed default layouts if empty
      await this.seedDefaultTemplates();
      return this.pagesRepo.findTemplates();
    }
    return templates;
  }

  async getTemplateById(id: number) {
    const template = await this.pagesRepo.findTemplateById(id);
    if (!template) {
      throw new Error('Template not found');
    }
    return template;
  }

  private async seedDefaultTemplates() {
    // Default page templates definition (Landing, Profile, About, Services, Pricing, Contact, Blog, Portfolio)
    const defaults = [
      {
        name: 'Landing Page',
        slug: 'landing-page',
        description: 'Modern enterprise hero section, client logos, dynamic features grid, testimonials and dynamic call-to-action.',
      },
      {
        name: 'Company Profile',
        slug: 'company-profile',
        description: 'Professional header, corporate mission statement, accordion core values, elegant FAQ block.',
      },
      {
        name: 'About',
        slug: 'about-us',
        description: 'Creative about us block with team profiles, values, and full width video block background.',
      },
      {
        name: 'Services',
        slug: 'services',
        description: 'Multi-column services lists, rich feature displays, custom cards with icons and individual service CTA buttons.',
      },
      {
        name: 'Pricing',
        slug: 'pricing',
        description: 'Enterprise tiered pricing matrices with pricing grids, detailed list of features and testimonial carousel.',
      },
      {
        name: 'Contact',
        slug: 'contact-us',
        description: 'Full width Google Map container, integrated rich contact form, and corporate address columns.',
      },
      {
        name: 'Blog',
        slug: 'blog',
        description: 'Clean layout displaying featured posts, multiple text paragraphs, grid gallery, and subscription CTA.',
      },
      {
        name: 'Portfolio',
        slug: 'portfolio',
        description: 'Showcase grid highlighting products or case studies with responsive gallery items and embed slides.',
      },
    ];

    for (const d of defaults) {
      try {
        await this.pagesRepo.createTemplate({
          name: d.name,
          slug: d.slug,
          description: d.description,
        });
      } catch (e) {
        console.error(`Failed to seed template ${d.name}:`, e);
      }
    }
  }

  // Global Components CRUD
  async createGlobalComponent(name: string, type: string, props: any, styles: any) {
    return this.pagesRepo.createGlobalComponent({
      name,
      type,
      props: JSON.stringify(props || {}),
      styles: JSON.stringify(styles || {}),
    });
  }

  async getGlobalComponents() {
    return this.pagesRepo.findGlobalComponents();
  }

  async updateGlobalComponent(id: number, name?: string, props?: any, styles?: any) {
    const data: Prisma.GlobalComponentUpdateInput = {};
    if (name) data.name = name;
    if (props) data.props = JSON.stringify(props);
    if (styles) data.styles = JSON.stringify(styles);
    return this.pagesRepo.updateGlobalComponent(id, data);
  }

  async deleteGlobalComponent(id: number) {
    return this.pagesRepo.deleteGlobalComponent(id);
  }

  // Theme Settings core
  async updateThemeSettings(key: string, value: any) {
    return this.pagesRepo.upsertThemeSetting(key, JSON.stringify(value));
  }

  async getThemeSettings() {
    const settings = await this.pagesRepo.findThemeSettings();
    const result: Record<string, any> = {};
    for (const s of settings) {
      try {
        result[s.key] = JSON.parse(s.value);
      } catch {
        result[s.key] = s.value;
      }
    }
    return result;
  }
}
