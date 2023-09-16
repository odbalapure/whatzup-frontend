import { lazy, Suspense } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Spinner from "./components/common/Spinner";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const Chat = lazy(() => import("./pages/Chat"));
const Event = lazy(() => import("./pages/Event"));
const SingleEvent = lazy(() => import("./pages/SingleEvent"));
const Announcement = lazy(() => import("./pages/Announcement"));
const ResetPassword = lazy(() => import("./components/ResetPassword"));
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const Navbar = lazy(() => import("./components/Navbar"));
const PageNotFound = lazy(() => import("./components/common/PageNotFound"));

function App() {
  return (
    <div style={{ marginTop: "5rem" }}>
      <Suspense fallback={<Spinner top="20rem" />}>
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
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </Suspense>
    </div>
  );
}

export default App;
