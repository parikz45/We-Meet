import React, { useContext, useEffect, useRef, useState } from 'react';
import Navbar from '../Navbar/Navbar';
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
                    const res = await axios.get(`http://localhost:8800/api/users?userId=${replyMessage.sender}`);
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
                const friendList = await axios.get(`http://localhost:8800/api/users/friends/${user._id}`);
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
                const res = await axios.get("http://localhost:8800/api/conversations/" + user._id);
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
                const response = await axios.get("http://localhost:8800/api/messages/" + currentChat?._id);
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
                const response = await axios.post("http://localhost:8800/api/upload/", data);
                message.image = response.data.filename;
            }

            // send message to backend
            const res = await axios.post("http://localhost:8800/api/messages/", message);

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
                const res = await axios.post("http://localhost:8800/api/conversations", {
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
        socket.current = io("wss://we-meet-production.up.railway.app", {
            transports: ['websocket'],
        });

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
        <div className="flex flex-col h-screen">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                {/* Friends list */}
                <div className="hidden md:flex md:flex-col w-72 border-r border-gray-300 p-4 bg-gray-50">
                    <div className="mb-2">
                        <div className="relative">
                            <input
                                value={searchquery}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSearchquery(val);
                                    findFriends(val);
                                }}
                                className="w-full rounded-md bg-gray-200 p-2 pr-8 text-gray-700 focus:outline-none"
                                placeholder="Search for friends"
                            />
                            {searchquery && (
                                <Close
                                    className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                                    onClick={() => setSearchquery("")}
                                />
                            )}
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto">
                        {searchquery ? (
                            searchfriends.length > 0 ? (
                                searchfriends.map((friend) => (
                                    <div
                                        key={friend._id}
                                        onClick={() => handleFriendClick(friend)}
                                        className="flex items-center gap-4 p-4 rounded-md cursor-pointer"
                                    >
                                        <img
                                            className="w-10 h-10 rounded-full object-cover"
                                            src={friend.profilePicture ? PF + friend.profilePicture : PF + '1.jpeg'}
                                        />
                                        <span className="font-medium text-gray-700">{friend.username}</span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-sm text-gray-500 mt-2">No results found</div>
                            )
                        ) : (
                            conversations.map((c) => (
                                <div key={c._id} onClick={() => setCurrentChat(c)}>
                                    <Online conversation={c} currentUser={user} />
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Chat section */}
                <div className="flex flex-col flex-1">
                    {currentChat ? (
                        <>
                            {/* Messages */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                                {messages.map((m) => {
                                    const isSelf = String(m.sender) === String(user._id);
                                    return (
                                        <Conversation
                                            key={m._id}
                                            message={m}
                                            self={isSelf}
                                            onReply={(msg) => setReplyMessage(msg)}
                                        />
                                    );
                                })}
                                <div ref={scrollRef} />
                            </div>

                            {/* Input area */}
                            <form className="flex items-end p-3 border-t border-gray-200 bg-white">
                                <AudioRecorder sender={user._id} conversationId={currentChat._id} />

                                {file && (
                                    <div className="relative ml-2">
                                        <img
                                            className="w-28 h-28 rounded-lg border"
                                            src={URL.createObjectURL(file)}
                                        />
                                        <Cancel
                                            className="absolute top-1 right-1 cursor-pointer text-red-500"
                                            onClick={() => setFile(null)}
                                        />
                                    </div>
                                )}

                                <div className="relative flex-1 mx-2">
                                    {replyMessage && (
                                        <div className="absolute -top-16 left-0 right-0 bg-blue-50 border-l-4 border-blue-400 p-2 rounded-md flex justify-between items-center">
                                            <div>
                                                <span className="text-blue-600 font-semibold text-sm">
                                                    {replySender === user.username ? "You" : replySender}
                                                </span>
                                                <div className="text-xs text-gray-600 truncate">
                                                    {replyMessage.text || "Media"}
                                                </div>
                                            </div>
                                            <Close
                                                className="cursor-pointer text-gray-600"
                                                onClick={() => setReplyMessage(null)}
                                            />
                                        </div>
                                    )}

                                    <textarea
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        className="w-full h-12 resize-none border rounded-md px-3 py-2 pr-10 text-gray-700 focus:outline-none"
                                        placeholder="Type a message"
                                    />

                                    <div
                                        ref={emojiIconRef}
                                        onClick={handleEmojiClick}
                                        className="absolute bottom-2 left-2 cursor-pointer text-gray-500"
                                    >
                                        <EmojiEmotionsOutlined />
                                    </div>

                                    {showEmojiPicker && (
                                        <div ref={emojiPickerRef} className="absolute bottom-14 left-0 z-10">
                                            <EmojiPicker onEmojiClick={(e) => setNewMessage(prev => prev + e.emoji)} />
                                        </div>
                                    )}
                                </div>

                                <label htmlFor="file" className="cursor-pointer text-gray-500 mx-2">
                                    <Attachment />
                                </label>
                                <input
                                    id="file"
                                    type="file"
                                    accept=".png,.jpeg,.jpg"
                                    className="hidden"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />

                                <div
                                    onClick={(newMessage.trim() === "" && !file) ? null : handleSubmit}
                                    className="ml-2"
                                >
                                    <Send
                                        className={(newMessage.trim() === "" && !file)
                                            ? 'text-gray-400 cursor-not-allowed'
                                            : 'text-blue-500 cursor-pointer'}
                                    />
                                </div>
                            </form>
                        </>
                    ) : (
                        <div className="flex items-center justify-center flex-1 text-gray-400 text-2xl">
                            Open a conversation to start chatting
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messenger;
