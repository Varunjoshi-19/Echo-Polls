import { config } from "@/config";

export const handleAddVote = async (userId: string, pollId: string, optionIdx: number) => {

    try {
        const res = await fetch(`${config.baseUrl}/api/polls/vote`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ userId, pollId, optionIdx }),
        });

        if (res.ok) return true;

        return false;
    }
    catch {
        return false;
    }

}