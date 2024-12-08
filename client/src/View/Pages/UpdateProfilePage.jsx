import { useContext, useState } from "react";
import UserContext from "../../UserContext";

const UpdateProfilePage = () => {
    const {userDetails: user, setUserDetails} = useContext(UserContext);
    const [password, setPassword] = useState({old:'', new:''})
    return (
        <div>

            <input value={user.cover_picture} type="file"alt="" />
            <input value={user.profile_picture} type="file" />
         
        </div>
    );
}
 
export default UpdateProfilePage;