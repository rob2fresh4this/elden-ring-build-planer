"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import SorceriesData from "../../../public/EldenRingData/data/sorceries.json";
import IncantationsData from "../../../public/EldenRingData/data/incantations.json";
import toast from "react-hot-toast";

const stripImageBaseUrl = (imageUrl) => {
    const baseUrlincantations = "https://eldenring.fanapis.com/images/incantations";
    const baseUrlsorceries = "https://eldenring.fanapis.com/images/sorceries";
    if (typeof imageUrl === "string") {
        if (imageUrl.startsWith(baseUrlincantations)) {
            return imageUrl.replace(baseUrlincantations, "");
        } else if (imageUrl.startsWith(baseUrlsorceries)) {
            return imageUrl.replace(baseUrlsorceries, "");
        }
    }
    return imageUrl || "";
};

const SpellSelection = ({ 
    talismans = [], 
    stats, 
    onSpellsChange, 
    initialSpells = [],
    viewMode = false 
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalSlot, setModalSlot] = useState(null);
    const [tempSelection, setTempSelection] = useState({});
    const [spells, setSpells] = useState(initialSpells.length > 0 ? initialSpells.reduce((acc, spell, index) => {
        if (spell) acc[index] = spell;
        return acc;
    }, {}) : {});
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [isMobile, setIsMobile] = useState(false);

    // Convert stats object to format expected by spell requirements
    const playerStats = useMemo(() => ({
        Strength: stats?.STR || 10,
        Dexterity: stats?.DEX || 10,
        Intelligence: stats?.INT || 10,
        Faith: stats?.FAI || 10,
        Arcane: stats?.ARC || 10,
    }), [stats]);

    const [moonOfNokstella, setMoonOfNokstella] = useState(false);    // Check if the Moon of Nokstella talisman is equipped
    const MOON_NOKSTELLA_TALISMAN_ID = "17f6980d220l0i2stavhe03m4ms2yf";
    const hasMoonTalisman = talismans.some(talisman =>
        talisman && talisman.id === MOON_NOKSTELLA_TALISMAN_ID
    );

    useEffect(() => {
        setMoonOfNokstella(hasMoonTalisman);
    }, [hasMoonTalisman]);

    // Update spell validation when stats change
    useEffect(() => {
        // Force re-render when stats change to update spell requirement checks
        // The component will automatically re-check canUseSpell for each spell
    }, [playerStats]);

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

    const maxSlots = moonOfNokstella ? 12 : 10;
    const allSpells = [
        ...SorceriesData.map((s) => ({ ...s, type: "Sorcery" })),
        ...IncantationsData.map((i) => ({ ...i, type: "Incantation" })),
    ];

    const filteredSpells = allSpells.filter(
        (spell) =>
            spell.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            spell.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Initialize with provided data in viewMode
    useEffect(() => {
        if (viewMode && initialSpells.length > 0) {
            const spellsObj = initialSpells.reduce((acc, spell, index) => {
                if (spell) acc[index] = spell;
                return acc;
            }, {});
            setSpells(spellsObj);
        }
    }, [initialSpells, viewMode]);

    // Add useEffect to update spells when initialSpells changes
    useEffect(() => {
        if (initialSpells && initialSpells.length > 0) {
            // Check if any spells are not null
            const hasSpells = initialSpells.some(spell => spell !== null);
            if (hasSpells) {
                const spellsObj = initialSpells.reduce((acc, spell, index) => {
                    if (spell) acc[index] = spell;
                    return acc;
                }, {});
                setSpells(spellsObj);
                
                // Notify parent component
                if (onSpellsChange) {
                    onSpellsChange(initialSpells);
                }
            }
        }
    }, [initialSpells, onSpellsChange]);

    const handleTileClick = (slot) => {
        if (viewMode) return; // Disable clicks in view mode
        setModalSlot(slot);
        setTempSelection({ ...spells });
        setSearch("");
        setModalOpen(true);
    };

    const handleSpellSelect = (slot, spell) => {
        console.log("Selecting spell", spell.name, "for slot", slot);

        const slotsNeeded = spell.slots ?? 1;
        let newSelection = { ...tempSelection };

        // First, check if the clicked slot is part of an existing multi-slot spell
        const existingSpell = newSelection[slot];
        if (existingSpell) {
            // Find all slots occupied by this existing spell and remove them
            const existingSlotsNeeded = existingSpell.slots ?? 1;

            // Find the starting slot of the existing spell
            let startSlot = slot;
            for (let i = slot - 1; i >= 0; i--) {
                if (newSelection[i] && newSelection[i].id === existingSpell.id) {
                    startSlot = i;
                } else {
                    break;
                }
            }

            // Remove all slots occupied by the existing spell
            for (let i = 0; i < existingSlotsNeeded; i++) {
                if (newSelection[startSlot + i] && newSelection[startSlot + i].id === existingSpell.id) {
                    delete newSelection[startSlot + i];
                }
            }
        }

        // Now check if we need to clear any other spells that would conflict with the new spell placement
        for (let i = 0; i < slotsNeeded; i++) {
            const targetSlot = slot + i;
            if (newSelection[targetSlot]) {
                const conflictingSpell = newSelection[targetSlot];
                const conflictingSlotsNeeded = conflictingSpell.slots ?? 1;

                // Find the starting slot of the conflicting spell
                let conflictingStartSlot = targetSlot;
                for (let j = targetSlot - 1; j >= 0; j--) {
                    if (newSelection[j] && newSelection[j].id === conflictingSpell.id) {
                        conflictingStartSlot = j;
                    } else {
                        break;
                    }
                }

                // Remove all slots occupied by the conflicting spell
                for (let j = 0; j < conflictingSlotsNeeded; j++) {
                    if (newSelection[conflictingStartSlot + j] && newSelection[conflictingStartSlot + j].id === conflictingSpell.id) {
                        delete newSelection[conflictingStartSlot + j];
                    }
                }
            }
        }

        // Finally, assign the new spell to its required slots
        for (let i = 0; i < slotsNeeded; i++) {
            newSelection[slot + i] = spell;
        }

        setTempSelection(newSelection);
    };

    const handleRemoveSpell = () => {
        const spell = tempSelection[modalSlot];
        if (spell) {
            const slotsNeeded = spell.slots ?? 1;
            let newSelection = { ...tempSelection };

            // Find the starting slot of the spell
            let startSlot = modalSlot;
            for (let i = modalSlot - 1; i >= 0; i--) {
                if (newSelection[i] && newSelection[i].id === spell.id) {
                    startSlot = i;
                } else {
                    break;
                }
            }

            // Remove all slots occupied by this spell
            for (let i = 0; i < slotsNeeded; i++) {
                if (newSelection[startSlot + i] && newSelection[startSlot + i].id === spell.id) {
                    delete newSelection[startSlot + i];
                }
            }

            setTempSelection(newSelection);
        }
    };

    const handleSave = () => {
        let newSpells = {};
        const assignedSpells = new Set();
        const occupiedSlots = new Set();

        const sortedEntries = Object.entries(tempSelection).sort((a, b) => Number(a[0]) - Number(b[0]));

        for (const [slotStr, spell] of sortedEntries) {
            if (!spell) continue;

            const slot = Number(slotStr);
            const slotsNeeded = spell.slots || 1;

            // Check if this spell has already been processed
            if (assignedSpells.has(spell.id)) {
                continue;
            }

            // Check if spell overlaps with slots occupied by OTHER spells
            for (let j = 0; j < slotsNeeded; j++) {
                if (occupiedSlots.has(slot + j)) {
                    // Check if the conflicting slot contains a different spell
                    const conflictingSpell = Object.entries(tempSelection).find(
                        ([s, sp]) => Number(s) === slot + j && sp && sp.id !== spell.id
                    );
                    if (conflictingSpell) {
                        toast.error(`Overlap error: '${spell.name}' conflicts with '${conflictingSpell[1].name}'.`);
                        return;
                    }
                }
            }

            // Check stat requirements
            const meetsRequirements = spell.requires?.every(
                (r) => (playerStats[r.name] || 0) >= r.amount
            );
            if (!meetsRequirements) {
                toast.error(`Stat error: You don't meet the requirements for '${spell.name}'.`);
                return;
            }

            // Assign spell to slots
            for (let j = 0; j < slotsNeeded; j++) {
                newSpells[slot + j] = spell;
                occupiedSlots.add(slot + j);
            }
            assignedSpells.add(spell.id);
        }

        setSpells(newSpells);

        // Convert spells object to array for easier handling
        const spellsArray = Array.from({ length: maxSlots }, (_, i) => newSpells[i] || null);

        // Notify parent component with spells data
        if (onSpellsChange) {
            onSpellsChange(spellsArray);
        }

        toast.success("Spell selection saved!");
        setModalOpen(false);
        setModalSlot(null);
    };


    const canUseSpell = (spell) => {
        return spell.requires?.every(attr => (playerStats[attr.name] || 0) >= attr.amount);
    };

    const renderRequirements = (requires = []) => {
        const validRequirements = (requires || []).filter((r) => r.amount > 0);
        return (
            <div className="flex flex-wrap justify-center gap-1">
                {validRequirements.map((r, index) => {
                    const hasStat = (playerStats[r.name] || 0) >= r.amount;
                    return (
                        <span
                            key={r.name}
                            className={`text-xs px-1 rounded ${hasStat ? "text-green-400 bg-green-900/20" : "text-red-500 bg-red-900/20"}`}
                        >
                            {r.name}: {r.amount}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <section className="mb-4 sm:mb-6 bg-[#2d2212] p-3 sm:p-4 rounded-xl border border-[#c0a857]">
            <div className="mb-3 sm:mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <h2 className="text-lg sm:text-xl font-semibold text-violet-300">Spells</h2>
                <div className="flex items-center gap-2">
                    <span className={`text-xs sm:text-sm flex items-center gap-1 ${moonOfNokstella ? "text-green-400" : "text-red-500"
                        }`}>
                        <span className="hidden sm:inline">Moon of Nokstella (+2 slots)</span>
                        <span className="sm:hidden">Moon (+2)</span>
                        {hasMoonTalisman && <span className="text-xs text-[#c0a857]">(Equipped)</span>}
                        {moonOfNokstella ? " ✓" : " ✗"}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
                {Array.from({ length: maxSlots }).map((_, i) => {
                    const spell = spells[i];
                    const usable = spell ? canUseSpell(spell) : true;
                    return (
                        <div
                            key={i}
                            className={`bg-[#3a2c1a] p-2 sm:p-3 rounded-md text-sm flex flex-col justify-center items-center ${!viewMode ? 'cursor-pointer hover:bg-[#4b3a22] active:bg-[#5c4733]' : ''} transition-colors duration-200 touch-manipulation min-h-[140px] sm:min-h-[175px] w-full border ${usable ? "border-[#c0a857]" : "border-red-500"}`}
                            onClick={!viewMode ? () => handleTileClick(i) : undefined}
                        >
                            {spell ? (
                                <div className="flex flex-col justify-center items-center text-center">
                                    <img
                                        src={
                                            spell.type === "Sorcery"
                                                ? `/EldenRingData/images/sorceries/${stripImageBaseUrl(spell.image)}`
                                                : `/EldenRingData/images/incantations/${stripImageBaseUrl(spell.image)}`
                                        }
                                        alt={spell.name}
                                        className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-1 mx-auto"
                                        loading="lazy"
                                    />
                                    <span className="text-xs sm:text-sm text-[#c0a857] text-center line-clamp-2 leading-tight">
                                        {spell.name}
                                    </span>
                                    <span className="text-xs text-violet-300 text-center">{spell.type}</span>
                                    <div className="text-xs text-[#e5c77b] text-center mt-1 space-y-1">
                                        <div className="flex flex-col sm:flex-row sm:gap-2 text-xs">
                                            <span>Cost: {spell.cost ?? "?"}</span>
                                            <span>Slots: {spell.slots ?? "?"}</span>
                                        </div>
                                        {renderRequirements(spell.requires)}
                                    </div>
                                </div>
                            ) : (
                                <span className="text-[#c0a857] text-xs sm:text-sm">Spell {i + 1}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal */}
            {modalOpen && modalSlot !== null && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 overflow-auto p-2 sm:p-4">
                    <div className="bg-[#2d2212] border border-[#c0a857] overflow-hidden rounded-xl p-0 w-full max-w-xs sm:max-w-lg md:max-w-4xl lg:max-w-6xl relative mx-2 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-[#2d2212] border-b border-[#c0a857] flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 min-h-[60px]">
                            <div className="flex-1 text-center">
                                <div className="text-sm sm:text-lg font-semibold text-violet-300 truncate">
                                    Spell Slot {modalSlot + 1}
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
                                    onClick={() => {
                                        setModalOpen(false);
                                        setModalSlot(null);
                                    }}
                                >
                                    &times;
                                </button>
                            </div>
                        </div>

                        {/* Search Bar */}
                        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-[#19140e] border-b border-[#c0a857] sticky top-[60px] z-10">
                            <input
                                type="text"
                                placeholder="Search spells..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full px-3 py-2 sm:py-3 rounded bg-[#2d2212] border border-[#c0a857] text-[#e5c77b] focus:outline-none focus:border-[#e5c77b] text-sm sm:text-base touch-manipulation"
                                autoComplete="off"
                            />
                        </div>

                        {/* Spell Grid */}
                        <div className="overflow-y-auto p-3 sm:p-4 flex-1">
                            <div className="mb-3 text-[#c0a857] font-semibold text-sm sm:text-base">All Spells</div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
                                {filteredSpells.map((spell) => {
                                    const usable = canUseSpell(spell);
                                    return (
                                        <div
                                            key={spell.id}
                                            className={`text-center border rounded-lg p-2 sm:p-3 cursor-pointer transition-all duration-200 touch-manipulation
                                            ${tempSelection[modalSlot]?.id === spell.id
                                                    ? "border-violet-300 bg-[#3a2c1a] scale-105"
                                                    : usable
                                                        ? "border-[#c0a857] bg-[#19140e] hover:bg-[#3a2c1a] active:bg-[#4a3c2a]"
                                                        : "border-red-500 bg-[#19140e] hover:bg-[#3a2c1a] active:bg-[#4a3c2a] opacity-75"}`}
                                            onClick={() => handleSpellSelect(modalSlot, spell)}
                                        >
                                            <img
                                                src={
                                                    spell.type === "Sorcery"
                                                        ? `/EldenRingData/images/sorceries/${stripImageBaseUrl(spell.image)}`
                                                        : `/EldenRingData/images/incantations/${stripImageBaseUrl(spell.image)}`
                                                }
                                                alt={spell.name}
                                                className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-1 sm:mb-2 mx-auto"
                                                loading="lazy"
                                            />
                                            <p className="text-xs sm:text-sm text-[#e5c77b] line-clamp-2 leading-tight mb-1">
                                                {spell.name}
                                            </p>
                                            <span className="text-xs text-violet-300 block mb-1">{spell.type}</span>
                                            <div className="text-xs text-[#e5c77b] text-center space-y-1">
                                                <div className="flex flex-col gap-1">
                                                    <span>Cost: {spell.cost ?? "?"}</span>
                                                    <span>Slots: {spell.slots ?? "?"}</span>
                                                </div>
                                                {renderRequirements(spell.requires)}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Remove Button */}
                        {tempSelection[modalSlot] && (
                            <div className="sticky bottom-0 bg-[#2d2212] border-t border-[#c0a857] p-3 sm:p-4">
                                <button
                                    className="w-full px-3 py-2 sm:py-3 bg-red-800 text-white rounded font-bold hover:bg-red-900 active:bg-red-700 text-sm sm:text-base transition-colors touch-manipulation"
                                    onClick={handleRemoveSpell}
                                >
                                    Remove Spell
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};

export default SpellSelection;
