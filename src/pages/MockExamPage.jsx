import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getExam, mockDurationMinutes } from '../data/index.js';
import { useBestScores } from '../hooks/useLocalStorage.js';
import { ScoreReport } from '../components/ScoreReport.jsx';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/** Fisher-Yates — a fresh question order every attempt. */
function shuffle(items) {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildPool(exam) {
  return exam.domains.flatMap((domain) =>
    domain.qs.map((question) => ({
      ...question,
      domainId: domain.id,
      domainN: domain.n,
      domainTitle: domain.title,
    })),
  );
}

function formatClock(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

export function MockExamPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const exam = getExam(examId);
  const { recordScore } = useBestScores();

  const durationSeconds = useMemo(
    () => (exam ? mockDurationMinutes(exam) * 60 : 0),
    [exam],
  );

  const [attempt, setAttempt] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [submitted, setSubmitted] = useState(false);
  const submittedRef = useRef(false);

  // Fresh shuffle and clock on mount and on every retake.
  useEffect(() => {
    if (!exam) return;
    setQuestions(shuffle(buildPool(exam)));
    setAnswers({});
    setSecondsLeft(durationSeconds);
    setSubmitted(false);
    submittedRef.current = false;
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [exam, durationSeconds, attempt]);

  const submit = useCallback(() => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Countdown; auto-submits when time runs out.
  useEffect(() => {
    if (submitted || !questions.length) return undefined;
    if (secondsLeft <= 0) {
      submit();
      return undefined;
    }
    const timer = setTimeout(() => setSecondsLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [secondsLeft, submitted, questions.length, submit]);

  const results = useMemo(() => {
    if (!submitted || !exam) return null;

    const perDomain = {};
    exam.domains.forEach((domain) => {
      perDomain[domain.id] = { correct: 0, total: 0 };
    });

    let correctCount = 0;
    questions.forEach((question, index) => {
      const picked = answers[index];
      const isCorrect = picked === question.answer;
      if (isCorrect) correctCount += 1;
      perDomain[question.domainId].total += 1;
      if (isCorrect) perDomain[question.domainId].correct += 1;
    });

    return { perDomain, correctCount };
  }, [submitted, exam, questions, answers]);

  // Persist the best score once, after the results are computed.
  useEffect(() => {
    if (!results || !questions.length) return;
    const percent = Math.round((results.correctCount / questions.length) * 100);
    recordScore(exam.id, percent);
  }, [results, questions.length, exam, recordScore]);

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

  const answeredCount = Object.keys(answers).length;
  const lowTime = !submitted && secondsLeft <= 180;

  return (
    <div className="wrap">
      <div className="exam-bar">
        <div className="exam-bar-row">
          <div className={`timer${lowTime ? ' low' : ''}`}>
            {submitted ? 'Submitted' : formatClock(secondsLeft)}
          </div>
          <div className="answered">
            {answeredCount} / {questions.length} answered
          </div>
          <div className="spacer" />
          <button
            type="button"
            className="btn-ghost"
            onClick={() => navigate(`/exam/${exam.id}`)}
          >
            Exit
          </button>
          {!submitted && (
            <button type="button" className="btn-primary" onClick={submit}>
              Submit exam
            </button>
          )}
        </div>
      </div>

      <h1 className="sr-only">{exam.name} mock exam</h1>

      {submitted && results && (
        <ScoreReport
          exam={exam}
          perDomain={results.perDomain}
          correctCount={results.correctCount}
          totalCount={questions.length}
          onRetake={() => setAttempt((n) => n + 1)}
        />
      )}

      <div style={{ paddingBottom: 80 }}>
        {questions.map((question, index) => {
          const picked = answers[index];
          return (
            <fieldset className="eq" key={`${attempt}-${index}`}>
              <legend className="eq-tag">
                Domain {question.domainN} &middot; {question.domainTitle}
              </legend>
              <p className="stem">
                {index + 1}. {question.stem}
              </p>

              {question.opts.map((option, optionIndex) => {
                let stateClass = '';
                if (submitted) {
                  if (optionIndex === question.answer) stateClass = ' correct-opt';
                  else if (optionIndex === picked) stateClass = ' wrong-opt';
                }
                return (
                  <label className={`eq-opt${stateClass}`} key={optionIndex}>
                    <input
                      type="radio"
                      name={`q${attempt}-${index}`}
                      value={optionIndex}
                      checked={picked === optionIndex}
                      disabled={submitted}
                      onChange={() =>
                        setAnswers((prev) => ({ ...prev, [index]: optionIndex }))
                      }
                    />
                    <span>
                      <b>{LETTERS[optionIndex]}.</b> {option}
                    </span>
                  </label>
                );
              })}

              {submitted && (
                <div className="eq-rationale">
                  <b>
                    {LETTERS[question.answer]}. {question.opts[question.answer]}
                  </b>{' '}
                  — {question.rationale}
                </div>
              )}
            </fieldset>
          );
        })}
      </div>
    </div>
  );
}
