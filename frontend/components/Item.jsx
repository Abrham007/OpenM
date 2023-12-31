import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import {Principal} from "@dfinity/principal"
import { idlFactory } from "../../src/declarations/nft/nft.did.js"
import { idlFactory as tokenIdlFactory } from "../../src/declarations/token/token.did.js";
import Button  from "./Button.jsx";
import { openm } from "../../src/declarations/openm/index.js"
import CURRENT_USER_ID from "../main.jsx";
import PriceLabel from "./PriceLabel.jsx";

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput ] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");
  const [priceLabel, setPriceLabel] = useState();
  const [shouldDisplay, setDisplay] = useState(true);

  const id = props.id;
  const localHost = "http://127.0.0.1:3000/";
  const agent = new HttpAgent({ host: localHost });

  // TODO: when deploy live, remove the following line.
  agent.fetchRootKey();


  let NFTActor;

  async function loadNFT() {
    NFTActor = await Actor.createActor(idlFactory, {
      agent,
      canisterId: id,
    });

    const name =  await NFTActor.getName();
    const owner = await NFTActor.getOwner();
    const imageData = await NFTActor.getAsset();
    const imageContent = new Uint8Array(imageData);
    const image = URL.createObjectURL(new Blob([imageContent.buffer], {type: "image/png"}));

    setName(name);
    setOwner(owner.toText());
    setImage(image);


  if (props.role == "collection") {
    const nftIsListed = await openm.isListed(props.id);

    if(nftIsListed) {
      setOwner("OpenM");
      setBlur({ filter: "blur(4px)" });
      setSellStatus("Listed")
    }else {
      setButton(<Button handleClick={handleSell} text={"Sell"}/>)
    }
  }else if (props.role == "discover") {
    const originalOwner = await openm.getOriginalOwner(props.id);
    if (originalOwner.toText() != CURRENT_USER_ID.toText()) {
      setButton(<Button handleClick={handleBuy} text={"Buy"}/>)
    }

    const price = await openm.getListedNFTPrice(props.id);
    setPriceLabel(<PriceLabel sellPrice={price.toString()}/>)
  }
}

  useEffect(() => {
    loadNFT();
  }, []);

  let price;
  function handleSell() {
    setPriceInput(<input
      placeholder="Price in MANGO"
      type="number"
      className="price-input"
      value={price}
      onChange={(e) => price=e.target.value}
    />)

    setButton(<Button handleClick={sellItem} text={"Confirm"}/>)
  }

  async function sellItem() {
    setBlur({ filter: "blur(4px)" });
    setLoaderHidden(false);
    console.log("price: " + price)
    const listingResult = await openm.listItem(props.id, Number(price));
    console.log("listing:" + listingResult);
    if (listingResult == "Success") {
      const openMId = await openm.getOpenMCanisterID();
      const transferResult = await NFTActor.transferOwnership(openMId);
      console.log("transferResult: " + transferResult);
      if (transferResult == "Success") {
        setLoaderHidden(true);
        setButton();
        setPriceInput();
        setOwner("OpenM");
        setSellStatus("Listed");
      }
    }
  }

  async function handleBuy() {
    console.log("buy was triggered")
    setLoaderHidden(false)
    const tokenActor = await Actor.createActor(tokenIdlFactory, {
      agent,
      canisterId: Principal.fromText("br5f7-7uaaa-aaaaa-qaaca-cai"),
    })

    const sellerId = await openm.getOriginalOwner(props.id);
    const itemPrice = await openm.getListedNFTPrice(props.id);

    const result = await tokenActor.transfer(sellerId, itemPrice);
    
    if (result == "Success") {
      const transferResult = await openm.completePurchase(props.id, sellerId, CURRENT_USER_ID);
      console.log("Purchase: ", transferResult);
      setLoaderHidden(true);
      setDisplay(false)
    }
  }

  return (
    <div style={{display: shouldDisplay ? "inline" : "none"}} className="disGrid-item">
      <div className="disPaper-root disCard-root makeStyles-root-17 disPaper-elevation1 disPaper-rounded">
        <img
          className="disCardMedia-root makeStyles-image-19 disCardMedia-media disCardMedia-img"
          src={image}
          style={blur}
        />
        <div hidden={loaderHidden} className="lds-ellipsis">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
        <div className="disCardContent-root">
          {priceLabel}
          <h2 className="disTypography-root makeStyles-bodyText-24 disTypography-h5 disTypography-gutterBottom">
            {name}<span className="purple-text"> {sellStatus}</span>
          </h2>
          <p className="disTypography-root makeStyles-bodyText-24 disTypography-body2 disTypography-colorTextSecondary">
            Owner: {owner}
          </p>
          {priceInput}
          {button}
        </div>
      </div>
    </div>
  );
}

export default Item;
