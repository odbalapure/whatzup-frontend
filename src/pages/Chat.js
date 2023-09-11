import { useCallback, useEffect, useState } from "react";
import { useGlobalContext } from "../context";

import io from "socket.io-client";
import { isMobile } from "../utils/common";
import ChatRoomV2 from "../components/ChatRoomv2";
import ChatRoomV2Mobile from "../components/ChatRoomv2/ChatRoomV2Mobile";
import Footer from "../components/Footer";
import { useNavigate } from "react-router";

/* Socket io conenction */
const socket = io(
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5000"
    : process.env.REACT_APP_API_URL
);

function Chat() {
  const navigate = useNavigate();
  const navigateToLogin = useCallback(
    () => navigate("/login", { replace: true }),
    [navigate]
  );

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("whatzup_user"));
    if (!user?.token) {
      localStorage.clear();
      navigateToLogin();
    }
  }, [navigateToLogin]);

  const { userName } = useGlobalContext();
  const [roomJoined, setRoomJoined] = useState(false);

  return (
    <>
      <div className="container" style={{ marginTop: "5rem" }}>
        {isMobile() ? (
          <ChatRoomV2Mobile socket={socket} />
        ) : (
          <ChatRoomV2
            socket={socket}
            userName={userName}
            roomJoined={roomJoined}
            setRoomJoined={setRoomJoined}
          />
        )}
      </div>
      <Footer />
    </>
  );
}

export default Chat;
