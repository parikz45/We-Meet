import React, { useContext, useEffect, useState } from 'react';
import './Conversation.css';
import { format } from "timeago.js";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Image } from '@mui/icons-material';

function Conversation({ message, self, onReply }) {
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;
    const [senderData, setSenderData] = useState(null);
    const navigate = useNavigate();
    const [fullImage, setFullImage] = useState(false);
    const [msgOptions, setMsgOptions] = useState({ visible: false, x: 0, y: 0, messageId: null });
    const [deletemsg, setDeletemsg] = useState(false);
    const { user } = useContext(AuthContext);

    // fetching message sender's data
    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(`https://we-meet-mecf4.sevalla.app/api/users?userId=${message.sender}`);
                setSenderData(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getData();
    }, [message.sender]);

    useEffect(() => {
        const handleClick = () => {
            if (msgOptions.visible) {
                setMsgOptions({ ...msgOptions, visible: false });
            }
        }
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [msgOptions]);

    // delete a message
    const deleteSelectedMsg = async () => {
        try {
            await axios.delete(`https://we-meet-mecf4.sevalla.app/api/messages/${message._id}`, {
                data: { userId: user._id }
            });
            setDeletemsg(false);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <>
            <div className={self ? (message.image ? "msg-recievedWithimage" : "msg-recieved") : (message.image ? "msg-sentWithimage" : "msg-sent")}>

                <div className="convo-top">                    

                    {/* delete and reply message preview */}
                    {msgOptions.visible && msgOptions.messageId === message._id && (
                        <div
                            className="msg-options"
                            style={{
                                position: "fixed",
                                top: msgOptions.y,
                                left: msgOptions.x,
                                background: "white",
                                boxShadow: "0 0 5px rgba(0,0,0,0.3)",
                                borderRadius: "5px",
                                zIndex: 999,
                                padding: "8px",
                                cursor: "pointer"
                            }}
                        >
                            {self && <div className="delmsg-span" onClick={() => setDeletemsg(true)}>Delete Message</div>}
                            <div className="delmsg-span" onClick={() => onReply(message)}>Reply</div>
                        </div>
                    )}

                    <div className="chat-div">
                        {/* profile picture in chat */}
                        <img
                            className="chat-img"
                            onClick={() => navigate("/profile/" + senderData?.username)}
                            src={senderData?.profilePicture ? PF + senderData.profilePicture : PF + "profile.jpg"}
                            alt="profile"
                        />
                        <div className="image-text" onDoubleClick={() => onReply(message)} onContextMenu={(e) => {
                            
                            e.preventDefault();
                            setMsgOptions({
                                visible: true,
                                x: e.clientX + 10,
                                y: e.clientY + 10,
                                messageId: message._id
                            });
                        }}>
                            {/* image in conversation */}
                            {message.image && (
                                <img
                                    onClick={() => setFullImage(true)}
                                    className="conversation-image"
                                    src={PF + message.image}
                                    alt="sent"
                                />
                            )}

                            {/* text in conversation */}
                            {message.text && (
                                <div className={self ? 'messageOwn' : (message.image ? 'messageFriend-img' : 'message-friend')}>
                                    <span className="chat">{message.text}</span>
                                </div>
                            )}

                            {/* audio in conversation */}
                            {message.audio && (
                                <div className="audio-wrapper">
                                    <audio controls className="audio-player">
                                        <source src={"https://we-meet-mecf4.sevalla.app/api/messages/audio/" + message.audio} type="audio/webm" />
                                        Your browser does not support the audio tag.
                                    </audio>
                                </div>
                            )}
                        </div>
                    </div>
                    {/* message sent time */}
                    <span className={self ? "msg-time" : "msgtime-friend"}>{format(message.createdAt)}</span>
                </div>
            </div>
            
            {/* chat-image in full screen */}
            {fullImage && (
                <div className="fullscreen-overlay" onClick={() => setFullImage(false)}>
                    <img className="fullscreen-image" src={PF + message.image} alt="full" />
                </div>
            )}
            {/* delete image preview */}
            {deletemsg &&
                <div className='logout-overlay'>
                    <div className="logout-div">
                        <span style={{ fontWeight: "450" }}>Are you sure you want to delete this message?</span>
                        <div className="logoutButtons">
                            <button className="logout-cancel" onClick={() => setDeletemsg(false)}>Cancel</button>
                            <button className="logout-confirm" onClick={() => deleteSelectedMsg()}>Delete</button>
                        </div>
                    </div>
                </div>
            }


        </>
    );
}

export default Conversation;
