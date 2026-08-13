import { Link } from 'react-router-dom';
import { mockDurationMinutes, questionCount } from '../data/index.js';

function StatStrip({ exam }) {
  const stats = [
    { n: exam.items, l: 'Items' },
    { n: exam.minutes, l: 'Minutes' },
    { n: exam.passScore, l: 'Pass score / 1000' },
    { n: exam.fee, l: 'Exam fee' },
    { n: exam.validity, l: 'Month validity' },
  ];

  return (
    <div className="stat-strip">
      {stats.map((stat) => (
        <div className="stat" key={stat.l}>
          <div className="stat-n">{stat.n}</div>
          <div className="stat-l">{stat.l}</div>
        </div>
      ))}
    </div>
  );
}

/** Horizontal bars sized by each domain's share of scored items. */
function WeightChart({ exam }) {
  const maxWeight = Math.max(...exam.domains.map((d) => d.weightNum));

  return (
    <div className="weight-chart">
      <div className="section-label">
        {exam.code} blueprint — scored item distribution by domain
      </div>
      {exam.domains.map((domain) => (
        <div className="wb-row" key={domain.id}>
          <div className="wb-name" title={domain.title}>
            D{domain.n} &middot; {domain.title}
          </div>
          <div
            className="wb-track"
            role="img"
            aria-label={`${domain.title}: ${domain.weight} of the exam`}
          >
            <div
              className="wb-fill"
              style={{ width: `${((domain.weightNum / maxWeight) * 100).toFixed(0)}%` }}
            />
          </div>
          <div className="wb-pct">{domain.weight}</div>
        </div>
      ))}
    </div>
  );
}

export function ExamSummary({ exam, bestScore }) {
  const total = questionCount(exam);
  const minutes = mockDurationMinutes(exam);

  return (
    <>
      <StatStrip exam={exam} />

      {exam.examNote && (
        <p className="exam-note" dangerouslySetInnerHTML={{ __html: exam.examNote }} />
      )}

      <WeightChart exam={exam} />

      <div className="exam-cta">
        <div className="info">
          <div className="t">Mock exam mode</div>
          <div className="d">
            {total} questions &middot; {minutes} min &middot; scaled to the real {exam.items}-item /{' '}
            {exam.minutes}-min ratio
          </div>
        </div>
        {typeof bestScore === 'number' && (
          <span className="best-score">
            Best: <b>{bestScore}%</b>
          </span>
        )}
        <Link className="btn-primary" to={`/exam/${exam.id}/mock`}>
          Start mock exam
        </Link>
      </div>
    </>
  );
}
