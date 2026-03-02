import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { CheckCircle, DeleteOutline } from "@mui/icons-material";
import ConfirmDialogue from "../ConfirmDialogue/ConfirmDialogue";
import ImageViewer from "../ImageViewer/ImageViewer";

function Conversation({ message, self, onReply }) {
    const PF = import.meta.env.VITE_PUBLIC_FOLDER;
    const { user } = useContext(AuthContext);

    const [senderData, setSenderData] = useState(null);
    const [selected, setSelected] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [viewerOpen, setViewerOpen] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                const res = await axios.get(
                    `https://we-meet-1-h00i.onrender.com/api/users?userId=${message.sender}`
                );
                setSenderData(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        getData();
    }, [message.sender]);

    const deleteSelectedMsg = async () => {
        try {
            await axios.delete(`https://we-meet-1-h00i.onrender.com/api/messages/${message._id}`, {
                data: { userId: user._id },
            });
            setShowDelete(false);
            setSelected(false);
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className={`flex w-full ${self ? "justify-end" : "justify-start"} mb-4`}>
            <div
                className={`group relative p-4 flex flex-col gap-3 max-w-[70%] rounded-2xl text-sm leading-relaxed
  ${self
                        ? message.image
                            ? "bg-white text-gray-900 shadow ring-1 ring-black/5"
                            : "bg-blue-500 text-white"
                        : "bg-gray-100 text-gray-800"
                    }
  ${message.image ? "p-2" : "px-4 py-2.5"}
`}
                onDoubleClick={() => onReply(message)}
            >
                {/* IMAGE */}
                {message.image && (
                    <img
                        src={PF + message.image}
                        onClick={(e) => {
                            e.stopPropagation();
                            setViewerOpen(true);
                        }}
                        className="mb-3 w-64 h-40 object-cover rounded-xl cursor-zoom-in"
                        alt=""
                    />
                )}

                {/* TEXT */}
                {message.text && <div className="mt-1">{message.text}</div>}

                {/* AUDIO */}
                {message.audio && (
                    <audio
                        controls
                        className="mt-2 w-full"
                        src={`https://we-meet-1-h00i.onrender.com/api/messages/audio/${message.audio}`}
                    />
                )}

                {/* SELECT BUTTON (small circle) */}
                {self && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelected((prev) => !prev);
                        }}
                        className={`absolute -left-5 top-1/2 -translate-y-1/2
              w-4 h-4 rounded-full border-2 flex items-center justify-center
              transition opacity-0 group-hover:opacity-100
              ${selected ? "border-blue-500 bg-blue-500" : "border-gray-300 bg-white"}
            `}
                    >
                        {selected && <span className="w-2 h-2 bg-white rounded-full" />}
                    </button>
                )}

                {/* DELETE BUTTON (left side) */}
                {self && selected && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowDelete(true);
                        }}
                        className="absolute -left-10 top-1/2 -translate-y-1/2
              bg-red-500 text-white p-1.5 rounded-full shadow
              hover:bg-red-600 transition"
                    >
                        <DeleteOutline fontSize="small" />
                    </button>
                )}
            </div>

            {/* Confirm Delete */}
            <ConfirmDialogue
                open={showDelete}
                title="Delete Message"
                description="Are you sure you want to delete this message?"
                confirmText="Delete"
                cancelText="Cancel"
                danger
                onConfirm={deleteSelectedMsg}
                onCancel={() => setShowDelete(false)}
            />

            {/* Fullscreen Image Viewer */}
            {message.image && (
                <ImageViewer
                    open={viewerOpen}
                    src={PF + message.image}
                    onClose={() => setViewerOpen(false)}
                />
            )}
        </div>
    );
}

export default Conversation;