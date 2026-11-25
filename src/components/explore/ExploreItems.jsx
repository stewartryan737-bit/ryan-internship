import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import CountdownTimer from "../UI/CountdownTimer";
import Skeleton from "../UI/Skeleton";

const ExploreItems = () => {
  const [visibleCount, setVisibleCount] = useState(8);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  const filterEndpoints = {
    "": "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore",
    price_low_to_high:
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=price_low_to_high",
    price_high_to_low:
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=price_high_to_low",
    likes_high_to_low:
      "https://us-central1-nft-cloud-functions.cloudfunctions.net/explore?filter=likes_high_to_low",
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  async function fetchData() {
    setLoading(true);
    try {
      const endpoint = filterEndpoints[filter];
      const { data } = await axios.get(endpoint);
      setData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
  };

  return (
    <>
      <div>
        <select id="filter-items" value={filter} onChange={handleFilterChange}>
          <option value="">Default</option>
          <option value="price_low_to_high">Price, Low to High</option>
          <option value="price_high_to_low">Price, High to Low</option>
          <option value="likes_high_to_low">Most liked</option>
        </select>
      </div>
      <div className="row">
        {loading ? (
          <div className="col-lg-12">
            <Skeleton>
              {new Array(8).fill(0).map((_, index) => (
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
                      style={{
                        position: "absolute",
                        width: "110px",
                        height: "30px",
                      }}
                    ></div>
                    <div className="nft__item_wrap">
                      <div
                        className="skeleton-box"
                        style={{ height: "250px", width: "100%" }}
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
          <>
            {data.slice(0, visibleCount).map((collection) => (
              <div
                key={collection.id}
                className="d-item col-lg-3 col-md-6 col-sm-6 col-xs-12"
                style={{ display: "block", backgroundSize: "cover" }}
              >
                <div className="nft__item">
                  <div className="author_list_pp">
                    <Link
                      to="/author"
                      data-bs-toggle="tooltip"
                      data-bs-placement="top"
                    >
                      <img
                        className="lazy"
                        src={collection.authorImage}
                        alt=""
                      />
                      <i className="fa fa-check"></i>
                    </Link>
                  </div>
                  <CountdownTimer expiryDate={collection.expiryDate} />

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
                      <span>{collection.likes} </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
      <div className="col-md-12 text-center">
        <Link
          to=""
          id="loadmore"
          className="btn-main lead"
          onClick={() => setVisibleCount(visibleCount + 4)}
        >
          Load more
        </Link>
      </div>
    </>
  );
};

export default ExploreItems;
