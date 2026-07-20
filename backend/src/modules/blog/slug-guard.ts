export const ensureUniqueSlug = async (
  getExisting: () => Promise<{ id: number } | null>,
  id: number | null,
  slug: string,
  conflictMessage: string,
) => {
  const existing = await getExisting();
  if (existing && existing.id !== id) {
    throw new Error(conflictMessage);
  }
};
