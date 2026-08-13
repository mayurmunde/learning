import { SelfTest } from './SelfTest.jsx';

/**
 * One exam domain: its blueprint objectives, condensed field notes,
 * the high-yield pattern worth memorising, and its self-test questions.
 *
 * Note bodies carry light inline markup (<b>, <i>) from the data modules,
 * which is authored in this repo — not user input.
 */
export function DomainCard({ exam, domain, isReviewed, onToggleReviewed }) {
  return (
    <section className="domain" id={domain.id} aria-labelledby={`${domain.id}-title`}>
      <div className="domain-head">
        <div>
          <span className="domain-tag">Domain {domain.n}</span>
          <h2 id={`${domain.id}-title`}>{domain.title}</h2>
        </div>
        <div className="domain-actions">
          <span className="weight-pill">{domain.weight} of exam</span>
          <button
            type="button"
            className={`mark-btn${isReviewed ? ' on' : ''}`}
            onClick={onToggleReviewed}
            aria-pressed={isReviewed}
          >
            {isReviewed ? 'Reviewed ✓' : 'Mark reviewed'}
          </button>
        </div>
      </div>

      <h3>Blueprint objectives</h3>
      <ul className="obj-list">
        {domain.objectives.map((objective, index) => (
          <li key={index}>{objective}</li>
        ))}
      </ul>

      <h3>Field notes</h3>
      <ul className="notes">
        {domain.notes.map((note, index) => (
          <li key={index} dangerouslySetInnerHTML={{ __html: note }} />
        ))}
      </ul>

      <div className="callout">
        <span className="callout-label">High-yield</span>
        {domain.highYield}
      </div>

      <h3>Self-test</h3>
      {domain.qs.map((question, index) => (
        <SelfTest key={index} question={question} id={`${exam.id}-${domain.id}-q${index}`} />
      ))}
    </section>
  );
}
