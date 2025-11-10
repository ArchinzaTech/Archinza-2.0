import React, { useState } from "react";
import { questions } from "./Api";
import Myaccordian from "./Myaccordian";

const Task= () => {
  const [data] = useState(questions);
  return (
    <>
      <section className="main-div">
        <div className="abc">
          <h5>Home | FAQs</h5>
          <h1>Frequently Asked Questions</h1>
        </div>
        <hr></hr>
        <button><h5>Grab Free Access Now <i className="fa-solid fa-arrow-right"></i></h5></button>
        <div className="main-container">
          {data.map((question , i) => {
            return <Myaccordian key={question} {...question} />;
          })}
        </div>
      </section>c
    </>
  );
};

export default Task