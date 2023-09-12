import { useEffect, useRef, useState } from "react";
import useAsync from "../../hooks/useAsync";
import { Api } from "../../utils/Api";
import ChatEventPlaceholderMobile from "./ChatEventPlaceholderMobile";
import isEmpty, { convertTo12HourFormat } from "../../utils/common";
import ChatEmptyMessages from "./ChatEmptyMessages";

const ChatRoomV2Mobile = ({ socket }) => {
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

  const renderPlaceholderOrLoader = () => {
    if (!noMessages) {
      return (
        <div
          className="d-flex justify-content-center"
          style={{ marginTop: "50%" }}
        >
          <div
            className="spinner-border text-secondary"
            role="status"
            style={{ height: "4rem", width: "4rem" }}
          />
        </div>
      );
    }
    return <ChatEmptyMessages message="No messages to display!" />;
  };

  return (
    <div style={{ width: "100%" }}>
      <div style={{ height: "40rem" }} className="card">
        <div style={{ display: !eventId ? "none" : "block" }}>
          <div className="card-header d-flex align-items-center">
            <div onClick={() => setEventId(null)}>
              <i class="bi bi-arrow-left-circle-fill fs-4" />
            </div>
            &nbsp;&nbsp;
            <div className="lead fw-bold">
              {
                eventsList?.events?.find((event) => event._id === eventId)
                  ?.event
              }
            </div>
          </div>
        </div>
        <div
          ref={showMessageRef}
          style={{ overflow: "auto", padding: 0 }}
          className="card-body"
        >
          {/* Event list */}
          <div style={{ display: eventId ? "none" : "block" }}>
            {eventsList?.events ? (
              eventsList?.events?.map((event) => (
                <div
                  key={event?._id}
                  className="d-flex align-items-center shadow p-3"
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
                    alt="event-thumbnail"
                  />
                  <div className="p-3">{event?.event}</div>
                </div>
              ))
            ) : (
              <ChatEventPlaceholderMobile />
            )}
          </div>
          {/* Event messages */}
          <div style={{ display: !eventId ? "none" : "block" }} className="p-2">
            {!isEmpty(msgList) ? (
              <div className="d-flex flex-column">
                {msgList?.map((msg) => (
                  <div
                    style={{
                      maxWidth: "15rem",
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
                    data-bs-toggle="tooltip"
                    data-bs-placement="top"
                    title="Your messages will appear green"
                  >
                    <div className="fw-bold">
                      {msg.email === user.email ? "You" : msg.author}{" "}
                    </div>
                    <div>{msg.message}</div>
                    <div className="text-end">{msg.time}</div>
                  </div>
                ))}
              </div>
            ) : (
              renderPlaceholderOrLoader()
            )}
          </div>
        </div>
        {eventId ? (
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
              &nbsp;
              <button
                type="submit"
                className="btn btn-success bi bi-send-fill"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Send Message"
                onClick={sendMsg}
                style={{ borderRadius: "50%" }}
              ></button>
            </form>
          </div>
        ) : (
          <div className="text-center text-muted p-3">
            <i style={{ fontSize: "2rem" }} className="bi bi-calendar-day" />
            <div>Please select an event to start chatting</div>
            <div>Whatzup ©, 2023</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomV2Mobile;
