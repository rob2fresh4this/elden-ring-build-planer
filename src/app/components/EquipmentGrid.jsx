"use client";

import React, { useState } from "react";
import gearData from "../../../public/EldenRingData/data/armors.json";
import { TalismanSection } from "./TalismanSection";

const categoryMap = {
    HEAD: "Helm",
    CHEST: "Chest Armor",
    LEGS: "Leg Armor",
    HANDS: "Gauntlets",
};

const slots = ["HEAD", "CHEST", "HANDS", "LEGS"];

const stripImageBaseUrl = (imageUrl) => {
    const baseUrl = "https://eldenring.fanapis.com/images/armors/";
    if (typeof imageUrl === "string" && imageUrl.startsWith(baseUrl)) {
        return imageUrl.replace(baseUrl, "");
    }
    return imageUrl || "";
};

export const EquipmentGrid = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [tempSelection, setTempSelection] = useState({});
    const [equipment, setEquipment] = useState({});

    const filteredGear = (slot) =>
        gearData.filter((item) => item.category === categoryMap[slot]);

    const handleTileClick = () => {
        setTempSelection({ ...equipment }); // Start with current equipment
        setModalOpen(true);
    };

    const handleGearSelect = (slot, gear) => {
        setTempSelection((prev) => ({
            ...prev,
            [slot]: gear,
        }));
    };

    const handleSave = () => {
        setEquipment(tempSelection);
        setModalOpen(false);
    };

    return (
        <div className="bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] p-4 rounded-xl border border-[#c0a857] text-[#e5c77b] shadow-lg w-full max-w-full overflow-x-auto">
            <h2 className="text-xl font-semibold mb-2 text-[#e5c77b] drop-shadow" style={{ fontFamily: "serif" }}>
                Armor
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {slots.map((slot, i) => (
                    <div
                        key={i}
                        className="p-2 bg-[#2d2212] rounded-md text-center border border-[#c0a857] h-[180px] flex flex-col justify-center items-center shadow cursor-pointer hover:bg-[#3a2c1a] w-full"
                        onClick={handleTileClick}
                    >
                        {equipment[slot] ? (
                            <>
                                <img
                                    src={`/EldenRingData/images/armors/${stripImageBaseUrl(equipment[slot].image)}`}
                                    alt={equipment[slot].name}
                                    className="w-full h-20 object-contain mb-2"
                                />
                                <span className="text-xs text-[#e5c77b]">{equipment[slot].name}</span>
                            </>
                        ) : (
                            <span className="text-sm text-[#c0a857]" style={{ fontFamily: "serif" }}>
                                {slot}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 overflow-auto">
                    
                    <div className="bg-[#2d2212] border border-[#c0a857] rounded-xl p-4 w-full max-w-lg relative mx-2">
                        <button
                            className="absolute top-2 right-2 text-[#e5c77b] text-xl"
                            onClick={() => setModalOpen(false)}
                        >
                            &times;
                        </button>
                        <h3 className="text-lg font-semibold mb-4 text-[#e5c77b]" style={{ fontFamily: "serif" }}>
                            Select Equipment
                        </h3>
                        
                        <div className="flex flex-col gap-4">
                            {slots.map((slot) => (
                                <div key={slot} className="">
                                    <div className="mb-2 text-[#c0a857] font-semibold">{slot}</div>
                                    <div className="overflow-x-auto flex gap-4 p-2 border border-[#c0a857] rounded-lg bg-[#19140e]">
                                        {filteredGear(slot).map((gear) => (
                                            <div
                                                key={gear.id}
                                                className={`flex-shrink-0 w-32 text-center border rounded-lg p-2 cursor-pointer
                                                    ${tempSelection[slot]?.id === gear.id
                                                        ? "border-[#e5c77b] bg-[#3a2c1a]"
                                                        : "border-[#c0a857] bg-[#19140e] hover:bg-[#3a2c1a]"
                                                    }`}
                                                onClick={() => handleGearSelect(slot, gear)}
                                            >
                                                <img
                                                    src={`/EldenRingData/images/armors/${stripImageBaseUrl(gear.image)}`}
                                                    alt={gear.name}
                                                    className="w-full h-16 object-contain mb-2"
                                                />
                                                <p className="text-xs text-[#e5c77b]">{gear.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                    {tempSelection[slot] && (
                                        <div className="mt-1 text-xs text-[#e5c77b]">
                                            Selected: {tempSelection[slot].name}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        <button
                            className="mt-6 px-6 py-2 bg-[#c0a857] text-[#19140e] rounded font-bold hover:bg-[#e5c77b] w-full"
                            onClick={handleSave}
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}

            <TalismanSection />
        </div>
    );
};
