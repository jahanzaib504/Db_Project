import { useContext } from "react";
import { Navigate } from "react-router-dom";  // React Router v6 uses Navigate for redirects
import UserContext from '../UserContext';

const AuthRoute = ({children}) => {
    const { userDetails, loading } = useContext(UserContext);

    // If the user is not logged in, redirect to login page
    if(loading)
        return <div>Loading.......</div>
    if(!loading && !userDetails)
        return <Navigate to='/log-in'/>

    // If the user is logged in, render the children (protected route)
    return children;
}

export default AuthRoute;
