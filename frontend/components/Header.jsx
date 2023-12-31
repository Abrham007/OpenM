import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import homeImage from "../assets/home-img.png";
import { BrowserRouter, Link, Routes, Route } from "react-router-dom";
import Minter from "./Minter";
import Gallery from "./Gallery";
import { openm } from "../../src/declarations/openm/index.js"
import {Principal} from "@dfinity/principal"
import CURRENT_USER_ID from "../main.jsx";

function Header() {

  const [ userOwnedGallery, setOwndedGallery] = useState();
  const [listingGallery, setListingGallery] = useState();

  async function getNFTs() {

    const userNFTs = await openm.getOwnedNFTs(CURRENT_USER_ID);
    setOwndedGallery(<Gallery title={"My NFT"} ids={userNFTs} role={"collection"}/>)

    const listedNFTIds = await openm.getListedNFTs();
    setListingGallery(<Gallery title={"Discover"}  ids={listedNFTIds} role={"discover"}/>)
  }

  useEffect(() => {
    getNFTs();
  },[]);

  return (
    <BrowserRouter forceRefresh={true}>
    <div className="app-root-1">
      <header className="Paper-root AppBar-root AppBar-positionStatic AppBar-colorPrimary Paper-elevation4">
        <div className="Toolbar-root Toolbar-regular header-appBar-13 Toolbar-gutters">
          <div className="header-left-4"></div>
          <img className="header-logo-11" src={logo} />
          <div className="header-vertical-9"></div>
            <Link reloadDocument to={"/"}>
              <h5 className="Typography-root header-logo-text">OpenM</h5>
            </Link>
          <div className="header-empty-6"></div>
          <div className="header-space-8"></div>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link reloadDocument to={"/discover"}>Discover</Link>         
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link reloadDocument to={"/minter"}>Minter</Link>     
          </button>
          <button className="ButtonBase-root Button-root Button-text header-navButtons-3">
            <Link reloadDocument to={"/collection"}>My NFTs</Link>
          </button>
        </div>
      </header>
    </div>
      <Routes>
        <Route exact path="/" element={<img className="bottom-space" src={homeImage}></img> }/>
        <Route path="/discover" element={ listingGallery } />         
        <Route path="/minter" element={ <Minter /> } />        
        <Route path="/collection" element={ userOwnedGallery } />    
      </Routes>
    </BrowserRouter>
  );
}

export default Header;
