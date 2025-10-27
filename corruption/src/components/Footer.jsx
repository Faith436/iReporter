import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Top Footer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-12">

          {/* Logo & Description */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold">iReporter</h3>
            <p className="text-blue-400 font-medium">Transparency • Accountability • Justice</p>
            <p className="text-gray-400 text-sm leading-relaxed">
              A platform for citizens to report corruption incidents and request government interventions. Together we can build a more transparent society.
            </p>

            {/* Social Icons */}
            <div className="flex space-x-3 mt-4 justify-start md:justify-start">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-500 p-2 rounded-md transition">
                {/* Facebook SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-blue-500 p-2 rounded-md transition">
                {/* Twitter SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.016 10.016 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-blue-500 p-2 rounded-md transition">
                {/* LinkedIn SVG */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/dashboard" className="text-gray-400 hover:text-blue-500 transition">Dashboard</Link></li>
              <li><Link to="/create-report" className="text-gray-400 hover:text-blue-500 transition">Create Report</Link></li>
              <li><Link to="/my-reports" className="text-gray-400 hover:text-blue-500 transition">My Reports</Link></li>
              <li><Link to="/map" className="text-gray-400 hover:text-blue-500 transition">Map View</Link></li>
            </ul>
          </div>

          {/* Report Types */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Report Types</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 hover:text-blue-500 transition">🚩 Red Flag Reports</li>
              <li className="text-gray-400 hover:text-blue-500 transition">🛠️ Intervention Requests</li>
              <li className="text-gray-400 hover:text-blue-500 transition">🔍 Under Investigation</li>
              <li className="text-gray-400 hover:text-blue-500 transition">✅ Resolved Cases</li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contact Info</h4>
            <div className="space-y-2 text-gray-400 text-sm">
              <div className="flex items-center gap-2">📧 report@ireporter.org</div>
              <div className="flex items-center gap-2">📞 0800-REPORT (0800-737678)</div>
              <div className="flex items-center gap-2">📍 Lagos, Nigeria</div>
              <div className="flex items-center gap-2">🕒 24/7 Hotline Available</div>
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="border-t border-gray-800 py-4 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
          <div>&copy; {currentYear} iReporter. All rights reserved.</div>
          <div className="flex gap-4 flex-wrap justify-center md:justify-end">
            <a href="#" className="hover:text-blue-500 transition">Privacy Policy</a>
            <a href="#" className="hover:text-blue-500 transition">Terms of Service</a>
            <a href="#" className="hover:text-blue-500 transition">Help Center</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
