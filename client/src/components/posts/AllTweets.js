import React, { useEffect, useState } from 'react';
import TweetItem from './../posts/TweetItem';
import api from '../../utils/api';

const AllTweets = () => {
  const [allTweets, setAllTweets] = useState([])
  const [follows, setFollows] = useState([])

  const getAllTweets = async() => {
    try {
      const res = await api.get('/posts');
      return res.data;
    } catch (err) {
      console.log("error", err);
    }
  };

  const getFollowing = async () => {
    try {
      const res = await api.get(`/users/following`);
      return res.data;
    } catch (err) {
      console.log("error", err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tweets, following] = await Promise.all([
          getAllTweets(),
          getFollowing()
        ]);
  
        setAllTweets(tweets);
        setFollows(following);
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchData();
  }, []);

  return (
    <section className="container">
      <h1 className="large text-primary">All Tweets</h1>
      <div className="posts">
        {allTweets.map((tweet) => (
            <TweetItem key={tweet._id} post={tweet} isFollowing={() => {
              console.log("following: ",follows);
              return follows.includes(tweet.user)}} following={setFollows}/>
        ))}
      </div>
    </section>
  );
};

export default AllTweets;
