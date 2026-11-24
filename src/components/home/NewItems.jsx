import React from "react";
import NFTCard from "../UI/NFTCard";
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

const NewItems = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

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
                    <div
                      key={collection.id}
                      className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                      style={{ display: "block", backgroundSize: "cover" }}
                    >
                      <NFTCard item={collection} />
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
