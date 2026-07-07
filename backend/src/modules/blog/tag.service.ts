import { TagRepository } from './tag.repository';

export class TagService {
  private tagRepository: TagRepository;

  constructor() {
    this.tagRepository = new TagRepository();
  }

  async createTag(data: { name: string; slug: string }) {
    const existing = await this.tagRepository.findBySlug(data.slug);
    if (existing) throw new Error('Tag with this slug already exists');
    return this.tagRepository.create(data);
  }

  async getAllTags() {
    return this.tagRepository.findAll();
  }

  async getTagById(id: number) {
    const tag = await this.tagRepository.findById(id);
    if (!tag) throw new Error('Tag not found');
    return tag;
  }

  async updateTag(id: number, data: { name?: string; slug?: string }) {
    if (data.slug) {
      const existing = await this.tagRepository.findBySlug(data.slug);
      if (existing && existing.id !== id) {
        throw new Error('Tag with this slug already exists');
      }
    }
    return this.tagRepository.update(id, data);
  }

  async deleteTag(id: number) {
    return this.tagRepository.delete(id);
  }
}
