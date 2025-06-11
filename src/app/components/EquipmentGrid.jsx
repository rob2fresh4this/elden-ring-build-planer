"use client";
import React from "react";
import { TalismanSection } from "./TalismanSection";

export const EquipmentGrid = () => {
    const slots = ["HEAD", "CHEST", "LEGS", "BOOTS"];

    return (
        <div className="bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] p-4 rounded-xl border border-[#c0a857] text-[#e5c77b] shadow-lg">
            <h2
                className="text-xl font-semibold mb-2 text-[#e5c77b] drop-shadow"
                style={{ fontFamily: "serif" }}
            >
                Armor
            </h2>
            <div className="grid grid-cols-4 gap-4">
                {slots.map((slot, i) => (
                    <div
                        key={i}
                        className="p-2 bg-[#2d2212] rounded-md text-center border border-[#c0a857] h-[200px] flex flex-col justify-center items-center shadow"
                    >
                        <span className="text-sm text-[#c0a857]" style={{ fontFamily: "serif" }}>
                            {slot}
                        </span>
                    </div>
                ))}
            </div>
            <br />
            {/* Talisman Display */}
            <section className="mb-6">
                <TalismanSection />
            </section>
        </div>
    );
};
