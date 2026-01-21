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
    const emojiPickerRef = useRef();
    const emojiIconRef = useRef();
    const socket = useRef();
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;

    // fetching sender of a message being replied to
    useEffect(() => {
        const fetchSender = async () => {
            if (replyMessage) {
                try {
                    const res = await axios.get(`https://we-meet-1-h00i.onrender.com/api/users?userId=${replyMessage.sender}`);
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
                const friendList = await axios.get(`https://we-meet-1-h00i.onrender.com/api/users/friends/${user._id}`);
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
                const res = await axios.get("https://we-meet-1-h00i.onrender.com/api/conversations/" + user._id);
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
                const response = await axios.get("https://we-meet-1-h00i.onrender.com/api/messages/" + currentChat?._id);
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
                const response = await axios.post("https://we-meet-1-h00i.onrender.com/api/upload/", data);
                message.image = response.data.filename;
            }

            // send message to backend
            const res = await axios.post("https://we-meet-1-h00i.onrender.com/api/messages/", message);

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
                const res = await axios.post("https://we-meet-1-h00i.onrender.com/api/conversations", {
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
                <div className="hidden md:flex md:flex-col w-72 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200">

                    {/* Search */}
                    <div className="p-4">
                        <div className="relative">
                            <input
                                value={searchquery}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSearchquery(val);
                                    findFriends(val);
                                }}
                                placeholder="Search friends"
                                className="w-full rounded-xl bg-white px-4 py-2.5 text-sm text-gray-700 
                   shadow-sm border border-gray-200
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />

                            {searchquery && (
                                <Close
                                    className="absolute right-3 top-1/2 -translate-y-1/2 
                     cursor-pointer text-gray-400 hover:text-gray-600"
                                    onClick={() => setSearchquery("")}
                                />
                            )}
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-200 mx-4 mb-2" />

                    {/* List */}
                    <div className="flex-1 overflow-y-auto px-2 space-y-1">
                        {searchquery ? (
                            searchfriends.length > 0 ? (
                                searchfriends.map((friend) => (
                                    <div
                                        key={friend._id}
                                        onClick={() => handleFriendClick(friend)}
                                        className="group flex items-center gap-3 px-3 py-3 rounded-xl cursor-pointer
                       hover:bg-white hover:shadow-sm transition-all duration-150"
                                    >
                                        {/* Avatar */}
                                        <div className="relative">
                                            <img
                                                src={
                                                    friend.profilePicture
                                                        ? PF + friend.profilePicture
                                                        : PF + "1.jpeg"
                                                }
                                                className="w-10 h-10 rounded-full object-cover ring-2 ring-transparent
                           group-hover:ring-blue-400 transition"
                                                alt=""
                                            />
                                        </div>

                                        {/* Text */}
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-gray-800 tracking-tight">
                                                {friend.username}
                                            </span>

                                            <span className="text-xs text-gray-400 opacity-0 
                               group-hover:opacity-100 transition">
                                                Click to chat
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="flex items-center justify-center h-full text-sm text-gray-400">
                                    No users found
                                </div>
                            )
                        ) : (
                            conversations.map((c) => (
                                <div
                                    key={c._id}
                                    onClick={() => setCurrentChat(c)}
                                    className="rounded-xl hover:bg-white hover:shadow-sm transition-all"
                                >
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
                            <form className="border-t border-gray-200 bg-white px-4 py-3">
                                {/* Reply Preview */}
                                {replyMessage && (
                                    <div className="mb-2 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 border-l-4 border-blue-400">
                                        <div className="min-w-0">
                                            <div className="text-xs font-semibold text-blue-600">
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
                                <div className="flex items-end gap-3">
                                    {/* Audio */}
                                    <AudioRecorder sender={user._id} conversationId={currentChat._id} />

                                    {/* Input */}
                                    <div className="relative flex-1">
                                        <textarea
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message"
                                            rows={1}
                                            className="w-full resize-none rounded-2xl border border-gray-300 
                   px-4 py-3 pr-12 text-sm text-gray-700
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        />

                                        {/* Emoji */}
                                        <div
                                            ref={emojiIconRef}
                                            onClick={handleEmojiClick}
                                            className="absolute right-4 bottom-3 cursor-pointer text-gray-400 hover:text-gray-600"
                                        >
                                            <EmojiEmotionsOutlined />
                                        </div>

                                        {showEmojiPicker && (
                                            <div
                                                ref={emojiPickerRef}
                                                className="absolute bottom-14 right-0 z-20"
                                            >
                                                <EmojiPicker
                                                    onEmojiClick={(e) =>
                                                        setNewMessage((prev) => prev + e.emoji)
                                                    }
                                                />
                                            </div>
                                        )}
                                    </div>

                                    {/* Attach */}
                                    <label
                                        htmlFor="file"
                                        className="cursor-pointer text-gray-400 hover:text-gray-600"
                                    >
                                        <Attachment />
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
                                        onClick={
                                            newMessage.trim() === "" && !file ? null : handleSubmit
                                        }
                                        className={`flex items-center justify-center w-10 h-10 rounded-full transition
        ${newMessage.trim() === "" && !file
                                                ? "bg-gray-200 cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-600"
                                            }`}
                                    >
                                        <Send
                                            className={
                                                newMessage.trim() === "" && !file
                                                    ? "text-gray-400"
                                                    : "text-white"
                                            }
                                        />
                                    </button>
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
