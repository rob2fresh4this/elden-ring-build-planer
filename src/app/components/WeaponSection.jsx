"use client";

import React, { useState, useEffect, useCallback } from "react";
import WeaponData from "../../../public/EldenRingData/data/weapons.json";
import WeaponDataDLC from "../../../public/EldenRingData/data/weaponsDLC.json";
import InfusibleData from "../../../public/EldenRingData/data/weapons_infusible.json";
import toast from "react-hot-toast";

const stripImageBaseUrl = (imageUrl) => {
    const baseUrl = "https://eldenring.fanapis.com/images/weapons/";
    if (typeof imageUrl === "string" && imageUrl.startsWith(baseUrl)) {
        return imageUrl.replace(baseUrl, "");
    }
    return imageUrl || "";
};

const decodeWeaponName = (name) => {
    if (!name || typeof name !== "string") return name;

    // Decode common URL encodings
    return name
        .replace(/%27/g, "'")  // %27 -> apostrophe
        .replace(/%20/g, " ")  // %20 -> space
        .replace(/%22/g, '"')  // %22 -> double quote
        .replace(/%26/g, "&")  // %26 -> ampersand
        .replace(/%2B/g, "+"); // %2B -> plus sign
};

const getWeaponImagePath = (weapon) => {
    // Check if this is a DLC weapon (has different image URL structure)
    if (weapon.image && weapon.image.includes("fextralife.com")) {
        return weapon.image; // Use DLC image URL directly
    }
    // Base game weapon - use local images
    return `/EldenRingData/images/weapons/${stripImageBaseUrl(weapon.image)}`;
};

const WEAPON_SLOTS = 6;

export const WeaponSection = ({ onWeaponsChange, stats }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(null);
    // Change weapons state to store objects with weapon and infusion data
    const [weapons, setWeapons] = useState(Array(WEAPON_SLOTS).fill(null));
    const [tempWeapons, setTempWeapons] = useState([...weapons]);
    const [selectedInfusion, setSelectedInfusion] = useState("Standard");
    const [isMobile, setIsMobile] = useState(false);

    const infusionTypes = [
        { name: "Standard", effect: "No change", color: "#e5c77b" },
        { name: "Keen", effect: "Boosts Dex scaling, reduces Str", color: "#4a90e2" },
        { name: "Heavy", effect: "Boosts Str scaling, reduces Dex", color: "#d4535a" },
        { name: "Quality", effect: "Balances Str & Dex scaling", color: "#8e44ad" },
        { name: "Magic", effect: "Adds Magic damage, Int scaling", color: "#3498db" },
        { name: "Cold", effect: "Adds Magic + Frostbite, Int scaling", color: "#5dade2" },
        { name: "Fire", effect: "Adds Fire damage, Str scaling", color: "#e74c3c" },
        { name: "Flame Art", effect: "Adds Fire + Faith scaling", color: "#f39c12" },
        { name: "Sacred", effect: "Adds Holy damage, Faith scaling", color: "#f1c40f" },
        { name: "Lightning", effect: "Adds Lightning damage, Dex scaling", color: "#f4d03f" },
        { name: "Bleed", effect: "Adds Arcane scaling + Bleed buildup", color: "#c0392b" },
        { name: "Poison", effect: "Adds Arcane scaling + Poison buildup", color: "#27ae60" },
        { name: "Occult", effect: "Adds Arcane scaling", color: "#6c3483" }
    ];

    const infusionImages = [
        { name: "Standard", image: "/EldenRingData/images/infusions/standardAffinity.webp" },
        { name: "Keen", image: "/EldenRingData/images/infusions/keenAffinity.webp" },
        { name: "Heavy", image: "/EldenRingData/images/infusions/heavyAffinity.webp" },
        { name: "Quality", image: "/EldenRingData/images/infusions/qualityAffinity.webp" },
        { name: "Magic", image: "/EldenRingData/images/infusions/magicAffinity.webp" },
        { name: "Cold", image: "/EldenRingData/images/infusions/coldAffinity.webp" },
        { name: "Fire", image: "/EldenRingData/images/infusions/fireAffinity.webp" },
        { name: "Flame Art", image: "/EldenRingData/images/infusions/flame_artAffinity.jpg" },
        { name: "Sacred", image: "/EldenRingData/images/infusions/sacredAffinity.webp" },
        { name: "Lightning", image: "/EldenRingData/images/infusions/lightningAffinity.webp" },
        { name: "Bleed", image: "/EldenRingData/images/infusions/bloodAffinity.webp" },
        { name: "Poison", image: "/EldenRingData/images/infusions/poison.png" },
        { name: "Occult", image: "/EldenRingData/images/infusions/occultAffinity.webp" }
    ]

    // Convert stats object to format expected by weapon requirements
    const playerStats = {
        Str: stats?.STR || 10,
        Dex: stats?.DEX || 10,
        Int: stats?.INT || 10,
        Fai: stats?.FAI || 10,
        Arc: stats?.ARC || 10,
    };

    // Helper function to get stat value for both "Fai" and "Faith" attribute names
    const getStatValue = (attrName, playerStats) => {
        if (attrName === "Fai" || attrName === "Faith") {
            return playerStats["Fai"] || playerStats["Faith"] || 0;
        }
        return playerStats[attrName] || 0;
    };

    // Calculate total weapon weight
    const calculateTotalWeaponWeight = (weaponArray) => {
        return weaponArray.reduce((total, slot) => {
            const weapon = getWeaponFromSlot(slot);
            return total + (weapon?.weight || 0);
        }, 0);
    };

    // Update weapon validation when stats change
    useEffect(() => {
        // Force re-render when stats change to update weapon requirement checks
        // The component will automatically re-check canUseWeapon for each weapon
    }, [stats]);

    // Reset infusion when switching to non-infusible weapon
    useEffect(() => {
        if (selectedSlot !== null && tempWeapons[selectedSlot]) {
            const weapon = getWeaponFromSlot(tempWeapons[selectedSlot]);
            if (weapon) {
                const infusibility = getWeaponInfusibility(weapon.name);
                if (!infusibility.canInfuse) {
                    setSelectedInfusion("Standard");
                }
            }
        }
    }, [tempWeapons, selectedSlot]);

    // Detect mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Debounced search for better mobile performance
    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
        setSearch(e.target.value);
    }, []);

    const filteredWeapons = [...WeaponData, ...WeaponDataDLC].filter(
        (w) =>
            w.name &&
            decodeWeaponName(w.name).toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper function to get weapon data from slot object
    const getWeaponFromSlot = (slot) => {
        return slot?.weapon || null;
    };

    // Helper function to get infusion from slot object
    const getInfusionFromSlot = (slot) => {
        return slot?.infusion || null;
    };

    // Update handleTileClick to set selectedInfusion from existing slot
    const handleTileClick = (slotIdx) => {
        setSelectedSlot(slotIdx);
        setTempWeapons([...weapons]);
        setSearch("");
        // Set the infusion dropdown to current weapon's infusion
        const currentSlot = weapons[slotIdx];
        setSelectedInfusion(currentSlot?.infusion || "Standard");
        setModalOpen(true);
    };
    // Update the canUseWeapon function to work with slot objects
    const canUseWeapon = (slot) => {
        const weapon = getWeaponFromSlot(slot);
        if (!weapon) return true;

        // Check if weapon has required attributes (some DLC weapons might not have this structure)
        if (!weapon.requiredAttributes || !Array.isArray(weapon.requiredAttributes)) {
            return true; // If no requirements, can use weapon
        }

        return weapon.requiredAttributes.every(attr => {
            const actual = getStatValue(attr.name, playerStats);
            if (attr.name === "Str") return actual >= attr.amount / 2;
            return actual >= attr.amount;
        });
    };

    const handleWeaponSelect = (weapon) => {
        const updated = [...tempWeapons];
        // Check if the new weapon can be infused
        const infusibility = getWeaponInfusibility(weapon.name);
        const infusionToUse = infusibility.canInfuse ? selectedInfusion : "Standard";

        // Create weapon slot object with weapon and appropriate infusion
        updated[selectedSlot] = {
            weapon: weapon,
            infusion: infusionToUse !== "Standard" ? infusionToUse : null
        };
        setTempWeapons(updated);

        // Reset infusion dropdown if weapon can't be infused
        if (!infusibility.canInfuse) {
            setSelectedInfusion("Standard");
        }
    };

    const handleRemoveWeapon = () => {
        const updated = [...tempWeapons];
        updated[selectedSlot] = null;
        setTempWeapons(updated);
        setSelectedInfusion("Standard");
    };

    const handleSave = () => {
        for (let i = 0; i < tempWeapons.length; i++) {
            const slot = tempWeapons[i];
            const weapon = getWeaponFromSlot(slot);
            if (!weapon) continue;

            // Check if weapon has required attributes before validating
            if (weapon.requiredAttributes && Array.isArray(weapon.requiredAttributes)) {
                const hasRequirements = weapon.requiredAttributes.every(attr => {
                    const actual = getStatValue(attr.name, playerStats);
                    if (attr.name === "Str") return actual >= attr.amount / 2;
                    return actual >= attr.amount;
                });

                if (!hasRequirements) {
                    toast.error(`You don't meet the requirements for '${decodeWeaponName(weapon.name)}' in slot ${i + 1}`);
                    return;
                }
            }
        }

        // Update the selected slot with the current infusion before saving
        if (selectedSlot !== null && tempWeapons[selectedSlot]) {
            const updatedTempWeapons = [...tempWeapons];
            const currentSlot = updatedTempWeapons[selectedSlot];
            if (currentSlot && currentSlot.weapon) {
                const weapon = currentSlot.weapon;
                const infusibility = getWeaponInfusibility(weapon.name);
                const finalInfusion = infusibility.canInfuse ? selectedInfusion : "Standard";

                updatedTempWeapons[selectedSlot] = {
                    weapon: currentSlot.weapon,
                    infusion: finalInfusion !== "Standard" ? finalInfusion : null
                };
            }
            setTempWeapons(updatedTempWeapons);
            setWeapons(updatedTempWeapons);
        } else {
            const newWeapons = [...tempWeapons];
            setWeapons(newWeapons);
        }

        // Use the updated weapons for logging
        const finalWeapons = selectedSlot !== null && tempWeapons[selectedSlot] ? (() => {
            const updated = [...tempWeapons];
            const currentSlot = updated[selectedSlot];
            if (currentSlot && currentSlot.weapon) {
                const weapon = currentSlot.weapon;
                const infusibility = getWeaponInfusibility(weapon.name);
                const finalInfusion = infusibility.canInfuse ? selectedInfusion : "Standard";

                updated[selectedSlot] = {
                    weapon: currentSlot.weapon,
                    infusion: finalInfusion !== "Standard" ? finalInfusion : null
                };
            }
            return updated;
        })() : [...tempWeapons];

        // Calculate total weight
        const totalWeaponWeight = calculateTotalWeaponWeight(finalWeapons);

        if (onWeaponsChange) {
            onWeaponsChange(totalWeaponWeight, finalWeapons);
        }

        setModalOpen(false);
        setSelectedSlot(null);
        setSelectedInfusion("Standard");
        toast.success("Weapons saved!");
    };

    const getInfusionColor = (infusion) => {
        const infusionData = infusionTypes.find(inf => inf.name === infusion);
        return infusionData ? infusionData.color : "#e5c77b";
    };

    // Helper function to check if weapon can be infused
    const getWeaponInfusibility = (weaponName) => {
        const decodedName = decodeWeaponName(weaponName);

        // Defensive check for undefined data
        if (!InfusibleData || !InfusibleData.infusibleWeapons) {
            return {
                canInfuse: false,
                status: "uncertain"
            };
        }

        // Check in infusible weapons list
        const infusibleWeapon = InfusibleData.infusibleWeapons.find(
            w => w.name === decodedName
        );

        if (infusibleWeapon) {
            return {
                canInfuse: infusibleWeapon.infusible,
                status: infusibleWeapon.infusible ? "infusible" : "not_infusible"
            };
        }

        // Check in uncertain weapons list with defensive check
        if (InfusibleData.uncertainWeapons && InfusibleData.uncertainWeapons.includes(decodedName)) {
            return {
                canInfuse: false,
                status: "uncertain"
            };
        }

        // Default to uncertain if not found
        return {
            canInfuse: false,
            status: "uncertain"
        };
    };

    return (
        <section className="w-full rounded-xl pt-3 sm:pt-4 mb-4 sm:mb-6">
            <div className="flex items-center justify-start px-2 sm:px-4 mb-3 sm:mb-4">
                <h2
                    className="text-lg sm:text-xl font-bold tracking-wide text-[#e5c77b] drop-shadow px-2 sm:px-0 flex items-center gap-1"
                    style={{ fontFamily: "serif" }}
                >
                    Weapons
                </h2>
                <span className="relative group cursor-help text-[#c0a857] font-bold w-5 h-5 ml-3 flex items-center justify-center rounded-full bg-[#3a2c1a] text-xs select-none">
                    ?
                    <span className="absolute bottom-full mb-2 w-[200px] left-1/2 -translate-x-1/2 rounded bg-[#1a1611] border border-[#c0a857] px-2 py-1 text-xs text-[#e5c77b] whitespace-normal opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                        "2H" means two-handed wielding; it counts your Strength as doubled for weapon requirements.
                    </span>
                </span>
            </div>


            <div className="grid grid-cols-3 gap-2 sm:gap-3 px-2 sm:px-0">
                {weapons.map((slot, i) => {
                    const weapon = getWeaponFromSlot(slot);
                    const infusion = getInfusionFromSlot(slot);
                    const borderColor = weapon && !canUseWeapon(slot) ? "border-red-500" : "border-[#e5c77b]";

                    return (
                        <div
                            key={i}
                            className={`w-full min-h-[120px] sm:min-h-[140px] md:min-h-[160px] p-2 sm:p-3 bg-[#2d2212] border ${borderColor} rounded-lg text-sm shadow transition-all duration-200 hover:bg-[#3a2c1a] active:bg-[#4a3c2a] cursor-pointer flex flex-col justify-center items-center touch-manipulation`}
                            onClick={() => handleTileClick(i)}
                        >
                            {weapon ? (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <img
                                        src={getWeaponImagePath(weapon)}
                                        alt={weapon.name}
                                        className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain mb-1 sm:mb-2"
                                        loading="lazy"
                                    />
                                    <p className="text-[#e5c77b] font-semibold text-xs sm:text-sm md:text-base text-center line-clamp-2 leading-tight mb-1" style={{ fontFamily: "serif" }}>
                                        {decodeWeaponName(weapon.name)}
                                    </p>
                                    {infusion && (
                                        <div className="flex items-center justify-center mt-1 mb-1">
                                            <img
                                                src={infusionImages.find(img => img.name === infusion)?.image || ""}
                                                alt={`${infusion} Infusion`}
                                                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 object-contain mr-1"
                                            />
                                            <span className="text-xs text-[#c0a857] truncate">{infusion}</span>
                                        </div>
                                    )}
                                    <div className="text-[#c0a857] text-xs text-center space-y-1">
                                        {weapon.requiredAttributes && weapon.requiredAttributes.length > 0 ? (
                                            <div className="flex flex-wrap justify-center gap-1">
                                                {weapon.requiredAttributes.map((attr, idx) => {
                                                    const actual = getStatValue(attr.name, playerStats);
                                                    const isStr = attr.name === "Str";
                                                    const meets = isStr ? actual >= attr.amount / 2 : actual >= attr.amount;
                                                    const mustTwoHand = isStr && actual >= attr.amount / 2 && actual < attr.amount;

                                                    return (
                                                        <span
                                                            key={idx}
                                                            className={`text-xs px-1 rounded ${meets ? "bg-[#3a2c1a] text-[#c0a857]" : "bg-[#4a1e1e] text-red-300"
                                                                }`}
                                                        >
                                                            {attr.name}: {attr.amount}
                                                            {mustTwoHand && <span className="text-[#f39c12]"> (2H)</span>}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <span className="text-xs">No requirements</span>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center text-center">
                                    <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 mb-1 sm:mb-2 bg-[#3a2c1a] rounded-md flex items-center justify-center">
                                        <span className="text-[#c0a857] text-lg sm:text-xl">+</span>
                                    </div>
                                    <p className="text-[#e5c77b] font-semibold text-xs sm:text-sm text-center" style={{ fontFamily: "serif" }}>
                                        <span className="hidden sm:inline">Empty Weapon Slot {i + 1}</span>
                                        <span className="sm:hidden">Slot {i + 1}</span>
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 overflow-auto p-2 sm:p-4">
                    <div className="bg-[#2d2212] border border-[#c0a857] overflow-hidden rounded-xl p-0 w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl relative mx-2 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-[#2d2212] border-b border-[#c0a857] flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 min-h-[60px]">
                            <div className="flex-1 text-center">
                                <div className="text-sm sm:text-lg font-semibold text-[#e5c77b] truncate" style={{ fontFamily: "serif" }}>
                                    Select Weapon
                                </div>
                                <div className="text-xs sm:text-sm text-[#c0a857] truncate">
                                    {decodeWeaponName(getWeaponFromSlot(tempWeapons[selectedSlot])?.name) || "None Selected"}
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
                                    onClick={() => { setModalOpen(false); setSelectedSlot(null); }}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        {/* Infusion Selection */}
                        {getWeaponFromSlot(tempWeapons[selectedSlot]) && (() => {
                            const weapon = getWeaponFromSlot(tempWeapons[selectedSlot]);
                            const infusibility = getWeaponInfusibility(weapon.name);

                            if (infusibility.canInfuse) {
                                return (
                                    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-[#19140e] border-b border-[#c0a857] sticky top-[60px] z-10">
                                        <div className="mb-2 text-[#c0a857] font-semibold text-sm sm:text-base">Infusion</div>
                                        <select
                                            value={selectedInfusion}
                                            onChange={(e) => setSelectedInfusion(e.target.value)}
                                            className="w-full px-3 py-2 sm:py-3 rounded bg-[#2d2212] border border-[#c0a857] text-[#e5c77b] focus:outline-none focus:border-[#e5c77b] text-sm sm:text-base touch-manipulation"
                                        >
                                            {infusionTypes.map((infusion) => (
                                                <option key={infusion.name} value={infusion.name} className="bg-[#2d2212]">
                                                    {infusion.name} - {infusion.effect}
                                                </option>
                                            ))}
                                        </select>
                                        {selectedInfusion !== "Standard" && (
                                            <p
                                                className="text-xs sm:text-sm mt-1"
                                                style={{ color: getInfusionColor(selectedInfusion) }}
                                            >
                                                {infusionTypes.find(inf => inf.name === selectedInfusion)?.effect}
                                            </p>
                                        )}
                                    </div>
                                );
                            } else if (infusibility.status === "not_infusible") {
                                return (
                                    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-[#19140e] border-b border-[#c0a857] sticky top-[60px] z-10">
                                        <div className="mb-2 text-[#c0a857] font-semibold text-sm sm:text-base">Infusion</div>
                                        <div className="px-3 py-2 sm:py-3 rounded bg-[#2d2212] border border-[#6d5a2b] text-[#a8955c] text-sm sm:text-base">
                                            This weapon cannot be infused
                                        </div>
                                    </div>
                                );
                            } else if (infusibility.status === "uncertain") {
                                return (
                                    <div className="px-3 sm:px-4 py-2 sm:py-3 bg-[#19140e] border-b border-[#c0a857] sticky top-[60px] z-10">
                                        <div className="mb-2 text-[#c0a857] font-semibold text-sm sm:text-base">Infusion</div>
                                        <div className="px-3 py-2 sm:py-3 rounded bg-[#2d2212] border border-[#8a7430] text-[#d4b85a] text-sm sm:text-base">
                                            Unsure on infuseable
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })()}

                        {/* Search Bar */}
                        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-[#19140e] border-b border-[#c0a857] sticky top-[60px] z-10">
                            <input
                                type="text"
                                placeholder="Search Weapons..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full px-3 py-2 sm:py-3 rounded bg-[#2d2212] border border-[#c0a857] text-[#e5c77b] focus:outline-none focus:border-[#e5c77b] text-sm sm:text-base touch-manipulation"
                                autoComplete="off"
                            />
                        </div>

                        {/* Weapon Grid */}
                        <div className="overflow-y-auto p-3 sm:p-4 flex-1">
                            <div className="mb-3 text-[#c0a857] font-semibold text-sm sm:text-base">Weapons</div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
                                {filteredWeapons.map((weapon) => {
                                    const selectedWeapon = getWeaponFromSlot(tempWeapons[selectedSlot]);
                                    const isSelected = selectedWeapon?.id === weapon.id;
                                    const infusibility = getWeaponInfusibility(weapon.name);

                                    return (
                                        <div
                                            key={weapon.id}
                                            className={`text-center border rounded-lg p-2 sm:p-3 cursor-pointer transition-all duration-200 touch-manipulation
                                                ${isSelected ? "border-[#e5c77b] bg-[#3a2c1a] scale-105" : "border-[#c0a857] bg-[#19140e] hover:bg-[#3a2c1a] active:bg-[#4a3c2a]"}
                                            `}
                                            onClick={() => handleWeaponSelect(weapon)}
                                        >
                                            <img
                                                src={getWeaponImagePath(weapon)}
                                                alt={weapon.name}
                                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-1 sm:mb-2 mx-auto"
                                                loading="lazy"
                                            />
                                            <p className="text-xs sm:text-sm text-[#e5c77b] mb-1 line-clamp-2 leading-tight">
                                                {decodeWeaponName(weapon.name)}
                                            </p>

                                            {/* Infusion status indicator */}
                                            {infusibility.status === "not_infusible" && (
                                                <p className="text-xs text-[#a8955c] mb-1">Cannot be infused</p>
                                            )}
                                            {infusibility.status === "uncertain" && (
                                                <p className="text-xs text-[#d4b85a] mb-1">Unsure on infuseable</p>
                                            )}
                                            {infusibility.status === "infusible" && (
                                                <p className="text-xs text-[#7db46c] mb-1">Can be infused</p>
                                            )}

                                            {/* Requirements */}
                                            {weapon.requiredAttributes.map((attr, idx) => {
                                                const actual = getStatValue(attr.name, playerStats);
                                                const isStr = attr.name === "Str";
                                                const meets = isStr ? actual >= attr.amount / 2 : actual >= attr.amount;
                                                const mustTwoHand = isStr && actual >= attr.amount / 2 && actual < attr.amount;

                                                return (
                                                    <div
                                                        key={idx}
                                                        className={`text-xs mb-1 px-1 rounded ${meets ? "bg-[#3a2c1a] text-[#c0a857]" : "bg-[#4a1e1e] text-red-300"
                                                            }`}
                                                    >
                                                        {attr.name}: {attr.amount}
                                                        {mustTwoHand && <span className="text-[#f39c12]"> (2H)</span>}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Remove Button */}
                        {getWeaponFromSlot(tempWeapons[selectedSlot]) && (
                            <div className="sticky bottom-0 bg-[#2d2212] border-t border-[#c0a857] p-3 sm:p-4">
                                <button
                                    className="w-full px-3 py-2 sm:py-3 bg-red-600 text-white rounded font-bold hover:bg-red-700 active:bg-red-800 text-sm sm:text-base transition-colors touch-manipulation"
                                    onClick={handleRemoveWeapon}
                                >
                                    Remove Weapon
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};
