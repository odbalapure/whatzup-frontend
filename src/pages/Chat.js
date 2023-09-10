import { useState } from "react";
import { useGlobalContext } from "../context";

import ChatRoom from "../components/ChatRoom";
import io from "socket.io-client";
import CustomToast from "../components/common/Toast";
import { showToast } from "../utils/common";
import useAsync from "../hooks/useAsync";
import ChatRoomV2 from "../components/ChatRoomv2";

/* Socket io conenction */
const socket = io(
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5000"
    : process.env.REACT_APP_API_URL
);

function Chat() {
  const { data } = useAsync("events", "GET", null, false);
  const [room, setRoom] = useState("");
  const [isError, setIsError] = useState("");
  const { userName } = useGlobalContext();
  const [roomJoined, setRoomJoined] = useState(false);

  /**
   * @desc Function to join chat room
   */
  const joinRoom = () => {
    if (room !== "" && userName !== "") {
      setRoomJoined(true);
      socket.emit("join_room", room);
    } else {
      setIsError(true);
      showToast("Please choose a room to join the chat!", "error");
    }
  };

  return (
    <div className="container" style={{ marginTop: "5rem" }}>
      <ChatRoomV2
        socket={socket}
        userName={userName}
        room={room}
        roomJoined={roomJoined}
        setRoomJoined={setRoomJoined}
      />
    </div>
  );
}

export default Chat;
