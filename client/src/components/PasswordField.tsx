import { useState } from "react";
import styles from "./PasswordField.module.css";

interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  inputClassName: string;
  autoComplete: string;
  minLength?: number;
}

export default function PasswordField({
  value,
  onChange,
  inputClassName,
  autoComplete,
  minLength,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.wrapper}>
      <input
        className={`${inputClassName} ${styles.input}`}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required
        autoComplete={autoComplete}
        minLength={minLength}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        {visible ? "Hide" : "Show"}
      </button>
    </div>
  );
}
