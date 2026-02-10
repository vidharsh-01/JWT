import './App.css';
import { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import loginBg from './images/login_page.jpg';

const API = "http://localhost:4000";
const GOOGLE_CLIENT_ID = "675616225771-2hi2d5k8gc8h9kv49qlju09p2elnl90t.apps.googleusercontent.com";

// login/register page
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [allowTracking, setAllowTracking] = useState(false);

  const navigate = useNavigate();

  // Verify token validity on mount
  useEffect(() => {
    const checkAuth = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          await axios.get(`${API}/verify`, {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          setToken(savedToken);
          navigate("/products");
        } catch (err) {
          localStorage.removeItem("token");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, [navigate]);

  if (loading) return <div className="vh-100 d-flex justify-content-center align-items-center">Checking auth...</div>;

  const register = async () => {
    await axios.post(`${API}/register`, form);
    alert("Registered! Login now.");
    setIsLogin(true);
  };

  const login = async () => {
    const res = await axios.post(`${API}/login`, {
      email: form.email,
      password: form.password,
      allowTracking,
    });
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("allowTracking", allowTracking ? "true" : "false");
    setToken(res.data.token);
    navigate("/products");
  };

  const handleGoogleLogin = async (CredentialResponse) => {
    try {
      const res = await axios.post(`${API}/auth/google`, {
        id_token: CredentialResponse.credential,
      });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      navigate("/products");
    } catch (err) {
      alert(err.response?.data?.message || "Google signin failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div className="vh-100 d-flex justify-content-center align-items-center " 
      style={{
        backgroundImage:`url(${loginBg})`,
        backgroundSize:'cover',
        backgroundPosition:'center',
        backgroundRepeat:'no-repeat'
      }}>
 
        <div className="bg-white rounded p-4" style={{ width: "350px" }}>
          <h2>{isLogin ? "Login" : "Register"}</h2>

          {!isLogin && (
            <input
              type="text"
              placeholder="name"
              className="form-control mb-3"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          )}

          <input
            type="email"
            placeholder="Enter email"
            className="form-control mb-3"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input
            type="password"
            placeholder="Password"
            className="form-control mb-3"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <p className="small text-muted">
  By logging in, you accept the basic cookies needed for the app to work.
</p>

<div className="form-check mb-3">
  <input
    className="form-check-input"
    type="checkbox"
    id="trackingConsent"
    checked={allowTracking}
    onChange={(e) => setAllowTracking(e.target.checked)}
  />
  <label className="form-check-label" htmlFor="trackingConsent">
    I allow you to track my in‑app behaviour to improve recommendations.
  </label>
</div>


          {isLogin ? (
            <button className="btn btn-primary w-100" onClick={login}>Login</button>
          ) : (
            <button className="btn btn-primary w-100" onClick={register}>Register</button>
          )}

          <div className="mt-3">
            <GoogleLogin
              onSuccess={handleGoogleLogin}
              onError={() => alert("Google login failed")}
              size="small"
              width="300px"
            />
          </div>

          <p
            className="text-center mt-3 text-danger"
            onClick={() => setIsLogin(!isLogin)}
            style={{ cursor: "pointer" }}
          >
            {isLogin ? "Create account" : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}

// main app with routes
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/products" element={<Products />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
