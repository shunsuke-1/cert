import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ArticleDetail from "./pages/ArticleDetail";
import EditArticle from "./pages/EditArticle";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import UserProfile from "./pages/UserProfile";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/articles/:id" element={<ArticleDetail />} />
              <Route path="/articles/:id/edit" element={<EditArticle />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/users/:id" element={<UserProfile />} />
            </Routes>
          </main>
        </div>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
