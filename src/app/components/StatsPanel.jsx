import React from "react";

export const StatsPanel = () => {
    const stats = {
        VIG: 10,
        MIND: 10,
        END: 10,
        STR: 10,
        DEX: 10,
        INT: 10,
        FAI: 10,
        ARC: 10,
    };

    return (
        <div className="bg-[#2d2212] p-4 rounded-xl border border-[#e5c77b] shadow-lg text-[#e5c77b]">
            <h2
                className="text-xl font-semibold mb-2 text-[#e5c77b] tracking-wider drop-shadow"
                style={{ fontFamily: "serif" }}
            >
                Player Stats
            </h2>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3.5 text-base">
                {Object.entries(stats).map(([key, val]) => (
                    <div key={key} className="flex justify-between">
                        <span className="text-[#c0a857] font-semibold" style={{ fontFamily: "serif" }}>{key}</span>
                        <span className="text-[#e5c77b]">{val}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};
