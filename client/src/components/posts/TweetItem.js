import React, { Fragment, useState } from 'react';
import formatDate from '../../utils/formatDate';
import api from '../../utils/api';

const TweetItem = ({post, isFollowing, following}) => {
  const [showFollow, setShowFollow] = useState(isFollowing);
  const follow = async (id) => {
    try {
      const res = await api.put(`/users/follow/${id}`);
      return res.data
    } catch (err) {
      console.error(err)
    }
  };
  const unfollow = async (id) => {
    try {
      const res = await api.put(`/users/unfollow/${id}`);
      return res.data
    } catch (err) {
      console.error(err)
    }
  };

return (
  <div className="post bg-white p-1 my-1">
    <div>
        <h4>{post.name}</h4>
        <p className="post-date">Posted on {formatDate(post.date)}</p>
    </div>
    <div className='post-data'>
        <p>{post.text}</p>
        <Fragment>
            {!showFollow && <button
            onClick={async() => {
              const follows = await follow(post.user)
              following(follows)
              setShowFollow(false)
            }}
            type="button"
            className="btn btn-success"
            >
            follow
            </button>}
            {showFollow && <button
            onClick={async() => {
              console.log("clicked");
              const follows = await unfollow(post.user)
              following(follows)
              setShowFollow(true)
            }}
            type="button"
            className="btn btn-dark"
            >
            unfollow
            </button>}
        </Fragment>
    </div>
  </div>
)};

export default TweetItem
