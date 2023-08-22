import React, { useEffect, useState } from 'react';
import TweetItem from './../posts/TweetItem';
import api from '../../utils/api';

const Dashboard = () => {
  const [allTweets, setAllTweets] = useState([])
  const [follows, setFollows] = useState([])

  const getAllTweetsByFollowing = async() => {
    try {
      const res = await api.get('/posts/follows');
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
    const fetchTweets = async () => {
      const tweets = await getAllTweetsByFollowing();
      setAllTweets(tweets);
    };
    
    fetchTweets();

    const fetchFollowing = async () => {
      const following = await getFollowing()
      setFollows(following);
    };
    
    fetchFollowing();
  }, []);

  const find = (user) => {
    console.log("user",user);
    console.log("following", follows);
    const check = follows.includes(user);
    console.log(check);
    if(check===true || check===false)
      return check;
    return true;
  }

  return (
    <section className="container">
      <h1 className="large text-primary">Following</h1>
      {allTweets.length>0 && <div className="posts">
        {allTweets.map((tweet) => (
          <TweetItem key={tweet._id} post={tweet} isFollowing={() => find(tweet.user)} following={setFollows}/>
        ))}
      </div>}
      {allTweets.length===0 && <div className="posts notweets">
        <h5>No Tweets To show</h5>
        <h4>Start Following Click on All Tweets</h4>
        <h5>to see all Tweets and Follow</h5>
      </div>}
    </section>
  );
};

export default Dashboard;
