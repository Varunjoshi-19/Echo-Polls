import { config } from "@/config";

export const getTotalUsers = async () => {

    try {
        const res = fetch(`${config.baseUrl}/api/users/count`, { method: "GET" });
        return (await res).json();
    } catch {
        throw new Error("failed to get the count of users !!");
    }

}

