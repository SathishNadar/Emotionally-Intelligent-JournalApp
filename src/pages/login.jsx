import React, { useState } from "react";
import "../css/signup.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Auth } from "../backend/firebase";
import { toast,ToastContainer } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const LoginRequest = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(Auth, email, password);
      console.log(Auth.currentUser);
      toast.success("yesss", { position: "top-right" });
    } catch (error) {
      console.log(error);
      toast.success("muditu poda myru", { position: "top-right" });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="start">
        <div className="container">
          <form className="form" onSubmit={LoginRequest}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              required
            />
            <button type="submit" className="login-button">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
