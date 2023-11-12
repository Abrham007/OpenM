import React, { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import { Actor, HttpAgent } from "@dfinity/agent";
import {Principal} from "@dfinity/principal"
import { idlFactory } from "../../src/declarations/nft/nft.did.js"
import Button  from "./Button.jsx";
import { openm } from "../../src/declarations/openm/index.js"

function Item(props) {
  const [name, setName] = useState();
  const [owner, setOwner] = useState();
  const [image, setImage] = useState();
  const [button, setButton] = useState();
  const [priceInput, setPriceInput ] = useState();
  const [loaderHidden, setLoaderHidden] = useState(true);
  const [blur, setBlur] = useState();
  const [sellStatus, setSellStatus] = useState("");

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

    const nftIsListed = await openm.isListed(props.id);

    if(nftIsListed) {
      setOwner("OpenM");
      setBlur({ filter: "blur(4px)" });
      setSellStatus("Listed")
    }else {
      setButton(<Button handleClick={handleSell} text={"Sell"}/>)
    }
    
  }

  useEffect(() => {
    loadNFT();
  }, []);

  let price;
  function handleSell() {
    setPriceInput(<input
      placeholder="Price in DANG"
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

  return (
    <div className="disGrid-item">
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
