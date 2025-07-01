import React, { useState } from "react";

export const StatsPanel = ({ stats, setStats }) => {
    const [editingStat, setEditingStat] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [showTooltip, setShowTooltip] = useState(null);
    const [tooltipPosition, setTooltipPosition] = useState('top');

    const changeStat = (key, amount) => {
        setStats((prev) => ({
            ...prev,
            [key]: Math.max(1, Math.min(prev[key] + amount, 99)),
        }));
    };

    const resetStats = () => {
        setStats({
            VIG: 10,
            MIND: 10,
            END: 10,
            STR: 10,
            DEX: 10,
            INT: 10,
            FAI: 10,
            ARC: 10
        });
    };

    const handleStatClick = (statKey, currentValue) => {
        setEditingStat(statKey);
        setInputValue(currentValue.toString());
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        // Only allow numbers, max 2 characters
        if (/^\d{0,2}$/.test(value)) {
            setInputValue(value);
        }
    };

    const handleInputSubmit = () => {
        const numValue = parseInt(inputValue);
        if (numValue >= 1 && numValue <= 99) {
            setStats(prev => ({
                ...prev,
                [editingStat]: numValue
            }));
        }
        setEditingStat(null);
        setInputValue('');
    };

    const handleInputCancel = () => {
        setEditingStat(null);
        setInputValue('');
    };

    const getStatTooltip = (statKey) => {
        const tooltips = {
            VIG: "Increases maximum HP, giving you a larger health pool. Also provides minor boosts to fire resistance and immunity.",
            MIND: "Raises FP (Focus Points), used for casting Sorceries, Incantations, Weapon Arts, and using Spirit Ashes.",
            END: "Boosts stamina, enabling more swings, rolls, blocks, and sprints. Also increases equip load for heavier gear and adds modest physical defense.",
            STR: "Improves physical damage and scaling for Strength-based weapons (like greatswords or hammers). Also enables wielding heavier gear and bolsters defense.",
            DEX: "Enhances damage and usability of Dexterity-scaling weapons (katanas, rapiers, bows). Additionally speeds up spell casting, reduces fall damage, and improves mount agility.",
            INT: "Governs Sorcery power and damage, enabling use of Int-scaling spells and gear. Also increases magic resistance.",
            FAI: "Governs Incantation power, boosting healing, buffs, and holy/fire damage. Enables use of Faith-scaling spells and equipment.",
            ARC: "Increases item discovery (drop rates from enemies) and status buildup (e.g. bleed, poison, rot). Also impacts some sorceries, incantations, and holy/magic defense."
        };
        return tooltips[statKey] || "";
    };

    const handleTooltipEnter = (key, event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const spaceAbove = rect.top;
        const spaceBelow = windowHeight - rect.bottom;
        
        // If there's more space below than above, show tooltip below
        const position = spaceBelow > spaceAbove ? 'bottom' : 'top';
        
        setTooltipPosition(position);
        setShowTooltip(key);
    };

    return (
        <div className="bg-[#2d2212] p-4 rounded-xl border border-[#e5c77b] shadow-lg text-[#e5c77b]">
            <div className="flex items-center justify-between mb-4">
                <h2
                    className="text-xl font-semibold text-[#e5c77b] tracking-wider drop-shadow"
                    style={{ fontFamily: "serif" }}
                >
                    Player Stats
                </h2>
                <button
                    onClick={resetStats}
                    className="px-3 py-1 bg-red-600 text-white rounded font-bold hover:bg-red-700 text-sm"
                >
                    Reset
                </button>
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 text-base">
                {Object.entries(stats).map(([key, val]) => (
                    <div
                        key={key}
                        className="relative flex items-center justify-between bg-[#3b2f1a] px-3 py-2 rounded-md"
                        onMouseEnter={(e) => handleTooltipEnter(key, e)}
                        onMouseLeave={() => setShowTooltip(null)}
                    >
                        <span className="text-[#c0a857] font-semibold w-10" style={{ fontFamily: "serif" }}>{key}</span>
                        <div className="flex items-center gap-1">
                            <button
                                className="bg-[#2d2212] px-1 py-1 rounded font-bold"
                                onClick={() => changeStat(key, -5)}
                                disabled={val <= 1}
                            >
                                {`<<`}
                            </button>
                            <button
                                className="bg-[#2d2212] px-1 py-1 rounded font-bold"
                                onClick={() => changeStat(key, -1)}
                                disabled={val <= 1}
                            >
                                {`<`}
                            </button>
                            {editingStat === key ? (
                                <div className="flex items-center gap-1">
                                    <input
                                        type="text"
                                        value={inputValue}
                                        onChange={handleInputChange}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') handleInputSubmit();
                                            if (e.key === 'Escape') handleInputCancel();
                                        }}
                                        onBlur={handleInputCancel}
                                        className="w-12 px-1 py-[2px] text-center bg-[#2d2212] border border-[#e5c77b] text-[#e5c77b] rounded text-sm font-mono shadow-sm focus:outline-none focus:ring-1 focus:ring-[#e5c77b]"
                                        autoFocus
                                        maxLength={2}
                                    />
                                    <button
                                        onClick={handleInputSubmit}
                                        className="w-6 h-6 flex items-center justify-center rounded-sm border border-green-500 text-green-500 hover:bg-green-600 hover:text-white transition-all duration-150 text-sm"
                                        title="Confirm"
                                    >
                                        ✓
                                    </button>
                                </div>

                            ) : (
                                <span
                                    className="text-[#e5c77b] px-3 w-6 text-center flex justify-center font-mono mr-1 cursor-pointer hover:text-[#f1d862]"
                                    onClick={() => handleStatClick(key, val)}
                                >
                                    {val}
                                </span>
                            )}
                            <button
                                className="bg-[#2d2212] px-1 py-1 rounded font-bold"
                                onClick={() => changeStat(key, 1)}
                                disabled={val >= 99}
                            >
                                {`>`}
                            </button>
                            <button
                                className="bg-[#2d2212] px-1 py-1 rounded font-bold"
                                onClick={() => changeStat(key, 5)}
                                disabled={val >= 99}
                            >
                                {`>>`}
                            </button>
                        </div>

                        {showTooltip === key && (
                            <div className={`absolute z-50 ${
                                tooltipPosition === 'top' 
                                    ? 'bottom-full mb-2' 
                                    : 'top-full mt-2'
                            } left-1/2 transform -translate-x-1/2 px-3 py-2 bg-[#1a1611] border border-[#c0a857] rounded-lg shadow-lg text-sm text-[#e5c77b] whitespace-normal max-w-xs`}>
                                {getStatTooltip(key)}
                                <div className={`absolute ${
                                    tooltipPosition === 'top'
                                        ? 'top-full border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#c0a857]'
                                        : 'bottom-full border-l-4 border-r-4 border-b-4 border-l-transparent border-r-transparent border-b-[#c0a857]'
                                } left-1/2 transform -translate-x-1/2 w-0 h-0`}></div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};