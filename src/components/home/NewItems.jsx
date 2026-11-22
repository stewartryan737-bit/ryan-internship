import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "../UI/Skeleton";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function NextArrow({ onClick }) {
  return (
    <button className="owl-next" onClick={onClick}>
      ›
    </button>
  );
}

function PrevArrow({ onClick }) {
  return (
    <button className="owl-prev" onClick={onClick}>
      ‹
    </button>
  );
}

function formatCountdown(expiryDate, now) {
  const seconds = Math.max(0, Math.ceil((expiryDate - now) / 1000));
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const pad = (num) => String(num).padStart(2, "0");

  return `${days ? `${days}d ` : ""}${pad(hours)}h ${pad(minutes)}m ${pad(remainingSeconds)}s`;
}

const NewItems = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!data.some((item) => item.expiryDate != null)) {
      return;
    }

    setNow(Date.now());
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [data]);

  async function fetchData() {
    try {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/newItems",
      );
      setData(data);
    } finally {
      setLoading(false);
    }
  }

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section id="section-items" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>New Items</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
          <div className="row">
            {loading ? (
              <div className="col-lg-12">
                <Skeleton>
                  {new Array(4).fill(0).map((_, index) => (
                    <div
                      key={index}
                      className="col-lg-3 col-md-6 col-sm-6 col-xs-12"
                    >
                      <div className="nft__item">
                        <div className="author_list_pp">
                          <div
                            className="skeleton-box"
                            style={{
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                            }}
                          ></div>
                        </div>
                        <div
                          className="de_countdown skeleton-box"
                          style={{ width: "75%" }}
                        ></div>
                        <div className="nft__item_wrap">
                          <div
                            className="skeleton-box"
                            style={{ height: "250px" }}
                          ></div>
                        </div>
                        <div className="nft__item_info">
                          <div
                            className="skeleton-box"
                            style={{ height: "20px", width: "60%" }}
                          ></div>
                          <div
                            className="skeleton-box"
                            style={{ height: "20px", width: "40%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Skeleton>
              </div>
            ) : (
              <div className="col-lg-12">
                <Slider {...sliderSettings}>
                  {data.map((collection) => (
                    <div key={collection.id} style={{ padding: "0 10px" }}>
                      <div className="nft__item">
                        <div className="author_list_pp">
                          <Link to="/author">
                            <img
                              className="lazy"
                              src={collection.authorImage}
                              alt=""
                            />
                            <i className="fa fa-check"></i>
                          </Link>
                        </div>
                        {collection.expiryDate != null && (
                          <div className="de_countdown">
                            {formatCountdown(collection.expiryDate, now)}
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

                          <Link to="/item-details">
                            <img
                              src={collection.nftImage}
                              className="lazy nft__item_preview"
                              alt=""
                            />
                          </Link>
                        </div>
                        <div className="nft__item_info">
                          <Link to="/item-details">
                            <h4>{collection.title}</h4>
                          </Link>
                          <div className="nft__item_price">
                            {collection.price} ETH
                          </div>
                          <div className="nft__item_like">
                            <i className="fa fa-heart"></i>
                            <span>{collection.likes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewItems;
