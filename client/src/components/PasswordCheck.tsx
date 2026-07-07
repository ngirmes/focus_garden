import styles from "./PasswordCheck.module.css";

interface PasswordCheckProps {
  password: string;
}

const RULES = [
  { label: "uppercase letter", test: /[A-Z]/ },
  { label: "lowercase letter", test: /[a-z]/ },
  { label: "has a number", test: /\d/ },
  { label: "has a special character", test: /\W/ },
];

export default function PasswordCheck({ password }: PasswordCheckProps) {
  return (
    <div className={styles.wrapper}>
      {RULES.map(({ label, test }) => {
        const isValid = test.test(password);
        return (
          <p
            key={label}
            className={`${styles.rule} ${isValid ? styles.valid : styles.invalid}`}
          >
            {label} {isValid ? "✓" : "✗"}
          </p>
        );
      })}
    </div>
  );
}
