import React from "react";
import { ArrowRightStroke } from "@boxicons/react";
import { useNavigate } from "react-router-dom";

const ChatTrigger = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/chat");
  };

  return (
    <button
      onClick={handleClick}
      className="relative flex flex-row rounded-xl py-3 px-3 gap-2 items-center shadow-md bg-linear-to-br from-green-600 to-green-700 text-white w-full text-left cursor-pointer hover:bg-linear-to-bl active:bg-linear-to-r hover:scale-105 active:scale-95 transition-all duration-300"
    >
      {/* btn badge */}
      <div className="absolute rounded-full -top-3 right-4 z-1 bg-[#ff7043] text-[0.7rem] px-3 py-1">
        <span>✨ NOVO</span>
      </div>

      {/* content */}
      <span className="text-3xl">🥗</span>
      <div className="flex flex-col flex-1 px-4">
        <span className="text-sm">O que trava a alimentação do seu filho?</span>
        <span className="text-[0.7rem] mt-1 text-white/70">
          Descubra o que trava a alimentação do seu filho · Grátis
        </span>
      </div>
      <div>
        <ArrowRightStroke />
      </div>
    </button>
  );
};

export default ChatTrigger;
