"use client";

import React, { useState, useEffect, useCallback } from "react";
import TalismanData from "../../../public/EldenRingData/data/talismans.json";
import toast from "react-hot-toast";

// images location ../../../public/EldenRingData/images/talismans/{imageName}

const stripImageBaseUrl = (imageUrl) => {
    const baseUrl = "https://eldenring.fanapis.com/images/talismans/";
    if (typeof imageUrl === "string" && imageUrl.startsWith(baseUrl)) {
        return imageUrl.replace(baseUrl, "");
    }
    return imageUrl || "";
};

const TALISMAN_SLOTS = 4;

export const TalismanSection = ({ 
    onTalismansChange, 
    initialTalismans = [],
    viewMode = false 
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [talismans, setTalismans] = useState(initialTalismans.length > 0 ? initialTalismans : Array(TALISMAN_SLOTS).fill(null));
    const [tempTalismans, setTempTalismans] = useState([...talismans]);
    const [cantUseSameTalisman, setCantUseSameTalisman] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

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

    const filteredTalismans = TalismanData.filter(
        (t) =>
            t.name &&
            t.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Initialize with provided data in viewMode
    useEffect(() => {
        if (viewMode && initialTalismans.length > 0) {
            setTalismans(initialTalismans);
        }
    }, [initialTalismans, viewMode]);

    const handleTileClick = (slotIdx) => {
        if (viewMode) return; // Disable clicks in view mode
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
            toast.error("Cannot equip the same talisman twice!");
            return;
        }

        const updated = [...tempTalismans];
        updated[selectedSlot] = talisman;
        setTempTalismans(updated);
        toast.success(`${talisman.name} selected!`);
    };

    const handleRemoveTalisman = () => {
        const updated = [...tempTalismans];
        updated[selectedSlot] = null;
        setTempTalismans(updated);
    };

    const handleSave = () => {
        setTalismans([...tempTalismans]);
        if (onTalismansChange) {
            onTalismansChange([...tempTalismans]);
        }
        setModalOpen(false);
        setSelectedSlot(null);
        toast.success("Talismans saved!");
    };

    return (
        <section className="w-full rounded-xl pt-3 sm:pt-4 mb-4 sm:mb-6">
            <h2
                className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 tracking-wide text-[#e5c77b] drop-shadow px-2 sm:px-0"
                style={{ fontFamily: "serif" }}
            >
                Talismans
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 px-2 sm:px-0">
                {talismans.map((t, i) => (
                    <div
                        key={i}
                        className={`w-full min-h-[120px] sm:min-h-[140px] md:min-h-[160px] p-2 sm:p-3 bg-[#2d2212] border border-[#e5c77b] rounded-lg text-sm shadow transition-all duration-200 ${!viewMode ? 'hover:bg-[#3a2c1a] active:bg-[#4a3c2a] cursor-pointer' : ''} flex flex-col justify-center items-center touch-manipulation`}
                        onClick={!viewMode ? () => handleTileClick(i) : undefined}
                    >
                        {t ? (
                            <div className="flex flex-col items-center text-center">
                                <img
                                    src={`/EldenRingData/images/talismans/${stripImageBaseUrl(t.image)}`}
                                    alt={t.name}
                                    className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 object-contain mb-1 sm:mb-2"
                                    loading="lazy"
                                />
                                <p className="text-[#e5c77b] font-semibold text-xs sm:text-sm md:text-base text-center line-clamp-2 leading-tight mb-1" style={{ fontFamily: "serif" }}>
                                    {t.name}
                                </p>
                                <p className="text-[#c0a857] text-xs text-center line-clamp-2 leading-tight">
                                    {t.effect}
                                </p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center text-center">
                                <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 mb-1 sm:mb-2 bg-[#3a2c1a] rounded-md flex items-center justify-center">
                                    <span className="text-[#c0a857] text-lg sm:text-xl">+</span>
                                </div>
                                <p className="text-[#e5c77b] font-semibold text-xs sm:text-sm text-center" style={{ fontFamily: "serif" }}>
                                    <span className="hidden sm:inline">Empty Talisman Slot {i + 1}</span>
                                    <span className="sm:hidden">Slot {i + 1}</span>
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 overflow-auto p-2 sm:p-4">
                    <div className="bg-[#2d2212] border border-[#c0a857] overflow-hidden rounded-xl p-0 w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl relative mx-2 flex flex-col max-h-[95vh] sm:max-h-[90vh]">
                        {/* Header */}
                        <div className="sticky top-0 z-10 bg-[#2d2212] border-b border-[#c0a857] flex items-center justify-between px-3 sm:px-4 py-2 sm:py-3 min-h-[60px]">
                            <div className="flex-1 text-center">
                                <div className="text-sm sm:text-lg font-semibold text-[#e5c77b] truncate" style={{ fontFamily: "serif" }}>
                                    Select Talisman
                                </div>
                                <div className="text-xs sm:text-sm text-[#c0a857] truncate">
                                    {tempTalismans[selectedSlot]?.name || "None Selected"}
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

                        {/* Search Bar */}
                        <div className="px-3 sm:px-4 py-2 sm:py-3 bg-[#19140e] border-b border-[#c0a857] sticky top-[60px] z-10">
                            <input
                                type="text"
                                placeholder="Search Talismans..."
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="w-full px-3 py-2 sm:py-3 rounded bg-[#2d2212] border border-[#c0a857] text-[#e5c77b] focus:outline-none focus:border-[#e5c77b] text-sm sm:text-base touch-manipulation"
                                autoComplete="off"
                            />
                        </div>

                        {/* Talisman Grid */}
                        <div className="overflow-y-auto p-3 sm:p-4 flex-1">
                            <div className="mb-3 text-[#c0a857] font-semibold text-sm sm:text-base">Talismans</div>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-4">
                                {filteredTalismans.map((talisman) => (
                                    <div
                                        key={talisman.id}
                                        className={`text-center border rounded-lg p-2 sm:p-3 cursor-pointer transition-all duration-200 touch-manipulation
                                            ${tempTalismans[selectedSlot]?.id === talisman.id
                                                ? "border-[#e5c77b] bg-[#3a2c1a] scale-105"
                                                : "border-[#c0a857] bg-[#19140e] hover:bg-[#3a2c1a] active:bg-[#4a3c2a]"
                                            }`}
                                        onClick={() => handleTalismanSelect(talisman)}
                                    >
                                        <img
                                            src={`/EldenRingData/images/talismans/${stripImageBaseUrl(talisman.image)}`}
                                            alt={talisman.name}
                                            className="w-12 h-12 sm:w-16 sm:h-16 md:w-20 md:h-20 object-contain mb-1 sm:mb-2 mx-auto"
                                            loading="lazy"
                                        />
                                        <p className="text-xs sm:text-sm text-[#e5c77b] line-clamp-2 leading-tight mb-1">
                                            {talisman.name}
                                        </p>
                                        <p className="text-xs text-[#c0a857] line-clamp-3 leading-tight">
                                            {talisman.effect}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Remove Button */}
                        {tempTalismans[selectedSlot] && (
                            <div className="sticky bottom-0 bg-[#2d2212] border-t border-[#c0a857] p-3 sm:p-4">
                                <button
                                    className="w-full px-3 py-2 sm:py-3 bg-red-800 text-white rounded font-bold hover:bg-red-900 active:bg-red-700 text-sm sm:text-base transition-colors touch-manipulation"
                                    onClick={handleRemoveTalisman}
                                >
                                    Remove Talisman
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </section>
    );
};
