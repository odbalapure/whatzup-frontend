import { useEffect, useRef, useState } from "react";
import ChatEventPlaceholder from "./ChatEventPlaceholder";
import useAsync from "../../hooks/useAsync";
import { Api } from "../../utils/Api";
import ChatEmptyMessages from "./ChatEmptyMessages";
import isEmpty from "../../utils/common";

const ChatRoomV2 = ({ socket }) => {
  const { data: eventsList } = useAsync("events", "GET", null, false);
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [eventId, setEventId] = useState(null);
  const user = JSON.parse(localStorage.getItem("whatzup_user"));

  useEffect(() => {
    if (eventId) {
      Api(`messages/${eventId}`, "GET", null, false).then((data) => {
        setMsgList(data?.messages);
      });
    }
  }, [eventId]);

  const sendMsg = async () => {
    if (!msg) return;
    const msgData = {
      author: user.name,
      email: user.email,
      message: msg,
      time:
        new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes(),
      msgId: Date.now().toString(),
      eventId
    };

    await socket.emit("send_msg", msgData);
    setMsgList((prev) => [...prev, msgData]);
    setMsg(null);
  };

  useEffect(() => {
    socket.on("recieve_msg", (data) => {
      setMsgList((prev) => [...prev, data]);
    });
  }, [socket]);

  return (
    <div
      className="d-flex"
      style={{ border: "1px solid lightgray", height: "50rem" }}
    >
      {/* Show event list */}
      <div
        id="rooms"
        className="card"
        style={{ width: "30%", height: "50rem" }}
      >
        {eventsList?.events ? (
          eventsList?.events?.map((event) => (
            <div
              key={event?._id}
              className="d-flex align-items-center shadow bg-body rounded bg-danger"
              onClick={() => {
                setEventId(event?._id);
                setMsgList([]);
                socket.emit("join_room", event?._id.toString());
              }}
              style={{
                borderBottom: "1px solid lightgray",
                cursor: "pointer"
              }}
            >
              <img
                width="20%"
                className="shadow bg-body rounded"
                src={event?.image}
                height="60px"
              />
              <div className="p-3">{event?.event}</div>
            </div>
          ))
        ) : (
          <ChatEventPlaceholder />
        )}
      </div>
      {/* Show message  */}
      <div
        id="messages-show-send-wrapper"
        className="card"
        style={{ width: "70%" }}
      >
        {!eventId ? (
          <ChatEmptyMessages
            message={"Please select an event to start chatting"}
          />
        ) : (
          <div
            style={{ overflow: "auto" }}
            className="card-body"
            id="messages-show-full"
          >
            {!isEmpty(msgList) ? (
              msgList?.map((msg) => (
                <div
                  style={{
                    maxWidth: "25rem",
                    borderRadius: "2rem",
                    marginLeft: msg.email === user.email && "50%"
                  }}
                  className={[
                    "card-body w-20 mb-3 p-3",
                    msg.email === user.email
                      ? "alert alert-success"
                      : "alert alert-primary"
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  key={msg.msgId}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Your messages will appear green"
                >
                  <div>
                    {msg.author} ({msg.time})
                  </div>
                  <div className="lead">{msg.message}</div>
                </div>
              ))
            ) : (
              <ChatEmptyMessages
                message={
                  "There are no old messages present, this is the very beginning of the conversation."
                }
              />
            )}
          </div>
        )}
        {eventId && (
          <div className="card-footer">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                e.target.reset();
              }}
              className="d-flex justify-content-around align-items-center"
            >
              <div style={{ width: "90%" }}>
                <input
                  type="text"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  onChange={(e) => setMsg(e.target.value)}
                  style={{ borderRadius: "2rem" }}
                />
              </div>
              <button
                type="submit"
                className="btn btn-success bi bi-send-fill"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Send Message"
                onClick={sendMsg}
                style={{ borderRadius: "2rem" }}
              ></button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomV2;