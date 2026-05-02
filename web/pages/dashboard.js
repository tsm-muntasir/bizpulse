import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/v1";

export default function DashboardPage({ user, setUser }) {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ streak: 0, totalNotes: 0, totalQuizzes: 0, avgScore: 0 });
  const [noteTitle, setNoteTitle] = useState("");
  const [noteContent, setNoteContent] = useState("");
  const [noteFile, setNoteFile] = useState(null);
  const [noteType, setNoteType] = useState("text");
  const [quizTopic, setQuizTopic] = useState("");
  const [quizDifficulty, setQuizDifficulty] = useState("medium");
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [flashcardFront, setFlashcardFront] = useState("");
  const [flashcardBack, setFlashcardBack] = useState("");
  const router = useRouter();
  const themeClass = useMemo(() => (darkMode ? "theme-dark" : "theme-light"), [darkMode]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetchData(token);
  }, []);

  const fetchData = async (token) => {
    try {
      const [nr, qr] = await Promise.all([
        fetch(API_BASE + "/notes", { headers: { Authorization: "Bearer " + token } }),
        fetch(API_BASE + "/quizzes", { headers: { Authorization: "Bearer " + token } })
      ]);
      if (nr.ok) { const d = await nr.json(); setNotes(d.data || []); setStats(p => ({ ...p, totalNotes: d.data ? d.data.length : 0 })); }
      if (qr.ok) { const d = await qr.json(); setStats(p => ({ ...p, totalQuizzes: d.data ? d.data.length : 0 })); }
      setStats(p => ({ ...p, streak: 12, avgScore: 85 }));
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const handleLogout = () => { localStorage.removeItem("token"); router.push("/login"); };

  const handleUploadNote = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    try {
      let res;
      if (noteType === "file" && noteFile) {
        const fd = new FormData(); fd.append("file", noteFile); fd.append("title", noteTitle);
        res = await fetch(API_BASE + "/notes/upload", { method: "POST", headers: { Authorization: "Bearer " + token }, body: fd });
      } else {
        res = await fetch(API_BASE + "/notes", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify({ title: noteTitle, content: noteContent }) });
      }
      if (res.ok) { alert("Note uploaded!"); setNoteTitle(""); setNoteContent(""); setNoteFile(null); fetchData(token); setActiveTab("notes"); }
      else { const d = await res.json(); alert(d.message || "Failed"); }
    } catch (e) { alert("Error uploading"); }
  };

  const handleSummarizeNote = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_BASE + "/notes/" + id + "/summarize", { method: "POST", headers: { Authorization: "Bearer " + token } });
      if (res.ok) { alert("Summary generated!"); fetchData(token); } else { alert("Failed"); }
    } catch (e) { alert("Error"); }
  };

  const handleGenerateQuiz = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_BASE + "/ai/generate-quiz", { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + token }, body: JSON.stringify({ topic: quizTopic, difficulty: quizDifficulty }) });
      if (res.ok) { const d = await res.json(); setQuizQuestions(d.questions || []); alert("Quiz generated!"); }
      else { setQuizQuestions([{ id: 1, question: "What is " + quizTopic + "?", options: ["A", "B", "C", "D"], correct: 0 }]); alert("Sample quiz generated"); }
    } catch (e) { setQuizQuestions([{ id: 1, question: "Question about " + quizTopic + "?", options: ["A", "B", "C", "D"], correct: 0 }]); alert("Sample quiz"); }
  };

  const handleAddFlashcard = () => {
    if (flashcardFront && flashcardBack) {
      setFlashcards(p => [...p, { id: Date.now(), front: flashcardFront, back: flashcardBack }]);
      setFlashcardFront(""); setFlashcardBack(""); alert("Flashcard added!");
    }
  };

  const handleDeleteNote = async (id) => {
    if (!confirm("Delete?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_BASE + "/notes/" + id, { method: "DELETE", headers: { Authorization: "Bearer " + token } });
      if (res.ok) { fetchData(token); alert("Deleted"); }
    } catch (e) { alert("Error"); }
  };

  const [flashcards, setFlashcards] = useState([]);
  const [studyPlan, setStudyPlan] = useState([]);
  const [planGoal, setPlanGoal] = useState("");
  const [planDays, setPlanDays] = useState(7);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    fetchFlashcards();
    fetchStudyPlan();
  }, []);

  const fetchFlashcards = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_BASE + "/flashcards", { headers: { Authorization: "Bearer " + token } });
      if (res.ok) { const d = await res.json(); setFlashcards(d.data || []); }
    } catch (e) { console.error(e); }
  };

  const fetchStudyPlan = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_BASE + "/study-plans", { headers: { Authorization: "Bearer " + token } });
      if (res.ok) { const d = await res.json(); setStudyPlan(d.data || []); }
    } catch (e) { console.error(e); }
  };

  const handleGenerateStudyPlan = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_BASE + "/ai/generate-study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ goal: planGoal, daysAvailable: planDays })
      });
      if (res.ok) { const d = await res.json(); alert("Study plan generated!"); fetchStudyPlan(); setActiveTab("planner"); }
      else { alert("Failed to generate plan"); }
    } catch (e) { alert("Error generating plan"); }
  };

  const handleGenerateFlashcards = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_BASE + "/ai/generate-flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ topic: flashcardFront, count: 5 })
      });
      if (res.ok) { const d = await res.json(); alert("Flashcards generated!"); fetchFlashcards(); }
      else { alert("Failed to generate flashcards"); }
    } catch (e) { alert("Error generating flashcards"); }
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) correct++;
    });
    const score = Math.round((correct / quizQuestions.length) * 100);
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleSaveQuiz = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(API_BASE + "/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + token },
        body: JSON.stringify({ topic: quizTopic, difficulty: quizDifficulty, questions: quizQuestions, score: quizScore })
      });
      if (res.ok) { alert("Quiz saved!"); setStats(p => ({ ...p, totalQuizzes: p.totalQuizzes + 1 })); }
    } catch (e) { console.error(e); }
  };

  if (loading) return <div className={`container py-5 ${themeClass}`}><div className="d-flex justify-content-center"><div className="spinner-border"></div></div></div>;

  const renderOverview = () => (
    <div className="row g-4">
      <div className="col-md-3">
        <div className="card p-3 h-100">
          <h6 className="text-muted">Study Streak</h6>
          <h3 className="text-primary">{stats.streak} days</h3>
          <small>Keep it up! 🔥</small>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card p-3 h-100">
          <h6 className="text-muted">Total Notes</h6>
          <h3 className="text-success">{stats.totalNotes}</h3>
          <small>Notes uploaded</small>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card p-3 h-100">
          <h6 className="text-muted">Quizzes Taken</h6>
          <h3 className="text-info">{stats.totalQuizzes}</h3>
          <small>Tests completed</small>
        </div>
      </div>
      <div className="col-md-3">
        <div className="card p-3 h-100">
          <h6 className="text-muted">Avg Score</h6>
          <h3 className="text-warning">{stats.avgScore}%</h3>
          <small>Performance</small>
        </div>
      </div>
      <div className="col-12">
        <div className="card p-4">
          <h5>📋 Today's Checklist</h5>
          <ul className="list-unstyled mt-3">
            <li className="mb-2"><input type="checkbox" className="me-2" /> Review yesterday's notes</li>
            <li className="mb-2"><input type="checkbox" className="me-2" /> Complete 1 quiz</li>
            <li className="mb-2"><input type="checkbox" className="me-2" /> Create 5 flashcards</li>
            <li className="mb-2"><input type="checkbox" className="me-2" /> Study for 2 hours</li>
          </ul>
        </div>
      </div>
      <div className="col-12">
        <div className="card p-4">
          <h5>⚡ Quick Actions</h5>
          <div className="d-flex gap-2 mt-3 flex-wrap">
            <button className="btn btn-outline-primary" onClick={() => setActiveTab("notes")}>📤 Upload Note</button>
            <button className="btn btn-outline-success" onClick={() => setActiveTab("quiz")}>❓ Generate Quiz</button>
            <button className="btn btn-outline-info" onClick={() => setActiveTab("flashcards")}>🃏 Create Flashcards</button>
            <button className="btn btn-outline-warning" onClick={() => setActiveTab("planner")}>📅 Plan Study</button>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="card p-4">
          <h5>📝 Recent Notes</h5>
          {notes.length === 0 ? <p className="text-muted">No notes yet. Upload your first note!</p> : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead><tr><th>Title</th><th>Type</th><th>Date</th><th>Actions</th></tr></thead>
                <tbody>
                  {notes.slice(0, 5).map(note => (
                    <tr key={note._id}>
                      <td>{note.title}</td>
                      <td><span className="badge bg-secondary">{note.type}</span></td>
                      <td>{new Date(note.createdAt).toLocaleDateString()}</td>
                      <td>
                        <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleSummarizeNote(note._id)}>Summarize</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteNote(note._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderNotes = () => (
    <div className="row g-4">
      <div className="col-lg-6">
        <div className="card p-4">
          <h5>📤 Upload Note</h5>
          <form onSubmit={handleUploadNote} className="mt-3">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input type="text" className="form-control" value={noteTitle} onChange={(e) => setNoteTitle(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Type</label>
              <select className="form-select" value={noteType} onChange={(e) => setNoteType(e.target.value)}>
                <option value="text">Text</option>
                <option value="file">PDF/File</option>
              </select>
            </div>
            {noteType === "text" ? (
              <div className="mb-3">
                <label className="form-label">Content</label>
                <textarea className="form-control" rows="6" value={noteContent} onChange={(e) => setNoteContent(e.target.value)} required></textarea>
              </div>
            ) : (
              <div className="mb-3">
                <label className="form-label">File</label>
                <input type="file" className="form-control" accept=".pdf,.doc,.docx,.txt" onChange={(e) => setNoteFile(e.target.files[0])} required />
              </div>
            )}
            <button type="submit" className="btn btn-primary w-100">Upload Note</button>
          </form>
        </div>
      </div>
      <div className="col-lg-6">
        <div className="card p-4">
          <h5>📚 Your Notes</h5>
          {notes.length === 0 ? <p className="text-muted mt-3">No notes uploaded yet.</p> : (
            <div className="mt-3" style={{ maxHeight: "500px", overflowY: "auto" }}>
              {notes.map(note => (
                <div key={note._id} className="card mb-2 p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-1">{note.title}</h6>
                      <small className="text-muted">{new Date(note.createdAt).toLocaleDateString()}</small>
                      {note.summary && <p className="mt-2 mb-0 text-success"><strong>Summary:</strong> {note.summary.substring(0, 100)}...</p>}
                    </div>
                    <div>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleSummarizeNote(note._id)}>AI Summarize</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteNote(note._id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderQuiz = () => (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="card p-4">
          <h5>❓ Generate Quiz</h5>
          <div className="mt-3">
            <label className="form-label">Topic</label>
            <input type="text" className="form-control" value={quizTopic} onChange={(e) => setQuizTopic(e.target.value)} placeholder="e.g., Biology Chapter 5" />
          </div>
          <div className="mt-3">
            <label className="form-label">Difficulty</label>
            <select className="form-select" value={quizDifficulty} onChange={(e) => setQuizDifficulty(e.target.value)}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <button className="btn btn-success w-100 mt-3" onClick={handleGenerateQuiz}>Generate Quiz</button>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="card p-4">
          <h5>📝 Quiz Questions</h5>
          {quizQuestions.length === 0 ? <p className="text-muted mt-3">Generate a quiz to start practicing!</p> : (
            <div className="mt-3">
              {quizQuestions.map((q, idx) => (
                <div key={q.id} className="card mb-3 p-3">
                  <p className="fw-bold">{idx + 1}. {q.question}</p>
                  <div className="ms-3">
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="form-check">
                        <input type="radio" className="form-check-input" name={`q-${idx}`} onChange={() => setQuizAnswers(p => ({ ...p, [idx]: optIdx }))} disabled={quizSubmitted} />
                        <label className="form-check-label">{opt}</label>
                      </div>
                    ))}
                  </div>
                  {quizSubmitted && <p className="mt-2 text-success">Correct answer: {q.options[q.correct]}</p>}
                </div>
              ))}
              {!quizSubmitted ? (
                <button className="btn btn-primary" onClick={handleSubmitQuiz}>Submit Quiz</button>
              ) : (
                <div>
                  <h4 className="text-primary">Your Score: {quizScore}%</h4>
                  <button className="btn btn-outline-success me-2" onClick={handleSaveQuiz}>Save Quiz</button>
                  <button className="btn btn-outline-secondary" onClick={() => { setQuizQuestions([]); setQuizSubmitted(false); setQuizScore(null); }}>New Quiz</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderFlashcards = () => (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="card p-4">
          <h5>🃏 Create Flashcard</h5>
          <div className="mt-3">
            <label className="form-label">Front</label>
            <input type="text" className="form-control" value={flashcardFront} onChange={(e) => setFlashcardFront(e.target.value)} placeholder="Question or term" />
          </div>
          <div className="mt-3">
            <label className="form-label">Back</label>
            <input type="text" className="form-control" value={flashcardBack} onChange={(e) => setFlashcardBack(e.target.value)} placeholder="Answer or definition" />
          </div>
          <button className="btn btn-primary w-100 mt-3" onClick={handleAddFlashcard}>Add Flashcard</button>
          <button className="btn btn-outline-info w-100 mt-2" onClick={handleGenerateFlashcards}>AI Generate</button>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="card p-4">
          <h5>📚 Your Flashcards ({flashcards.length})</h5>
          {flashcards.length === 0 ? <p className="text-muted mt-3">No flashcards yet. Create your first one!</p> : (
            <div className="row g-3 mt-2">
              {flashcards.map((fc, idx) => (
                <div key={fc._id || idx} className="col-md-6">
                  <div className="card p-3 text-center" style={{ minHeight: "150px", cursor: "pointer" }} onClick={(e) => e.currentTarget.classList.toggle('bg-light')}>
                    <p className="fw-bold">{fc.front}</p>
                    <hr />
                    <p className="text-primary">{fc.back}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderPlanner = () => (
    <div className="row g-4">
      <div className="col-lg-4">
        <div className="card p-4">
          <h5>📅 Generate Study Plan</h5>
          <div className="mt-3">
            <label className="form-label">Study Goal</label>
            <input type="text" className="form-control" value={planGoal} onChange={(e) => setPlanGoal(e.target.value)} placeholder="e.g., Prepare for Math Exam" />
          </div>
          <div className="mt-3">
            <label className="form-label">Days Available</label>
            <input type="number" className="form-control" value={planDays} onChange={(e) => setPlanDays(e.target.value)} min="1" max="30" />
          </div>
          <button className="btn btn-warning w-100 mt-3" onClick={handleGenerateStudyPlan}>Generate Plan</button>
        </div>
      </div>
      <div className="col-lg-8">
        <div className="card p-4">
          <h5>📋 Your Study Plan</h5>
          {studyPlan.length === 0 ? <p className="text-muted mt-3">No study plan yet. Generate one to get started!</p> : (
            <div className="mt-3">
              {studyPlan.map((plan, idx) => (
                <div key={plan._id || idx} className="card mb-2 p-3">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h6 className="mb-1">Day {plan.day || idx + 1}: {plan.topic || plan.task}</h6>
                      <p className="mb-0 text-muted">{plan.description || "Study session planned"}</p>
                    </div>
                    <span className="badge bg-primary">{plan.duration || "2 hrs"}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card p-4 text-center">
          <h6 className="text-muted">Weekly Study Hours</h6>
          <h2 className="display-4 text-primary">12.5</h2>
          <p className="text-success">↑ 15% from last week</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card p-4 text-center">
          <h6 className="text-muted">Quiz Average</h6>
          <h2 className="display-4 text-success">85%</h2>
          <p className="text-success">↑ 5% improvement</p>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card p-4 text-center">
          <h6 className="text-muted">Flashcards Mastered</h6>
          <h2 className="display-4 text-info">{flashcards.length}</h2>
          <p className="text-muted">Keep learning!</p>
        </div>
      </div>
      <div className="col-12">
        <div className="card p-4">
          <h5>📊 Progress Overview</h5>
          <div className="mt-3">
            <div className="mb-3">
              <label>Notes Mastery</label>
              <div className="progress">
                <div className="progress-bar bg-success" style={{ width: "75%" }}>75%</div>
              </div>
            </div>
            <div className="mb-3">
              <label>Quiz Performance</label>
              <div className="progress">
                <div className="progress-bar bg-info" style={{ width: "85%" }}>85%</div>
              </div>
            </div>
            <div className="mb-3">
              <label>Study Consistency</label>
              <div className="progress">
                <div className="progress-bar bg-warning" style={{ width: "60%" }}>60%</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12">
        <div className="card p-4">
          <h5>💡 AI Insights</h5>
          <ul className="list-unstyled mt-3">
            <li className="mb-2">✅ You're strongest in topics covered by your notes</li>
            <li className="mb-2">⚠️ Consider more practice quizzes for better retention</li>
            <li className="mb-2">💡 Best study time: Morning sessions show 20% better results</li>
            <li className="mb-2">🎯 Recommended: Focus on weak areas identified in recent quizzes</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <main className={`container-fluid py-4 ${themeClass}`}>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary rounded mb-4 px-3">
        <span className="navbar-brand">🎓 AI Study Assistant</span>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item"><button className={`nav-link ${activeTab === "overview" ? "active" : ""}`} onClick={() => setActiveTab("overview")}>📊 Overview</button></li>
            <li className="nav-item"><button className={`nav-link ${activeTab === "notes" ? "active" : ""}`} onClick={() => setActiveTab("notes")}>📝 Notes</button></li>
            <li className="nav-item"><button className={`nav-link ${activeTab === "quiz" ? "active" : ""}`} onClick={() => setActiveTab("quiz")}>❓ Quiz</button></li>
            <li className="nav-item"><button className={`nav-link ${activeTab === "flashcards" ? "active" : ""}`} onClick={() => setActiveTab("flashcards")}>🃏 Flashcards</button></li>
            <li className="nav-item"><button className={`nav-link ${activeTab === "planner" ? "active" : ""}`} onClick={() => setActiveTab("planner")}>📅 Planner</button></li>
            <li className="nav-item"><button className={`nav-link ${activeTab === "analytics" ? "active" : ""}`} onClick={() => setActiveTab("analytics")}>📈 Analytics</button></li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            <button className="btn btn-outline-light btn-sm" onClick={() => setDarkMode(!darkMode)}>{darkMode ? "☀️ Light" : "🌙 Dark"}</button>
            <button className="btn btn-outline-light btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </nav>
      <div className="container">
        {activeTab === "overview" && renderOverview()}
        {activeTab === "notes" && renderNotes()}
        {activeTab === "quiz" && renderQuiz()}
        {activeTab === "flashcards" && renderFlashcards()}
        {activeTab === "planner" && renderPlanner()}
        {activeTab === "analytics" && renderAnalytics()}
      </div>
    </main>
  );
}
