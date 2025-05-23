import React, { useState } from "react";
import "./signup.css";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Auth } from "../../../../backend/firebase/firebase.js";
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
      const user = await signInWithEmailAndPassword(Auth, email, password);
      const firebase_id = user.user.uid;

      localStorage.setItem('firebase_id', firebase_id);

      try {
        await fetch(`http://localhost:7777/db/sync-user/${firebase_id}`);
      } catch (err) {
        console.warn("User DB sync failed:", err.message);
      }

      toast.success("Login Successful!", { position: "top-right" });
      navigate("/dashboard"); 
    } catch (error) {
      toast.error("Invalid Credentials", { position: "top-right" });
    }
  };

  // 🎯 Google Sign-in Function
  const GoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      var user = await signInWithPopup(Auth, provider);
      const firebase_id = user.user.uid;

      localStorage.setItem('firebase_id', firebase_id);

      try {
        await fetch(`http://localhost:7777/db/sync-user/${firebase_id}`);
      } catch (err) {
        console.warn("User DB sync failed:", err.message);
      }

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
