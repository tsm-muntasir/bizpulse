import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container py-5">
      <div className="row align-items-center min-vh-75">
        <div className="col-lg-6">
          <h1 className="display-4 fw-bold mb-3">🎓 AI Study Assistant for Students</h1>
          <p className="lead text-secondary mb-4">
            Upload notes, get AI summaries, generate flashcards, take quizzes, 
            plan your study sessions, and track your progress—all in one place.
          </p>
          <div className="d-flex gap-3">
            <Link href="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
            <Link href="/login" className="btn btn-outline-secondary btn-lg">Login</Link>
          </div>
          <div className="mt-5">
            <h5>Features:</h5>
            <ul className="list-unstyled">
              <li>📤 Upload Notes & PDFs</li>
              <li>🤖 AI-Powered Summaries</li>
              <li>🃏 Flashcard Generator</li>
              <li>❓ Quiz Generation</li>
              <li>📅 Smart Study Planner</li>
              <li>📈 Analytics & Progress Tracking</li>
            </ul>
          </div>
        </div>
        <div className="col-lg-6 text-center">
          <div className="card p-5 bg-light border-0">
            <h2 className="mb-3">🚀 Boost Your Grades</h2>
            <p className="text-secondary">Join thousands of students studying smarter with AI.</p>
            <div className="row g-3 mt-4">
              <div className="col-6">
                <div className="p-3 bg-white rounded shadow-sm">
                  <h3 className="text-primary mb-0">10K+</h3>
                  <small>Active Students</small>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-white rounded shadow-sm">
                  <h3 className="text-success mb-0">50K+</h3>
                  <small>Notes Uploaded</small>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-white rounded shadow-sm">
                  <h3 className="text-info mb-0">100K+</h3>
                  <small>Quizzes Taken</small>
                </div>
              </div>
              <div className="col-6">
                <div className="p-3 bg-white rounded shadow-sm">
                  <h3 className="text-warning mb-0">95%</h3>
                  <small>Satisfaction Rate</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
