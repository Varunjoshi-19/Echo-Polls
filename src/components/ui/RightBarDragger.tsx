"use client";

import { useRightDrag } from "@/hooks/dragger";
import cssStyles from "@/styles/rightbar.module.css";
import PollCard from "./PollCard";
import { useAuth } from "@/context/AuthContext";
import { handleAddVote } from "@/services/polls";
import toast from "react-hot-toast";
import { useGlobal } from "@/context/GlobalContext";


export default function RightBarDragger() {

    const { containerRef, onMouseDown } = useRightDrag({
        minRight: 0,
        maxRight: -560
    });

    const { user } = useAuth();
    const { polls, totalUsers, loading , socket } = useGlobal();

    const handleVote = async (pollId: string, optionIdx: number) => {

        if (!user) return;
        const result = await handleAddVote(user.id, pollId, optionIdx);
        if (result) {
            socket.emit("update-poll-state", { pollId, optionIdx , userId : user.id });
            toast.success("Vote added");
        }
        else {
            toast.error("Failed to add vote!");
        }

    }


    if (loading) return <div>Loading...</div>

    return (

        <div ref={containerRef} className={cssStyles.container}>
            <div onMouseDown={onMouseDown} className={cssStyles.rightBar}></div>

            <div className={cssStyles.contentContainer}>
                {polls && polls.length > 0 ? (
                    polls.map((poll: any) => (
                        <PollCard
                            key={poll._id}
                            totalUsers={totalUsers}
                            handleVote={handleVote}
                            pollData={poll}
                        />
                    ))
                ) : (
                    <div style={styles.emptyState}>
                        <h3>No polls yet</h3>
                        <p>Be the first one to create a poll.</p>
                    </div>
                )}
            </div>

        </div>
    )

}


const styles: Record<string, React.CSSProperties> = {
    emptyState: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 40,
        borderRadius: 12,
        color: "white",
        textAlign: "center",
        gap: 8,
        height: "100vh",
    },
};





