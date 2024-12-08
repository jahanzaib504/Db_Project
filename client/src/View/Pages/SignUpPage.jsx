import { useState, useContext } from 'react';
import api from '../../axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../../UserContext';
import { Link } from 'react-router-dom';
function Signup() {
  const [user, setUser] = useState({ user_name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const { setUserDetails, setLoading } = useContext(UserContext); // Access context correctly
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      // POST to the correct signup endpoint
      const response = await api.post('/auth/sign-up', user); // Adjusted to use 'sign-up' endpoint
      const token = response.data.token;

      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        localStorage.setItem('authToken', token);
      }

      // Fetch user data after successful signup
      const userResponse = await api.get('/user/me');
      setSuccess('Account created successfully!');
      setUser({ user_name: '', email: '', password: '' }); // Clear form after successful signup
      const { setUserDetails, setLoading } = useContext(UserContext); // Access context correctly
      // Redirect to the user's profile page
      navigate(`/profile/${user.user_name}`);
    } catch (err) {
      // Set the error message based on the response or a general message
      setError(err.response?.data?.message || 'An error occurred during sign-up.');
    }
  };

  return (
    <div>
      <div className="background-layer2"></div>

      <section className="login-signup">
        <div className="container">
          <div className="sign-up">
            <h1 className="heading">Welcome!</h1>

            {error && <div className="error-message">{error}</div>}  {/* Display error message */}
            {success && <div className="success-message">{success}</div>}  {/* Display success message */}

            <form onSubmit={handleSubmit}>
              <div className="text">
                <img src="https://i.postimg.cc/1zgS8WTF/user.png" alt="icon" height="20" />
                <input
                  type="text"
                  name="user_name"
                  value={user.user_name}
                  onChange={handleChange}
                  placeholder="Name"
                  required
                />
              </div>

              <div className="text">
                <img src="https://i.postimg.cc/DZBPRgvC/email.png" alt="icon" height="12" />
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={handleChange}
                  placeholder="Email"
                  required
                />
              </div>

              <div className="text">
                <img src="https://i.postimg.cc/Nj5SDK4q/password.png" alt="icon" height="20" />
                <input
                  type="password"
                  name="password"
                  value={user.password}
                  onChange={handleChange}
                  placeholder="Password"
                  required
                />
              </div>

              <button type="submit">CREATE ACCOUNT</button>
            </form>

            <p className="conditions pt-3">
              Already have an account? <Link to='/log-in'>Sign in</Link> {/* Link to login page */}
            </p>
          </div>

          <div className="text-container">
            <h1 className="pb-1">Glad to see you!</h1>
            <p>Welcome, please fill in the blanks to sign up</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Signup;
