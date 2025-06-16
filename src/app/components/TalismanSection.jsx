"use client";

import React, { useState } from "react";
import TalismanData from "../../../public/EldenRingData/data/talismans.json";
// images location ../../../public/EldenRingData/images/talismans/{imageName}

const stripImageBaseUrl = (imageUrl) => {
    const baseUrl = "https://eldenring.fanapis.com/images/talismans/";
    if (typeof imageUrl === "string" && imageUrl.startsWith(baseUrl)) {
        return imageUrl.replace(baseUrl, "");
    }
    return imageUrl || "";
};

const TALISMAN_SLOTS = 4;

export const TalismanSection = () => {
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [talismans, setTalismans] = useState(Array(TALISMAN_SLOTS).fill(null));
    const [tempTalismans, setTempTalismans] = useState([...talismans]);
    const [cantUseSameTalisman, setCantUseSameTalisman] = useState(false);

    const filteredTalismans = TalismanData.filter(
        (t) =>
            t.name &&
            t.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleTileClick = (slotIdx) => {
        setSelectedSlot(slotIdx);
        setTempTalismans([...talismans]);
        setSearch("");
        setModalOpen(true);
    };

    const handleTalismanSelect = (talisman) => {
        const isDuplicate = tempTalismans.some(
            (t, idx) => t && t.id === talisman.id && idx !== selectedSlot
        );

        if (isDuplicate) {
            setCantUseSameTalisman(true);
            return;
        }

        const updated = [...tempTalismans];
        updated[selectedSlot] = talisman;
        setTempTalismans(updated);
    };


    const handleSave = () => {
        setTalismans([...tempTalismans]);
        setModalOpen(false);
        setSelectedSlot(null);
    };

    return (
        <section className="w-full rounded-xl pt-4 mb-6">
            <h2
                className="text-xl font-bold mb-3 tracking-wide text-[#e5c77b] drop-shadow"
                style={{ fontFamily: "serif" }}
            >
                Talismans
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {talismans.map((t, i) => (
                    <div
                        key={i}
                        className="w-full min-h-[140px] p-3 bg-[#2d2212] border border-[#e5c77b] rounded-lg text-sm shadow transition hover:bg-[#3a2c1a] cursor-pointer flex flex-col justify-center items-center"
                        onClick={() => handleTileClick(i)}
                    >
                        {t ? (
                            <>
                                <img
                                    src={`/EldenRingData/images/talismans/${stripImageBaseUrl(t.image)}`}
                                    alt={t.name}
                                    className="w-12 h-12 object-contain mb-2"
                                />
                                <p className="text-[#e5c77b] font-semibold" style={{ fontFamily: "serif" }}>
                                    {t.name}
                                </p>
                                <p className="text-[#c0a857]">{t.effect}</p>
                            </>
                        ) : (
                            <p className="text-[#e5c77b] font-semibold" style={{ fontFamily: "serif" }}>
                                Empty Talisman Slot {i + 1}
                            </p>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 overflow-auto">
                    <div className="bg-[#2d2212] border border-[#c0a857] overflow-hidden rounded-xl p-0 w-full max-w-lg relative mx-2 flex flex-col max-h-[90vh]">
                        {/* Fixed Save and Close */}
                        <div className="sticky top-0 z-10 bg-[#2d2212] border-b border-[#c0a857] flex items-center justify-between px-4 py-2">
                            <div className="flex-1 text-center text-lg font-semibold text-[#e5c77b]" style={{ fontFamily: "serif" }}>
                                Select Talisman - {tempTalismans[selectedSlot]?.name || "None Selected"}
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
                        {/* Search Bar */}
                        <div className="px-4 py-2 bg-[#19140e] border-b border-[#c0a857] sticky top-[48px] z-10">
                            <input
                                type="text"
                                placeholder="Search Talismans..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full px-3 py-2 rounded bg-[#2d2212] border border-[#c0a857] text-[#e5c77b] focus:outline-none"
                            />
                        </div>
                        {/* Scrollable Talisman List */}
                        <div className="overflow-y-auto p-4 flex-1">
                            <div className="mb-2 text-[#c0a857] font-semibold">Talismans</div>
                            <div className="flex flex-wrap gap-4">
                                {filteredTalismans.map((talisman) => (
                                    <div
                                        key={talisman.id}
                                        className={`w-32 text-center border rounded-lg p-2 cursor-pointer
                                            ${tempTalismans[selectedSlot]?.id === talisman.id
                                                ? "border-[#e5c77b] bg-[#3a2c1a]"
                                                : "border-[#c0a857] bg-[#19140e] hover:bg-[#3a2c1a]"
                                            }`}
                                        onClick={() => handleTalismanSelect(talisman)}
                                    >
                                        <img
                                            src={`/EldenRingData/images/talismans/${stripImageBaseUrl(talisman.image)}`}
                                            alt={talisman.name}
                                            className="w-full h-16 object-contain mb-2"
                                        />
                                        <p className="text-xs text-[#e5c77b]">{talisman.name}</p>
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
