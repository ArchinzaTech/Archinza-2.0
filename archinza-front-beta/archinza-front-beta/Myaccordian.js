import React, { useState } from "react";

const Myaccordian = ({ question, answer }) => {
  const [show, setShow] = useState(false);
  return (
    <>
      <div className="main-heading">
        <h3>{question}</h3>
        <p onClick={() => setShow(!show)}>
          {show ? (
            <i className="fa-solid fa-minus"></i>
          ) : (
            <i className="fa-solid fa-plus"></i>
          )}
        </p>
      </div>

      {show && <p className="answers">{answer}</p>}
    </>
  );
};
export default Myaccordian;
