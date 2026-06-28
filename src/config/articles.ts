/**
 * Article registry — controls what appears in each section listing and in what order.
 * To publish: add the slug here. To unpublish: remove it. The file can stay in /pages.
 */

// ── Personal ────────────────────────────────────────────────────────────────
// Slugs of /pages/personal/*.md files to show, in display order (newest first).
export const personalSlugs: string[] = [
  'khong-la-cung-khong-dai-tra',
  'surviving-or-living',
  'mot-vai-nguoi-xep',
  'cai-nong',
  'mot-bua-no',
];

// ── Growth ───────────────────────────────────────────────────────────────────
// Growth supports three entry types:
//   post        → reads title/description/date from the .md frontmatter
//   external    → custom link outside the /growth/ folder (talks, slides, etc.)
//   coming-soon → placeholder, not linked

export type GrowthEntry =
  | { type: 'post'; slug: string }
  | { type: 'external'; href: string; title: string; description: string; meta: string }
  | { type: 'coming-soon'; title: string; description: string; meta: string };

export const growthEntries: GrowthEntry[] = [
  {
    type: 'external',
    href: '/talks/scalable-systems.html',
    title: 'Scalable Software Systems',
    description:
      'A story-driven talk following Hope building a social platform from 2003 to now — each act introduces a real pain point, then shows what technology the world invented to solve it.',
    meta: 'Interactive Presentation · System Design · Architecture',
  },
  { type: 'post', slug: 'bad-experiences-job-interview' },
  {
    type: 'coming-soon',
    title: 'Book Notes: Atomic Habits',
    description:
      "My notes and takeaways from James Clear's \"Atomic Habits\" — how small changes compound into remarkable results, and how to build systems that make good habits inevitable.",
    meta: 'Unpublished · Books · Productivity',
  },
  {
    type: 'coming-soon',
    title: 'Review Book: The Joy of Less',
    description:
      'Reflections and key takeaways from a practical minimalism book — on decluttering, simplifying, and focusing on what truly matters in daily life.',
    meta: 'Unpublished · Books · Minimalism',
  },
];
