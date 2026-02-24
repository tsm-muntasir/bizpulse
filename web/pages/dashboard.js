import { useMemo, useState } from 'react';

export default function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const streak = 12;

  const className = useMemo(() => (darkMode ? 'theme-dark' : 'theme-light'), [darkMode]);

  return (
    <main className={`container py-4 ${className}`}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Study Dashboard</h2>
        <button className="btn btn-outline-secondary" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? 'Light' : 'Dark'} mode
        </button>
      </div>

      <section className="row g-3">
        <div className="col-md-4">
          <div className="card p-3 h-100">
            <h6>Current Streak</h6>
            <p className="fs-3 fw-semibold mb-0">{streak} days</p>
          </div>
        </div>
        <div className="col-md-8">
          <div className="card p-3 h-100">
            <h6>Today Checklist</h6>
            <ul className="mb-0">
              <li>Complete Algorithms chapter 2</li>
              <li>Review flashcards for OOP</li>
              <li>Solve 20 DBMS MCQs</li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
