'use client';
import React, { useState } from 'react';
import { EquipmentGrid } from '../components/EquipmentGrid';
import SpellSelection from '../components/SpellSelection';
import { WeaponSection } from '../components/WeaponSection';
import toast, { Toaster } from 'react-hot-toast';
import StatsSection from '../components/StatsSection';

const BuildCreator = () => {
    const [equipmentWeight, setEquipmentWeight] = useState(0);
    const [weaponWeight, setWeaponWeight] = useState(0);
    const [talismans, setTalismans] = useState(Array(4).fill(null));
    const [equipment, setEquipment] = useState({
        HEAD: null,
        CHEST: null,
        HANDS: null,
        LEGS: null
    });
    const [weapons, setWeapons] = useState(Array(6).fill(null));
    const [spells, setSpells] = useState(Array(12).fill(null));
    const [stats, setStats] = useState({
        VIG: 10,
        MIND: 10,
        END: 10,
        STR: 10,
        DEX: 10,
        INT: 10,
        FAI: 10,
        ARC: 10,
    });
    
    const totalWeight = equipmentWeight + weaponWeight;

    const handleEquipmentChange = (totalArmorWeight, equipmentData) => {
        setEquipmentWeight(totalArmorWeight);
        if (equipmentData) {
            setEquipment(equipmentData);
        }
    };

    const handleWeaponsChange = (totalWeaponWeight, weaponsData) => {
        setWeaponWeight(totalWeaponWeight);
        if (weaponsData) {
            setWeapons(weaponsData);
        }
    };

    const handleTalismansChange = (newTalismans) => {
        setTalismans(newTalismans);
    };

    const handleSpellsChange = (spellsData) => {
        setSpells(spellsData);
    };

    const saveBuild = () => {
        // Debug weapons array structure
        console.log('=== WEAPONS ARRAY DEBUG ===');
        console.log('weapons:', weapons);
        weapons.forEach((weapon, index) => {
            console.log(`weapon[${index}]:`, weapon);
        });
        
        const buildData = {
            equipment: {
                head: equipment.HEAD?.name || null,
                chest: equipment.CHEST?.name || null,
                hands: equipment.HANDS?.name || null,
                legs: equipment.LEGS?.name || null
            },
            talismans: {
                slot1: talismans[0]?.name || null,
                slot2: talismans[1]?.name || null,
                slot3: talismans[2]?.name || null,
                slot4: talismans[3]?.name || null
            },
            stats: stats,
            weapons: {
                slot1: weapons[0] ? { name: weapons[0].weapon?.name || weapons[0].name || null, infusion: weapons[0]?.infusion || null } : { name: null, infusion: null },
                slot2: weapons[1] ? { name: weapons[1].weapon?.name || weapons[1].name || null, infusion: weapons[1]?.infusion || null } : { name: null, infusion: null },
                slot3: weapons[2] ? { name: weapons[2].weapon?.name || weapons[2].name || null, infusion: weapons[2]?.infusion || null } : { name: null, infusion: null },
                slot4: weapons[3] ? { name: weapons[3].weapon?.name || weapons[3].name || null, infusion: weapons[3]?.infusion || null } : { name: null, infusion: null },
                slot5: weapons[4] ? { name: weapons[4].weapon?.name || weapons[4].name || null, infusion: weapons[4]?.infusion || null } : { name: null, infusion: null },
                slot6: weapons[5] ? { name: weapons[5].weapon?.name || weapons[5].name || null, infusion: weapons[5]?.infusion || null } : { name: null, infusion: null }
            },
            spells: spells.reduce((acc, spell, index) => {
                acc[`slot${index + 1}`] = spell?.name || null;
                return acc;
            }, {}),
            totalWeight: totalWeight,
            timestamp: new Date().toISOString()
        };

        console.log('=== COMPLETE BUILD DATA ===');
        console.log(JSON.stringify(buildData, null, 2));
        toast.success('Build saved successfully!');
    };

    return (
        <main className="min-h-screen p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b]">
            {/* ✅ Toaster should be here once */}
            <Toaster position="top-left" />

            <div className="max-w-6xl mx-auto">
                <h1
                    className="text-4xl font-bold mb-4 tracking-wider text-[#e5c77b] drop-shadow-lg"
                    style={{ fontFamily: 'serif' }}
                >
                    Elden Ring Build Planner
                </h1>
                <p className="text-[#c0a857] mb-8 text-lg tracking-wide">
                    Strategize like a true Tarnished. Manage your Elden Ring builds below.
                </p>

                {/* Save Button */}
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={saveBuild}
                        className="bg-[#e5c77b] text-[#19140e] px-6 py-3 rounded-lg font-semibold hover:bg-[#c0a857] transition-colors duration-200 shadow-lg"
                    >
                        Save Build
                    </button>
                </div>

                {/* Equipment and Loadout Grid */}
                <section className="mb-6">
                    <EquipmentGrid onEquipmentChange={handleEquipmentChange} onTalismansChange={handleTalismansChange} />
                </section>                {/* Required Stats / Current Stats Panel */}
                <StatsSection equipmentWeight={totalWeight} stats={stats} setStats={setStats} />

                {/* Weapons */}
                <WeaponSection onWeaponsChange={handleWeaponsChange} stats={stats} />

                {/* Spells Section */}
                <SpellSelection talismans={talismans} stats={stats} onSpellsChange={handleSpellsChange} />
            </div>
        </main>
    );
};

export default BuildCreator;
