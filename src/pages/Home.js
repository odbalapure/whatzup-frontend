import { Suspense, lazy } from "react";
const Events = lazy(() => import("../components/Events"));
const Urgent = lazy(() => import("../components/Urgent"));
const Footer = lazy(() => import("../components/Footer"));
const Announcements = lazy(() => import("../components/Announcements"));
const Spinner = lazy(() => import("../components/common/Spinner"));

function Home() {
  return (
    <div>
      <Suspense fallback={<Spinner top="20rem" />}>
        <div className="container">
          <Urgent />
          <Events />
          <Announcements />
        </div>
        <Footer />
      </Suspense>
    </div>
  );
}

export default Home;
