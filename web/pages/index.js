import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="container py-5">
      <h1 className="display-5 fw-bold">Smart Study Partner AI</h1>
      <p className="lead text-secondary">AI-powered study planning for university students.</p>
      <Link href="/dashboard" className="btn btn-primary">Open Dashboard</Link>
    </main>
  );
}
