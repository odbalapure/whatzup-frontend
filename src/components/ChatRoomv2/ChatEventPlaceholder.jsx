const ChatEventPlaceholder = () => {
  return (
    <>
      {[1, 2].map((_, index) => (
        <div
          id={index}
          key={index}
          className="d-flex align-items-center"
          style={{ borderBottom: "1px solid lightgray" }}
        >
          <div>
            <img
              src="https://iconicentertainment.in/wp-content/uploads/2013/11/dummy-image-square.jpg"
              height="60px"
              width="60px"
              alt="placeholder-for-event"
              loading="lazy"
            />
          </div>
          &nbsp;&nbsp;
          <div className="bg-secondary placeholder col-7"></div>
        </div>
      ))}
    </>
  );
};

export default ChatEventPlaceholder;
