import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import api from './axios';
import UserContext, { UserProvider } from './UserContext';

import HomePage from './View/Pages/HomePage';
import LogInPage from './View/Pages/LogInPage';
import SignUp from './View/Pages/SignUpPage';
import ProfilePage from './View/Pages/ProfilePage';
import FriendPage from './View/Pages/FriendPage';
import NotificationPage from './View/Pages/NotificationPage';
import AuthRoute from './Routes/AuthRoute';
import PostPage from './View/Pages/PostPage';
import CreatePost from './View/Pages/CreatePost';

const App = () => {
  
  const { setUserDetails, userDetails,setLoading } = useContext(UserContext); // Use context here

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if(userDetails) return;
        const response = await api.get('/user/me'); // Await the result properly
        setUserDetails(response.data); // Set the user details in context
        setLoading(false);
      } catch (err) {
        setLoading(false)
        setUserDetails(undefined);
        console.error("Error fetching user profile:", err);
      }
    };

    fetchProfile(); // Call the function to fetch user data
  }, [setUserDetails]); // Add setUserDetails as a dependency

  return (
    <Router>
      <Routes>
        <Route path='/' element={<Navigate to='/feed'></Navigate>}></Route>
        <Route path="log-in" element={<LogInPage />} />
        <Route path="sign-up" element={<SignUp />} />
        <Route path="/feed" element={<AuthRoute><HomePage /></AuthRoute>} />
        <Route path="/profile/:user_name" element={<AuthRoute><ProfilePage /></AuthRoute>} />
        <Route path="/friend" element={<AuthRoute><FriendPage /></AuthRoute>} />
        <Route path="/notifications" element={<AuthRoute><NotificationPage /></AuthRoute>} />
        <Route path='/post/:post_id' element={<AuthRoute><PostPage/></AuthRoute>}></Route>
        <Route path='/post/create' element={<AuthRoute><CreatePost/></AuthRoute>}></Route>
      </Routes>
    </Router>
  );
};

// Wrap App with UserProvider when rendering
export default () => (
  <UserProvider>
    <App />
  </UserProvider>
);
