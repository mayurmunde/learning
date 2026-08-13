import { useEffect, useState } from 'react';

/**
 * Reports which section is currently in view so the side nav can
 * highlight it as the reader scrolls.
 *
 * Uses IntersectionObserver with a top offset matching the sticky
 * header, and picks the topmost visible section when several overlap.
 */
export function useScrollSpy(sectionIds, { offset = 90 } = {}) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? null);

  useEffect(() => {
    if (!sectionIds.length) return undefined;

    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (!elements.length) return undefined;

    const visible = new Map();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          visible.set(entry.target.id, entry.isIntersecting);
        });

        // Prefer the first section that is currently intersecting.
        const firstVisible = sectionIds.find((id) => visible.get(id));
        if (firstVisible) {
          setActiveId(firstVisible);
          return;
        }

        // Nothing intersecting (e.g. mid-gap): fall back to the last
        // section whose top has scrolled above the header line.
        const scrolledPast = elements
          .filter((el) => el.getBoundingClientRect().top < offset)
          .pop();
        if (scrolledPast) setActiveId(scrolledPast.id);
      },
      {
        rootMargin: `-${offset}px 0px -55% 0px`,
        threshold: 0,
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [sectionIds, offset]);

  return activeId;
}
