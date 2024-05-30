import { createContext,  useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [isSignedIn, setIsSignedIn] = useState(false);

  const checkToken = async () => {
    const token = await SecureStore.getItemAsync("access_token");
    console.log(token, '<<< token');
    if (token) setIsSignedIn(true);
  };

  useEffect(() => {
    checkToken();
  }, []);
  return(
    <AuthContext.Provider value={{isSignedIn, setIsSignedIn}}>{children}</AuthContext.Provider>
  )
}
