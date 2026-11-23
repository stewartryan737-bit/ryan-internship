import React, { useEffect, useState } from "react";
import AuthorBanner from "../images/author_banner.jpg";
import AuthorItems from "../components/author/AuthorItems";
import { Link, useParams } from "react-router-dom";
import axios from "axios";


const Author = () => {
  const { authorId } = useParams();
  const [authorData, setAuthorData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const { data } = await axios.get(
          `https://cloudfunctions.net//${authorId}`,
        );
        setAuthorData(data);
      } catch (error) {
        console.error("Error fetching author data:", error);
      }
    };

    window.scrollTo(0, 0);
    fetchAuthor();
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
              {authorData ? (
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
                
                
                <p>Loading author data...</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Author;
