import { useCallback, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getExam } from '../data/index.js';
import { useBestScores, useReviewProgress } from '../hooks/useLocalStorage.js';
import { useScrollSpy } from '../hooks/useScrollSpy.js';
import { PathwayNav } from '../components/PathwayNav.jsx';
import { ExamSummary } from '../components/ExamSummary.jsx';
import { DomainNav } from '../components/DomainNav.jsx';
import { DomainCard } from '../components/DomainCard.jsx';
import { BackToTop } from '../components/BackToTop.jsx';

export function ExamPage() {
  const { examId } = useParams();
  const exam = getExam(examId);

  const { isReviewed, toggleReviewed, reviewedCount } = useReviewProgress();
  const { scores } = useBestScores();

  const domainIds = useMemo(() => (exam ? exam.domains.map((d) => d.id) : []), [exam]);
  const activeDomainId = useScrollSpy(domainIds);

  const reviewedIds = useMemo(() => {
    if (!exam) return new Set();
    return new Set(exam.domains.filter((d) => isReviewed(exam.id, d.id)).map((d) => d.id));
  }, [exam, isReviewed]);

  const jumpToDomain = useCallback((domainId) => {
    const target = document.getElementById(domainId);
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  if (!exam) {
    return (
      <div className="wrap" style={{ padding: '60px 24px' }}>
        <p>That exam doesn&apos;t exist.</p>
        <Link className="btn-ghost" to="/">
          Back to start
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="hero">
        <div className="wrap">
          <span className="eyebrow">
            Independent study companion &middot; Not an official Anthropic product
          </span>
          <h1>{exam.name}</h1>
          <p className="hero-sub">
            Condensed, original prep notes mapped to the official {exam.code} blueprint — organized
            by the domains this exam actually scores, plus a timed mock exam built from the same
            question bank.
          </p>

          <PathwayNav currentExamId={exam.id} reviewedCount={reviewedCount} />
        </div>
      </section>

      <div className="wrap" style={{ paddingTop: 28 }}>
        <ExamSummary exam={exam} bestScore={scores[exam.id]} />
      </div>

      <div className="wrap layout">
        <DomainNav
          exam={exam}
          activeId={activeDomainId}
          reviewedIds={reviewedIds}
          onJump={jumpToDomain}
        />

        <main className="domain-stack" id="content">
          {exam.domains.map((domain) => (
            <DomainCard
              key={domain.id}
              exam={exam}
              domain={domain}
              isReviewed={reviewedIds.has(domain.id)}
              onToggleReviewed={() => toggleReviewed(exam.id, domain.id)}
            />
          ))}
        </main>
      </div>

      <BackToTop />
    </>
  );
}
