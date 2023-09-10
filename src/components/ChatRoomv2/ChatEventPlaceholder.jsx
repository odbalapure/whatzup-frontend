const ChatEventPlaceholder = () => {
  return (
    <>
      {[1, 2].map((_, index) => (
        <div
          id={index}
          key={index}
          className="d-flex"
          style={{ borderBottom: "1px solid lightgray" }}
        >
          <div>
            <img
              src="https://iconicentertainment.in/wp-content/uploads/2013/11/dummy-image-square.jpg"
              height="60px"
              width="60px"
            />
          </div>
            <div className="bg-light placeholder col-7"></div>
            <div className="bg-light placeholder col-4"></div>
        </div>
      ))}
    </>
  );
};

export default ChatEventPlaceholder;
