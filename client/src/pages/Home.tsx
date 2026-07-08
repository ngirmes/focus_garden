import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Home.module.css";

export default function Home() {
  const { user, logout } = useAuth();

  return (
    <div className={`page ${styles.page}`}>
      <header className={styles.header}>
        <span className={styles.logo}>🌱 Sprout</span>
        {user ? (
          <div className={styles.nav}>
            <span className={styles.greeting}>Hi, {user.email}</span>
            <button className={styles.navBtn} onClick={logout}>
              Sign out
            </button>
          </div>
        ) : (
          <nav className={styles.nav}>
            <Link className={styles.navLink} to="/login">
              Sign in
            </Link>
            <Link className={styles.navBtn} to="/register">
              Get started
            </Link>
          </nav>
        )}
      </header>

      <main className={styles.main}>
        <p className={styles.eyebrow}>🌿 A quiet place to grow</p>
        <h1 className={styles.headline}>
          Tend to your focus,
          <br />
          day by day
        </h1>
        <p className={styles.sub}>
          Focus Garden helps you build gentle, sustainable habits around your
          attention — without pressure, streaks, or noise.
        </p>
        {!user && (
          <Link className={styles.cta} to="/register">
            Start for free
          </Link>
        )}
      </main>
    </div>
  );
}
