import React, { createContext, useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Routing from "./Routing";
import "./common.scss";

// Import AOS styles
import AOS from "aos";
import "aos/dist/aos.css";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/effect-coverflow";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AuthState from "./context/Auth/AuthState";
import ProAccessState from "./context/ProAccess/ProAccessState";
import BusinessAccountState from "./context/BusinessAccount/BusinessAccountState";
import GlobalDataState from "./context/GlobalData/GlobalDataState";

export const DeContext = createContext();

function App() {
  useEffect(() => {
    AOS.init({
      duration: 1500,
      // once: true,
    });
  }, []);

   // 🔁 deChangRole state with localStorage support
  const [deChangRole, setDeChangRole] = useState(() => {
  const storedValue = localStorage.getItem("deChangRole");
  return storedValue === "true"; // Convert string to boolean
});

useEffect(() => {
  localStorage.setItem("deChangRole", deChangRole);
}, [deChangRole]);


  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');

  return (
    <>
      <DeContext.Provider value={{ deChangRole, setDeChangRole }}>
        <ToastContainer />
        <BrowserRouter>
          <AuthState skipInitialGetUser={!!token}>
            <ProAccessState>
              <BusinessAccountState>
                <GlobalDataState>
                  <Routes>
                    <Route path="*" element={<Routing />} />
                  </Routes>
                </GlobalDataState>
              </BusinessAccountState>
            </ProAccessState>
          </AuthState>
        </BrowserRouter>
      </DeContext.Provider>
    </>
  );
}

export default App;

