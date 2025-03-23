import React from "react";
import { Routes, Route } from "react-router-dom";  

import TokenFetcher from "./components/TokenFetcher";
import ListDevicesPage from "./pages/ListDevicesPage";
import TestPage from "./TestPage";

const App = () => {
  return (
    <div>
      <Routes> 
        <Route path="/" element={<TokenFetcher />} />  
        <Route path="/list-devices" element={<ListDevicesPage />} />  
      </Routes>
    </div>
  );
};

export default App;
