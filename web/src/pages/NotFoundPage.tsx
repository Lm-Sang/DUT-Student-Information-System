import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="card">
      <h1>Page not found</h1>
      <p>The page you requested does not exist.</p>
      <Link to="/">Go back home</Link>
    </section>
  );
}
