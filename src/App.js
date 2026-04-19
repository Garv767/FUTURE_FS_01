import React, { useState, useEffect } from "react";
import Preloader from "../src/components/Pre";
import Navbar from "./components/Navbar";
import Home from "./components/Home/Home";
import About from "./components/About/About";
import Projects from "./components/Projects/Projects";
import Footer from "./components/Footer";
import Resume from "./components/Resume/ResumeNew";
import Login from "./components/Auth/Login";
import AdminDashboard from "./components/Admin/AdminDashboard";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import MissionLog from "./components/Missions/MissionLog";
import TerminalBackground from "./components/TerminalBackground";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import "./style.css";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [load, setLoad] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoad(false), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <Router basename="/portfolio">
      <Preloader load={load} />
      <div className="App" id={load ? "no-scroll" : "scroll"}>
        <TerminalBackground />
        <Navbar />
        <ScrollToTop />
        <Routes>
          <Route path="/"         element={<Home />} />
          <Route path="/project"  element={<Projects />} />
          <Route path="/about"    element={<About />} />
          <Route path="/resume"   element={<Resume />} />
          <Route path="/missions" element={<MissionLog />} />
          <Route path="/login"    element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
