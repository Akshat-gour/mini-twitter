import React, { useEffect, useState } from 'react';
import MyTweetsItem from './MyTweetsItem';
import api from '../../utils/api';

const MyTweets = () => {
  const [myposts, setmyposts] = useState([])
  // Get my posts
  const getMyPosts = async () => {
    try {
      const res = await api.get('/posts/myposts');
      return res.data;
    } catch (err) {
      console.error(err)
    }
  };
  useEffect(()=>{
    const fetchMyPosts = async () => {
        const posts = await getMyPosts();
        setmyposts(posts);
    }
    fetchMyPosts();
  },[])

  return (
    <section className="container">
      {myposts.length>0 && <div className="posts">
        {myposts.map((post) => (
          <MyTweetsItem key={post._id} post={post} />
        ))}
      </div>}
      {myposts.length===0 && <div className="posts notweets">
        <h5>No Tweets To show</h5>
        <h4>Tweet by Clicking on Tweet</h4>
        <h5>to make Tweets</h5>
      </div>}
      </section>
  );
};

export default MyTweets;
