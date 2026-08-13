import { useState } from 'react';

const LETTERS = ['A', 'B', 'C', 'D', 'E'];

/**
 * A single study question with a hidden answer. Read the stem, commit to an
 * option mentally, then reveal — the rationale explains why the distractors fail.
 */
export function SelfTest({ question, id }) {
  const [revealed, setRevealed] = useState(false);
  const answerId = `${id}-answer`;

  return (
    <div className="selftest">
      <p className="stem">{question.stem}</p>

      {question.opts.map((option, index) => (
        <div className="opt" key={index}>
          <b>{LETTERS[index]}.</b>
          <span>{option}</span>
        </div>
      ))}

      <button
        type="button"
        className="reveal-btn"
        onClick={() => setRevealed((prev) => !prev)}
        aria-expanded={revealed}
        aria-controls={answerId}
      >
        {revealed ? 'Hide answer' : 'Show answer'}
      </button>

      {revealed && (
        <div className="answer" id={answerId}>
          <b>
            {LETTERS[question.answer]}. {question.opts[question.answer]}
          </b>{' '}
          — {question.rationale}
        </div>
      )}
    </div>
  );
}
