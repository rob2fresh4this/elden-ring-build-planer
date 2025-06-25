"use client";

import React, { useState } from "react";
import gearData from "../../../public/EldenRingData/data/armors.json";
import gearDataDLC from "../../../public/EldenRingData/data/armorsdlc.json";
import { TalismanSection } from "./TalismanSection";
import toast from 'react-hot-toast';


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

export const EquipmentGrid = ({ onEquipmentChange, onTalismansChange }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalSlot, setModalSlot] = useState(null);
    const [tempSelection, setTempSelection] = useState({});    
    const [equipment, setEquipment] = useState({});
    const [search, setSearch] = useState("");

    // Calculate total equipment weight
    const calculateTotalWeight = (equipmentSet) => {
        return Object.values(equipmentSet).reduce((total, item) => {
            return total + (item?.weight || 0);
        }, 0);
    };

    const filteredGear = (slot) =>
        gearData.filter(
            (item) =>
                item.category === categoryMap[slot] &&
                item.name.toLowerCase().includes(search.toLowerCase())
        );

    const handleTileClick = (slot) => {
        setModalSlot(slot);
        setTempSelection({ ...equipment });
        setSearch(""); // Reset search on open
        setModalOpen(true);
    };

    const handleGearSelect = (slot, gear) => {
        if (tempSelection[slot]?.id === gear.id) {
            toast.error("This item is already selected.");
            return;
        }
        setTempSelection((prev) => ({
            ...prev,
            [slot]: gear,
        }));
        toast.success(`${gear.name} selected!`);
    };
    const handleSave = () => {
        if (!tempSelection[modalSlot]) {
            toast.error("Please select a piece of gear before saving.");
            return;
        }

        const newEquipment = { ...tempSelection };
        setEquipment(newEquipment);
        
        // Calculate and notify parent about weight change
        const totalWeight = calculateTotalWeight(newEquipment);
        if (onEquipmentChange) {
            onEquipmentChange(totalWeight);
        }
        
        setModalOpen(false);
        setModalSlot(null);
        toast.success("Equipment saved!");
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
                        onClick={() => handleTileClick(slot)}
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
            {modalOpen && modalSlot && (
                <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 overflow-auto">
                    <div className="bg-[#2d2212] border border-[#c0a857] overflow-hidden rounded-xl p-0 w-full max-w-lg relative mx-2 flex flex-col max-h-[90vh]">
                        {/* Fixed Save and Close */}
                        <div className="sticky top-0 z-10 bg-[#2d2212] border-b border-[#c0a857] flex items-center justify-between px-4 py-2">
                            <div className="flex-1 text-center text-lg font-semibold text-[#e5c77b]" style={{ fontFamily: "serif" }}>
                                {modalSlot} - {tempSelection[modalSlot]?.name || "None Selected"}
                            </div>
                            <button
                                className="text-[#e5c77b] text-2xl ml-2"
                                onClick={() => { setModalOpen(false); setModalSlot(null); }}
                            >
                                &times;
                            </button>
                            <button
                                className="ml-4 px-4 py-1 bg-[#c0a857] text-[#19140e] rounded font-bold hover:bg-[#e5c77b]"
                                onClick={handleSave}
                            >
                                Save
                            </button>
                        </div>
                        {/* Search Bar */}
                        <div className="px-4 py-2 bg-[#19140e] border-b border-[#c0a857] sticky top-[48px] z-10">
                            <input
                                type="text"
                                placeholder={`Search ${categoryMap[modalSlot]}...`}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-[#2d2212] border border-[#c0a857] text-[#e5c77b] focus:outline-none"
                            />
                        </div>
                        {/* Scrollable Gear List */}
                        <div className="overflow-y-auto p-4 flex-1">
                            <div className="mb-2 text-[#c0a857] font-semibold">{categoryMap[modalSlot]}</div>
                            <div className="flex flex-wrap gap-4">
                                {filteredGear(modalSlot).map((gear) => (
                                    <div
                                        key={gear.id}
                                        className={`w-32 text-center border rounded-lg p-2 cursor-pointer
                                            ${tempSelection[modalSlot]?.id === gear.id
                                                ? "border-[#e5c77b] bg-[#3a2c1a]"
                                                : "border-[#c0a857] bg-[#19140e] hover:bg-[#3a2c1a]"
                                            }`}
                                        onClick={() => handleGearSelect(modalSlot, gear)}
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
                        </div>
                    </div>
                </div>
            )}

            <TalismanSection onTalismansChange={onTalismansChange} />
        </div>
    );
};
