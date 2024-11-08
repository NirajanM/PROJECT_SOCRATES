// src/components/AuthForm.js
import { useState } from "react";
import { useAuthStore } from "../stores/authStore";
import { Button, Input, Label } from "@shadcn/ui";

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signup, login, user, error, loading } = useAuthStore();

  const handleAuth = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(email, password);
    } else {
      await signup(email, password);
    }
  };

  return (
    <div className="auth-form">
      <h2>{isLogin ? "Login" : "Signup"}</h2>
      <form onSubmit={handleAuth}>
        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : isLogin ? "Login" : "Signup"}
        </Button>
      </form>
      <Button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Switch to Signup" : "Switch to Login"}
      </Button>
      {user && <p>Welcome, {user.email}</p>}
    </div>
  );
};

export default AuthForm;
