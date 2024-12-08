import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../axios";
import { Photo, Video } from "../../utils/converter";
import Post from "../Components/Post";
import UserContext from "../../UserContext";
import React from 'react';
import axios from "axios";

const change_pp = async()=>{

}
const ProfilePage = () => {
  const { user_name } = useParams();
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pending, setPending] = useState(null);
  const [is_friend, setIsFriend] = useState(null);
  const { userDetails } = useContext(UserContext);
  const [isActive, set_active] = useState(false);
  const [comment_val, set_comment_val] = useState('');
  const navigate = useNavigate();

  const change_name = async (e) => {
    try {
      // Update the userDetails object with the new name
      const newUserName = e.target.value;
      console.log(e.target.value)
      const updatedUserDetails = { ...userDetails, user_name: newUserName };
  
      // Call API to update the user on the backend
      const response = await api.put('/user/', {profile: updatedUserDetails});
  
      // Update the context with the new details
      setUserDetails(updatedUserDetails);
  
      // Optionally, update any other state related to the user, if needed
      setProfile((prevProfile) => ({
        ...prevProfile,
        user_name: newUserName, // Assuming you have the user_name in the profile state
      }));
  
      // Optionally, handle success (such as showing a success message)
      console.log('Username updated successfully', response.data);
  
    } catch (err) {
      // Handle error, update the error state to display an error message
      setError('Failed to update username. Please try again later.');
      console.error('Error updating username:', err);
    }
  };
  
 
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
  const handleClick = async () => {
    if (is_friend) {
      navigate("/friend");
    } else if (!is_friend && !pending) {
      try {
        await api.post(`/friend/request/${profile.user_id}`);
        setPending(true); // Mark as pending after successful request
      } catch (err) {
        alert(err.message);
      }
    } else if (pending) {
      try {
        await api.post(`/friend/${profile.user_id}/reject`);
        setPending(false); // Reset pending status
      } catch (err) {
        alert(err.message);
      }
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
  
 const friend_request = async()=>{
  try{
    api.post(`/friend/request/${profile.user_id}`);
    setPending(true);
  }catch(err){
    console.log(err)
  }
 }
  useEffect(() => {
    if (!user_name) {
      setError(new Error("User name is required in the query parameter."));
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const userResponse = await api.get(`/user/${user_name}`);
        const userData = userResponse.data;
        userData.profile_picture = Photo(userData.profile_picture);
        userData.cover_picture = Photo(userData.cover_picture);
        setProfile(userData);
        setPending(userData.pending);
        setIsFriend(userData.is_friend);

        const postResponse = await api.get(`/post/user/${userData.user_id}`);
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
  }, [user_name]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;
  if (!profile) return <p>No profile found</p>;
  return (
    <>
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
              <p className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Home</p>
            </div>

            <div className="menu-item flex pb-3">
              <img src="/imgdb/bell.png" alt="" />
              <p className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Notification</p>
            </div>

            <div className="menu-item flex pb-3">
              <img src="/imgdb/message.png" alt="" />
              <p className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Messages</p>
            </div>

            <div className="menu-item flex pb-3">
              <img src="/imgdb/profile.png" alt="" />
              <p className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Profile</p>
            </div>

            <div className="menu-item flex pb-3">
              <img src="/imgdb/plus.png" alt="" />
              <p className="hide m-0 ps-1" style={{ '--delay': '300ms' }}>Post</p>
            </div>
          </div>
        </div>
      </div>











      {/* Posts */}



      <section className="profile-pg" style={{ marginTop: '100px', paddingBottom: '100px' }}>



        <div class="row py-5 px-4">

          <div class="col-0 col-sm-1 col-md-2">  </div>




          <div class="col-12 col-sm-10 col-md-9 mx-auto">



            <div class="bg-white shadow rounded overflow-hidden">

              <div class="px-4 pt-0 pb-4 cover">

                <div class="media align-items-end profile-head">

                  <div class="profile-pic mr-3">

                    <img src={profile.profile_picture || '/imgdb/profile_picture.png'} alt="..." class="rounded mb-2 img-thumbnail" />

                  </div>

                  <div class="media-body mb-5 pb-3 text-white">
                    <h4 class="mt-0 mb-0 profile-name">{profile.user_name}</h4>
                  </div>
                  {(userDetails.user_id === profile.user_id) ?
                    <div class="btn btn-outline-dark btn-sm btn-block border-black fw-bold edit-profile" data-bs-toggle="modal" data-bs-target="#exampleModal2">Edit profile</div>
                    : is_friend ?
                      <div class="btn btn-outline-dark btn-sm btn-block border-black fw-bold profile-message" onClick={navigate('/friend')}>Message</div>
                      : pending ?
                        <div class="btn btn-outline-dark btn-sm btn-block border-black fw-bold profile-send-request">Pending</div>
                        :
                        <div class="btn btn-outline-dark btn-sm btn-block border-black fw-bold profile-send-request" onClick={friend_request}>Add Friend +</div>
                  }
                </div>


                <div class="modal fade" id="exampleModal2" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">

                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Edit Profile</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>

                      <div class="modal-body pt-3 pb-4">


                        <form>
                          <div class="mb-3">
                            <label for="profilePic" class="form-label">Change Profile Picture</label>
                            <input class="form-control" type="file" id="profilePic" accept="image/*" />
                            <button type="button" class="btn btn-primary mt-2">Change Profile Picture</button>
                          </div>

                          <div class="mb-3">
                            <label for="coverPic" class="form-label">Change Cover Picture</label>
                            <input class="form-control" type="file" id="coverPic" accept="image/*" />
                            <button type="button" class="btn btn-primary mt-2">Change Cover Picture</button>
                          </div>

                          <div class="mb-3">
                            <label for="name" class="form-label">Change Name</label>
                            <input type="text" class="form-control" id="name" placeholder="Enter new name" />
                            <button type="button" class="btn btn-primary mt-2" onClick={change_name}>Change Name</button>
                          </div>

                          <div class="mb-3">
                            <label for="password" class="form-label">Change Password</label>
                            <input type="password" class="form-control" id="password" placeholder="Enter new password" />
                            <button type="button" class="btn btn-primary mt-2">Change Password</button>
                          </div>

                          <div class="mb-3">
                            <label for="bio" class="form-label">Change Bio</label>
                            <textarea class="form-control" id="bio" rows="3" placeholder="Enter new bio"></textarea>
                            <button type="button" class="btn btn-primary mt-2">Change Bio</button>
                          </div>
                        </form>




                      </div>

                    </div>
                  </div>
                </div>


              </div>

              <div class="bg-light p-4 d-flex justify-content-end text-center">
                <ul class="list-inline mb-0">
                  <li class="list-inline-item">
                    <h5 class="font-weight-bold mb-0 d-block tot-posts">{profile.post_count}</h5>
                    <small class="text-muted">
                      <i class="fas fa-image mr-1"></i>Posts</small>
                  </li>
                  <li class="list-inline-item">
                    <h5 class="font-weight-bold mb-0 d-block tot-friends">{profile.friend_count}</h5>
                    <small class="text-muted">
                      <i class="fas fa-user mr-1"></i>Friends</small
                    >
                  </li>
                </ul>
              </div>

              <div class="px-4 py-3">
                <h5 class="mb-0 pb-2">About</h5>
                <div class="p-4 rounded shadow-sm bg-light">
                  <p class="font-italic mb-0">{profile.bio}</p>
                </div>
              </div>

              <div class="py-4 px-4">


                <div class="d-flex align-items-center justify-content-between mb-3">
                  <h5 class="mb-0">All Posts</h5>
                </div>

                {/*ye row aek post hai jitni rows utni posts  */}
                {posts ? posts.map(post => (
                  <div class="row post-row mb-4" key={post.post_id}>
                    <div class="col-12 ">

                      <div class="container post p-3 rounded-4">


                        <div class=" d-flex pic-name-follow container align-items-center justify-content-between">

                          <div class=" d-flex align-items-center">

                            <div class="pic">
                              <img src={post.profile_picture} alt="" />
                            </div>

                            <div class="name pointer">
                              {post.user_name}
                            </div>

                          </div>

                          <div class="post-del pointer">
                            <img src="/imgdb/delete.png" style={{ height: '25px', width: '25px' }}
                              alt="" onClick={()=>delete_post(post.post_id)}/>
                          </div>


                        </div>

                        <div class="description container pt-2 pb-4">
                          {post.content}
                        </div>

                        <div class="post-media container d-flex justify-content-center pb-2">
                          {post.images.length > 0 &&
                            <div id="carouselExampleIndicators" class="carousel slide">
                              <div class="carousel-indicators">
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

                              <div class="carousel-inner">
                                {post.images.map((image, index) => (
                                  <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                                    <img src={image} class="d-block w-100" alt={`Slide ${index + 1}`} />
                                  </div>
                                ))}
                              </div>
                            </div>
                          }
                        </div>


                        <div class="likes-comments-info pb-2 ps-3 pe-3 d-flex justify-content-between border border-2 border-top-0 border-end-0 border-start-0">

                          <div class="like-info d-flex align-items-center">
                            <img src="/imgdb/like2.png" style={{ width: '15px', height: '15px' }}
                              alt="" />
                            <div class="ps-1" style={{ fontSize: 'x-small', fontWeight: 'bold' }}
                            >{post.like_count}</div>
                          </div>

                          <div class="comment-info d-flex align-items-center">
                            <div class="" style={{ fontSize: 'x-small', fontWeight: 'bold' }}
                            >{post.comment_count}</div>
                            <div class="ps-1" style={{ fontSize: 'x-small', fontWeight: 'bold' }}
                            >Comments</div>
                          </div>

                        </div>

                        <div class="post-opts d-flex justify-content-between pt-2">

                          <div class="post-opt d-flex align-items-center p-3 rounded-4">
                            <img src="/imgdb/like1.png" alt="" />
                            <div class="ps-3 post-opt-lable d-none d-md-block">Like</div>
                          </div>

                          <div class="post-opt d-flex align-items-center p-3 rounded-4" type="button" data-bs-toggle="modal" data-bs-target="#exampleModal">
                            <img src="/imgdb/comment.png" alt="" />
                            <div class="ps-3 post-opt-lable d-none d-md-block" onClick={()=> getComments(post.post_id)}>Comment</div>
                          </div>

                          <div class="post-opt d-flex align-items-center p-3 rounded-4">
                            <img src="/imgdb/share.png" alt="" />
                            <div class="ps-3 post-opt-lable d-none d-md-block">Share</div>
                          </div>

                        </div>


                      </div>

                    </div>
                  </div>
                )) : <div>No post found</div>}
                {/* ye single modal for all post comments sari rows kay neechay hoga ye */}

                <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                    <div class="modal-content">

                      <div class="modal-header">
                        <h1 class="modal-title fs-5" id="exampleModalLabel">Comments</h1>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                      </div>

                      <div class="modal-body pt-3 pb-4">
                        {comments.length > 0 && comments.map(comment=>(
                        <div class="comment pb-3" key={comment.comment_id}>

                          <div class="comment-pic-name container align-items-center">

                            <div class=" d-flex align-items-center">

                              <div class="comment-pic">
                                <img src={Photo(comment.profile_picture) || '/imgdb/profile.png'} alt="" />
                              </div>

                              <div class="comment-name pointer">
                                {comment.user_name}
                              </div>

                            </div>

                            <div class="comment-content ps-5">
                             {comment.content}
                            </div>
                            <div class="reply-btn ps-5 pointer">reply</div>

                          </div>
                          {comment.replies.length > 0 && comment.replies.map(reply=>{
                          <div class="comment-replys ps-0 ps-md-5 pt-2" key={reply.reply_id}>

                            <div class="comment-reply ps-5 pt-2">

                              <div class="comment-reply-pic-name container align-items-center pt-2 pb-2">

                                <div class=" d-flex align-items-center">

                                  <div class="comment-reply-pic">
                                    <img src={Photo(reply.profile_picture) || '/imgdb/profile.png'} alt="" />
                                  </div>

                                  <div class="comment-reply-name pointer">
                                    {reply.user_name}
                                  </div>

                                </div>

                                <div class="comment-reply-content ps-5">
                                  {reply.content}
                                </div>

                              </div>

                            </div>

                          </div>
                          })}
                        </div>

                        ))}
                      </div>

                      <div class="modal-footer justify-content-start ps-1 pe-0 ps-md-2 pe-md-2">

                        <div class="comment-box w-100 m-0">

                          <form class="d-flex" role="search">
                            <input class="form-control w-100" placeholder="Comment :)" value={comment_val} onChange={handleChange}/>
                            <button class="btn btn-outline-success ps-1 pe-1 ps-md-3 pe-md-3" type="submit">
                              <img src="/imgdb/comment-btn.png" alt="" onClick={()=>add_comment(comment_val, comments[0].post_id)}/>
                            </button>
                          </form>

                        </div>

                      </div>

                    </div>
                  </div>
                </div>


              </div>


            </div>



          </div>



          <div class="col-0 col-sm-1"></div>


        </div>

      </section>

    </>
  )
}

export default ProfilePage;
