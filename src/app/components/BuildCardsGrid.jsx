import React from "react";

const BuildCardsGrid = ({ title, description, mainWeapon, onClick, isLoading = false }) => (
    <div className="p-1 sm:p-2 flex justify-center w-full">
        <div 
            className={`
                w-full max-w-[160px] sm:max-w-xs md:max-w-sm 
                bg-[#232014] border border-[#a08c4a] 
                p-2 sm:p-4 md:p-5 
                rounded-lg shadow-lg 
                hover:scale-[1.02] active:scale-[0.98] 
                transition-all duration-200 ease-in-out
                cursor-pointer touch-manipulation
                ${onClick ? 'hover:border-[#e5c77b] hover:shadow-xl' : ''}
                ${isLoading ? 'opacity-50 pointer-events-none' : ''}
            `}
            onClick={onClick}
            role={onClick ? "button" : undefined}
            tabIndex={onClick ? 0 : undefined}
            onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick(e); } : undefined}
        >
            {/* Main Weapon Display */}
            {mainWeapon && mainWeapon.image && (
                <div className="mb-2 sm:mb-3 flex justify-center">
                    <img
                        src={`/EldenRingData/images/weapons/${mainWeapon.image}`}
                        alt={mainWeapon.name}
                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain"
                        draggable={false}
                        loading="lazy"
                    />
                </div>
            )}

            <h2
                className="text-sm sm:text-xl md:text-2xl font-semibold mb-1 sm:mb-2 text-[#e5c77b] tracking-wide text-left line-clamp-2"
                style={{ fontFamily: "serif" }}
            >
                {title}
            </h2>
            <p className="text-[#cbb67c] text-xs sm:text-sm text-left leading-tight line-clamp-3">
                {description}
            </p>

            {/* Loading indicator */}
            {isLoading && (
                <div className="mt-2 flex justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#e5c77b]"></div>
                </div>
            )}
        </div>
    </div>
);

export default BuildCardsGrid;