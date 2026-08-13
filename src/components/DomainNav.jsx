/**
 * Sticky side navigation over an exam's domains.
 * Highlights the domain currently in view (scroll-spy) and shows
 * which ones the learner has already marked reviewed.
 */
export function DomainNav({ exam, activeId, reviewedIds, onJump }) {
  const done = exam.domains.filter((d) => reviewedIds.has(d.id)).length;
  const total = exam.domains.length;

  return (
    <nav className="side-nav" aria-label="Exam domains">
      <div className="nav-progress">
        <span>
          <b>{done}</b> / {total} domains reviewed
        </span>
        <div
          className="nav-bar"
          role="progressbar"
          aria-valuenow={done}
          aria-valuemin={0}
          aria-valuemax={total}
          aria-label="Domains reviewed"
        >
          <i style={{ width: `${(done / total) * 100}%` }} />
        </div>
      </div>

      <div className="nav-list">
        {exam.domains.map((domain) => {
          const isCurrent = domain.id === activeId;
          const isDone = reviewedIds.has(domain.id);
          return (
            <button
              type="button"
              key={domain.id}
              className={`nav-item${isCurrent ? ' current' : ''}${isDone ? ' done' : ''}`}
              onClick={() => onJump(domain.id)}
              aria-current={isCurrent ? 'true' : undefined}
            >
              <span className="nav-dot" aria-hidden="true">
                {isDone ? '✓' : ''}
              </span>
              <span className="nav-label" title={domain.title}>
                {domain.title}
              </span>
              <span className="nav-wt">{domain.weight}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
