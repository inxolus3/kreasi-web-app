import { CategoryRepository } from './category.repository';

export class CategoryService {
  private categoryRepository: CategoryRepository;

  constructor() {
    this.categoryRepository = new CategoryRepository();
  }

  async createCategory(data: { name: string; slug: string }) {
    const existing = await this.categoryRepository.findBySlug(data.slug);
    if (existing) throw new Error('Category with this slug already exists');
    return this.categoryRepository.create(data);
  }

  async getAllCategories() {
    return this.categoryRepository.findAll();
  }

  async getCategoryById(id: number) {
    const category = await this.categoryRepository.findById(id);
    if (!category) throw new Error('Category not found');
    return category;
  }

  async updateCategory(id: number, data: { name?: string; slug?: string }) {
    if (data.slug) {
      const existing = await this.categoryRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) {
        throw new Error('Category with this slug already exists');
      }
    }
    return this.categoryRepository.update(id, data);
  }

  async deleteCategory(id: number) {
    return this.categoryRepository.delete(id);
  }
}
