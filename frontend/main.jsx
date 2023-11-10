import React from "react";
import ReactDOM from "react-dom";
import { createRoot } from 'react-dom/client';
import App from "./App";
import { Principal } from "@dfinity/principal";

const CURRENT_USER_ID = Principal.fromText("2vxsx-fae");
export default CURRENT_USER_ID;
const init = async () => {
  
  const domNode = document.getElementById('root');
  const root = createRoot(domNode);
  root.render(<App />);
};

init();
