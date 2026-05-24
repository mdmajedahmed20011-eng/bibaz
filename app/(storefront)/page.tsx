import { prisma } from "@/lib/db";
import { HomeClient } from "./home-client";

// Ensure this page fetches dynamically or relies on server actions' revalidatePath
export const dynamic = "force-dynamic";

export default async function HomePage() {
  // Fetch only active sections, ordered by admin's drag-and-drop sortOrder
  const sections = await prisma.homepageSection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  // Since Next.js requires plain objects to cross the Server->Client boundary,
  // we do a simple serialization mapping (though Prisma objects are usually fine, Decimals can cause issues if any).
  // Currently, HomepageSection only has Strings, Ints, Booleans, and JSON content.
  const serializedSections = sections.map((s) => ({
    id: s.id,
    type: s.type,
    title: s.title,
    subtitle: s.subtitle,
    content: s.content,
    sortOrder: s.sortOrder,
    isActive: s.isActive,
  }));

  return <HomeClient dbSections={serializedSections} />;
}
