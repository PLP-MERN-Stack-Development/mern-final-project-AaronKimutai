import { useAuth } from "../context/AuthContext";

export default function useAuthHook() {
  const {
    userData,
    authLoading,
    isAdmin,
    logout,
    setUserData,
    isSignedIn,
    isAuthReady,
    hasUserProfile,
    clerkUser,
    refreshUser,
    authError,
  } = useAuth();

  return {
    userData,
    authLoading,
    isAdmin,
    logout,
    isSignedIn,
    setUserData,
    isAuthReady,
    hasUserProfile,
    clerkUser,
    refreshUser,
    authError,
  };
}
