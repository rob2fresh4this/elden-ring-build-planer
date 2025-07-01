"use client";

import React, { useState, useEffect, useMemo } from "react";
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

const SpellSelection = ({ talismans = [], stats, onSpellsChange }) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalSlot, setModalSlot] = useState(null);
    const [tempSelection, setTempSelection] = useState({});
    const [spells, setSpells] = useState({});
    const [search, setSearch] = useState("");
    
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

    const maxSlots = moonOfNokstella ? 12 : 10;
    const allSpells = [
        ...SorceriesData.map((s) => ({ ...s, type: "Sorcery" })),
        ...IncantationsData.map((i) => ({ ...i, type: "Incantation" })),
    ];

    const filteredSpells = allSpells.filter(
        (spell) =>
            spell.name.toLowerCase().includes(search.toLowerCase()) ||
            spell.type.toLowerCase().includes(search.toLowerCase())
    );

    const handleTileClick = (slot) => {
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
            <div>
                {validRequirements.map((r, index) => {
                    const hasStat = (playerStats[r.name] || 0) >= r.amount;
                    const isLast = index === validRequirements.length - 1;
                    return (
                        <span
                            key={r.name}
                            className={`mr-1 ${hasStat ? "text-green-400" : "text-red-500"}`}
                        >
                            {r.name}: {r.amount}
                            {!isLast && <span className="text-[#c0a857]"> |</span>}
                        </span>
                    );
                })}
            </div>
        );
    };

    return (
        <section className="mb-6 bg-[#2d2212] p-4 rounded-xl border border-[#c0a857]">
            <div className="mb-2 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-violet-300">Spells</h2>
                <div className="flex items-center gap-2">
                    <span className={`text-sm flex items-center gap-1 ${moonOfNokstella ? "text-green-400" : "text-red-500"
                        }`}>
                        Moon of Nokstella (+2 slots)
                        {hasMoonTalisman && <span className="text-xs text-[#c0a857]">(Talisman Equipped)</span>}
                        {moonOfNokstella ? " ✓" : " ✗"}
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {Array.from({ length: maxSlots }).map((_, i) => {
                    const spell = spells[i];
                    const usable = spell ? canUseSpell(spell) : true;
                    return (
                        <div
                            key={i}
                            className={`bg-[#3a2c1a] p-2 rounded-md text-sm flex flex-col justify-center items-center cursor-pointer hover:bg-[#4b3a22] min-h-[175px] w-full border ${usable ? "border-[#c0a857]" : "border-red-500"}`}
                            onClick={() => handleTileClick(i)}
                        >
                            {spell ? (
                                <div className="flex flex-col justify-center items-center">
                                    <img
                                        src={
                                            spell.type === "Sorcery"
                                                ? `/EldenRingData/images/sorceries/${stripImageBaseUrl(spell.image)}`
                                                : `/EldenRingData/images/incantations/${stripImageBaseUrl(spell.image)}`
                                        }
                                        alt={spell.name}
                                        className="w-20 h-20 object-contain mb-1 mx-auto"
                                    />
                                    <span className="text-xs text-[#c0a857] text-center">{spell.name}</span>
                                    <span className="text-[10px] text-violet-300 text-center">{spell.type}</span>
                                    <div className="text-[10px] text-[#e5c77b] text-center mt-1">
                                        <div>Cost: {spell.cost ?? "?"}</div>
                                        <div>Slots: {spell.slots ?? "?"}</div>
                                        <div className="flex flex-wrap justify-center">
                                            {renderRequirements(spell.requires)}
                                        </div>
                                        {spell.effects && <div>Effects: {spell.effects}</div>}
                                    </div>
                                </div>
                            ) : (
                                <span className="text-[#c0a857]">Spell {i + 1}</span>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Modal remains unchanged */}
            {modalOpen && modalSlot !== null && (
                <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 overflow-auto">
                    <div className="bg-[#2d2212] border border-[#c0a857] overflow-hidden rounded-xl p-0 w-[70%] relative mx-2 flex flex-col max-h-[90vh]">
                        <div className="sticky top-0 z-10 bg-[#2d2212] border-b border-[#c0a857] flex items-center justify-between px-4 py-2">
                            <div className="flex-1 text-center text-lg font-semibold text-violet-300">
                                Spell Slot {modalSlot + 1} - {tempSelection[modalSlot]?.name || "None Selected"}
                            </div>
                            <button
                                className="text-[#e5c77b] text-2xl ml-2"
                                onClick={() => {
                                    setModalOpen(false);
                                    setModalSlot(null);
                                }}
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
                                placeholder="Search spells..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-[#2d2212] border border-[#c0a857] text-[#e5c77b] focus:outline-none"
                            />
                        </div>
                        <div className="overflow-y-auto p-4 flex-1">
                            <div className="mb-2 text-[#c0a857] font-semibold">All Spells</div>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {filteredSpells.map((spell) => {
                                    const usable = canUseSpell(spell);
                                    return (
                                        <div
                                            key={spell.id}
                                            className={`w-[22%] min-w-[140px] text-center border rounded-lg p-2 cursor-pointer
                                            ${tempSelection[modalSlot]?.id === spell.id
                                                    ? "border-violet-300 bg-[#3a2c1a]"
                                                    : usable
                                                        ? "border-[#c0a857] bg-[#19140e] hover:bg-[#3a2c1a]"
                                                        : "border-red-500 bg-[#19140e] hover:bg-[#3a2c1a]"}`}
                                            onClick={() => handleSpellSelect(modalSlot, spell)}
                                        >
                                            <img
                                                src={
                                                    spell.type === "Sorcery"
                                                        ? `/EldenRingData/images/sorceries/${stripImageBaseUrl(spell.image)}`
                                                        : `/EldenRingData/images/incantations/${stripImageBaseUrl(spell.image)}`
                                                }
                                                alt={spell.name}
                                                className="w-20 h-20 object-contain mb-1 mx-auto"
                                            />
                                            <p className="text-xs text-[#e5c77b]">{spell.name}</p>
                                            <span className="text-[10px] text-violet-300">{spell.type}</span>
                                            <div className="text-[10px] text-[#e5c77b] text-center mt-1">
                                                <div>Cost: {spell.cost ?? "?"}</div>
                                                <div>Slots: {spell.slots ?? "?"}</div>
                                                <div className="flex flex-wrap justify-center">
                                                    {renderRequirements(spell.requires)}
                                                </div>
                                                {spell.effects && <div>Effects: {spell.effects}</div>}
                                            </div>
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

export default SpellSelection;
