import React, { useState } from "react";
import "../css/signup.css";
import { Auth, db } from "../backend/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { toast, ToastContainer } from "react-toastify";
import {useNavigate} from "react-router-dom";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(Auth, email, password);
      let user = Auth.currentUser;
      console.log(user);
      if (user) {
        await setDoc(doc(db, "Users", user.uid), {
          email: user.email,
          firstname: fname,
          lastname: lname,
        });
      }
      toast.success("Registration successful!", { position: "top-right" });
    } catch (error) {
      toast.error("Error: " + error.message, { position: "top-right", autoClose: 3000 });
      console.log(error.message);
    }
  };

  const Googlesignin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(Auth, provider).then(async (res) => {
      console.log(res);
    });
    navigate("/login");
  };

  return (
    <>
      <ToastContainer />
      <div className="start">
        <div className="container">
          <div className="heading">Sign Up</div>
          {error && <p className="error-message">{error}</p>}
          <form className="form" onSubmit={handleRegister}>
            <input
              type="text"
              placeholder="First Name"
              value={fname}
              onChange={(e) => setFname(e.target.value)}
              className="input"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lname}
              onChange={(e) => setLname(e.target.value)}
              className="input"
              required
            />
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
              Sign Up
            </button>
          </form>

          <div className="social-account-container">
            <span className="title">Or Sign Up with</span>
            <div className="social-accounts">
              <button className="social-button google" onClick={Googlesignin}>
                <svg viewBox="0 0 488 512" height="1em">
                  <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                </svg>
              </button>
            </div>
          </div>

          <span className="agreement">
            <a href=""  onClick={() => navigate("/login")} style={{ cursor: "pointer", color: "blue" }}>Already have an account? Log in</a>
          </span>
        </div>
      </div>
    </>
  );
};

export default Signup;
