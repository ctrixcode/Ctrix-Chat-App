import Signin from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from "./pages/Home";

import { ContextWrapper } from "./components/GlobalStore/Context";

import { Route, Routes, Navigate } from "react-router-dom";

export default function App() {
  return (
    <>
    <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    <Routes>
      <Route path="/" element={<Navigate replace to="signin" />} />
      <Route
        path="/main"
        element={
          <ContextWrapper>
            <Home />
          </ContextWrapper>
        }
      />
      <Route path="/signin" element={<Signin />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
    </>
  );
}
