import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import homeImage from "./assets/home-img.png";
import Item from "./components/Item";

function App() {

  const NFTID = "br5f7-7uaaa-aaaaa-qaaca-cai"
  return (
    <div className="App">
      <Header />
      <Item id={NFTID} />
      <img className="bottom-space" src={homeImage} />
      <Footer />
    </div>
  );
}

export default App;
