import prisma from '../../utils/prisma';
import { Setting } from '@prisma/client';

export class SettingRepository {
  async findMany(): Promise<Setting[]> {
    return prisma.setting.findMany();
  }

  async findByGroup(group: string): Promise<Setting[]> {
    return prisma.setting.findMany({
      where: { group },
    });
  }

  async findByKeys(keys: string[]): Promise<Setting[]> {
    return prisma.setting.findMany({
      where: {
        key: { in: keys },
      },
    });
  }

  async findByKey(key: string): Promise<Setting | null> {
    return prisma.setting.findUnique({
      where: { key },
    });
  }

  async upsert(key: string, value: string, group: string): Promise<Setting> {
    return prisma.setting.upsert({
      where: { key },
      update: { value, group },
      create: { key, value, group },
    });
  }

  async upsertMany(settings: { key: string; value: string; group: string }[]): Promise<Setting[]> {
    const promises = settings.map((s) =>
      prisma.setting.upsert({
        where: { key: s.key },
        update: { value: s.value, group: s.group },
        create: { key: s.key, value: s.value, group: s.group },
      })
    );
    return Promise.all(promises);
  }
}
