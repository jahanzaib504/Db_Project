import { useEffect, useState } from "react";
import api from "../../axios";
import { useParams } from "react-router-dom";

const MessagePage = () => {
    const {friend_id}=useParams();
    const [messages, setMessages] = useState([]);
    const [friend, setFriend] = useState();
    const [after_message_id, set_after_message_id] = useState(-1);
    const [loading, setLoading] = useState(true);
    const fetchMessages = async()=>{
        try{
            const token = localStorage.getItem('authToken');
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            let m = (await api.get(`/friend/${friend_id}/${after_message_id}`)).data.messages;
            setMessages(m);
        }catch(err){
            console.log(err)
        }}

    useEffect(()=>{
       fetchMessages();
    }
    , [])
    return( 
       <div>
        <div>
            {messages.length > 0 && (messages.map(message=>(
                <div key={message.message_id}>
                    <div>{message.content}</div>
                    <span>{message.messeged_at}</span>
                </div>
            )))}
        </div>
        <input type="text" placeholder="Type a message"/>
       </div>
    )
};
 
export default MessagePage;