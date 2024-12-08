import {Photo, Video} from './converter'
export function processPost(post){
    if(post.profile_picture)
        post.profile_picture = Photo(post.profile_picture);

    if(post.cover_picture)
        post.cover_picture = Photo(post.cover_picture);
    post.images = post.images.map(Photo);
    post.videos = post.videos.map(Video)
    return post;
}