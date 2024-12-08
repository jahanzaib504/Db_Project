import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../axios";
import { Photo, Video } from "../../utils/converter";
import Post from "../Components/Post";
import UserContext from "../../UserContext";
import React from 'react';
import axios from "axios";
import { Link } from "react-router-dom";
const HomePage = () => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { userDetails } = useContext(UserContext);
  const [isActive, set_active] = useState(false);
  const [comment_val, set_comment_val] = useState('');
  const navigate = useNavigate();
  const handleMouseEnter = () => {
    set_active(true);
  }
  const handleMouseLeave = () => {
    set_active(false);
  }
  // Update the text dynamically when pending or is_friend changes
  const getComments = async (post_id)=>{
    try{
      const response=  await api.get(`/comment/${post_id}`);
      setComments(response.data);
      navigate(`/profile/${profile.user_name}`);
    }catch(err){
      console.log(err)
    }
  }
  const handleChange = (event) => {
    set_comment_val(event.target.value);
  };


  const add_comment = async(content, post_id)=>{
    try{
        api.post(`/comment/:${post_id}`, [{content: content}]);
        console.log(post_id,' ', content)
        navigate(`/profile/${profile.user_name}`);
    }catch(err){
      console.log(err);
    }
  }
  const add_reply = async (comment_id) =>{
    const content = prompt('Enter reply: ');
    if(!content)
      return;
    try{
      api.post(`/reply/${comment_id}`, [{content: content}]);
    }catch(err){
      console.log(err);
    }
  }

  const delete_post = async (post_id) => {
    try {
   
      await api.delete(`/post/${post_id}`);
      setPosts((prevPosts) => prevPosts.filter(post => post.post_id !== post_id));
      console.log('Post deleted successfully!');
    } catch (err) {
      // Handle any error during the delete request
      console.error('Error deleting post:', err);
      // You can also show an error message to the user, e.g., through state or a notification
      alert('An error occurred while deleting the post');
    }
  };
  const like_post = async (post)=>{
    try{
      const flag = !post.liked_by_user;
      api.post(`/post/${post.post_id}/like/${flag === true ? 1: 0}`);
      setPosts((prevPosts) =>
        prevPosts.map((item) =>
          item.post_id === post.post_id
            ? { ...item, liked_by_user: flag, like_count: (post.like_count + ((flag === true)?1:-1))} // Toggle the `is_liked` property
            : item
        )
      );
    }catch(err){
      console.log(err);
    }
  }
  useEffect(() => {

    const fetchData = async () => {
      try {
        const postResponse = await api.get(`/post/feed/73887`);
        const postData = postResponse.data.map((post) => ({
          ...post,
          cover_photo: Photo(post.cover_photo),
          profile_picture: Photo(post.profile_picture),
          images: post.images.map(Photo),
          videos: post.videos.map(Video),
        }));
        setPosts(postData);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (<div>
    <div className="background-layer"></div>


    <section id="navbar">
      <header className="nbar pt-3 pb-1">
        <div className="container">
          <input type="checkbox" name="check" id="check" />
          <div className="logo-container">
            <div><img style={{ width: '50px' }} src="/imgdb/logo.png" alt="" /></div>
            <h3 className="nblogo">DB<span>Proj</span></h3>
          </div>

          <div className="nav-btn">
            <div className="nav-links">
              <ul className="ps-0 justify-content-around">
                <li className="nav-link" style={{ '--i': '1.1s' }}>
                  <div className="ps-4 pe-4">
                    <form className="d-flex rounded-2" role="search" style={{ background: 'var(--btn-light)' }}>
                      <input className="form-control me-2 border border-0" style={{ background: 'var(--btn-light)' }} type="search" placeholder="Search" aria-label="Search" />
                      <button className="border border-0 rounded-2 ps-2 pe-2 fw-bold f-but" type="submit" style={{ background: 'var(--gtextdark)' }}>
                        <img width="20px" src="/imgdb/search.png" alt="" />
                      </button>
                    </form>
                  </div>
                </li>
              </ul>
            </div>

            <div className="navbar-profile" style={{ '--i': '1.8s' }}>
              <div className="d-flex navbar-pic-name container align-items-center pt-2">
                <div className="d-flex align-items-center">
                  <div className="navbar-pic">
                    <img src={Photo(userDetails.profile_picture) || '/imgdb/profile.png'} alt="" />
                  </div>
                  <div className="navbar-name pointer">
                    {userDetails.user_name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="hamburger-menu-container">
            <div className="hamburger-menu">
              <div></div>
            </div>
          </div>
        </div>
      </header>

      <nav className="navbar fixed-bottom" style={{ backgroundColor: 'rgba(240, 248, 255, 0)', backdropFilter: 'blur(2px)' }}>
        <div className="container pt-1 pb-3">
          <div className="row w-100">
            <div className="col col-2 d-flex justify-content-center pointer rounded-2"><img src="/imgdb/home.png" alt="" /></div>
            <div className="col col-2 d-flex justify-content-center pointer rounded-2"><img src="/imgdb/message.png" alt="" /></div>
            <div className="col col-4 d-flex justify-content-center pointer rounded-2"><img src="/imgdb/plus.png" alt="" /></div>
            <div className="col col-2 d-flex justify-content-center pointer rounded-2"><img src="/imgdb/bell.png" alt="" /></div>
            <div className="col col-2 d-flex justify-content-center pointer rounded-2"><img src="/imgdb/profile.png" alt="" /></div>
          </div>
        </div>
      </nav>
    </section>








    <div>
      <div className={`sidebar ${isActive ? 'active' : ''}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <div className="top">
          <div className="dots flex">
            <span className="dot"></span>
            <span className="dot"></span>
            <span className="dot"></span>
          </div>
        </div>
        <div className="menu">
          <div className="menu-item flex pb-3">
            <img src="/imgdb/home.png" alt="" />
            <Link to='/feed' className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Home</Link>
          </div>

          <div className="menu-item flex pb-3">
            <img src="/imgdb/bell.png" alt="" />
            <Link to = '/notifications' className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Notification</Link>
          </div>

          <div className="menu-item flex pb-3">
            <img src="/imgdb/message.png" alt="" />
            <Link to = '/friend' className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Messages</Link>
          </div>

          <div className="menu-item flex pb-3">
            <img src="/imgdb/profile.png" alt="" />
            <Link to={`/profile/${userDetails.user_name}`} className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Profile</Link>
          </div>

          <div className="menu-item flex pb-3">
            <img src="/imgdb/plus.png" alt="" />
            <Link to='/post/create' className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Post</Link>
          </div>
        </div>
      </div>
    </div>











    {/* Posts */}



    <section className="profile-pg" style={{ marginTop: '100px', paddingBottom: '100px' }}>



      <div className="row py-5 px-4">

        <div className="col-0 col-sm-1 col-md-2">  </div>


        <div className="col-12 col-sm-10 col-md-9 mx-auto">



          <div className="bg-white shadow rounded overflow-hidden p-3">




            <div className="d-flex align-items-center justify-content-between mb-3">
              <h5 className="mb-0 p-3 pt-4 pb-5">Posts</h5>
            </div>

            {/*ye row aek post hai jitni rows utni posts  */}
            {posts ? posts.map(post => (
                  <div className="row post-row mb-4" key={post.post_id}>
                    <div className="col-12 ">

                      <div className="container post p-3 rounded-4">


                        <div className=" d-flex pic-name-follow container align-items-center justify-content-between">

                          <div className=" d-flex align-items-center">

                            <div className="pic">
                              <img src={post.profile_picture} alt="" />
                            </div>

                            <div className="name pointer">
                              {post.user_name}
                            </div>

                          </div>


                        </div>

                        <div className="description container pt-2 pb-4">
                          {post.content}
                        </div>

                        <div className="post-media container d-flex justify-content-center pb-2">
                          {post.images.length > 0 &&
                            <div id="carouselExampleIndicators" className="carousel slide">
                              <div className="carousel-indicators">
                                {post.images.map((image, index) => (
                                  <button
                                    key={index}
                                    type="button"
                                    data-bs-target="#carouselExampleIndicators"
                                    data-bs-slide-to={index}
                                    className={index === 0 ? "active" : ""}
                                    aria-current={index === 0 ? "true" : "false"}
                                    aria-label={`Slide ${index + 1}`}
                                  ></button>
                                ))}
                              </div>

                              <div className="carousel-inner">
                                {post.images.map((image, index) => (
                                  <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                    <img src={image} className="d-block w-100" alt={`Slide ${index + 1}`} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          }
                        </div>


                        <div className="likes-comments-info pb-2 ps-3 pe-3 d-flex justify-content-between border border-2 border-top-0 border-end-0 border-start-0">

                          <div className="like-info d-flex align-items-center">
                            <img src="/imgdb/like2.png" style={{ width: '15px', height: '15px' }}
                              alt="" />
                            <div className="ps-1" style={{ fontSize: 'x-small', fontWeight: 'bold' }}
                            >{post.like_count}</div>
                          </div>

                          <div className="comment-info d-flex align-items-center">
                            <div className="" style={{ fontSize: 'x-small', fontWeight: 'bold' }}
                            >{post.comment_count}</div>
                            <div className="ps-1" style={{ fontSize: 'x-small', fontWeight: 'bold' }}
                            >Comments</div>
                          </div>

                        </div>

                        <div className="post-opts d-flex justify-content-between pt-2">

                          <div className="post-opt d-flex align-items-center p-3 rounded-4" onClick={()=>like_post(post)}>
                            <img src={post.liked_by_user ? "/imgdb/like2.png": "/imgdb/like1.png"} alt="" />
                            <div className="ps-3 post-opt-lable d-none d-md-block">Like</div>
                          </div>

                          <div className="post-opt d-flex align-items-center p-3 rounded-4" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            <img src="/imgdb/comment.png" alt="" />
                            <div className="ps-3 post-opt-lable d-none d-md-block" onClick={()=> getComments(post.post_id)}>Comment</div>
                          </div>

                          <div className="post-opt d-flex align-items-center p-3 rounded-4">
                            <img src="/imgdb/share.png" alt="" />
                            <div className="ps-3 post-opt-lable d-none d-md-block">Share</div>
                          </div>

                        </div>


                      </div>

                    </div>
                  </div>
                )) : <div>No post found</div>}
            {/* ye single modal for all post comments sari rows kay neechay hoga ye */}

            <div className="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div className="modal-content">

                  <div className="modal-header">
                    <h1 className="modal-title fs-5" id="exampleModalLabel">Comments</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                  </div>

                  <div className="modal-body pt-3 pb-4">
                    {comments.length > 0 && comments.map(comment => (
                      <div className="comment pb-3" key={comment.comment_id}>

                        <div className="comment-pic-name container align-items-center">

                          <div className=" d-flex align-items-center">

                            <div className="comment-pic">
                              <img src={Photo(comment.profile_picture) || '/imgdb/profile.png'} alt="" />
                            </div>

                            <div className="comment-name pointer">
                              {comment.user_name}
                            </div>

                          </div>

                          <div className="comment-content ps-5">
                            {comment.content}
                          </div>
                          <div className="reply-btn ps-5 pointer">reply</div>

                        </div>
                        {comment.replies.length > 0 && comment.replies.map(reply => {
                          <div className="comment-replys ps-0 ps-md-5 pt-2" key={reply.reply_id}>

                            <div className="comment-reply ps-5 pt-2">

                              <div className="comment-reply-pic-name container align-items-center pt-2 pb-2">

                                <div className=" d-flex align-items-center">

                                  <div className="comment-reply-pic">
                                    <img src={Photo(reply.profile_picture) || '/imgdb/profile.png'} alt="" />
                                  </div>

                                  <div className="comment-reply-name pointer">
                                    {reply.user_name}
                                  </div>

                                </div>

                                <div className="comment-reply-content ps-5">
                                  {reply.content}
                                </div>

                              </div>

                            </div>

                          </div>
                        })}
                      </div>

                    ))}
                  </div>

                  <div className="modal-footer justify-content-start ps-1 pe-0 ps-md-2 pe-md-2">

                    <div className="comment-box w-100 m-0">

                      <form className="d-flex" role="search">
                        <input className="form-control w-100" placeholder="Comment :)" value={comment_val} onChange={handleChange} />
                        <button className="btn btn-outline-success ps-1 pe-1 ps-md-3 pe-md-3" type="submit">
                          <img src="/imgdb/comment-btn.png" alt="" onClick={(e) => add_comment(e.target.value, comments[0].post_id)} />
                        </button>
                      </form>

                    </div>

                  </div>

                </div>
              </div>
            </div>


          </div>


        </div>


        <div className="col-0 col-sm-1"></div>



      </div>

    </section >

    
  </div >);
}

export default HomePage;