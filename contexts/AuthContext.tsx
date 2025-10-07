import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

// A mock user for demonstration purposes, as requested.
const MOCK_USER = {
    id: 'user-001-parliamentarian',
    name: 'ส.ส. วิโรจน์', // MP Wiroj
    email: 'wiroj.p@peoplesparty.or.th',
    imageUrl: `https://i.pravatar.cc/150?u=wiroj.p@peoplesparty.or.th`
};

interface User {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isGapiLoading: boolean;
  accessToken: string | null;
  authError: string | null;
  signIn: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isGapiLoading, setIsGapiLoading] = useState(true); // GAPI is now loading by default

  useEffect(() => {
    const handleClientLoad = () => {
        // gapi is loaded from index.html via an async script
        const script = document.querySelector('script[src="https://apis.google.com/js/api.js"]');
        
        const initGapi = () => {
             window.gapi.load('client', () => {
                setIsGapiLoading(false); // GAPI client base is ready
            });
        };

        if (window.gapi) {
            initGapi();
        } else if (script) {
            script.addEventListener('load', initGapi);
        } else {
            console.error("Could not find GAPI script tag.");
            setAuthError("Google services script not found. Drive and Calendar will be unavailable.");
            setIsGapiLoading(false);
        }
    };
    handleClientLoad();
  }, []);

  const isLoggedIn = !!user;

  const signIn = () => {
    if (isGapiLoading) {
      setAuthError("Google services are initializing. Please try again in a moment.");
      return;
    }
    setAuthError(null);
    setUser(MOCK_USER);
    // Set a mock token for any components that might expect one.
    // NOTE: This mock token will not work for actual Google API calls.
    // A real authentication flow is needed to get a valid token.
    setAccessToken('mock_access_token_for_demo');
  };

  const signOut = () => {
    setUser(null);
    setAccessToken(null);
  };

  const value = { 
    user, 
    isLoggedIn, 
    isGapiLoading, // This is now a real state
    accessToken, 
    authError, 
    signIn, 
    signOut 
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};