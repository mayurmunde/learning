import { Link, NavLink } from 'react-router-dom';
import { EXAMS } from '../data/index.js';

export function TopBar() {
  return (
    <header className="topbar">
      <div className="wrap topbar-inner">
        <Link to="/" className="brand">
          Field Notes
        </Link>
        <nav className="topbar-exams" aria-label="Exams">
          {EXAMS.map((exam) => (
            <NavLink
              key={exam.id}
              to={`/exam/${exam.id}`}
              className={({ isActive }) => `topbar-exam${isActive ? ' active' : ''}`}
            >
              {exam.code}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
