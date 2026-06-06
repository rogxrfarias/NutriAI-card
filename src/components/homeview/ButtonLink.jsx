import React from "react";
import { ArrowRightStroke } from "@boxicons/react";

const ButtonLink = ({ link, icon, title, desc }) => {
  // const handleClick = () => {
  //   window.location.href = link;
  //   console.log(link);
  // };

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="relative flex flex-row rounded-xl py-3 px-3 my-4 gap-2 items-center shadow-md bg-linear-to-br from-gray-200 to-gray-50 text-slate-700 w-full text-left cursor-pointer hover:bg-linear-to-bl active:bg-linear-to-r hover:scale-105 active:scale-95 transition-all duration-300"
    >
      {/* content */}
      <div className="text-3xl">{icon}</div>
      <div className="flex flex-col flex-1 px-4">
        <span>{title}</span>
        <span className="text-[0.7rem] mt-1 text-slate-500">{desc}</span>
      </div>
      <div>
        <ArrowRightStroke />
      </div>
    </a>
  );
};

export default ButtonLink;
