import {Buffer} from 'buffer'
const Photo = (photo) => {
    if (!photo) return null;
    
    const base64String = Buffer.from(photo).toString('base64');
    return `data:image/jpeg;base64,${base64String}`; // Adjust MIME type if needed
  };
  
  const Video = (video) => {
    if (!video) return null;
    
    const base64String = Buffer.from(video).toString('base64');
    return `data:video/mp4;base64,${base64String}`; // Adjust MIME type if needed
  };
  
  export { Video, Photo };
  