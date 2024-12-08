import React, { createContext, useState } from 'react';

// Create the context
const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userDetails, setUserDetails] = useState(undefined);
  const [loading, setLoading] = useState(true);
  return (
    <UserContext.Provider value={{ userDetails, setUserDetails, loading, setLoading}}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
