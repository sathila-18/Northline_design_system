/** One entry in the visible page list: a page number or a gap. */
export type NlPaginationEntry = { kind: 'page'; page: number } | { kind: 'ellipsis'; key: 'start' | 'end' };

/**
 * The visible pages (DESIGN.md §9, NlPagination): always the first and last page, the current page and `siblingCount`
 * pages either side. Any other run becomes one "…", except a run of a single page, which is shown instead, and every
 * page shows when there are no more than siblingCount × 2 + 5 (OD-182).
 * `page` is clamped to 1…pageCount (OD-183).
 */
export function paginationEntries(page: number, pageCount: number, siblingCount: number): NlPaginationEntry[] {
  const count = Math.max(1, Math.floor(pageCount));
  const current = Math.min(Math.max(1, Math.floor(page)), count);
  const siblings = Math.max(0, Math.floor(siblingCount));
  // Gaps only pay off when the list is longer than the slots the gapped layout takes anyway: first, last, current,
  // the siblings and two gaps. Up to that, every page shows (OD-182).
  if (count <= siblings * 2 + 5) {
    return Array.from({ length: count }, (_, index) => ({ kind: 'page' as const, page: index + 1 }));
  }

  const start = Math.max(2, current - siblings);
  const end = Math.min(count - 1, current + siblings);
  const entries: NlPaginationEntry[] = [{ kind: 'page', page: 1 }];

  if (start === 3) entries.push({ kind: 'page', page: 2 });
  else if (start > 3) entries.push({ kind: 'ellipsis', key: 'start' });

  for (let number = start; number <= end; number += 1) entries.push({ kind: 'page', page: number });

  if (end === count - 2) entries.push({ kind: 'page', page: count - 1 });
  else if (end < count - 2) entries.push({ kind: 'ellipsis', key: 'end' });

  entries.push({ kind: 'page', page: count });
  return entries;
}
