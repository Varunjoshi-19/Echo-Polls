"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useGlobal } from "@/context/GlobalContext";

interface PollCardProps {
    pollData: any;
    totalUsers: number;
    handleVote: (pollId: string, optionIdx: number) => Promise<void>;
}

export default function PollCard({
    pollData,
    totalUsers,
    handleVote,
}: PollCardProps) {
    const { user } = useAuth();
    const { setPolls } = useGlobal();

    const [selected, setSelected] = useState<number | null>(null);

    useEffect(() => {
        if (!pollData || !user) return;

        if (selected === null) {
            const votesByMap = pollData.votesBy instanceof Map
                ? pollData.votesBy
                : new Map(Object.entries(pollData.votesBy || {}).map(([k, v]) => [k, v as number]));

            if (votesByMap.size === 0) {
                setSelected(null);
                return;
            }

            if (votesByMap.has(user.id)) {
                const votedIdx = votesByMap.get(user.id);
                setSelected(typeof votedIdx === "number" ? votedIdx : null);
            }
        }
    }, [pollData, user]);


    const updateVoteLocally = (pollId: string, optionIdx: number) => {
        setPolls((prev) => {
            if (!prev) return prev;

            return prev.map((poll) => {
                if (poll._id !== pollId) return poll;

                const current = structuredClone(poll);
                current.options[optionIdx].votes += 1;
                return current;
            });
        });
    };

    const rollbackVote = (pollId: string, optionIdx: number) => {
        setPolls((prev) => {
            if (!prev) return prev;

            return prev.map((poll) => {
                if (poll._id !== pollId) return poll;

                const next = structuredClone(poll);
                next.options[optionIdx].votes -= 1;
                return next;
            });
        });
    };

    const addVote = async (pollId: string, index: number) => {
        if (!user) {
            toast.error("Login required");
            return;
        }

        if (selected !== null) {
            toast.error("You already voted");
            return;
        }
        setSelected(index);
        updateVoteLocally(pollId, index);

        try {
            await handleVote(pollId, index);
        } catch {
            toast.error("Vote failed");
            rollbackVote(pollId, index);
            setSelected(null);
        }
    };

    if (!pollData) return null;

    const totalVotes = pollData.options.reduce(
        (sum: number, opt: any) => sum + opt.votes,
        0
    );

    return (
        <div style={styles.pollCard}>
            <h4 style={styles.question}>{pollData.question}</h4>

            <div style={styles.options}>
                {pollData.options.map((opt: any, index: number) => {
                    const percentage =
                        totalVotes > 0
                            ? Math.round((opt.votes / totalUsers) * 100)
                            : 0;

                    return (
                        <div
                            key={opt._id}
                            onClick={() => addVote(pollData._id, index)}
                            style={{
                                ...styles.option,
                                ...(selected === index && styles.optionSelected),
                            }}
                        >
                            <div style={styles.optionRow}>
                                <span>{opt.text}</span>
                                <span>{percentage}%</span>
                            </div>

                            <div style={styles.progress}>
                                <div
                                    style={{
                                        ...styles.progressFill,
                                        width: `${percentage}%`,
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div style={styles.footer}>
                <p >{totalVotes} people voted</p>
                <p>Created By :{" "}{pollData.createdBy}</p>
            </div>
        </div>
    );
}

const styles: Record<string, React.CSSProperties> = {
    pollCard: {
        borderRadius: 12,
        background: "white",
        padding: 16,
        marginBottom: 16,
    },
    question: {
        marginBottom: 12,
    },
    options: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    option: {
        padding: 10,
        background: "#e0e0e0e4",
        borderRadius: 8,
        cursor: "pointer",
    },
    optionSelected: {
        background: "rgb(1, 255, 1)",
    },
    optionRow: {
        display: "flex",
        justifyContent: "space-between",
        fontSize: 14,
        marginBottom: 6,
    },
    progress: {
        height: 6,
        background: "#eee",
        borderRadius: 4,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        background: "#111",
    },
    footer: {
        display : "flex",
        flex : 1,
        justifyContent : "space-between",
        marginTop: 12,
        fontSize: 12,
        color: "#666",
    },
};
