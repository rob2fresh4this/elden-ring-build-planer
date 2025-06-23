import React, { useState } from "react";

export const StatsPanel = ({ onStatsChange }) => {
    const initialStats = {
        VIG: 10,
        MIND: 10,
        END: 10,
        STR: 10,
        DEX: 10,
        INT: 10,
        FAI: 10,
        ARC: 10,
    };

    const [stats, setStats] = useState(initialStats);

    const changeStat = (key, amount) => {
        setStats((prev) => {
            const updated = {
                ...prev,
                [key]: Math.max(1, Math.min(prev[key] + amount, 99)),
            };
            onStatsChange && onStatsChange(updated);
            console.log(`Stat changed: ${key} is now ${updated[key]}`);
            return updated;
        });
    };

    return (
        <div className="bg-[#2d2212] p-4 rounded-xl border border-[#e5c77b] shadow-lg text-[#e5c77b]">
            <h2
                className="text-xl font-semibold mb-4 text-[#e5c77b] tracking-wider drop-shadow"
                style={{ fontFamily: "serif" }}
            >
                Player Stats
            </h2>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-base">
                {Object.entries(stats).map(([key, val]) => (
                    <div key={key} className="flex items-center justify-between bg-[#3b2f1a] px-3 py-2 rounded-md">
                        <span className="text-[#c0a857] font-semibold w-10" style={{ fontFamily: "serif" }}>{key}</span>
                        <div className="flex items-center gap-1">
                            <button
                                className="bg-[#2d2212] px-1 py-1 rounded font-bold"
                                onClick={() => changeStat(key, -5)}
                                disabled={val <= 1}
                            >
                                {`<<`}
                            </button>
                            <button
                                className="bg-[#2d2212] px-1 py-1 rounded font-bold"
                                onClick={() => changeStat(key, -1)}
                                disabled={val <= 1}
                            >
                                {`<`}
                            </button>
                            <span className="text-[#e5c77b] px-3 w-6 text-center flex justify-center font-mono mr-1">
                                {val}
                            </span>
                            <button
                                className="bg-[#2d2212] px-1 py-1 rounded font-bold"
                                onClick={() => changeStat(key, 1)}
                                disabled={val >= 99}
                            >
                                {`>`}
                            </button>
                            <button
                                className="bg-[#2d2212] px-1 py-1 rounded font-bold"
                                onClick={() => changeStat(key, 5)}
                                disabled={val >= 99}
                            >
                                {`>>`}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};