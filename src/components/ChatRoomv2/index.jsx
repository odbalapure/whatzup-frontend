import { useEffect, useRef, useState } from "react";
import ChatEventPlaceholder from "./ChatEventPlaceholder";
import useAsync from "../../hooks/useAsync";
import { Api } from "../../utils/Api";
import ChatEmptyMessages from "./ChatEmptyMessages";
import isEmpty, { convertTo12HourFormat } from "../../utils/common";
import Spinner from "../common/Spinner";

const ChatRoomV2 = ({ socket }) => {
  const { data: eventsList } = useAsync("events", "GET", null, false);
  const [msg, setMsg] = useState("");
  const [msgList, setMsgList] = useState([]);
  const [eventId, setEventId] = useState(null);
  const user = JSON.parse(localStorage.getItem("whatzup_user"));
  const [noMessages, setNoMessages] = useState(false);
  const showMessageRef = useRef(null);

  const scrollToBottom = () => {
    if (showMessageRef.current) {
      showMessageRef.current.scrollTop = showMessageRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [msgList, eventId]);

  useEffect(() => {
    if (eventId) {
      Api(`messages/${eventId}`, "GET", null, false).then((data) => {
        if (data?.messages?.length === 0) {
          setNoMessages(true);
        }
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
      time: convertTo12HourFormat(new Date()),
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

  const renderPlaceholderOrLoader = () => {
    if (!noMessages) {
      return (
        <div
          className="d-flex justify-content-center"
          style={{ marginTop: "25%" }}
        >
          <Spinner
            message="Loading messages please wait..."
            tip="If its taking too long, please refresh the page!"
            top="15rem"
          />
        </div>
      );
    }
    return (
      <ChatEmptyMessages
        height="30"
        width="30"
        message="No messages to display!"
      />
    );
  };

  return (
    <div
      className="d-flex"
      style={{ border: "1px solid lightgray", height: "40rem" }}
    >
      {/* Show event list */}
      <div
        id="rooms"
        className="card"
        style={{ width: "30%", height: "40rem" }}
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
                cursor: "pointer",
                pointerEvents: event?._id === eventId && "none"
              }}
              disabled
            >
              <img
                width="20%"
                className="shadow bg-body rounded"
                src={event?.image}
                height="60px"
                alt="event_image_desktop"
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
        {eventId && (
          <div className="card-header">
            <div className="lead fw-bold">
              {
                eventsList?.events?.find((event) => event._id === eventId)
                  ?.event
              }
            </div>
          </div>
        )}
        {!eventId ? (
          <ChatEmptyMessages
            height="50"
            width="50"
            message={"Please select an event to start chatting"}
          />
        ) : (
          <div
            style={{ overflow: "auto" }}
            className="card-body"
            id="messages-show-full-desktop"
            ref={showMessageRef}
          >
            {!isEmpty(msgList) ? (
              <div className="d-flex flex-column">
                {msgList?.map((msg) => (
                  <div
                    style={{
                      maxWidth: "20rem",
                      display: "inline-block"
                    }}
                    className={[
                      msg.email === user.email
                        ? "alert alert-success align-self-end"
                        : "alert alert-primary align-self-start"
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    key={msg.msgId}
                    title="Your messages will appear green"
                  >
                    <div className="d-flex justify-content-between">
                      <div className="fw-bold">
                        {msg.email === user.email ? "You" : msg.author}{" "}
                      </div>
                    </div>
                    <div className="">{msg.message}</div>
                    <div className="text-end">{msg.time}</div>
                  </div>
                ))}
              </div>
            ) : (
              renderPlaceholderOrLoader()
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
                className="btn btn-success"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Send Message"
                onClick={sendMsg}
                style={{ borderRadius: "50%" }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  class="bi bi-send-fill"
                  viewBox="0 0 16 16"
                >
                  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083l6-15Zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471-.47 1.178Z" />
                </svg>
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomV2;
