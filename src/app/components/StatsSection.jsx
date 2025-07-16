import React, { useEffect } from 'react';
import { StatsPanel } from './StatsPanel';
import { hpTable, fpTable, staminaTable, equipLoadTable } from "../../../public/EldenRingData/data/stats"

const StatsSection = ({ equipmentWeight = 0, stats, setStats, viewMode = false }) => {
    // Add useEffect to ensure stats are properly initialized
    useEffect(() => {
        if (stats && Object.keys(stats).length > 0) {
            // Stats are passed directly, no need to transform
            // But we can ensure the component re-renders when stats change
        }
    }, [stats]);

    function calculateHP(vigor) {
        if (vigor < 1) return hpTable[0];
        if (vigor > 99) return hpTable[98];
        return hpTable[Math.floor(vigor) - 1];
    }
    function calculateFP(mind) {
        if (mind < 1) return fpTable[0];
        if (mind > 99) return fpTable[98];
        return fpTable[Math.floor(mind) - 1];
    }
    function calculateStamina(endurance) {
        if (endurance < 1) return staminaTable[0];
        if (endurance > 99) return staminaTable[98];
        return staminaTable[Math.floor(endurance) - 1];
    }
    function calculateEquipLoad(endurance) {
        if (endurance < 1) return equipLoadTable[0];
        if (endurance > 99) return equipLoadTable[98];
        return equipLoadTable[Math.floor(endurance) - 1];
    }

    const getLoadInfo = (load, maxLoad) => {
        const ratio = (load / maxLoad) * 100;
        if (ratio <= 29.9) {
            return {
                status: 'Light Load',
                roll: '13 frames (433ms)',
                recovery: '8 frames (233ms)',
                notes: 'Further roll distance and quicker backstep recovery than Medium Load.',
            };
        } else if (ratio <= 69.9) {
            return {
                status: 'Med. Load',
                roll: '13 frames (433ms)',
                recovery: '8 frames (233ms)',
                notes: 'Same iframes and recoveries as Light Load.',
            };
        } else if (ratio <= 99.9) {
            return {
                status: 'Heavy Load',
                roll: '12 frames (400ms)',
                recovery: '16 frames (533ms)',
                notes: 'Shorter roll distance, longer recovery, -20% stamina regen.',
            };
        } else {
            return {
                status: 'Overloaded',
                roll: '-',
                recovery: '-',
                notes: 'Unable to roll or backstep. Movement is slow.',
            };
        }
    };    const maxLoad = Math.floor(calculateEquipLoad(stats.END));
    const loadInfo = getLoadInfo(equipmentWeight, maxLoad);

    return (
        <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <StatsPanel stats={stats} setStats={setStats} viewMode={viewMode} />
            <div className="bg-[#2d2212] p-4 rounded-xl border border-[#e5c77b]">
                <h2 className="text-xl font-semibold mb-2 text-[#e5c77b]">Basic Stats</h2>
                <p className="mb-1">
                    Level: <span className="text-lime-400">{Object.values(stats).reduce((a, b) => a + b, 1) - 80}</span>
                </p>
                <p className="mb-1">
                    HP: <span className="text-lime-400">{calculateHP(stats.VIG)}</span>
                </p>
                <p className="mb-1">
                    Stamina: <span className="text-lime-400">{calculateStamina(stats.END)}</span>
                </p>
                <p className="mb-1">
                    FP: <span className="text-lime-400">{calculateFP(stats.MIND)}</span>
                </p>                <p className="mb-1">
                    Equip Load: <span className="text-lime-400">{equipmentWeight.toFixed(1)} / {maxLoad}</span> - {loadInfo.status}
                </p>
                <div className="mt-2 text-sm text-[#e5c77b]">
                    <div>Roll I-frames: <span className="text-lime-400">{loadInfo.roll}</span></div>
                    <div>Recovery: <span className="text-lime-400">{loadInfo.recovery}</span></div>
                    <div>{loadInfo.notes}</div>
                </div>
            </div>
        </section>
    );
};

export default StatsSection;
