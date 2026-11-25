import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Skeleton from "../UI/Skeleton";

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

const HotCollections = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/hotCollections",
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
    <section id="section-collections" className="no-bottom">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Hot Collections</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>
        </div>

        <div className="row">
          {loading ? (
            <div className="col-lg-12">
              <Skeleton>
                {Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="col-lg-3 col-sm-6 col-xs-12"
                      style={{ padding: "0 10px" }}
                    >
                      <div className="nft_coll">
                        <div className="nft_wrap">
                          <div
                            className="skeleton-box"
                            style={{ height: "200px" }}
                          ></div>
                        </div>
                        <div className="nft_coll_pp">
                          <div
                            className="skeleton-box"
                            style={{
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                            }}
                          ></div>
                        </div>
                        <div className="nft_coll_info">
                          <div
                            className="skeleton-box"
                            style={{ height: "20px", width: "80%" }}
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
                    <div className="nft_coll">
                      <div className="nft_wrap">
                        <Link to="/item-details/:nftId">
                          <img
                            src={collection.nftImage}
                            className="lazy img-fluid"
                            alt=""
                          />
                        </Link>
                      </div>
                      <div className="nft_coll_pp">
                        <Link to="/author">
                          <img
                            className="lazy pp-coll"
                            src={collection.authorImage}
                            alt=""
                          />
                        </Link>
                        <i className="fa fa-check"></i>
                      </div>
                      <div className="nft_coll_info">
                        <Link to="/item-details/:nftId">
                          <h4>{collection.title}</h4>
                        </Link>
                        <span>ERC-{collection.code}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default HotCollections;
