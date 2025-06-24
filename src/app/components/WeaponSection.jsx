"use client";

import React, { useState, useEffect } from "react";
import WeaponData from "../../../public/EldenRingData/data/weapons.json";
import WeaponDataDLC from "../../../public/EldenRingData/data/weaponsDLC.json";
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
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [weapons, setWeapons] = useState(Array(WEAPON_SLOTS).fill(null));
    const [tempWeapons, setTempWeapons] = useState([...weapons]);
    
    // Convert stats object to format expected by weapon requirements
    const playerStats = {
        Str: stats?.STR || 10,
        Dex: stats?.DEX || 10,
        Int: stats?.INT || 10,
        Fai: stats?.FAI || 10,
        Arc: stats?.ARC || 10,
    };

    // Calculate total weapon weight
    const calculateTotalWeaponWeight = (weaponArray) => {
        return weaponArray.reduce((total, weapon) => {
            return total + (weapon?.weight || 0);
        }, 0);
    };

    // Update weapon validation when stats change
    useEffect(() => {
        // Force re-render when stats change to update weapon requirement checks
        // The component will automatically re-check canUseWeapon for each weapon
    }, [stats]);    const filteredWeapons = [...WeaponData, ...WeaponDataDLC].filter(
        (w) =>
            w.name &&
            decodeWeaponName(w.name).toLowerCase().includes(search.toLowerCase())
    );

    const handleTileClick = (slotIdx) => {
        setSelectedSlot(slotIdx);
        setTempWeapons([...weapons]);
        setSearch("");
        setModalOpen(true);
    };    const getWeaponWarnings = (weapon) => {
        let warnings = [];
        
        // Check if weapon has required attributes (some DLC weapons might not have this structure)
        if (!weapon.requiredAttributes || !Array.isArray(weapon.requiredAttributes)) {
            return warnings;
        }
        
        weapon.requiredAttributes.forEach(attr => {
            const required = attr.amount;
            const actual = playerStats[attr.name] || 0;

            if (attr.name === "Str" && actual >= required / 2 && actual < required) {
                warnings.push("You must two-hand this weapon");
            } else if (actual < required / 2 || (attr.name !== "Str" && actual < required)) {
                warnings.push(`Need ${attr.name} ${required}`);
            }
        });

        return warnings;
    };    const canUseWeapon = (weapon) => {
        // Check if weapon has required attributes (some DLC weapons might not have this structure)
        if (!weapon.requiredAttributes || !Array.isArray(weapon.requiredAttributes)) {
            return true; // If no requirements, can use weapon
        }
        
        return weapon.requiredAttributes.every(attr => {
            const actual = playerStats[attr.name] || 0;
            if (attr.name === "Str") return actual >= attr.amount / 2;
            return actual >= attr.amount;
        });
    };

    const handleWeaponSelect = (weapon) => {
        const updated = [...tempWeapons];
        updated[selectedSlot] = weapon;
        setTempWeapons(updated);
    };

    const handleSave = () => {        for (let i = 0; i < tempWeapons.length; i++) {
            const weapon = tempWeapons[i];
            if (!weapon) continue;
            
            // Check if weapon has required attributes before validating
            if (weapon.requiredAttributes && Array.isArray(weapon.requiredAttributes)) {
                const hasRequirements = weapon.requiredAttributes.every(attr => {
                    const actual = playerStats[attr.name] || 0;
                    if (attr.name === "Str") return actual >= attr.amount / 2;
                    return actual >= attr.amount;
                });                if (!hasRequirements) {
                    toast.error(`You don't meet the requirements for '${decodeWeaponName(weapon.name)}' in slot ${i + 1}`);
                    return;
                }
            }
        }

        const newWeapons = [...tempWeapons];
        setWeapons(newWeapons);
        
        // Calculate and notify parent about weapon weight change
        const totalWeaponWeight = calculateTotalWeaponWeight(newWeapons);
        if (onWeaponsChange) {
            onWeaponsChange(totalWeaponWeight);
        }
        
        setModalOpen(false);
        setSelectedSlot(null);
        toast.success("Weapons saved!");
    };


    return (
        <section className="w-full rounded-xl pt-4 mb-6">
            <h2
                className="text-xl font-bold mb-3 tracking-wide text-[#e5c77b] drop-shadow"
                style={{ fontFamily: "serif" }}
            >
                Weapons
            </h2>
            <div className="grid grid-cols-3 gap-3">
                {weapons.map((w, i) => {
                    const borderColor = w && !canUseWeapon(w) ? "border-red-500" : "border-[#e5c77b]";
                    return (
                        <div
                            key={i}
                            className={`w-full min-h-[140px] p-3 bg-[#2d2212] border ${borderColor} rounded-lg text-sm shadow transition hover:bg-[#3a2c1a] cursor-pointer flex flex-col justify-center items-center`}
                            onClick={() => handleTileClick(i)}
                        >
                            {w ? (                                <>
                                    <img
                                        src={getWeaponImagePath(w)}
                                        alt={w.name}
                                        className="w-12 h-12 object-contain mb-2"
                                    />
                                    <p className="text-[#e5c77b] font-semibold text-center" style={{ fontFamily: "serif" }}>{decodeWeaponName(w.name)}</p>
                                    <p className="text-[#c0a857] text-xs text-center">{
                                        w.requiredAttributes?.map(attr => `${attr.name}: ${attr.amount}`).join(" | ") || "No requirements"
                                    }</p>
                                </>
                            ) : (
                                <p className="text-[#e5c77b] font-semibold text-center" style={{ fontFamily: "serif" }}>Empty Weapon Slot {i + 1}</p>
                            )}
                        </div>
                    );
                })}
            </div>

            {modalOpen && (
                <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 overflow-auto">
                    <div className="bg-[#2d2212] border border-[#c0a857] overflow-hidden rounded-xl p-0 w-full max-w-lg relative mx-2 flex flex-col max-h-[90vh]">
                        <div className="sticky top-0 z-10 bg-[#2d2212] border-b border-[#c0a857] flex items-center justify-between px-4 py-2">                            <div className="flex-1 text-center text-lg font-semibold text-[#e5c77b]" style={{ fontFamily: "serif" }}>
                                Select Weapon - {decodeWeaponName(tempWeapons[selectedSlot]?.name) || "None Selected"}
                            </div>
                            <button
                                className="text-[#e5c77b] text-2xl ml-2"
                                onClick={() => { setModalOpen(false); setSelectedSlot(null); }}
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

                        <div className="px-4 py-2 bg-[#19140e] border-b border-[#c0a857] sticky top-[48px] z-10">
                            <input
                                type="text"
                                placeholder="Search Weapons..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-[#2d2212] border border-[#c0a857] text-[#e5c77b] focus:outline-none"
                            />
                        </div>

                        <div className="overflow-y-auto p-4 flex-1">
                            <div className="mb-2 text-[#c0a857] font-semibold">Weapons</div>
                            <div className="flex flex-wrap gap-4">
                                {filteredWeapons.map((weapon) => {
                                    const warnings = getWeaponWarnings(weapon);
                                    const isSelected = tempWeapons[selectedSlot]?.id === weapon.id;

                                    return (
                                        <div
                                            key={weapon.id}
                                            className={`w-32 text-center border rounded-lg p-2 cursor-pointer
                                                ${isSelected ? "border-[#e5c77b] bg-[#3a2c1a]" : "border-[#c0a857] bg-[#19140e] hover:bg-[#3a2c1a]"}
                                            `}
                                            onClick={() => handleWeaponSelect(weapon)}
                                        >                                            <img
                                                src={getWeaponImagePath(weapon)}
                                                alt={weapon.name}
                                                className="w-full h-16 object-contain mb-2"
                                            />
                                            <p className="text-xs text-[#e5c77b] mb-1">{decodeWeaponName(weapon.name)}</p>
                                            {warnings.length > 0 && (
                                                <div className="text-xs text-red-500">
                                                    {warnings.map((w, i) => (
                                                        <p key={i}>{w}</p>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};
