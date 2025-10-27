import React from "react";
import { useNavigate } from "react-router-dom";

const heroImage = "https://images.unsplash.com/photo-1670602152500-e14c206b5335?ixlib=rb-4.1.0&auto=format&fit=crop&q=60&w=1000";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page font-sans">
      <header className="bg-gray-50">
        <nav className="flex justify-between items-center px-8 py-4 shadow sticky top-0 z-50 bg-white">
          <h1
            className="text-2xl font-bold text-red-500 cursor-pointer"
            onClick={() => navigate("/")}
          >
            iReporter
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-blue-600 border-2 border-red-500 rounded-lg hover:bg-gray-900 hover:text-white transition"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Get Started
            </button>
          </div>
        </nav>

        <div className="flex flex-col lg:flex-row items-center justify-center max-w-6xl mx-auto px-6 py-16 gap-12">
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Report Corruption. Demand Action.</h2>
            <p className="text-gray-600 mb-6">
              iReporter empowers citizens to report corruption incidents and request government interventions for infrastructure issues.
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
              <button
                onClick={() => navigate("/login")}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition"
              >
                Start Reporting
              </button>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img src={heroImage} alt="justice" className="rounded-xl shadow-lg max-w-full h-auto" />
          </div>
        </div>
      </header>
    </div>
  );
};

export default LandingPage;
