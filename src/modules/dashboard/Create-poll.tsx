"use client";

import { WelcomeScreen } from "@/components/ui/welcome";
import { useState } from "react";

import { PollModal } from "@/components/ui/PollModal";



const CreatePolls = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    return (
        <>
            <WelcomeScreen setIsOpen={setIsOpen} />
            {isOpen && (
                <PollModal setIsOpen={setIsOpen} />
            )}
        </>
    );
};

export default CreatePolls;

