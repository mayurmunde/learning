import { Navigate, Route, Routes } from 'react-router-dom';
import { EXAMS } from './data/index.js';
import { TopBar } from './components/TopBar.jsx';
import { ExamPage } from './pages/ExamPage.jsx';
import { MockExamPage } from './pages/MockExamPage.jsx';
import './styles/app.css';

export default function App() {
  return (
    <>
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      <TopBar />

      <Routes>
        <Route path="/" element={<Navigate to={`/exam/${EXAMS[0].id}`} replace />} />
        <Route path="/exam/:examId" element={<ExamPage />} />
        <Route path="/exam/:examId/mock" element={<MockExamPage />} />
        <Route path="*" element={<Navigate to={`/exam/${EXAMS[0].id}`} replace />} />
      </Routes>

      <footer className="wrap foot">
        <p>
          <b>How to use this:</b> pick your track and level, tick off domains as you can explain
          their notes and high-yield callouts without looking, then run the mock exam. Self-test
          questions are original, written to match each exam&apos;s scenario-judgment style — they
          are not real exam items. This supplements the official prep courses and exam guides; it
          does not replace hands-on experience, which every blueprint assumes to some degree.
        </p>
      </footer>
    </>
  );
}
