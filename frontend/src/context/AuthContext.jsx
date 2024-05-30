import { createContext, useEffect, useState } from "react";
import axios from "axios"; // Import axios for making HTTP requests

export const AuthContext = createContext();
export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null); // Initialize currentUser as null initially
  useEffect(() => {
    const fetchUserDetails = async () => {
      const token = localStorage.getItem("token");
      
      // Check if the token is present
      if (token) {
        try {
          const response = await axios.get("https://intellilearn-f0dw.onrender.com/api/check-auth", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
  
          setCurrentUser(response.data.user);
        } catch (error) {
          console.error("Error fetching user details:", error);
          setCurrentUser(null); // Set currentUser to null in case of errors
        }
      } else {
        setCurrentUser(null); // Set currentUser to null if token is not present
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
