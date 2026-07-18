import React, { useContext, useEffect, useRef, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import Online from '../Online/Online';
import Conversation from '../Conversation/Conversation';
import { Close, EmojiEmotionsOutlined, Send, Attachment, Cancel, Search, ChatBubbleOutline } from '@mui/icons-material';
import { AuthContext } from '../../context/AuthContext';
import axios from "axios";
import EmojiPicker from 'emoji-picker-react';
import { io } from "socket.io-client";
import AudioRecorder from './audio';
import { media } from "../../utils/media";

function Messenger() {
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState(null);
    const [newMessage, setNewMessage] = useState("");
    const scrollRef = useRef();
    const [friends, setFriends] = useState([]);
    const [searchfriends, setSearchfriends] = useState([]);
    const [searchquery, setSearchquery] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [file, setFile] = useState(null);
    const [replyMessage, setReplyMessage] = useState(null);
    const [replySender, setReplySender] = useState("");
    const [arrivalMessage, setArrivalMessage] = useState(null);
    const [onlineUsers, setOnlineUsers] = useState([]);
    const emojiPickerRef = useRef();
    const emojiIconRef = useRef();
    const socket = useRef();
    const [chatUser, setChatUser] = useState(null);

    useEffect(() => {
        const getChatUser = async () => {
            if (!currentChat) return;
            const friendId = currentChat.members.find((m) => m !== user._id);
            const res = await axios.get(`https://we-meet-9jye.onrender.com/api/users?userId=${friendId}`);
            setChatUser(res.data);
        };
        getChatUser();
    }, [currentChat, user._id]);

    // fetching sender of a message being replied to
    useEffect(() => {
        const fetchSender = async () => {
            if (replyMessage) {
                try {
                    const res = await axios.get(`https://we-meet-9jye.onrender.com/api/users?userId=${replyMessage.sender}`);
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
                const friendList = await axios.get(`https://we-meet-9jye.onrender.com/api/users/friends/${user._id}`);
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
                const res = await axios.get("https://we-meet-9jye.onrender.com/api/conversations/" + user._id);
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
                const response = await axios.get("https://we-meet-9jye.onrender.com/api/messages/" + currentChat?._id);
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
                const response = await axios.post("https://we-meet-9jye.onrender.com/api/upload/", data);
                message.image = response.data.filename;
            }

            // send message to backend
            const res = await axios.post("https://we-meet-9jye.onrender.com/api/messages/", message);

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
                const res = await axios.post("https://we-meet-9jye.onrender.com/api/conversations", {
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
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        socket.current = io("wss://we-meet-production.up.railway.app", {
            transports: ['websocket'],
            auth: { token },
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

    // The friend in the currently-open chat, and whether they're online.
    const chatFriendId = currentChat?.members.find((m) => m !== user._id);
    const isChatUserOnline = onlineUsers.includes(chatFriendId);

    return (
        <div className="flex flex-col h-screen bg-[#f5f5f7]">
            <Navbar />
            <div className="flex flex-1 overflow-hidden">
                {/* Friends list */}
                <div className="hidden md:flex md:flex-col w-80 bg-white border-r border-gray-200/80">

                    {/* Header */}
                    <div className="h-16 flex items-center px-5 border-b border-gray-200/80">
                        <span className="text-lg font-semibold text-gray-900">Messages</span>
                    </div>

                    {/* Search */}
                    <div className="px-4 pt-4 pb-2">
                        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 h-10
                                        focus-within:border-indigo-400 focus-within:ring-3 focus-within:ring-indigo-100 transition-all">
                            <Search className="text-gray-400 shrink-0" fontSize="small" />
                            <input
                                value={searchquery}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSearchquery(val);
                                    findFriends(val);
                                }}
                                placeholder="Search friends"
                                className="flex-1 bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
                            />
                            {searchquery && (
                                <button
                                    onClick={() => setSearchquery("")}
                                    className="text-gray-300 hover:text-gray-500 transition text-lg leading-none"
                                >
                                    ×
                                </button>
                            )}
                        </div>
                    </div>

                    {/* List */}
                    <div className="flex-1 overflow-y-auto px-2 py-2 space-y-1">
                        {searchquery ? (
                            searchfriends.length > 0 ? (
                                searchfriends.map((friend) => (
                                    <div
                                        key={friend._id}
                                        onClick={() => handleFriendClick(friend)}
                                        className="group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-gray-50 transition"
                                    >
                                        <div className="relative shrink-0">
                                            <img
                                                src={
                                                    friend.profilePicture
                                                        ? media(friend.profilePicture)
                                                        : media("profile.jpg")
                                                }
                                                className="w-11 h-11 rounded-full object-cover ring-2 ring-transparent group-hover:ring-indigo-400 transition"
                                                alt=""
                                            />
                                            {onlineUsers.includes(friend._id) && (
                                                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
                                            )}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-900">
                                                {friend.username}
                                            </span>
                                            <span className="text-xs text-gray-400">
                                                {onlineUsers.includes(friend._id) ? "Active now" : "Click to chat"}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full text-sm text-gray-400">
                                    No users found
                                </div>
                            )
                        ) : conversations.length > 0 ? (
                            conversations.map((c) => (
                                <div
                                    key={c._id}
                                    onClick={() => setCurrentChat(c)}
                                    className={`rounded-xl cursor-pointer transition ${
                                        currentChat?._id === c._id ? "bg-indigo-50" : "hover:bg-gray-50"
                                    }`}
                                >
                                    <Online conversation={c} currentUser={user} onlineUsers={onlineUsers} />
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center justify-center h-full text-sm text-gray-400 px-4 text-center">
                                No conversations yet. Search a friend to start chatting.
                            </div>
                        )}
                    </div>
                </div>



                {/* Chat section */}
                <div className="flex flex-col flex-1 bg-white">
                    {/* Chat Header */}
                    {currentChat && chatUser && (
                        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200/80">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <img
                                        src={chatUser.profilePicture ? media(chatUser.profilePicture) : media("profile.jpg")}
                                        alt="avatar"
                                        className="w-11 h-11 rounded-full object-cover"
                                    />
                                    {isChatUserOnline && (
                                        <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 ring-2 ring-white" />
                                    )}
                                </div>
                                <div className="flex flex-col leading-tight">
                                    <span className="text-base font-semibold text-gray-900">
                                        {chatUser.username}
                                    </span>
                                    <span className={`text-xs ${isChatUserOnline ? "text-green-500" : "text-gray-400"}`}>
                                        {isChatUserOnline ? "Active now" : "Offline"}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                    {currentChat ? (
                        <>
                            {/* Messages */}
                            <div className="flex-1 flex flex-col gap-4 overflow-y-auto px-8 py-6 space-y-3">
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
                            <form className="border-t border-gray-200 bg-white px-4 py-3">
                                {/* Reply Preview */}
                                {replyMessage && (
                                    <div className="mb-2 flex items-center justify-between rounded-lg bg-indigo-50 px-3 py-2 border-l-4 border-indigo-400">
                                        <div className="min-w-0">
                                            <div className="text-xs font-semibold text-indigo-600">
                                                {replySender === user.username ? "You" : replySender}
                                            </div>
                                            <div className="text-xs text-gray-600 truncate">
                                                {replyMessage.text || "Media"}
                                            </div>
                                        </div>
                                        <Close
                                            className="cursor-pointer text-gray-500 hover:text-gray-700"
                                            onClick={() => setReplyMessage(null)}
                                        />
                                    </div>
                                )}

                                {/* Attachment Preview */}
                                {file && (
                                    <div className="mb-2 relative w-fit">
                                        <img
                                            className="w-28 h-28 rounded-xl border object-cover"
                                            src={URL.createObjectURL(file)}
                                            alt=""
                                        />
                                        <Cancel
                                            className="absolute -top-2 -right-2 bg-white rounded-full text-red-500 cursor-pointer shadow"
                                            onClick={() => setFile(null)}
                                        />
                                    </div>
                                )}

                                {/* Composer */}
                                <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-3 py-2">

                                    {/* Mic */}
                                    <div className="flex items-center justify-center text-gray-500">
                                        <AudioRecorder sender={user._id} conversationId={currentChat._id} />
                                    </div>

                                    {/* Input */}
                                    <div className="relative flex-1">
                                        <textarea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message"
                                            rows={1}
                                            className="w-full resize-none bg-transparent text-sm text-gray-700 
        placeholder:text-gray-400 focus:outline-none px-2 py-2"
                                        />

                                        {/* Emoji */}
                                        <div
                                            ref={emojiIconRef}
                                            onClick={handleEmojiClick}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600"
                                        >
                                            <EmojiEmotionsOutlined fontSize="small" />
                                        </div>

                                        {showEmojiPicker && (
                                            <div ref={emojiPickerRef} className="absolute bottom-12 right-0 z-20">
                                                <EmojiPicker
                                                    onEmojiClick={(e) => setNewMessage((prev) => prev + e.emoji)}
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Attach */}
                                    <label
                                        htmlFor="file"
                                        className="flex items-center justify-center w-9 h-9 rounded-full cursor-pointer hover:bg-gray-200 transition"
                                    >
                                        <Attachment fontSize="small" className="text-gray-500" />
                                    </label>

                                    <input
                                        id="file"
                                        type="file"
                                        accept=".png,.jpeg,.jpg"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files[0])}
                                    />

                                    {/* Send */}
                                    <button
                                        type="button"
                                        onClick={newMessage.trim() === "" && !file ? null : handleSubmit}
                                        className={`flex items-center justify-center w-10 h-10 rounded-full transition
        ${newMessage.trim() === "" && !file
                                                ? "bg-gray-200 cursor-not-allowed"
                                                : "bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                                            }`}
                                    >
                                        <Send
                                            fontSize="small"
                                            className={
                                                newMessage.trim() === "" && !file ? "text-gray-400" : "text-white"
                                            }
                                        />
                                    </button>
                                </div>
                            </form>

                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 gap-4 text-gray-400">
                            <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                                <ChatBubbleOutline fontSize="large" />
                            </div>
                            <p className="text-base font-medium text-gray-500">Select a conversation to start chatting</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Messenger;
