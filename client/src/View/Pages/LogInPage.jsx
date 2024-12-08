import React, { useContext, useState } from 'react';
import api from '../../axios';
import UserContext from '../../UserContext';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom';
const LogInPage = () => {
  const [user, setUser] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { setUserDetails, setLoading } = useContext(UserContext); // Access context correctly
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { id, value } = e.target; // id and value from the input element
    setUser((prevUser) => ({
      ...prevUser,
      [id]: value, // Use id to update the state key (email or password)
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post('/auth/log-in', user);
      setSuccess('Log-in successful!');
      setUser({ email: '', password: '' });

      const token = response.data.token;
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('authToken', token);
      }

      // Fetch user data after login
      const userResponse = await api.get('/user/me');
      setUserDetails(userResponse.data); // Properly set user details
      setLoading(false);

      // Navigate to the feed page after successful login
      navigate('/feed'); // Use navigate to redirect
    } catch (err) {
      console.error('Log-in error:', err);
      setUserDetails(undefined);
      setLoading(false);
      setError(err.response?.data?.message || 'An error occurred during log-in.');
    }
  };

  return (
    <div>
      <div className="background-layer2"></div>
      <section className="login-signup">
        <div className="container">
          <div className="sign-up">
            <h1 className="heading">Welcome!</h1>

            <form onSubmit={handleLogin}> {/* Attach handleLogin to form submission */}
              <div className="text">
                <img
                  src="https://i.postimg.cc/DZBPRgvC/email.png"
                  alt="icon"
                  height="12"
                />
                <input
                  id="email" // Set id to email
                  type="email"
                  placeholder="Email"
                  value={user.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="text">
                <img
                  src="https://i.postimg.cc/Nj5SDK4q/password.png"
                  alt="icon"
                  height="20"
                />
                <input
                  id="password" // Set id to password
                  type="password"
                  placeholder="Password"
                  value={user.password}
                  onChange={handleChange}
                  required
                />
              </div>

              <button type="submit">Login</button> {/* Ensure button type is submit */}
            </form>

            <p className="conditions pt-3">
              Want to create an account? <Link to='/sign-up'>Sign up</Link>
            </p>
          </div>

          <div className="text-container">
            <h1 className="pb-1">Glad to see you!</h1>
            <p>Welcome, please fill in the blanks for login</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LogInPage;
