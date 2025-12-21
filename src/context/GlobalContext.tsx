"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { config } from "@/config";
import { io, Socket } from "socket.io-client";
import { socket } from "@/config/socket";
import { useAuth } from "./AuthContext";

type Poll = {
  _id: string;
  question: string;
  createdBy: string;
  options: any[];
};

type GlobalContextType = {
  polls: Poll[];
  socket: Socket,
  totalUsers: number;
  loading: boolean;
  setPolls: React.Dispatch<React.SetStateAction<Poll[]>>;
  refetchPolls: () => Promise<void>;
};

const GlobalContext = createContext<GlobalContextType | null>(null);

export function GlobalProvider({ children }: { children: React.ReactNode }) {

  const [polls, setPolls] = useState<Poll[]>([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);


  const fetchPolls = async () => {
    try {
      setLoading(true);

      const [pollRes, userRes] = await Promise.all([
        fetch(`${config.baseUrl}/api/polls`, { cache: "no-store" }),
        fetch(`${config.baseUrl}/api/users/count`, { cache: "no-store" }),
      ]);

      if (!pollRes.ok || !userRes.ok) {
        throw new Error("Fetch failed");
      }

      const pollsData = await pollRes.json();
      const usersCount = await userRes.json();

      setPolls(pollsData);
      setTotalUsers(usersCount);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePoll = ({ pollId, optionIdx  }: { pollId: string; optionIdx: number }) => {
    setPolls((prev) =>
      prev.map((poll) => {
        if (poll._id !== pollId) return poll;

        const updatedPoll = structuredClone(poll);
        updatedPoll.options[optionIdx].votes += 1;
        return updatedPoll;
      })
    );
  };

  const handleAddNewPoll = useCallback((pollData: any) => {
    setPolls(prev => [pollData, ...prev]);
  }, []);


  useEffect(() => {
    fetchPolls();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connection ", socket.id);
    });
    socket.on("new-poll", handleAddNewPoll);

    socket.on("updated-poll", handleUpdatePoll);

    return () => {
      socket.off("updated-poll", handleUpdatePoll);
      socket.off("new-poll", handleAddNewPoll);
    }
  }, [socket]);


  return (
    <GlobalContext.Provider
      value={{
        polls,
        socket,
        totalUsers,
        loading,
        setPolls,
        refetchPolls: fetchPolls,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
}

export const useGlobal = () => {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobal must be used inside GlobalProvider");
  return ctx;
};
