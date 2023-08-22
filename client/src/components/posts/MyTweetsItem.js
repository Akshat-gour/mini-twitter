import React, { Fragment, useState } from 'react';
import formatDate from '../../utils/formatDate';
import api from '../../utils/api';

const MyTweetsItem = ({
  post: { _id, text, name, date }
}) => {
  const [edited, setEdited] = useState(text);
  const [showEdit, setShowEdit] = useState(false);
  const [isDeleted, setIsDeleted] = useState(false);

  // Edit post
  const editPost = async (formData) => {
    console.log("form ",formData);
    try {
      const edited = await api.put(`/posts/${formData._id}`, {text: formData.edited});
      return edited.data
    } catch (err) {
      console.error(err)
    }
  };

  // Delete post
  const deletePost = async (id) => {
    try {
      await api.delete(`/posts/${id}`);
      return id;
    } catch (err) {
      console.error(err);
    }
  };

  const delPost = async () => {
    const id = await deletePost(_id)
    if(id===_id) {
      setIsDeleted(true)
    }
  }
  
return (
  <div>
  {!isDeleted &&
  <div className="post bg-white p-1 my-1">
    <div>
        <h4>{name}</h4>
    </div>
    <div>
      {showEdit &&
        <form
        className='form my-1'
        onSubmit={e => {
          e.preventDefault();
          const edit = async() => {
            const e = await editPost({ edited, _id});
            if(e?.text!==edited)
              setEdited(text)
          }
          edit();
          setShowEdit(false);
        }}
      >
        <textarea
          name='text'
          cols='30'
          rows='5'
          value={edited}
          onChange={e => setEdited(e.target.value)}
          required
        />
        <div className="mt-1">
        <input type='submit' className='btn btn-dark' value='Submit' />
        <button className='btn btn-dark' onClick={() => {setShowEdit(false); setEdited(text);}} type="button">Cancel</button>
        </div>
      </form>
      }
      {!showEdit && <p className="my-1">{edited}</p>}
      
      <p className="post-date">Posted on {formatDate(date)}</p>

      {!showEdit &&
        <Fragment>
          <button
            onClick={() => setShowEdit(true)}
            type="button"
            className="btn btn-light"
          >
            <i className="fas fa-edit" />
          </button>
          <button
            onClick={delPost}
            type="button"
            className="btn btn-danger"
          >
            <i className="fas fa-times" />
          </button>
        </Fragment>
      }
    </div>
  </div>
}</div>);
};
export default MyTweetsItem
