import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header.jsx/Header";
import Footerr from "./components/Footer/Footer";
import Home from "./pages/Home";
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
      </Routes>
      <Footerr />
    </BrowserRouter>
  );
}

export default App;
