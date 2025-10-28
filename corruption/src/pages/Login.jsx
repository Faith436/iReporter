import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, ArrowRight } from 'lucide-react';

const SocialButton = ({ icon, text }) => (
  <button
    className="flex items-center justify-center w-full py-2 border border-gray-600 rounded-lg hover:bg-gray-700 transition duration-200 text-sm font-medium"
  >
    {icon}
    <span className="ml-2">{text}</span>
  </button>
);

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    // Admin login
    if (email === 'wisdom@example.com' && password === '12345') {
      localStorage.setItem('loggedInUser', JSON.stringify({ name: 'Wisdom', email, role: 'admin' }));
      navigate('/admin', { replace: true });
      return;
    }

    // Check registered user from localStorage
    const registeredUser = JSON.parse(localStorage.getItem('registeredUser'));
    if (registeredUser && email === registeredUser.email && password === registeredUser.password) {
      localStorage.setItem('loggedInUser', JSON.stringify({ ...registeredUser }));
      navigate('/dashboard', { replace: true });
      return;
    }

    // Invalid credentials
    setError('Invalid credentials. Please try again.');
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4" style={{ backgroundColor: '#211e2f' }}>
      <div className="flex w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden" style={{ backgroundColor: '#211e2f' }}>
        
        {/* Left Sidebar */}
        <div 
          className="hidden lg:block w-5/12 p-8 relative"
          style={{ background: 'linear-gradient(135deg, #6c4b9d 0%, #30264d 100%)' }}
        >
          <div className="text-3xl font-bold tracking-widest text-white mb-6">AMU</div>
          <button className="absolute top-8 right-8 flex items-center px-4 py-2 bg-white bg-opacity-10 rounded-full text-white text-sm hover:bg-opacity-20 transition duration-200">
            Back to website <ArrowRight className="w-4 h-4 ml-2" />
          </button>

          {/* Placeholder Image */}
          <div className="absolute inset-0 z-0 opacity-70">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: 'url("https://media.istockphoto.com/id/1766260321/photo/dark-money.webp?a=1&b=1&s=612x612&w=0&k=20&c=aXwUcoh-ZPTtAXw2SYwlxeBIZ5SvEMPsIMBe4eef9lA=")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.6)',
              }}
            ></div>
          </div>

          {/* Text Overlay */}
          <div className="absolute bottom-12 left-8 right-8 z-10 text-white">
            <h1 className="text-3xl font-semibold leading-snug mb-4">
              Capturing Moments,<br/>Creating Memories
            </h1>
            <div className="flex space-x-2 mt-4">
              <div className="w-5 h-1 bg-white rounded-full"></div>
              <div className="w-5 h-1 bg-white bg-opacity-50 rounded-full"></div>
              <div className="w-5 h-1 bg-white bg-opacity-50 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="w-full lg:w-7/12 p-12 text-white">
          <h2 className="text-4xl font-semibold mb-2">Log in</h2>
          <p className="mb-8 text-gray-400">
            Don't have an account? <a href="signup" className="text-purple-400 hover:underline">Create one</a>
          </p>

          <form className="space-y-4" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400"
              required
            />

            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border-none rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-gray-400 pr-10"
                required
              />
              <Eye className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 cursor-pointer" />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <div className="flex justify-between items-center text-sm pt-2">
              <label className="flex items-center text-gray-400">
                <input type="checkbox" className="mr-2 h-4 w-4 text-purple-600 bg-gray-700 border-gray-600 rounded focus:ring-purple-500" />
                Remember me
              </label>
              <a href="#" className="text-gray-400 hover:text-purple-400 hover:underline">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 text-lg font-semibold rounded-lg transition duration-200 bg-purple-700 hover:bg-purple-800"
            >
              Log in
            </button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="mx-4 text-sm text-gray-400">Or log in with</span>
            <div className="flex-grow border-t border-gray-600"></div>
          </div>

          <div className="flex space-x-4">
            <SocialButton icon={<span>G</span>} text="Google" />
            <SocialButton icon={<span>A</span>} text="Apple" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
