import { useState } from "react";

const Friend = ({parm_friend}) => {
    const [friend, setFriend] = useState(parm_friend);

    return (<div>
        <div>{friend.profile_picture}</div>
        <div>{friend.user_name}</div>
    </div>);
}
 
export default Friend;