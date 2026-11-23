import React, { useEffect, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import Skeleton from "../components/UI/Skeleton.jsx";

const Author = () => {
  const { authorId } = useParams();
  const [authorData, setAuthorData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const fetchAuthor = async () => {
      setLoading(true);
      setAuthorData(null);
      try {
        const { data } = await axios.get(
          "https://us-central1-nft-cloud-functions.cloudfunctions.net/authors",
          { params: { author: authorId } },
        );
        if (active) setAuthorData(data);
      } catch (error) {
        console.error("Error fetching author data:", error);
      } finally {
        if (active) setLoading(false);
      }
    };

    window.scrollTo(0, 0);
    fetchAuthor();
    return () => {
      active = false;
    };
  }, [authorId]);
  return (
    <div id="wrapper">
      <div className="no-bottom no-top" id="content">
        <div id="top"></div>

        <section
          id="profile_banner"
          aria-label="section"
          className="text-light"
          data-bgimage="url(images/author_banner.jpg) top"
          style={{ background: `url(${AuthorBanner}) top` }}
        ></section>

        <section aria-label="section">
          <div className="container">
            <div className="row">
              {loading ? (
                <div className="col-md-12" role="status" aria-label="Loading author data">
                  <div className="d_profile de-flex">
                    <Skeleton width="100px" height="100px" borderRadius="50%" />
                    <div style={{ marginLeft: "20px", width: "200px" }}>
                      <Skeleton width="100%" height="24px" />
                      <div style={{ marginTop: "8px" }}>
                        <Skeleton width="70%" height="18px" />
                      </div>
                    </div>
                  </div>
                  <div className="row" style={{ marginTop: "30px" }}>
                    {Array.from({ length: 4 }, (_, index) => (
                      <div className="col-lg-3 col-md-6" key={index}>
                        <div className="nft__item">
                          <Skeleton width="100%" height="250px" />
                          <div style={{ marginTop: "12px" }}>
                            <Skeleton width="70%" height="20px" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : authorData ? (
                <>
                  <div className="col-md-12">
                    <div className="d_profile de-flex">
                      <div className="de-flex-col">
                        <div className="profile_avatar">
                          <img src={authorData.authorImage} alt="" />

                          <i className="fa fa-check"></i>
                          <div className="profile_name">
                            <h4>
                              {authorData.authorName}
                              <span className="profile_username">
                                @{authorData.tag}
                              </span>
                              <span id="wallet" className="profile_wallet">
                                {authorData.address}
                              </span>
                              <button
                                id="btn_copy"
                                title="Copy Text"
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    authorData.address,
                                  )
                                }
                              >
                                Copy
                              </button>
                            </h4>
                          </div>
                        </div>
                      </div>
                      <div className="profile_follow de-flex">
                        <div className="de-flex-col">
                          <div className="profile_follower">
                            {isFollowing
                              ? authorData.followers + 1
                              : authorData.followers}
                            {""}
                            followers
                          </div>
                          <Link
                            to="#"
                            className="btn-main"
                            onClick={() => setIsFollowing(!isFollowing)}
                          >
                            {isFollowing ? "Unfollow" : "Follow"}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-12">
                    <div className="de_tab tab_simple">
                      <AuthorItems
                        nftCollection={authorData.nftCollection}
                        authorImage={authorData.authorImage}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <p role="alert">Could not load author data.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
