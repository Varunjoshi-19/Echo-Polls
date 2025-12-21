"use client";

import RightBarDragger from "@/components/ui/RightBarDragger";
import { useAuth } from "@/context/AuthContext";
import { CSSProperties } from "react";


export default function PollRoom() {

    const {logout} =  useAuth();

    return (
        <div>
            <div style={styles.infoBar}>
                <button onClick={logout} style={styles.logoutBtn}>Logout</button>
                <span style={styles.info}>← Drag this bar to view other uploaded polls</span>
            </div>
            <RightBarDragger />
        </div>

    )

}

const styles: Record<string, CSSProperties> = {
    infoBar: {
        position: "absolute",
        top: "12px",
        right: "16px",
        color: "#333",
        padding: "8px 12px",
        borderRadius: "6px",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        gap: "20px",
        pointerEvents: "none",
        userSelect: "none",
    },

    info: { 
        backgroundColor: "#f5f7fa",
        color: "#333",
        padding: "8px 12px",
        borderRadius: "6px",
        fontSize: "13px",
        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        pointerEvents: "none",
        userSelect: "none",
    },

    logoutBtn: {
        backgroundColor: "#e74c3c", 
        color: "#fff",
        border: "none",
        padding: "6px 14px",
        borderRadius: "4px",
        fontSize: "13px",
        cursor: "pointer",
        pointerEvents: "auto", 
        transition: "background-color 0.2s",
    }
};

