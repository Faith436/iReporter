import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";
import { FaFlag, FaHandsHelping, FaMapMarkerAlt, FaPhotoVideo, FaBell, FaUserSecret } from "react-icons/fa";

const heroImage = "https://images.unsplash.com/photo-1670602152500-e14c206b5335?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y29ycnVwdGlvbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&q=60&w=1000";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* ===== HERO SECTION ===== */}
      <header className="hero-section">
        <nav className="navbar">
          <h1 className="logo">iReporter</h1>
          <div className="nav-buttons">
            <button onClick={() => navigate("/login")} className="btn-outline">
              Sign In
            </button>
            <button onClick={() => navigate("/signup")} className="btn-primary">
              Get Started
            </button>
          </div>
        </nav>

        <div className="hero-content">
          <div className="hero-text">
            <h2>Report Corruption. Demand Action.</h2>
            <p>
              iReporter empowers citizens to report corruption incidents and
              request government interventions for infrastructure issues. Make
              your voice heard and drive positive change in your community.
            </p>
            <div className="hero-buttons">
              <button onClick={() => navigate("/create-report")} className="btn-primary">
                Start Reporting
              </button>
              <button onClick={() => navigate("/login")} className="btn-outline">
                Sign In
              </button>
            </div>
          </div>
          <div className="hero-image">
            <img src={heroImage} alt="justice" />
          </div>
        </div>
      </header>

      {/* ===== FEATURES SECTION ===== */}
      <section className="features">
  <h2>iReporter Platform</h2>
  <p>Powerful Features for Civic Engagement</p>
  <div className="feature-grid">
    <div className="feature-card">
      <FaFlag className="feature-icon" />
      <h3>Red Flag Reports</h3>
      <p>Report corruption incidents, bribery, and misuse of public funds with evidence and location data.</p>
    </div>

    <div className="feature-card">
      <FaHandsHelping className="feature-icon" />
      <h3>Intervention Requests</h3>
      <p>Request government intervention for infrastructure issues like bad roads, collapsed bridges, and flooding.</p>
    </div>

    <div className="feature-card">
      <FaMapMarkerAlt className="feature-icon" />
      <h3>Geolocation Tracking</h3>
      <p>Add precise location coordinates to your reports and visualize incidents on interactive maps.</p>
    </div>

    <div className="feature-card">
      <FaPhotoVideo className="feature-icon" />
      <h3>Media Evidence</h3>
      <p>Upload images and videos to support your claims and provide compelling evidence.</p>
    </div>

    <div className="feature-card">
      <FaBell className="feature-icon" />
      <h3>Real-time Updates</h3>
      <p>Receive notifications when administrators update the status of your reports.</p>
    </div>

    <div className="feature-card">
      <FaUserSecret className="feature-icon" />
      <h3>Secure & Anonymous</h3>
      <p>Your reports are secure and you can choose to remain anonymous while still tracking progress.</p>
    </div>
  </div>
</section>


      {/* ===== HOW IT WORKS ===== */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <p>Simple steps to make a difference in your community</p>
        <div className="steps">
          <div className="step">
            <span>1</span>
            <h3>Create Account</h3>
            <p>Sign up for a free account to start reporting incidents and tracking their progress.</p>
          </div>

          <div className="step">
            <span>2</span>
            <h3>Submit Report</h3>
            <p>Create detailed reports with location data, evidence, and clear descriptions of the incident.</p>
          </div>

          <div className="step">
            <span>3</span>
            <h3>Track Progress</h3>
            <p>Monitor the status of your reports and receive notifications when actions are taken.</p>
          </div>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <section className="cta">
        <h2>Ready to Make a Difference?</h2>
        <p>Join thousands of citizens who are using iReporter to fight corruption and improve their communities.</p>
        <button onClick={() => navigate("/signup")} className="btn-primary">
          Get Started Today
        </button>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="footer">
        <div className="footer-top">
          <div className="footer-brand">
            <h3>iReporter</h3>
            <p>Empowering citizens to report corruption and demand government accountability.</p>
          </div>
          <div className="footer-links">
            <div>
              <h4>Platform</h4>
              <ul>
                <li>Features</li>
                <li>How it Works</li>
                <li>Security</li>
              </ul>
            </div>
            <div>
              <h4>Support</h4>
              <ul>
                <li>Help Center</li>
                <li>Contact Us</li>
                <li>Community</li>
              </ul>
            </div>
            <div>
              <h4>Legal</h4>
              <ul>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Cookie Policy</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2024 iReporter. All rights reserved. | Powered by Readdy</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
