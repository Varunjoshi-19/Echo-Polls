import { io } from "socket.io-client";

export const socket =
    io("https://talks-gram.onrender.com", {
        transports: ["websocket"],
    });
