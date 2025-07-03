'use client';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EquipmentGrid } from '../components/EquipmentGrid';
import SpellSelection from '../components/SpellSelection';
import { WeaponSection } from '../components/WeaponSection';
import toast, { Toaster } from 'react-hot-toast';
import StatsSection from '../components/StatsSection';

const BuildCreator = () => {
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isClient, setIsClient] = useState(false);
    
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
    const [isLoading, setIsLoading] = useState(false);
    
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

    // Memoize build data creation to improve performance
    const buildData = useMemo(() => ({
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
    }), [equipment, talismans, stats, weapons, spells, totalWeight]);

    // Debounced save function
    const saveBuild = useCallback(async () => {
        if (isLoading) return;
        
        setIsLoading(true);
        
        try {
            // Simulate async operation (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 100));
            
            console.log('=== COMPLETE BUILD DATA ===');
            console.log(JSON.stringify(buildData, null, 2));
            toast.success('Build saved successfully!');
        } catch (error) {
            toast.error('Failed to save build');
        } finally {
            setIsLoading(false);
        }
    }, [buildData, isLoading]);

    // Client-side only search params handling
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            setIsEditMode(urlParams.get('edit') === 'true');
        }
    }, []);

    // Load build data if in edit mode
    useEffect(() => {
        if (isEditMode && isClient) {
            const editBuildData = localStorage.getItem('editBuildData');
            if (editBuildData) {
                const buildData = JSON.parse(editBuildData);
                
                // Load stats
                setStats(buildData.stats);
                
                // Load equipment
                const transformedEquipment = {
                    HEAD: buildData.equipment.head ? { name: buildData.equipment.head } : null,
                    CHEST: buildData.equipment.chest ? { name: buildData.equipment.chest } : null,
                    HANDS: buildData.equipment.hands ? { name: buildData.equipment.hands } : null,
                    LEGS: buildData.equipment.legs ? { name: buildData.equipment.legs } : null
                };
                setEquipment(transformedEquipment);
                
                // Load talismans
                const transformedTalismans = [
                    buildData.talismans.slot1 ? { name: buildData.talismans.slot1 } : null,
                    buildData.talismans.slot2 ? { name: buildData.talismans.slot2 } : null,
                    buildData.talismans.slot3 ? { name: buildData.talismans.slot3 } : null,
                    buildData.talismans.slot4 ? { name: buildData.talismans.slot4 } : null
                ];
                setTalismans(transformedTalismans);
                
                // Load weapons
                const transformedWeapons = Object.values(buildData.weapons).map(weapon => {
                    if (!weapon.name) return null;
                    return {
                        weapon: { name: weapon.name },
                        infusion: weapon.infusion
                    };
                });
                setWeapons(transformedWeapons);
                
                // Load spells
                const transformedSpells = Object.values(buildData.spells).map(spellName => {
                    if (!spellName) return null;
                    return { name: spellName };
                });
                setSpells(transformedSpells);
                
                // Set weights
                setEquipmentWeight(buildData.totalWeight || 0);
                
                // Clear localStorage after loading
                localStorage.removeItem('editBuildData');
            }
        }
    }, [isEditMode, isClient]);

    // Show loading state until client-side hydration
    if (!isClient) {
        return (
            <div className="min-h-screen p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e5c77b] mx-auto mb-4"></div>
                    <p className="text-xl">Loading Build Creator...</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b]">
            <Toaster position="top-left" />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1
                            className="text-4xl font-bold mb-4 tracking-wider text-[#e5c77b] drop-shadow-lg"
                            style={{ fontFamily: 'serif' }}
                        >
                            {isEditMode ? 'Edit Build' : 'Elden Ring Build Planner'}
                        </h1>
                        <p className="text-[#c0a857] text-lg tracking-wide">
                            {isEditMode ? 'Modify your existing build below.' : 'Strategize like a true Tarnished. Manage your Elden Ring builds below.'}
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="px-6 py-3 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors duration-200"
                        >
                            Back to Dashboard
                        </button>
                        <button
                            onClick={saveBuild}
                            disabled={isLoading}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg ${
                                isLoading 
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                                    : 'bg-[#e5c77b] text-[#19140e] hover:bg-[#c0a857] hover:scale-105'
                            }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Saving...
                                </span>
                            ) : (
                                'Save Build'
                            )}
                        </button>
                    </div>
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
