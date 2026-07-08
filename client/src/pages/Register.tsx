import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";
import { registerRequest } from "../api/auth";
import { useAuth } from "../hooks/useAuth";
import styles from "./AuthPage.module.css";

export default function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(email: string, password: string) {
    const { token, user } = await registerRequest(email, password);
    login(token, user);
    navigate("/");
  }

  return (
    <div className={`page ${styles.page}`}>
      <AuthForm
        form="register"
        heading="Create an account"
        submitLabel="Get started"
        onSubmit={handleSubmit}
        footer={{
          text: "Already have an account?",
          linkTo: "/login",
          linkLabel: "Sign in",
        }}
      />
    </div>
  );
}
