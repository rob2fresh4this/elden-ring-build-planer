'use client'
import React from "react";

export const WeaponCard = ({ index }) => {
    const weapon = {
        name: `Weapon ${index}`,
        requirements: { str: 20, dex: 15 },
        playerStats: { str: 10, dex: 10 },
        description: "A mighty weapon that cleaves through enemies.",
    };

    const meetsRequirements =
        weapon.playerStats.str >= weapon.requirements.str &&
        weapon.playerStats.dex >= weapon.requirements.dex;

    return (
        <div
            className={`p-4 rounded-xl border shadow-lg transition-colors duration-200
                ${meetsRequirements ? "border-[#e5c77b] bg-[#2d2212]" : "border-red-500 bg-[#3a2c1a]"}
                text-[#e5c77b]`}
            title={weapon.description}
            style={{ fontFamily: 'serif', minWidth: 220 }}
        >
            <h3 className="text-lg font-bold mb-1 tracking-wide text-[#e5c77b] drop-shadow">
                {weapon.name}
            </h3>
            <p className="text-sm text-[#c0a857] mb-2">
                STR: {weapon.requirements.str} | DEX: {weapon.requirements.dex}
            </p>
            {!meetsRequirements && (
                <p className="text-red-400 text-xs font-semibold">Requirements not met</p>
            )}
        </div>
    );
};