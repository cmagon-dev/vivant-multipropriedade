export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export async function ensureUniqueSlug(
  baseSlug: string,
  model: "property" | "destination",
  excludeId?: string
): Promise<string> {
  const prisma = (await import("@/lib/prisma")).prisma;
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    let existing: { id: string } | null = null;
    
    if (model === "property") {
      existing = await prisma.property.findUnique({
        where: { slug },
        select: { id: true }
      });
    } else {
      existing = await prisma.destination.findUnique({
        where: { slug },
        select: { id: true }
      });
    }
    
    if (!existing || existing.id === excludeId) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
}
