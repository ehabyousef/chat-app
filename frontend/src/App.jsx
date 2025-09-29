import Navbar from "./components/Navbar";
import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAuthStore } from "./store/useAuthStore";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
function App() {
  const { authUser, isCheckingAuth, checkAuth, onlineUsers, startAutoRefresh } =
    useAuthStore();
  console.log("🚀 ~ App ~ onlineUsers:", onlineUsers);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    let refreshInt;
    if (authUser) {
      refreshInt = startAutoRefresh();
    }
    return () => {
      if (refreshInt) clearInterval(refreshInt);
    };
  }, [authUser, startAutoRefresh]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="h-screen flex items-center justify-center bg-background text-foreground">
        <Loader2 className="animate-spin size-10 text-muted-foreground" />
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors">
      <Navbar />
      <main className="pt-16">
        <Routes>
          <Route
            path="/"
            element={authUser ? <Home /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!authUser ? <Login /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUp /> : <Navigate to="/" />}
          />
          <Route
            path="/profile"
            element={authUser ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
      <Toaster />
    </div>
  );
}

export default App;
