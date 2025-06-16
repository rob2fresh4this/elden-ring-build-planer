"use client";

import React, { useState } from "react";
import SorceriesData from "../../../public/EldenRingData/data/sorceries.json";
import IncantationsData from "../../../public/EldenRingData/data/incantations.json";
// images location ../../../public/EldenRingData/images/sorceries/{imageName}
// ../../../public/EldenRingData/images/incantations/{imageName}

const spellSlots = Array.from({ length: 12 });
const allSpells = [
    ...SorceriesData.map((s) => ({ ...s, type: "Sorcery" })),
    ...IncantationsData.map((i) => ({ ...i, type: "Incantation" })),
];

// https://eldenring.fanapis.com/images/incantations/17f696c7ce7l0hynrwmh6d0r0rwk2.png
// https://eldenring.fanapis.com/images/sorceries/17f69383db4l0hykt8reipbquz8e6t.png

const stripImageBaseUrl = (imageUrl) => {
    const baseUrlincantations = "https://eldenring.fanapis.com/images/incantations"
    const baseUrlsorceries = "https://eldenring.fanapis.com/images/sorceries";
    if (typeof imageUrl === "string") {
        if (imageUrl.startsWith(baseUrlincantations)) {
            return imageUrl.replace(baseUrlincantations, "");
        } else if (imageUrl.startsWith(baseUrlsorceries)) {
            return imageUrl.replace(baseUrlsorceries, "");
        } else {
            console.warn(`Image URL does not match expected base URLs: ${imageUrl}`);
            return imageUrl; // Return as is if it doesn't match
        }
    }
    return imageUrl || "";
};

const SpellSelection = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalSlot, setModalSlot] = useState(null);
    const [tempSelection, setTempSelection] = useState({});
    const [spells, setSpells] = useState({});
    const [search, setSearch] = useState("");

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
        setTempSelection((prev) => ({
            ...prev,
            [slot]: spell,
        }));
    };

    const handleSave = () => {
        setSpells(tempSelection);
        setModalOpen(false);
        setModalSlot(null);
    };

    console.log(`incantation 1 ${stripImageBaseUrl(IncantationsData[1]?.image)}.png`);
    console.log(`sorcery 1 ${stripImageBaseUrl(SorceriesData[1]?.image)}.png`);
    const i = 2;
    console.log(`/EldenRingData/images/sorceries${stripImageBaseUrl(SorceriesData[i]?.image)}`);

    return (
        <section className="mb-6 bg-[#2d2212] p-4 rounded-xl border border-[#c0a857]">
            <h2 className="text-xl font-semibold mb-2 text-violet-300">Spells</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {spellSlots.map((_, i) => (
                    <div
                        key={i}
                        className="bg-[#3a2c1a] border border-[#c0a857] p-2 rounded-md text-sm flex flex-col items-center cursor-pointer hover:bg-[#4b3a22]"
                        onClick={() => handleTileClick(i)}
                    >
                        {spells[i] ? (
                            <div className="flex flex-col justify-center items-center">
                                <div className="flex justify-center items-center w-full">
                                    <img
                                        src={
                                            spells[i].type === "Sorcery"
                                                ? `/EldenRingData/images/sorceries/${stripImageBaseUrl(spells[i].image)}`
                                                : `/EldenRingData/images/incantations/${stripImageBaseUrl(spells[i].image)}`
                                        }
                                        alt={spells[i].name}
                                        className="w-20 h-20 object-contain mb-1 mx-auto"
                                    />
                                </div>
                                <span className="text-xs text-[#c0a857] text-center">{spells[i].name}</span>
                                <span className="text-[10px] text-violet-300 text-center">{spells[i].type}</span>
                                {/* Stats */}
                                <div className="text-[10px] text-[#e5c77b] text-center mt-1">
                                    <div>Cost: {spells[i].cost ?? "?"}</div>
                                    <div>Slots: {spells[i].slots ?? "?"}</div>
                                    <div>
                                        {spells[i].requires &&
                                            spells[i].requires
                                                .filter((r) => r.amount > 0)
                                                .map((r) => `${r.name}: ${r.amount}`)
                                                .join(" | ")}
                                    </div>
                                    {spells[i].effects && (
                                        <div>Effects: {spells[i].effects}</div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <span className="text-[#c0a857]">Spell {i + 1}</span>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && modalSlot !== null && (
                <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 overflow-auto">
                    <div className="bg-[#2d2212] border border-[#c0a857] overflow-hidden rounded-xl p-0 w-[70%] relative mx-2 flex flex-col max-h-[90vh]">
                        {/* Header */}
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

                        {/* Search Bar */}
                        <div className="px-4 py-2 bg-[#19140e] border-b border-[#c0a857] sticky top-[48px] z-10">
                            <input
                                type="text"
                                placeholder="Search spells..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-[#2d2212] border border-[#c0a857] text-[#e5c77b] focus:outline-none"
                            />
                        </div>

                        {/* Scrollable Spell List */}
                        <div className="overflow-y-auto p-4 flex-1">
                            <div className="mb-2 text-[#c0a857] font-semibold">All Spells</div>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {filteredSpells.map((spell) => (
                                    <div
                                        key={spell.id}
                                        className={`w-[22%] min-w-[140px] text-center border rounded-lg p-2 cursor-pointer
                                ${tempSelection[modalSlot]?.id === spell.id
                                                ? "border-violet-300 bg-[#3a2c1a]"
                                                : "border-[#c0a857] bg-[#19140e] hover:bg-[#3a2c1a]"
                                            }`}
                                        onClick={() => handleSpellSelect(modalSlot, spell)}
                                    >
                                        <div className="flex justify-center items-center w-full">
                                            <img
                                                src={
                                                    spell.type === "Sorcery"
                                                        ? `/EldenRingData/images/sorceries/${stripImageBaseUrl(spell.image)}`
                                                        : `/EldenRingData/images/incantations/${stripImageBaseUrl(spell.image)}`
                                                }
                                                alt={spell.name}
                                                className="w-20 h-20 object-contain mb-1 mx-auto"
                                            />
                                        </div>
                                        <p className="text-xs text-[#e5c77b]">{spell.name}</p>
                                        <span className="text-[10px] text-violet-300">{spell.type}</span>
                                        <div className="text-[10px] text-[#e5c77b] text-center mt-1">
                                            <div>Cost: {spell.cost ?? "?"}</div>
                                            <div>Slots: {spell.slots ?? "?"}</div>
                                            <div>
                                                {spell.requires &&
                                                    spell.requires
                                                        .filter((r) => r.amount > 0)
                                                        .map((r) => `${r.name}: ${r.amount}`)
                                                        .join(" | ")}
                                            </div>
                                            {spell.effects && (
                                                <div>Effects: {spell.effects}</div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </section>
    );
};

export default SpellSelection;

// {spells[i] && (
//     <div className="flex flex-col justify-center items-center">
//         <div className="flex justify-center items-center w-full">
//             <img
//                 src={
//                     spells[i].type === "Sorcery"
//                         ? `/EldenRingData/images/sorceries/${stripImageBaseUrl(spells[i].image)}`
//                         : `/EldenRingData/images/incantations/${stripImageBaseUrl(spells[i].image)}`
//                 }
//                 alt={spells[i].name}
//                 className="w-20 h-20 object-contain mb-1 mx-auto"
//             />
//         </div>
//         <span className="text-xs text-[#c0a857] text-center">{spells[i].name}</span>
//         <span className="text-[10px] text-violet-300 text-center">{spells[i].type}</span>
//         {/* Stats */}
//         <div className="text-[10px] text-[#e5c77b] text-center mt-1">
//             <div>Cost: {spells[i].cost ?? "?"}</div>
//             <div>Slots: {spells[i].slots ?? "?"}</div>
//             <div>
//                 {spells[i].requires &&
//                     spells[i].requires
//                         .filter((r) => r.amount > 0)
//                         .map((r) => `${r.name}: ${r.amount}`)
//                         .join(" | ")}
//             </div>
//         </div>
//     </div>
// )}