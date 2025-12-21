import { useAuth } from "@/context/AuthContext";
import { useGlobal } from "@/context/GlobalContext";
import { Minus } from "lucide-react";
import { ChangeEvent, CSSProperties, useState } from "react";
import toast from "react-hot-toast";

interface PollModalProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PollModal = ({ setIsOpen }: PollModalProps) => {

    const [options, setOptions] = useState<string[]>([""]);
    const [question, setQuestion] = useState<string>("");
    const { user } = useAuth();
    const { socket } = useGlobal();


    const handleCreatePoll = async () => {

        if (!validatePoll()) return;

        const pollData = { question, options, createdBy: user?.username }

        const res = await fetch("/api/polls", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(pollData)
        });

        const result = await res.json();


        if (res.ok) {
            const pollData = { ...result.poll, votesBy: new Map() }
            toast.success("poll uploaded successfully !!");
            socket.emit("new-created-poll", pollData);
            setIsOpen(false);
        }
        else {
            toast.error(result.error);
        }

    }

    const validatePoll = (): boolean => {

        if (!question.trim()) {
            toast.error("poll question required !!");
            return false;
        }
        const size = options.length;

        for (const each of options) {
            if (size == 1 && !each.trim()) {
                toast.error("At least one option need to be fill !!");
                return false;
            }

        }

        return true;
    }

    const addOption = () => {
        if (options.length >= 5) return;
        setOptions((prev) => [...prev, ""]);
    };

    const updateOption = (index: number, value: string) => {
        setOptions((prev) => {
            const updated = [...prev];
            updated[index] = value;
            return updated;
        });
    };

    const handleRemoveOption = (currentIdx: number) => {
        setOptions(prev => prev.filter((each, index) => currentIdx != index));
    }


    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <h2 style={styles.title}>Create your poll</h2>

                <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="Poll question"
                    style={styles.input}
                />

                <div style={{ marginTop: 16 }}>
                    <label style={styles.label}>Options</label>

                    {options.map((opt, index) => (
                        <div style={styles.optionContainer}>
                            <input
                                key={index}
                                type="text"
                                placeholder={`Option ${index + 1}`}
                                value={opt}
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    updateOption(index, e.target.value)
                                }
                                style={{
                                    ...styles.input,
                                    marginTop: 8
                                }}
                            />
                            {
                                index != 0 &&
                                <Minus style={styles.removalButton} onClick={() => handleRemoveOption(index)} size={15} />
                            }
                        </div>
                    ))}

                    {options.length < 5 && (
                        <button
                            type="button"
                            onClick={addOption}
                            style={styles.addBtn}
                        >
                            + Add option
                        </button>
                    )}
                </div>

                <div style={styles.actions}>
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        style={styles.cancel}
                    >
                        Cancel
                    </button>
                    <button type="button"
                        onClick={handleCreatePoll}
                        style={styles.create}>
                        Post
                    </button>
                </div>
            </div>
        </div>
    )
}


const styles: Record<string, CSSProperties> = {
    optionContainer: {
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        gap: "10px"
    },
    removalButton: {
        display: "flex",
        color: "white",
        cursor: "pointer",
        alignItems: "center",
        justifyContent: "center",
        width: "25px",
        height: "25px",
        borderRadius: "50%",
        background: "red"
    },
    welcome: {
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 24
    },
    subtitle: {
        marginTop: 8,
        marginBottom: 24,
        color: "#555",
        maxWidth: 420
    },
    primaryBtn: {
        background: "#111",
        color: "#fff",
        border: "none",
        padding: "12px 20px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 15
    },
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
    },
    modal: {
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        borderRadius: 12,
        padding: 24
    },
    title: {
        marginBottom: 16
    },
    label: {
        fontSize: 13,
        fontWeight: 500
    },
    input: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: 8,
        border: "1px solid #ddd",
        fontSize: 14
    },
    addBtn: {
        marginTop: 12,
        background: "transparent",
        border: "none",
        color: "#2563eb",
        cursor: "pointer",
        fontSize: 14
    },
    actions: {
        marginTop: 24,
        display: "flex",
        justifyContent: "flex-end",
        gap: 12
    },
    cancel: {
        background: "transparent",
        border: "none",
        cursor: "pointer"
    },
    create: {
        background: "#111",
        color: "#fff",
        border: "none",
        padding: "8px 16px",
        borderRadius: 6,
        cursor: "pointer"
    }
};
