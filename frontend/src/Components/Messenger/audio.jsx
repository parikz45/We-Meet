import React, { useState, useRef } from 'react';
import { Mic, Stop, Save, Delete } from '@mui/icons-material';
import axios from 'axios';
import "./audio.css";

const AudioRecorder = ({ sender, conversationId }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordedBlob, setRecordedBlob] = useState(null);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    // start recording
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                console.log(blob.size);
                setRecordedBlob(blob); 
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Microphone access denied:", err);
        }
    };

    // stop recording
    const stopRecording = (e) => {
        e.preventDefault();
        mediaRecorderRef.current?.stop();
        setIsRecording(false);
    };

    const sendRecording = async () => {
        if (!recordedBlob) return;

        const formData = new FormData();
        formData.append("audio", recordedBlob, "recording.webm");
        formData.append("sender", sender);
        formData.append("conversationId", conversationId);

        try {
            await axios.post("https://we-meet-mecf4.sevalla.app/api/messages/audio", formData);
            console.log("Audio uploaded");
            setRecordedBlob(null); 
        } catch (err) {
            console.error("Upload failed:", err);
        }
    };

    // delete recording
    const discardRecording = () => {
        setRecordedBlob(null); 
    };

    return (
        <div>
            
            {/* displaying stop or start recording buttons based on current recording state */}
            {isRecording ? (
                <button type='button' onClick={stopRecording} style={{ color: "red", cursor:"pointer" }}>
                    <Stop /> Stop
                </button>
            ) : recordedBlob ? (
                <div style={{ display: "flex", gap: "10px", alignItems: "center", position:"absolute", bottom:"80px" }}>
                    <audio controls src={URL.createObjectURL(recordedBlob)} />
                    <button type='button' onClick={sendRecording} style={{cursor:"pointer"}}><Save /> Send</button>
                    <button type='button' onClick={discardRecording} style={{ color: "gray", cursor:"pointer" }}><Delete /> Discard</button>
                </div>
            ) : (
                <button type='button' className="mic-notrecording" onClick={startRecording}>
                    <Mic /> Record
                </button>
            )}
        </div>
    );
};

export default AudioRecorder;
