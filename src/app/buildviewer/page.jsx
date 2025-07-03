'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { EquipmentGrid } from '../components/EquipmentGrid';
import SpellSelection from '../components/SpellSelection';
import { WeaponSection } from '../components/WeaponSection';
import StatsSection from '../components/StatsSection';
import tempPlayerBuild from '../components/tempplayerbuild.json';
// Import data files to find full object data
import WeaponData from '../../../public/EldenRingData/data/weapons.json';
import WeaponDataDLC from '../../../public/EldenRingData/data/weaponsDLC.json';
import TalismanData from '../../../public/EldenRingData/data/talismans.json';
import ArmorData from '../../../public/EldenRingData/data/armors.json';
import ArmorDataDLC from '../../../public/EldenRingData/data/armorDLC.json';
import SorceriesData from '../../../public/EldenRingData/data/sorceries.json';
import IncantationsData from '../../../public/EldenRingData/data/incantations.json';

const BuildViewer = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const buildIndex = searchParams.get('build');

    const [buildData, setBuildData] = useState(null);
    const [isSimplifiedMode, setIsSimplifiedMode] = useState(false);

    // Helper functions to find full object data
    const findWeaponByName = (name) => {
        if (!name) return null;
        const allWeapons = [...WeaponData, ...WeaponDataDLC];
        return allWeapons.find(weapon => weapon.name === name);
    };

    const findTalismanByName = (name) => {
        if (!name) return null;
        return TalismanData.find(talisman => talisman.name === name);
    };

    const findArmorByName = (name) => {
        if (!name) return null;
        const allArmor = [...ArmorData, ...ArmorDataDLC];
        return allArmor.find(armor => armor.name === name);
    };

    const findSpellByName = (name) => {
        if (!name) return null;
        const allSpells = [
            ...SorceriesData.map(s => ({ ...s, type: "Sorcery" })),
            ...IncantationsData.map(i => ({ ...i, type: "Incantation" }))
        ];
        return allSpells.find(spell => spell.name === name);
    };

    useEffect(() => {
        if (buildIndex !== null && tempPlayerBuild.builds[buildIndex]) {
            const build = tempPlayerBuild.builds[buildIndex];
            setBuildData(build);
        }
    }, [buildIndex]);

    if (!buildData) {
        return (
            <main className="min-h-screen p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b]">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-4xl font-bold mb-4 tracking-wider text-[#e5c77b] drop-shadow-lg" style={{ fontFamily: 'serif' }}>
                        Build Not Found
                    </h1>
                </div>
            </main>
        );
    }

    // Calculate total level
    const totalLevel = Object.values(buildData.stats).reduce((sum, stat) => sum + stat, 0) - 80;

    // Transform equipment data to match EquipmentGrid format with full object data
    const transformedEquipment = {
        HEAD: findArmorByName(buildData.equipment.head),
        CHEST: findArmorByName(buildData.equipment.chest),
        HANDS: findArmorByName(buildData.equipment.hands),
        LEGS: findArmorByName(buildData.equipment.legs)
    };

    // Transform talismans data with full object data
    const transformedTalismans = [
        findTalismanByName(buildData.talismans.slot1),
        findTalismanByName(buildData.talismans.slot2),
        findTalismanByName(buildData.talismans.slot3),
        findTalismanByName(buildData.talismans.slot4)
    ];

    // Transform weapons data with full object data
    const transformedWeapons = Object.values(buildData.weapons).map(weaponSlot => {
        if (!weaponSlot.name) return null;
        const weaponData = findWeaponByName(weaponSlot.name);
        if (!weaponData) return null;

        return {
            weapon: weaponData,
            infusion: weaponSlot.infusion
        };
    });

    // Transform spells data with full object data
    const transformedSpells = Object.values(buildData.spells).map(spellName => {
        if (!spellName) return null;
        return findSpellByName(spellName);
    });

    const handleEditBuild = () => {
        // Store the build data for editing
        localStorage.setItem('editBuildData', JSON.stringify(buildData));
        router.push('/buildcreator?edit=true');
    };

    return (
        <main className="min-h-screen p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b]">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold mb-4 tracking-wider text-[#e5c77b] drop-shadow-lg" style={{ fontFamily: 'serif' }}>
                            {tempPlayerBuild.username}'s Build
                        </h1>
                        <p className="text-[#c0a857] text-lg tracking-wide">
                            Level {totalLevel} | Equipment Load: {buildData.totalWeight}kg | View Mode
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setIsSimplifiedMode(!isSimplifiedMode)}
                            className={`px-6 py-3 rounded-lg font-semibold transition-colors duration-200 ${isSimplifiedMode
                                    ? 'bg-[#c0a857] text-[#19140e] hover:bg-[#a08f47]'
                                    : 'bg-[#3a2c1a] text-[#e5c77b] hover:bg-[#4a3c2a] border border-[#c0a857]'
                                }`}
                        >
                            {isSimplifiedMode ? 'Detailed View' : 'Simplified View'}
                        </button>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors duration-200"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={handleEditBuild}
                            disabled
                            className="px-6 py-3 rounded-lg bg-[#e5c77b] text-[#19140e] font-semibold hover:bg-[#c0a857] transition-colors duration-200"
                        >
                            Edit This Build
                        </button>
                    </div>
                </div>

                {isSimplifiedMode && (
                    // Build Overview Display - Always Shown
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Stats Card */}
                <div className="bg-[#2d2212] p-6 rounded-lg border-2 border-[#e5c77b]/20">
                    <h3 className="text-xl font-bold mb-4 text-[#e5c77b]">Stats</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries(buildData.stats).map(([stat, value]) => (
                            <div key={stat} className="flex justify-between">
                                <span className="text-[#c0a857]">{stat}:</span>
                                <span className="text-[#e5c77b] font-semibold">{value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Equipment Card */}
                <div className="bg-[#2d2212] p-6 rounded-lg border-2 border-[#e5c77b]/20">
                    <h3 className="text-xl font-bold mb-4 text-[#e5c77b]">Equipment</h3>
                    <div className="space-y-2">
                        {Object.entries(buildData.equipment).map(([slot, item]) => (
                            <div key={slot} className="flex justify-between">
                                <span className="text-[#c0a857] capitalize">{slot}:</span>
                                <span className="text-[#e5c77b] font-semibold">{item || 'None'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Talismans Card */}
                <div className="bg-[#2d2212] p-6 rounded-lg border-2 border-[#e5c77b]/20">
                    <h3 className="text-xl font-bold mb-4 text-[#e5c77b]">Talismans</h3>
                    <div className="space-y-2">
                        {Object.entries(buildData.talismans).map(([slot, talisman]) => (
                            <div key={slot} className="flex justify-between">
                                <span className="text-[#c0a857]">{slot}:</span>
                                <span className="text-[#e5c77b] font-semibold">{talisman || 'None'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Weapons Card */}
                <div className="bg-[#2d2212] p-6 rounded-lg border-2 border-[#e5c77b]/20">
                    <h3 className="text-xl font-bold mb-4 text-[#e5c77b]">Weapons</h3>
                    <div className="space-y-2">
                        {Object.entries(buildData.weapons).map(([slot, weapon]) => (
                            <div key={slot} className="flex justify-between">
                                <span className="text-[#c0a857]">{slot}:</span>
                                <span className="text-[#e5c77b] font-semibold">
                                    {weapon.name ? `${weapon.name}${weapon.infusion ? ` (${weapon.infusion})` : ''}` : 'None'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Spells Card */}
                <div className="bg-[#2d2212] p-6 rounded-lg border-2 border-[#e5c77b]/20 md:col-span-2">
                    <h3 className="text-xl font-bold mb-4 text-[#e5c77b]">Spells</h3>
                    <div className="grid grid-cols-2 gap-2">
                        {Object.entries(buildData.spells).map(([slot, spell]) => (
                            <div key={slot} className="flex justify-between">
                                <span className="text-[#c0a857]">{slot}:</span>
                                <span className="text-[#e5c77b] font-semibold">{spell || 'None'}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            )

                }

            {/* Detailed Components - Only shown when NOT in simplified mode */}
            {!isSimplifiedMode && (
                <div className="space-y-6">
                    <EquipmentGrid
                        initialEquipment={transformedEquipment}
                        initialTalismans={transformedTalismans}
                        viewMode={true}
                        onEquipmentChange={() => { }}
                        onTalismansChange={() => { }}
                    />

                    <StatsSection
                        equipmentWeight={buildData.totalWeight}
                        stats={buildData.stats}
                        setStats={() => { }}
                        viewMode={true}
                    />

                    <WeaponSection
                        initialWeapons={transformedWeapons}
                        stats={buildData.stats}
                        viewMode={true}
                        onWeaponsChange={() => { }}
                    />

                    <SpellSelection
                        initialSpells={transformedSpells}
                        talismans={transformedTalismans.filter(t => t)}
                        stats={buildData.stats}
                        viewMode={true}
                        onSpellsChange={() => { }}
                    />
                </div>
            )}

            {/* Simplified Mode Message */}
            {isSimplifiedMode && (
                <div className="text-center py-8">
                    <p className="text-[#c0a857] text-lg">
                        Simplified view active. Click "Detailed View" to see equipment grids and weapon details.
                    </p>
                </div>
            )}
        </div>
        </main >
    );
};

export default BuildViewer;
