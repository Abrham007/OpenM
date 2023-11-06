import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
// import {Principal} from "@dfinity/principal"
import { idlFactory } from "../../src/declarations/nft/index.js"


function Item(props) {
  const [name, setName] = useState();

  // const id = Principal.fromText(props.id);
  const id = props.id;


  const localHost = "http://127.0.0.1:3000/";
  const agent = new HttpAgent({ host: localHost });

  async function loadNFT() {
    const NFTActor = Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    let name =  await NFTActor.getName();
    setName(name);
    
  }

  useEffect(() => {
    loadNFT();
  }, []);

  return (
    <div className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={logo}
        />
        <div className="disCardContent-root">
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"></span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: sdfsdf-erwerv-sdf
          </p>
        </div>
      </div>
    </div>
  );
}

export default Item;
