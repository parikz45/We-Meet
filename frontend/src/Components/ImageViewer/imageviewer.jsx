import { useEffect, useRef, useState } from "react";
import { Close, ZoomIn, ZoomOut } from "@mui/icons-material";

export default function ImageViewer({ src, open, onClose }) {
    const [scale, setScale] = useState(1);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const dragging = useRef(false);
    const last = useRef({ x: 0, y: 0 });

    useEffect(() => {
        if (!open) return;
        setScale(1);
        setPos({ x: 0, y: 0 });

        const onEsc = (e) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onEsc);
        return () => window.removeEventListener("keydown", onEsc);
    }, [open]);

    if (!open) return null;

    const onWheel = (e) => {
        e.preventDefault();
        setScale((s) => Math.min(3, Math.max(1, s + (e.deltaY < 0 ? 0.1 : -0.1))));
    };

    const onMouseDown = (e) => {
        dragging.current = true;
        last.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseMove = (e) => {
        if (!dragging.current) return;
        setPos((p) => ({
            x: p.x + (e.clientX - last.current.x),
            y: p.y + (e.clientY - last.current.y),
        }));
        last.current = { x: e.clientX, y: e.clientY };
    };

    const onMouseUp = () => (dragging.current = false);

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center"
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            {/* Controls */}
            <div className="absolute top-4 right-4 flex gap-2 z-10">
                <button onClick={() => setScale((s) => Math.min(3, s + 0.2))} className="cursor-pointer p-2 bg-white/90 rounded-full">
                    <ZoomIn fontSize="small" />
                </button>
                <button onClick={() => setScale((s) => Math.max(1, s - 0.2))} className="cursor-pointer p-2 bg-white/90 rounded-full">
                    <ZoomOut fontSize="small" />
                </button>
                <button onClick={onClose} className="cursor-pointer p-2 bg-white/90 rounded-full">
                    <Close fontSize="small" />
                </button>
            </div>

            {/* Image */}
            <img
                src={src}
                onWheel={onWheel}
                onMouseDown={onMouseDown}
                draggable={false}
                className="max-w-[90vw] max-h-[90vh] cursor-grab active:cursor-grabbing select-none transition-transform duration-150"
                style={{
                    transform: `translate(${pos.x}px, ${pos.y}px) scale(${scale})`,
                }}
            />
        </div>
    );
}