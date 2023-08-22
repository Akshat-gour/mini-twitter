import React, { useState } from 'react';
import api from './../../utils/api'

const Tweet = () => {
  const [text, setText] = useState('');

  // Add post
  const addPost = async (formData) => {
    try {
      const res = await api.post('/posts', formData);
      return res.data;
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="container">
      <h1 className="large text-primary">Tweet</h1>
      <div className='post-form'>
      <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault();
          addPost({ text });
          setText('');
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          placeholder='Create a post'
          value={text}
          onChange={e => setText(e.target.value)}
          required
        />
        <input type='submit' className='btn btn-dark my-1' value='Submit' />
      </form>
    </div>
    </section>
  );
};

export default Tweet;
