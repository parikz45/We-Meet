import React, { useContext, useEffect, useRef, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import './Messenger.css';
import Online from '../Online/Online';
import Conversation from '../Conversation/Conversation';
import { Close, EmojiEmotionsOutlined, Send, Attachment, Cancel, Image, Mic } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";
import EmojiPicker from 'emoji-picker-react';
import { io } from "socket.io-client";
import AudioRecorder from './audio';

function Messenger() {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);           // all conversations
    const [messages, setMessages] = useState([]);                     // all messages in current conversation
    const [currentChat, setCurrentChat] = useState(null);            // selected conversation
    const [newMessage, setNewMessage] = useState("");                // new message input
    const scrollRef = useRef();                                      // for auto-scroll to last message
    const [friends, setFriends] = useState([]);                      // all friends of user
    const [searchfriends, setSearchfriends] = useState([]);          // filtered friends from search
    const [searchquery, setSearchquery] = useState("");              // friend search query
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);   // toggle emoji picker
    const [file, setFile] = useState(null);                          // image to send
    const [sendAudio, setSendAudio] = useState(false);               // unused but can toggle audio UI
    const [replyMessage, setReplyMessage] = useState(null);          // message being replied to
    const [replySender, setReplySender] = useState("");              // sender of the reply message
    const [arrivalMessage, setArrivalMessage] = useState(null);      // message received in real-time via socket
    const emojiPickerRef = useRef();                                 // emoji picker popup
    const emojiIconRef = useRef();                                   // emoji icon trigger
    const socket = useRef();                                         // socket reference
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;                   // public folder path

    // fetching sender of a message being replied to
    useEffect(() => {
        const fetchSender = async () => {
            if (replyMessage) {
                try {
                    const res = await axios.get(`https://we-meet-9jye.onrender.com//api/users?userId=${replyMessage.sender}`);
                    setReplySender(res.data.username);
                } catch (err) {
                    console.error("Error fetching sender", err);
                }
            } else {
                setReplySender("");
            }
        };
        fetchSender();
    }, [replyMessage]);

    // fetch friends of the user
    useEffect(() => {
        const getFriends = async () => {
            if (!user._id) return;
            try {
                const friendList = await axios.get(`https://we-meet-9jye.onrender.com//api/users/friends/${user._id}`);
                setFriends(friendList.data);
            } catch (err) {
                console.error("Error fetching friends:", err.response?.data || err.message);
            }
        };
        getFriends();
    }, [user._id]);

    // fetch user's conversations
    useEffect(() => {
        const getConversations = async () => {
            try {
                const res = await axios.get("https://we-meet-9jye.onrender.com//api/conversations/" + user._id);
                setConversations(res.data);
            } catch (err) {
                console.log(err);
            }
        }
        getConversations();
    }, [user._id]);

    // fetch messages for selected chat
    useEffect(() => {
        const getMessages = async () => {
            try {
                const response = await axios.get("https://we-meet-9jye.onrender.com//api/messages/" + currentChat?._id);
                setMessages(response.data);
            } catch (err) {
                console.log(err);
            }
        }
        getMessages();
    }, [currentChat]);

    // submit new message
    const handleSubmit = async (e) => {
        e.preventDefault();
        const message = {
            sender: user._id,
            text: newMessage,
            conversationId: currentChat._id,
            replyTo: replyMessage?._id || null
        };
        const receiverId = currentChat.members.find((member) => member !== user._id);

        try {
            // if an image is selected
            if (file) {
                const data = new FormData();
                data.append("file", file);
                const response = await axios.post("https://we-meet-9jye.onrender.com//api/upload/", data);
                message.image = response.data.filename;
            }

            // send message to backend
            const res = await axios.post("https://we-meet-9jye.onrender.com//api/messages/", message);

            // send message via socket to receiver
            socket.current.emit("sendMessage", {
                ...res.data,
                receiverId
            });

            // update local messages
            setMessages([...messages, res.data]);
            setNewMessage("");
            setFile(null);
            setReplyMessage(null);
        } catch (err) {
            console.log(err);
        }
    };

    // scroll to latest message
    useEffect(() => {
        if (scrollRef.current) {
            setTimeout(() => {
                scrollRef.current.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    }, [messages]);

    // filter friends based on search input
    const findFriends = (query) => {
        const filtered = friends.filter(friend =>
            friend.username.toLowerCase().includes(query.toLowerCase())
        );
        setSearchfriends(filtered);
    };

    // create or open conversation with a friend
    const handleFriendClick = async (friend) => {
        const existing = conversations.find(c =>
            c.members.includes(user._id) && c.members.includes(friend._id)
        );

        if (existing) {
            setCurrentChat(existing);
        } else {
            try {
                const res = await axios.post("https://we-meet-9jye.onrender.com//api/conversations", {
                    senderId: user._id,
                    recieverId: friend._id
                });
                setConversations([...conversations, res.data]);
                setCurrentChat(res.data);
            } catch (err) {
                console.error("Error creating conversation:", err);
            }
        }
    };

    // toggle emoji picker
    const handleEmojiClick = () => {
        setShowEmojiPicker((prev) => !prev);
    };

    // hide emoji picker when clicking outside
    useEffect(() => {
        const handleClick = () => {
            if (
                emojiPickerRef.current && !emojiPickerRef.current.contains(event.target) &&
                emojiIconRef.current && !emojiIconRef.current.contains(event.target)
            ) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener("click", handleClick);
        return () => document.removeEventListener("click", handleClick);
    }, [showEmojiPicker]);

    // setup socket connection and receive real-time messages
    useEffect(() => {
        socket.current = io("ws://localhost:8900");
        socket.current.on("getMessage", (data) => {
            setArrivalMessage(data);
        });
    }, []);

    // append new socket message to current chat
    useEffect(() => {
        arrivalMessage &&
            currentChat?.members.includes(arrivalMessage.sender) &&
            setMessages((prev) => [...prev, arrivalMessage]);
    }, [arrivalMessage, currentChat]);

    // emit user connection to socket server
    useEffect(() => {
        socket.current.emit("addUser", user._id);
        socket.current.on("getUsers", (users) => {
            setOnlineUsers(
                (user.followings || []).filter((f) => users.some((u) => u.userId === f))
            );
        });
    }, [user]);

    return (
        <div className='messenger'>
            <Navbar />
            <div className='messenger-body'>
                {/* Friends list / Conversations */}
                <div className='friends-list'>
                    <div>
                        <div className="online">
                            <div className="search-container">
                                <input
                                    value={searchquery}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        setSearchquery(val);
                                        findFriends(val);
                                    }}
                                    className='friend-search'
                                    placeholder='Search for friends'
                                />
                                {searchquery && (
                                    <div onClick={() => setSearchquery("")}>
                                        <Close className="close-Icon" />
                                    </div>
                                )}
                            </div>
                        </div>
                        <hr style={{ width: "260px" }} />
                    </div>
                    {searchquery ? (
                        searchfriends.length > 0 ? (
                            searchfriends.map((friend) => (
                                <div key={friend._id} onClick={() => handleFriendClick(friend)}>
                                    <div className='online'>
                                        <div className='online-friend'>
                                            <img className='chat-image' src={friend.profilePicture ? PF + friend.profilePicture : PF + '1.jpeg'} />
                                            <span className='chat-username'>{friend.username}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div style={{ marginTop: "15px", fontSize: "15px" }}>No results found</div>
                        )
                    ) : (
                        conversations.map((c) => (
                            <div key={c._id} onClick={() => setCurrentChat(c)}>
                                <Online conversation={c} currentUser={user} />
                            </div>
                        ))
                    )}
                </div>

                {/* Message panel */}
                <div className='my-msg'>
                    {currentChat ? (
                        <div className="chat-list">
                            <>
                                {messages.map((m) => {
                                    const isSelf = String(m.sender) === String(user._id);
                                    return <Conversation key={m._id} message={m} self={isSelf} onReply={(msg) => setReplyMessage(msg)} />;
                                })}
                                <div ref={scrollRef} />
                            </>
                        </div>
                    ) : (
                        <span className="noConversation">Open a conversation to start chatting</span>
                    )}

                    {/* Message input box */}
                    {currentChat && (
                        <form className="convo-bottom">
                            {/* Audio recorder */}
                            <div onClick={() => setSendAudio(true)}>
                                <AudioRecorder sender={user._id} conversationId={currentChat._id} />
                            </div>

                            {/* Preview selected image */}
                            {file && (
                                <div className="chat-previewcontainer">
                                    <img className="chat-shareImg" src={URL.createObjectURL(file)} />
                                    <Cancel className="chat-cancelbutton" onClick={() => setFile(null)} />
                                </div>
                            )}

                            <div className="chat-divBox">
                                {/* Emoji picker */}
                                {showEmojiPicker && (
                                    <div ref={emojiPickerRef} className="emojis-chat">
                                        <EmojiPicker onEmojiClick={(e) => setNewMessage(prev => prev + e.emoji)} />
                                    </div>
                                )}

                                <div className="input-wrapper">
                                    {/* Reply preview */}
                                    {replyMessage && (
                                        <div className="reply-preview">
                                            <div className="reply-content">
                                                <span className="reply-sender">{replySender === user.username ? "You" : replySender} </span>
                                                {replyMessage.image && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                                                        <div className="imageIcon"><Image /></div>
                                                        <span className="reply-text">Image</span>
                                                    </div>
                                                )}
                                                {replyMessage.text && (
                                                    <div><span className="reply-text">{replyMessage.text}</span></div>
                                                )}
                                                {replyMessage.audio && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                        <Mic style={{ width: "18px" }} />
                                                        <span className="reply-text">Audio</span>
                                                    </div>
                                                )}
                                            </div>
                                            {/* Small preview of image being replied to */}
                                            {replyMessage.image && (
                                                <div>
                                                    <img style={{ minWidth: "40px", maxWidth: "50px", minHeight: "50px", maxHeight: "60px", marginLeft: "660px" }} src={PF + replyMessage.image} />
                                                </div>
                                            )}
                                            {/* Remove reply */}
                                            <div onClick={() => setReplyMessage(null)} className="close-button">
                                                <Close />
                                            </div>
                                        </div>
                                    )}

                                    {/* Message textarea */}
                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => { setNewMessage(e.target.value); }}
                                        className="chat-input"
                                        placeholder="enter a message"
                                    />
                                </div>

                                {/* Attach file */}
                                <div style={{ color: "gray", position: "absolute", cursor: "pointer", top: "56px", left: "50px" }}>
                                    <label htmlFor="file" style={{ cursor: "pointer", color: "gray" }}>
                                        <Attachment />
                                    </label>
                                    <input
                                        style={{ display: "none" }}
                                        id="file"
                                        type="file"
                                        accept=".png,.jpeg,.jpg"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />
                                </div>

                                {/* Emoji icon */}
                                <div ref={emojiIconRef} onClick={handleEmojiClick}>
                                    <EmojiEmotionsOutlined className="chat-emoji" />
                                </div>
                            </div>

                            {/* Send message button */}
                            <div onClick={(newMessage.trim() === "" && !file) ? null : handleSubmit}>
                                <Send className={(newMessage.trim() === "" && !file) ? 'sendButton-disabled' : 'send-button'} />
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messenger;
