import React from "react";
import pfp from "./../../assets/avatar.jpg";

const Header = ({ coverImg, profileImg, name, specialty, stats }) => {
  return (
    <header className="relative w-full md:w-xl bg-white pb-4">
      <div className="relative h-40 px-2 py-2 w-full md:h-60 overflow-hidden">
        <img
          src={coverImg || "/cov.jpg"}
          alt="Capa do perfil"
          className="h-full w-full rounded-2xl object-cover"
        />
      </div>

      <div className="px-4">
        <div className="relative flex flex-col items-center -mt-16 md:-mt-20">
          <div className="relative inline-block">
            <img
              src={profileImg || pfp}
              alt={name}
              className="h-32 w-32 rounded-full border-4 border-white object-cover md:h-40 md:w-40"
            />
            <span className="absolute bottom-4 right-4 h-5 w-5 rounded-full border-2 border-white bg-green-500" />
          </div>

          <div className="mt-4 text-center">
            <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
              {name || "Dra. Adriana Almeida"}
            </h1>
            <p className="text-sm font-medium text-green-600 tracking-wide">
              {specialty || "NUTRIÇÃO INFANTIL"}
            </p>
            {/* <span className="text-[0.7rem] text-[#6f6f6f]/50">
              CRN-X · 12.345
            </span> */}

            <div className="mt-2 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold text-[#6f6f6f]">
              {stats || (
                <p>
                  Ajudo crianças a se relacionarem melhor com a comida,
                  <br />
                  sem brigas na hora do almoço.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
