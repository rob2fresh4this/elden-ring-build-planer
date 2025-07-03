'use client';
import React, { useState, useEffect } from 'react';
import { EquipmentGrid } from './EquipmentGrid';
import { WeaponSection } from './WeaponSection';
import SpellSelection from './SpellSelection';
import StatsSection from './StatsSection';

// Import data files - INCLUDING DLC DATA
import EldenRingDataArmor from '../../../public/EldenRingData/data/armors.json';
import EldenRingDataArmorDLC from '../../../public/EldenRingData/data/armorDLC.json';
import EldenRingDataTalismans from '../../../public/EldenRingData/data/talismans.json';
import EldenRingDataWeapons from '../../../public/EldenRingData/data/weapons.json';
import EldenRingDataWeaponsDLC from '../../../public/EldenRingData/data/weaponsDLC.json';
import EldenRingDataSorceries from '../../../public/EldenRingData/data/sorceries.json';
import EldenRingDataIncantations from '../../../public/EldenRingData/data/incantations.json';

const BuildDetailedView = ({ buildData, viewMode = true }) => {
    const [transformedEquipment, setTransformedEquipment] = useState({
        HEAD: null,
        CHEST: null,
        HANDS: null,
        LEGS: null
    });
    const [transformedTalismans, setTransformedTalismans] = useState(Array(4).fill(null));
    const [transformedWeapons, setTransformedWeapons] = useState(Array(6).fill(null));
    const [transformedSpells, setTransformedSpells] = useState(Array(12).fill(null));

    // Helper functions to find items by name - UPDATED TO INCLUDE DLC
    const findArmorByName = (name) => {
        if (!name) return null;
        // Search in both base game and DLC armor like EquipmentGrid does
        const baseGameArmor = Array.isArray(EldenRingDataArmor) ? EldenRingDataArmor : [];
        const dlcArmor = Array.isArray(EldenRingDataArmorDLC) ? EldenRingDataArmorDLC : [];
        const allArmor = [...baseGameArmor, ...dlcArmor];
        return allArmor.find(armor => armor.name === name) || null;
    };

    const findTalismanByName = (name) => {
        if (!name) return null;
        return EldenRingDataTalismans.find(talisman => talisman.name === name) || null;
    };

    const findWeaponByName = (name) => {
        if (!name) return null;
        // Search in both base game and DLC weapons like WeaponSection does
        const allWeapons = [...EldenRingDataWeapons, ...EldenRingDataWeaponsDLC];
        return allWeapons.find(weapon => weapon.name === name) || null;
    };

    const findSpellByName = (name) => {
        if (!name) return null;
        // Search in both sorceries and incantations like SpellSelection does
        const allSpells = [
            ...EldenRingDataSorceries.map(s => ({ ...s, type: "Sorcery" })),
            ...EldenRingDataIncantations.map(i => ({ ...i, type: "Incantation" }))
        ];
        return allSpells.find(spell => spell.name === name) || null;
    };

    // Transform build data when component mounts or buildData changes
    useEffect(() => {
        if (!buildData) return;

        // Transform equipment data - matching EquipmentGrid expected format
        const equipment = {
            HEAD: findArmorByName(buildData.equipment.head),
            CHEST: findArmorByName(buildData.equipment.chest),
            HANDS: findArmorByName(buildData.equipment.hands),
            LEGS: findArmorByName(buildData.equipment.legs)
        };
        setTransformedEquipment(equipment);

        // Transform talismans data - array format like original expects
        const talismans = [
            findTalismanByName(buildData.talismans.slot1),
            findTalismanByName(buildData.talismans.slot2),
            findTalismanByName(buildData.talismans.slot3),
            findTalismanByName(buildData.talismans.slot4)
        ];
        setTransformedTalismans(talismans);

        // Transform weapons data - IMPORTANT: WeaponSection expects different props
        const weapons = Object.values(buildData.weapons).map(weaponSlot => {
            if (!weaponSlot || !weaponSlot.name) return null;
            const weaponData = findWeaponByName(weaponSlot.name);
            if (!weaponData) return null;

            return {
                weapon: weaponData,
                infusion: weaponSlot.infusion || null
            };
        });
        setTransformedWeapons(weapons);

        // Transform spells data - array format like SpellSelection expects
        const spells = Object.values(buildData.spells).map(spellName => {
            if (!spellName) return null;
            return findSpellByName(spellName);
        });
        setTransformedSpells(spells);
    }, [buildData]);

    if (!buildData) {
        return (
            <div className="text-center py-8">
                <p className="text-[#c0a857] text-lg">No build data available</p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6">
                {/* Equipment Grid - Fix prop passing to match EquipmentGrid expectations */}
                <EquipmentGrid
                    initialEquipment={transformedEquipment}
                    initialTalismans={transformedTalismans}
                    viewMode={viewMode}
                    onEquipmentChange={() => {}} // Read-only callbacks
                    onTalismansChange={() => {}}
                />

                {/* Stats Section - Use correct prop names from original */}
                <StatsSection
                    equipmentWeight={buildData.totalWeight || 0}
                    stats={buildData.stats}
                    setStats={() => {}} // Read-only callback
                    viewMode={viewMode}
                />

                {/* Weapons Section - Fix prop passing to match WeaponSection expectations */}
                <WeaponSection
                    initialWeapons={transformedWeapons}
                    stats={buildData.stats}
                    viewMode={viewMode}
                    onWeaponsChange={() => {}} // Read-only callback
                />

                {/* Spells Section - Use correct prop names from original */}
                <SpellSelection
                    talismans={transformedTalismans.filter(t => t !== null)}
                    stats={buildData.stats}
                    initialSpells={transformedSpells}
                    viewMode={viewMode}
                    onSpellsChange={() => {}} // Read-only callback
                />
            </div>

            {/* Build Summary */}
            <section className="bg-[#2d2212] p-6 rounded-lg border-2 border-[#e5c77b]">
                <div className="text-center">
                    <p className="text-[#c0a857]">Equipment Load</p>
                    <p className="text-2xl font-bold text-[#e5c77b]">{buildData.totalWeight || 0}kg</p>
                </div>
                <div className="text-center">
                    <p className="text-[#c0a857]">Main Weapon</p>
                    <p className="text-lg font-semibold text-[#e5c77b]">
                        {buildData.weapons?.slot1?.name || 'None'}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-[#c0a857]">Build Date</p>
                    <p className="text-lg font-semibold text-[#e5c77b]">
                        {buildData.timestamp ? new Date(buildData.timestamp).toLocaleDateString() : 'Unknown'}
                    </p>
                </div>
            </section>
        </>
    );
};

export default BuildDetailedView;
