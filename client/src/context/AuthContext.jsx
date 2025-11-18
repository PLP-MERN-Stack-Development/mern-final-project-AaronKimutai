import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";
import axiosInstance from "../services/axiosInstance";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const { isLoaded: isClerkAuthLoaded, isSignedIn: clerkSignedIn, signOut } = useClerkAuth();
  const { isLoaded: isClerkUserLoaded, user } = useUser();

  const [userData, setUserData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const clerkReady = isClerkAuthLoaded && isClerkUserLoaded;

  const fetchUser = useCallback(async () => {
    if (!clerkReady || !clerkSignedIn) {
      setUserData(null);
      setProfileLoading(false);
      return;
    }

    setProfileLoading(true);

    try {
      const res = await axiosInstance.get("/users/me");
      setUserData(res.data);
      setAuthError(null);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
      setAuthError(error);
      setUserData(null);
    } finally {
      setProfileLoading(false);
    }
  }, [clerkReady, clerkSignedIn]);

  useEffect(() => {
    if (!clerkReady) return;
    fetchUser();
  }, [clerkReady, clerkSignedIn, fetchUser]);

  const logout = useCallback(async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Failed to sign out from Clerk:", error);
    } finally {
      setUserData(null);
    }
  }, [signOut]);

  const isAdmin = userData?.role === "admin";

  const contextValue = useMemo(() => ({
    userData,
    authLoading: !clerkReady || profileLoading,
    isAdmin,
    logout,
    setUserData,
    isSignedIn: Boolean(clerkSignedIn),
    hasUserProfile: Boolean(userData),
    isAuthReady: clerkReady && !profileLoading,
    authError,
    clerkUser: user,
    refreshUser: fetchUser,
  }), [userData, profileLoading, clerkReady, isAdmin, logout, clerkSignedIn, authError, user, fetchUser]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
