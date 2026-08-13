import { Link } from 'react-router-dom';

/**
 * Mirrors the shape of the real score report: an overall result plus
 * per-domain correctness, so weak domains are obvious at a glance.
 *
 * The 80% threshold here is a deliberately conservative study proxy —
 * the real exam uses a scaled 100–1000 score that is not a straight
 * percent-correct conversion.
 */
export function ScoreReport({ exam, perDomain, correctCount, totalCount, onRetake }) {
  const percent = Math.round((correctCount / totalCount) * 100);
  const onTrack = percent >= 80;

  return (
    <div className="results">
      <div className="score-row">
        <span className="score">{percent}%</span>
        <span className={`verdict ${onTrack ? 'pass' : 'fail'}`}>
          {onTrack ? 'On track' : 'Below target'}
        </span>
      </div>

      <p className="note">
        {correctCount} of {totalCount} correct. This self-test uses an 80% threshold as a study
        proxy with headroom above the real cut score — the actual exam is scored on a scaled
        100–1000 range (pass at {exam.passScore}) that isn&apos;t a straight percent-correct
        conversion. Review any domain below ~75% here before scheduling the real exam.
      </p>

      <div className="results-table-wrap">
        <table>
          <thead>
            <tr>
              <th scope="col">Domain</th>
              <th scope="col">Correct</th>
              <th scope="col">Coverage</th>
            </tr>
          </thead>
          <tbody>
            {exam.domains.map((domain) => {
              const stat = perDomain[domain.id];
              const pct = stat.total ? Math.round((stat.correct / stat.total) * 100) : 0;
              return (
                <tr key={domain.id}>
                  <td>
                    D{domain.n} &middot; {domain.title}
                  </td>
                  <td className="num">
                    {stat.correct}/{stat.total}
                  </td>
                  <td className="bar-cell">
                    <div
                      className="mini-bar"
                      role="img"
                      aria-label={`${pct}% correct in ${domain.title}`}
                    >
                      <i style={{ width: `${pct}%` }} />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="results-actions">
        <button type="button" className="btn-primary" onClick={onRetake}>
          Retake exam
        </button>
        <Link className="btn-ghost" to={`/exam/${exam.id}`}>
          Back to notes
        </Link>
      </div>
    </div>
  );
}
