import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { loginRequest } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import styles from "./AuthPage.module.css";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(email: string, password: string) {
    const { token, user } = await loginRequest(email, password);
    login(token, user);
    navigate("/");
  }

  return (
    <div className={`page ${styles.page}`}>
      <AuthForm
        form="login"
        heading="Welcome back"
        submitLabel="Sign in"
        onSubmit={handleSubmit}
        footer={{
          text: "Don't have an account?",
          linkTo: "/register",
          linkLabel: "Create one",
        }}
      />
    </div>
  );
}
