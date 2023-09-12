import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Event from "./pages/Event";
import SingleEvent from "./pages/SingleEvent";
import Announcement from "./pages/Announcement";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword";
import Navbar from "./components/Navbar";
// import { useEffect, useState } from "react";

function App() {
  // const [orientation, setOrientation] = useState(window.orientation);

  // useEffect(() => {
  //   const handleOrientationChange = () => {
  //     setOrientation(window.orientation);
  //   };

  //   window.addEventListener("resize", () => {
  //     handleOrientationChange();
  //     window.location.reload();
  //   });
  //   return () => {
  //     window.removeEventListener("resize", handleOrientationChange);
  //   };
  // }, [orientation]);

  return (
    <div style={{ marginTop: "5rem" }}>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/chat" element={<Chat />}></Route>
          <Route path="/event" element={<Event />}></Route>
          <Route path="/event/:id" element={<SingleEvent />}></Route>
          <Route path="/announcement" element={<Announcement />}></Route>
          <Route path="/forgot-password" element={<ForgotPassword />}></Route>
          <Route
            path="/reset-password/:email"
            element={<ResetPassword />}
          ></Route>
          <Route
            path="*"
            element={
              <div className="container">
                <div
                  className="d-flex justify-content-center align-items-center alert alert-danger"
                  role="alert"
                >
                  This page does not exist{" "}
                  <span style={{ fontSize: "2rem" }}>😕</span>
                </div>
              </div>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
