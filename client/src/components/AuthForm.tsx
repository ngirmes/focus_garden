import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AuthForm.module.css';

interface AuthFormProps {
  heading: string;
  submitLabel: string;
  onSubmit: (email: string, password: string) => Promise<void>;
  footer: { text: string; linkTo: string; linkLabel: string };
}

export default function AuthForm({ heading, submitLabel, onSubmit, footer }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError('');
    setLoading(true);
    try {
      await onSubmit(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.heading}>{heading}</h1>

      {error && <p className={styles.error}>{error}</p>}

      <form onSubmit={e => { e.preventDefault(); void handleSubmit(); }} className={styles.form} noValidate>
        <label className={styles.label}>
          Email
          <input
            className={styles.input}
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </label>

        <label className={styles.label}>
          Password
          <input
            className={styles.input}
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            minLength={8}
          />
        </label>

        <button className={styles.submit} type="submit" disabled={loading}>
          {loading ? 'Please wait…' : submitLabel}
        </button>
      </form>

      <p className={styles.footer}>
        {footer.text}{' '}
        <Link to={footer.linkTo}>{footer.linkLabel}</Link>
      </p>
    </div>
  );
}
