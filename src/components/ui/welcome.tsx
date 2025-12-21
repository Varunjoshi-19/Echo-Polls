import { CSSProperties } from "react";

interface WelcomeScreenProps {
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const WelcomeScreen = ({ setIsOpen }: WelcomeScreenProps) => {

    return (
        <div style={styles.welcome}>
            <h1 style={{ fontSize: "4rem", fontWeight: "bold" }}>Welcome to the polling system</h1>
            <p style={styles.subtitle}>
                Create your own polls and vote on polls created by others.
            </p>

            <button
                style={styles.primaryBtn}
                onClick={() => setIsOpen(true)}
            >
                Create new poll
            </button>
        </div>
    )

}


const styles: Record<string, CSSProperties> = {
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
        fontSize: "17px",
        maxWidth: 420
    },
    primaryBtn: {
        background: "blue",
        color: "#fff",
        fontWeight: "bold",
        border: "none",
        padding: "12px 20px",
        borderRadius: 8,
        cursor: "pointer",
        fontSize: 15
    },

};