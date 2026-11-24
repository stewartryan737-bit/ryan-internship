import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function formatCountdown(expiryDate, now) {
  const seconds = Math.max(0, Math.ceil((expiryDate - now) / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (num) => String(num).padStart(2, "0");

  return `${days ? `${days}d ` : ""}${pad(hours)}h ${pad(minutes)}m ${pad(remainingSeconds)}s`;
}

const NftCard = ({ item }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (item.expiryDate == null) return;

    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(interval);
  }, [item.expiryDate]);

  return (
    <div className="nft__item">
      <div className="author_list_pp">
        <Link to={`/author/${item.authorId}`}>
          <img className="lazy" src={item.authorImage} alt="" />
          <i className="fa fa-check"></i>
        </Link>
      </div>

      {item.expiryDate != null && (
        <div className="de_countdown">
          {formatCountdown(item.expiryDate, now)}
        </div>
      )}

      <div className="nft__item_wrap">
        <div className="nft__item_extra">
          <div className="nft__item_buttons">
            <button>Buy Now</button>
            <div className="nft__item_share">
              <h4>Share</h4>
              <a href="" target="_blank" rel="noreferrer">
                <i className="fa fa-facebook fa-lg"></i>
              </a>
              <a href="" target="_blank" rel="noreferrer">
                <i className="fa fa-twitter fa-lg"></i>
              </a>
              <a href="">
                <i className="fa fa-envelope fa-lg"></i>
              </a>
            </div>
          </div>
        </div>

        <Link to={`/item-details/${item.nftId}`}>
          <img
            src={item.nftImage}
            className="lazy nft__item_preview"
            alt=""
          />
        </Link>
      </div>

      <div className="nft__item_info">
        <Link to={`/item-details/${item.nftId}`}>
          <h4>{item.title}</h4>
        </Link>
        <div className="nft__item_price">{item.price} ETH</div>
        <div className="nft__item_like">
          <i className="fa fa-heart"></i>
          <span>{item.likes}</span>
        </div>
      </div>
    </div>
  );
};

export default NftCard;