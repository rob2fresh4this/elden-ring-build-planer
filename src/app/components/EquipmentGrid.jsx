"use client";

import React, { useState, useCallback, useEffect } from "react";
import gearData from "../../../public/EldenRingData/data/armors.json";
import gearDataDLC from "../../../public/EldenRingData/data/armorDLC.json";
import { TalismanSection } from "./TalismanSection";
import toast from 'react-hot-toast';


const categoryMap = {
    HEAD: "Helm",
    CHEST: "Chest Armor",
    LEGS: "Leg Armor", 
    HANDS: "Gauntlets",
    // DLC categories
    "DLC Helm": "Helm",
    "DLC Chest Armor": "Chest Armor",
    "DLC Leg Armor": "Leg Armor",
    "DLC Gauntlets": "Gauntlets",
};

const slots = ["HEAD", "CHEST", "HANDS", "LEGS"];

const stripImageBaseUrl = (imageUrl) => {
    const baseUrl = "https://eldenring.fanapis.com/images/armors/";
    if (typeof imageUrl === "string" && imageUrl.startsWith(baseUrl)) {
        return imageUrl.replace(baseUrl, "");
    }
    return imageUrl || "";
};

// Combine base game and DLC armor data
const getAllArmorData = () => {
    const baseGameArmor = Array.isArray(gearData) ? gearData : [];
    const dlcArmor = Array.isArray(gearDataDLC) ? gearDataDLC : [];
    return [...baseGameArmor, ...dlcArmor];
};

export const EquipmentGrid = ({ 
    onEquipmentChange, 
    onTalismansChange, 
    initialEquipment = {},
    initialTalismans = [],
    viewMode = false 
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalSlot, setModalSlot] = useState(null);
    const [tempSelection, setTempSelection] = useState({});    
    const [equipment, setEquipment] = useState(initialEquipment);
    const [search, setSearch] = useState("");

    // Debounced search for better performance on mobile
    const [searchTerm, setSearchTerm] = useState("");
    
    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setSearch(e.target.value);
    }, []);

    // Initialize with provided data in viewMode
    useEffect(() => {
        if (viewMode && initialEquipment) {
            setEquipment(initialEquipment);
        }
    }, [initialEquipment, viewMode]);

    // Add useEffect to update equipment when initialEquipment changes
    useEffect(() => {
        if (initialEquipment && Object.keys(initialEquipment).length > 0) {
            // Check if any equipment items are not null
            const hasEquipment = Object.values(initialEquipment).some(item => item !== null);
            if (hasEquipment) {
                setEquipment(initialEquipment);
                
                // Calculate and notify parent about weight change
                const totalWeight = calculateTotalWeight(initialEquipment);
                if (onEquipmentChange) {
                    onEquipmentChange(totalWeight, initialEquipment);
                }
            }
        }
    }, [initialEquipment, onEquipmentChange]);

    // Calculate total equipment weight
    const calculateTotalWeight = (equipmentSet) => {
        return Object.values(equipmentSet).reduce((total, item) => {
            return total + (item?.weight || 0);
        }, 0);
    };

    const allArmorData = getAllArmorData();

    const filteredGear = (slot) => {
        const targetCategory = categoryMap[slot];
        return allArmorData.filter((item) => {
            // Handle both base game categories and DLC categories
            const itemCategory = item.category;
            const matchesCategory = categoryMap[itemCategory] === targetCategory || itemCategory === targetCategory;
            const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
            return matchesCategory && matchesSearch;
        });
    };

    const handleTileClick = (slot) => {
        if (viewMode) return; // Disable clicks in view mode
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

    const handleRemoveEquipment = () => {
        setTempSelection((prev) => ({
            ...prev,
            [modalSlot]: null,
        }));
    };

    const handleSave = () => {
        if (!tempSelection[modalSlot]) {
            toast.error("Please select a piece of gear before saving.");
            return;
        }

        const newEquipment = { ...tempSelection };
        setEquipment(newEquipment);
        
        // Calculate and notify parent about weight change and equipment data
        const totalWeight = calculateTotalWeight(newEquipment);
        if (onEquipmentChange) {
            onEquipmentChange(totalWeight, newEquipment);
        }
        
        setModalOpen(false);
        setModalSlot(null);
        toast.success("Equipment saved!");
    };

    const getImageSrc = (item) => {
        // Use DLC images directly, process base game images
        if (item.category?.startsWith('DLC')) {
            return item.image;
        } else {
            return `/EldenRingData/images/armors/${stripImageBaseUrl(item.image)}`;
        }
    };

    return (
        <div className="bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] p-2 sm:p-4 rounded-xl border border-[#c0a857] text-[#e5c77b] shadow-lg w-full max-w-full overflow-x-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4 text-[#e5c77b] drop-shadow px-2 sm:px-0" style={{ fontFamily: "serif" }}>
                Armor
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 px-2 sm:px-0">
                {slots.map((slot, i) => (
                    <div
                        key={i}
                        className={`p-2 sm:p-3 bg-[#2d2212] rounded-md text-center border border-[#c0a857] h-[120px] sm:h-[180px] flex flex-col justify-center items-center shadow ${!viewMode ? 'cursor-pointer hover:bg-[#3a2c1a] active:bg-[#4a3c2a]' : ''} transition-colors duration-200 w-full touch-manipulation`}
                        onClick={!viewMode ? () => handleTileClick(slot) : undefined}
                    >
                        {equipment[slot] ? (
                            <>
                                <img
                                    src={getImageSrc(equipment[slot])}
                                    alt={equipment[slot].name}
                                    className="w-full h-12 sm:h-20 object-contain mb-1 sm:mb-2"
                                    loading="lazy"
                                />
                                <span className="text-xs sm:text-sm text-[#e5c77b] line-clamp-2 px-1">
                                    {equipment[slot].name}
                                </span>
                            </>
                        ) : (
                            <span className="text-xs sm:text-sm text-[#c0a857]" style={{ fontFamily: "serif" }}>
                                {slot}
                            </span>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && modalSlot && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 overflow-auto p-2 sm:p-4">
                    <div className="bg-[#2d2212] border border-[#c0a857] overflow-hidden rounded-xl p-0 w-full max-w-xs sm:max-w-lg lg:max-w-2xl relative mx-2 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                        {/* Fixed Header with Save and Close */}
                        <div className="sticky top-0 z-10 bg-[#2d2212] border-b border-[#c0a857] flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 min-h-[60px]">
                            <div className="flex-1 text-center">
                                <div className="text-sm sm:text-lg font-semibold text-[#e5c77b] truncate" style={{ fontFamily: "serif" }}>
                                    {modalSlot}
                                </div>
                                <div className="text-xs sm:text-sm text-[#c0a857] truncate">
                                    {tempSelection[modalSlot]?.name || "None Selected"}
                                </div>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                                <button
                                    className="px-3 sm:px-4 py-1 sm:py-2 bg-[#c0a857] text-[#19140e] rounded text-sm sm:text-base font-bold hover:bg-[#e5c77b] active:bg-[#a08f47] transition-colors touch-manipulation"
                                    onClick={handleSave}
                                >
                                    Save
                                </button>
                                <button
                                    className="text-[#e5c77b] text-xl sm:text-2xl p-1 hover:text-white active:text-[#c0a857] transition-colors touch-manipulation"
                                    onClick={() => { setModalOpen(false); setModalSlot(null); }}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-[#19140e] border-b border-[#c0a857] sticky top-[60px] z-10">
                            <input
                                type="text"
                                placeholder={`Search ${categoryMap[modalSlot]}...`}
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full px-3 py-2 sm:py-3 rounded bg-[#2d2212] border border-[#c0a857] text-[#e5c77b] focus:outline-none focus:border-[#e5c77b] text-sm sm:text-base touch-manipulation"
                            />
                        </div>

                        {/* Scrollable Gear List */}
                        <div className="overflow-y-auto p-3 sm:p-4 flex-1">
                            <div className="mb-3 text-[#c0a857] font-semibold text-sm sm:text-base">
                                {categoryMap[modalSlot]}
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                                {filteredGear(modalSlot).map((gear) => (
                                    <div
                                        key={gear.id}
                                        className={`text-center border rounded-lg p-2 sm:p-3 cursor-pointer transition-all duration-200 touch-manipulation
                                            ${tempSelection[modalSlot]?.id === gear.id
                                                ? "border-[#e5c77b] bg-[#3a2c1a] scale-105"
                                                : "border-[#c0a857] bg-[#19140e] hover:bg-[#3a2c1a] active:bg-[#4a3c2a]"
                                            }`}
                                        onClick={() => handleGearSelect(modalSlot, gear)}
                                    >
                                        <img
                                            src={getImageSrc(gear)}
                                            alt={gear.name}
                                            className="w-full h-12 sm:h-16 object-contain mb-1 sm:mb-2"
                                            loading="lazy"
                                        />
                                        <p className="text-xs sm:text-sm text-[#e5c77b] line-clamp-2 leading-tight">
                                            {gear.name}
                                        </p>
                                        <p className="text-xs text-[#c0a857] mt-1">
                                            Weight: {gear.weight || 0}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Remove Button */}
                        {tempSelection[modalSlot] && (
                            <div className="sticky bottom-0 bg-[#2d2212] border-t border-[#c0a857] p-3 sm:p-4">
                                <button
                                    className="w-full px-3 py-2 sm:py-3 bg-red-800 text-white rounded font-bold hover:bg-red-900 active:bg-red-700 text-sm sm:text-base transition-colors touch-manipulation"
                                    onClick={handleRemoveEquipment}
                                >
                                    Remove Equipment
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <TalismanSection 
                onTalismansChange={onTalismansChange} 
                initialTalismans={initialTalismans}
                viewMode={viewMode}
            />
        </div>
    );
};
