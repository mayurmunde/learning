import { associateFoundations } from './associate-foundations.js';
import { developerFoundations } from './developer-foundations.js';
import { architectFoundations } from './architect-foundations.js';
import { architectProfessional } from './architect-professional.js';

/** All exams, in pathway order. */
export const EXAMS = [
  associateFoundations,
  developerFoundations,
  architectFoundations,
  architectProfessional,
];

/** Track order and the one-line description shown on each track card. */
export const TRACKS = [
  {
    name: 'Associate',
    blurb: 'Business and productivity users applying Claude day to day.',
  },
  {
    name: 'Developer',
    blurb: 'Engineers building applications, agents, and tools on the API and SDK.',
  },
  {
    name: 'Architect',
    blurb: 'Solution architects designing, integrating, and governing Claude systems.',
  },
];

export function getExam(examId) {
  return EXAMS.find((exam) => exam.id === examId);
}

export function examsForTrack(trackName) {
  return EXAMS.filter((exam) => exam.track === trackName);
}

/** Total self-test questions across an exam's domains. */
export function questionCount(exam) {
  return exam.domains.reduce((total, domain) => total + domain.qs.length, 0);
}

/**
 * Mock-exam length in minutes, scaled from the real exam's
 * item-to-minute ratio so pacing practice stays realistic.
 */
export function mockDurationMinutes(exam) {
  const ratio = exam.minutes / exam.items;
  return Math.max(1, Math.round(questionCount(exam) * ratio));
}
