import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import homeImage from "./assets/home-img.png";
import Item from "./components/Item";
import Minter from "./components/Minter";

function App() {

  const NFTID = "bd3sg-teaaa-aaaaa-qaaba-cai"
  return (
    <div className="App">
      <Header />
      <Minter />
      {/* <Item id={NFTID} /> */}
      <img className="bottom-space" src={homeImage} />
      <Footer />
    </div>
  );
}

export default App;
