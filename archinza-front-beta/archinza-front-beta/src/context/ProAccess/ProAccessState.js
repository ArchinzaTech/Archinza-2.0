import React, { useContext, useState } from "react";

import ProAccessContext from "./ProAccessContext";

const ProAccessState = (props) => {
  const [entry, setEntry] = useState({});

  const update = (data) => {
    setEntry(data);
  };
  return (
    <ProAccessContext.Provider value={{ data: entry, update }}>
      {props.children}
    </ProAccessContext.Provider>
  );
};


export const useProAccess = () => {
  return useContext(ProAccessContext);
};

export default ProAccessState;
