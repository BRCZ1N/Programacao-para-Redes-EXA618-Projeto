import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Signup} from "./pages/Signup";
import {Login} from "./pages/Login";
import {Home} from "./pages/Home";
import {ForgotPassword} from "./pages/ForgotPassword";
import {Dashboard} from './pages/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element= {<Signup />}/>
        <Route path="/forgot-password" element= {<ForgotPassword />}/>
        <Route path="/dashboard" element= {<Dashboard />}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

