import React, { useState } from "react";
import api from "../../axios";

const CreatePost = () => {
    const [post, setPost] = useState({
        content: "",
        caption: "",
        images: [],
        videos: [],
    });

    const handleChange = (e) => {
        setPost({ ...post, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (file.type === "image/jpeg" || file.type === "image/jpg") {
                    setPost((prevState) => ({
                        ...prevState,
                        images: [...prevState.images, reader.result],
                    }));
                } else if (file.type === "video/mp4") {
                    setPost((prevState) => ({
                        ...prevState,
                        videos: [...prevState.videos, reader.result],
                    }));
                } else {
                    alert("Only mp4 and jpeg files are allowed");
                }
            };
            reader.readAsDataURL(file); // Convert file to base64
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postData = {
            post: {
                content: post.content,
                caption: post.caption,
                images: post.images,
                videos: post.videos,
            },
        };

        try {
            const response = await api.post("/post", postData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            console.log("Post added successfully:", response.data);

            // Reset the form after submission
            setPost({
                content: "",
                caption: "",
                images: [],
                videos: [],
            });
        } catch (error) {
            console.error("Error adding post:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create a Post</h2>
            <form onSubmit={handleSubmit} className="border p-4 rounded shadow">
                <div className="form-group">
                    <label htmlFor="caption">Caption</label>
                    <input
                        type="text"
                        name="caption"
                        value={post.caption}
                        className="form-control"
                        placeholder="Enter a caption"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="content">Content</label>
                    <input
                        type="text"
                        name="content"
                        value={post.content}
                        className="form-control"
                        placeholder="Enter content"
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="file">Upload Images/Videos</label>
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg, image/jpg, video/mp4"
                        className="form-control-file"
                        onChange={handleFileChange}
                    />
                </div>
                <button type="submit" className="btn btn-primary btn-block">Submit Post</button>
            </form>
        </div>
    );
};

export default CreatePost;
