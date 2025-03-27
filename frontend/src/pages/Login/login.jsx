import React, { useState } from "react";
import "./signup.css";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Auth } from "../Login/";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // 🔐 Email & Password Login Function
  const LoginRequest = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(Auth, email, password);
      toast.success("Login Successful!", { position: "top-right" });
      navigate("/"); // Redirect to home after login
    } catch (error) {
      toast.error("Invalid Credentials", { position: "top-right" });
    }
  };

  // 🎯 Google Sign-in Function
  const GoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(Auth, provider);
      toast.success("Google Sign-in Successful!", { position: "top-right" });
      navigate("/");
    } catch (error) {
      toast.error("Google Sign-in Failed", { position: "top-right" });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="start">
        <div className="container">
          <h2 className="page-heading"> Login to Your Account</h2>
          <p className="page-subtext">Welcome back! Please enter your credentials.</p>

          {/* 🔑 Email & Password Login */}
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
            <button type="submit" className="login-button">Login</button>
          </form>

          {/*  Google Login */}
          <div className="social-account-container">
            <span className="title">Or Login with</span>
            <button className="social-button google" onClick={GoogleSignIn}>
            <svg viewBox="0 0 488 512" height="1em">
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                </svg>
            </button>
          </div>

          {/*  Signup Redirect */}
          <p className="redirect-signup">
            Don’t have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
