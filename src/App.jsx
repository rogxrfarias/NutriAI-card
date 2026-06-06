import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthProvider";

// pages
import Home from "./pages/HomeView";
import UserAuth from "./pages/admin/UserAuth";
import PrivateRoute from "./contexts/PrivateRoute";
import AIChatPage from "./pages/ChatView";
import AdminView from "./pages/admin/AdminView";

const App = () => {
  return (
    <div className="flex flex-center justify-center w-screen h-full bg-gray-50">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<UserAuth />} />
            <Route path="/chat" element={<AIChatPage />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <AdminView />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
