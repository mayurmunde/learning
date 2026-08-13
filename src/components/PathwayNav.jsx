import { Link } from 'react-router-dom';
import { TRACKS, examsForTrack } from '../data/index.js';

/**
 * The certification pathway: one card per track, with each level as a chip.
 * Multi-level tracks show an arrow to make the intended sequence explicit.
 */
export function PathwayNav({ currentExamId, reviewedCount }) {
  return (
    <section className="pathway" aria-labelledby="pathway-label">
      <div className="section-label" id="pathway-label">
        Certification pathway — pick a level to load its notes
      </div>
      <div className="tracks">
        {TRACKS.map((track) => {
          const exams = examsForTrack(track.name);
          return (
            <article className="track-card" key={track.name}>
              <h2 className="track-name">{track.name}</h2>
              <p className="track-blurb">{track.blurb}</p>
              <div className="levels">
                {exams.map((exam, index) => {
                  const isActive = exam.id === currentExamId;
                  const complete = reviewedCount(exam) === exam.domains.length;
                  return (
                    <div
                      key={exam.id}
                      style={{ display: 'flex', alignItems: 'center', gap: 8 }}
                    >
                      {index > 0 && (
                        <span className="level-arrow" aria-hidden="true">
                          &rarr;
                        </span>
                      )}
                      <Link
                        to={`/exam/${exam.id}`}
                        className={`level-chip${isActive ? ' active' : ''}`}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        <span className="lv">{exam.level}</span>
                        <span className="px">
                          {exam.code} &middot; {exam.fee}
                        </span>
                        {complete && (
                          <span className="tick" aria-hidden="true">
                            &#10003;
                          </span>
                        )}
                        {complete && <span className="sr-only">(all domains reviewed)</span>}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
