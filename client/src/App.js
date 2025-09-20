import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import BasicTypes from "./pages/BasicTypes";
import Views from "./pages/Views";
import Modifiers from "./pages/Modifiers";
import Layout from "./pages/Layout";
import Navigation from "./pages/Navigation";
import DataFlow from "./pages/DataFlow";
import Animation from "./pages/Animation";
import Gestures from "./pages/Gestures";
import Drawing from "./pages/Drawing";
import Performance from "./pages/Performance";
import Testing from "./pages/Testing";
import AdminEditor from "./components/AdminEditor";
import AdminAccess from "./components/AdminAccess";
import "./index.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Route - Full Screen */}
        <Route path="/admin" element={<AdminEditor />} />
        
        {/* Main Site Routes */}
        <Route path="/*" element={
          <div className="min-h-screen bg-white">
            <AdminAccess />
            <Navbar />
            <div className="flex">
              <Sidebar />
              <main className="flex-1 max-w-4xl mx-auto px-6 py-8">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/basic-types" element={<BasicTypes />} />
                  <Route path="/views" element={<Views />} />
                  <Route path="/modifiers" element={<Modifiers />} />
                  <Route path="/layout" element={<Layout />} />
                  <Route path="/navigation" element={<Navigation />} />
                  <Route path="/data-flow" element={<DataFlow />} />
                  <Route path="/animation" element={<Animation />} />
                  <Route path="/gestures" element={<Gestures />} />
                  <Route path="/drawing" element={<Drawing />} />
                  <Route path="/performance" element={<Performance />} />
                  <Route path="/testing" element={<Testing />} />
                </Routes>
              </main>
            </div>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;