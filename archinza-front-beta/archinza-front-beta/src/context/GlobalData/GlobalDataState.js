import React, { useContext, useEffect, useState } from "react";

import GlobalDataContext from "./GlobalDataContext";
import http from "../../helpers/http";
import config from "../../config/config";

const GlobalDataState = (props) => {
  const [data, setData] = useState(null);
  const base_url = config.api_url;

  useEffect(() => {
    const fetchData = async () => {
      const [optionsResponse, servicesResponse, businessTypes] =
        await Promise.all([
          http.get(base_url + "/business/options"),
          http.get(base_url + "/services"),
          http.get(base_url + "/business/business-types"),
        ]);
      const options = optionsResponse.data;
      options.services = servicesResponse.data;
      options.business_types = businessTypes.data;
      setData(options);
    };

    fetchData();
  }, []);

  return (
    <GlobalDataContext.Provider value={data}>
      {props.children}
    </GlobalDataContext.Provider>
  );
};

export const useGlobalDataContext = () => {
  return useContext(GlobalDataContext);
};

export default GlobalDataState;
