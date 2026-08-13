import { useCallback, useEffect, useState } from 'react';

/**
 * State that survives a reload by mirroring into localStorage.
 * Falls back to in-memory state if storage is unavailable (private mode, etc.).
 */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored === null ? initialValue : JSON.parse(stored);
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Storage full or blocked — keep working from memory.
    }
  }, [key, value]);

  return [value, setValue];
}

/**
 * Tracks which domains the learner has marked reviewed.
 * Keys are namespaced per exam so switching tracks never mixes progress.
 */
export function useReviewProgress() {
  const [reviewed, setReviewed] = useLocalStorage('claude-cert-reviewed', {});

  const isReviewed = useCallback(
    (examId, domainId) => Boolean(reviewed[`${examId}:${domainId}`]),
    [reviewed],
  );

  const toggleReviewed = useCallback(
    (examId, domainId) => {
      const key = `${examId}:${domainId}`;
      setReviewed((prev) => {
        const next = { ...prev };
        if (next[key]) {
          delete next[key];
        } else {
          next[key] = true;
        }
        return next;
      });
    },
    [setReviewed],
  );

  const reviewedCount = useCallback(
    (exam) => exam.domains.filter((domain) => reviewed[`${exam.id}:${domain.id}`]).length,
    [reviewed],
  );

  return { isReviewed, toggleReviewed, reviewedCount };
}

/** Best mock-exam score per exam, as a percentage. */
export function useBestScores() {
  const [scores, setScores] = useLocalStorage('claude-cert-best-scores', {});

  const recordScore = useCallback(
    (examId, percent) => {
      setScores((prev) => {
        if ((prev[examId] ?? 0) >= percent) return prev;
        return { ...prev, [examId]: percent };
      });
    },
    [setScores],
  );

  return { scores, recordScore };
}
