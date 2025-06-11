import React from "react";
// import eldenringimage from "../../../EldenRingData/images/weapons/" idea of the location of the images

const BuildCardsGrid = ({ title, description, mainWeapon }) => (
    <div className="p-2 flex justify-left">
        <div className="w-full max-w-xs bg-[#232014] border border-[#a08c4a] p-4 rounded-lg shadow-lg hover:scale-[1.02] transition-transform duration-200 ease-in-out">

            {/* Main Weapon Display */}
            {mainWeapon && mainWeapon.image && (
                <div className="mb-3 flex justify-center">
                    <img
                        src={`/EldenRingData/images/weapons/${mainWeapon.image}`}
                        alt={mainWeapon.name}
                        className="w-16 h-16 object-contain"
                        draggable={false}
                    />
                </div>
            )}

            <h2
                className="text-xl font-semibold mb-2 text-[#e5c77b] tracking-wide text-left"
                style={{ fontFamily: "serif" }}
            >
                {title}
            </h2>
            <p className="text-[#cbb67c] text-xs text-left leading-tight">
                {description}
            </p>
        </div>
    </div>
);

export default BuildCardsGrid;