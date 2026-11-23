import React from "react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Skeleton from "../UI/Skeleton";

const TopSellers = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const { data } = await axios.get(
        "https://us-central1-nft-cloud-functions.cloudfunctions.net/topSellers",
      );
      setData(data);
    } finally {
      setLoading(false);
    }
  }
  return (
    <section id="section-popular" className="pb-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="text-center">
              <h2>Top Sellers</h2>
              <div className="small-border bg-color-2"></div>
            </div>
          </div>

          <div className="col-md-12">
            <ol className="author_list">
              {loading
                ? new Array(12).fill(0).map((_, index) => (
                    <li key={index}>
                      <div className="author_list_pp">
                        <Skeleton
                          width="50px"
                          height="50px"
                          borderRadius="50%"
                        />
                      </div>
                      <div
                        className="author_list_info"
                        style={{ minHeight: "50px" }}
                      >
                        <Skeleton width="80%" height="20px" />
                        <div style={{ marginTop: "4px" }}>
                          <Skeleton width="40%" height="16px" />
                        </div>
                      </div>
                    </li>
                  ))
                : data.map((collection, index) => (
                    <li key={index}>
                      <div className="author_list_pp">
                        <Link to={`/author/${collection.authorId}`}>
                          <img
                            className="lazy pp-author"
                            src={collection.authorImage}
                            alt=""
                          />
                          <i className="fa fa-check"></i>
                        </Link>
                      </div>
                      <div className="author_list_info">
                        <Link to={`/author/${collection.authorId}`}>
                          {collection.authorName}
                        </Link>
                        <span>{collection.price} ETH</span>
                      </div>
                    </li>
                  ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopSellers;
