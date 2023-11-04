import React from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "bootstrap/dist/css/bootstrap.min.css";
import homeImage from "./assets/home-img.png";

function App() {
  return (
    <div className="App">
      <Header />
      <Item />
      <img className="bottom-space" src={homeImage} />
      <Footer />
    </div>
  );
}

export default App;
