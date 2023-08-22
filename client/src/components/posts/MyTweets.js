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
      <div className="posts">
        {myposts.map((post) => (
          <MyTweetsItem key={post._id} post={post} />
        ))}
      </div>
      </section>
  );
};

export default MyTweets;