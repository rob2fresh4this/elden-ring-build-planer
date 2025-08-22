'use client';
import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EquipmentGrid } from '../components/EquipmentGrid';
import SpellSelection from '../components/SpellSelection';
import { WeaponSection } from '../components/WeaponSection';
import toast, { Toaster } from 'react-hot-toast';
import StatsSection from '../components/StatsSection';
import SaveBuildModal from '../components/SaveBuildModal';
// Add import for local storage utility
import { saveBuildToLocal } from '../../../utils/localstorage';

// Import data files for transformation
import EldenRingDataArmor from '../../../public/EldenRingData/data/armors.json';
import EldenRingDataArmorDLC from '../../../public/EldenRingData/data/armorDLC.json';
import EldenRingDataTalismans from '../../../public/EldenRingData/data/talismans.json';
import EldenRingDataWeapons from '../../../public/EldenRingData/data/weapons.json';
import EldenRingDataWeaponsDLC from '../../../public/EldenRingData/data/weaponsDLC.json';
import EldenRingDataSorceries from '../../../public/EldenRingData/data/sorceries.json';
import EldenRingDataIncantations from '../../../public/EldenRingData/data/incantations.json';

const BuildCreator = () => {
    const router = useRouter();
    const [isEditMode, setIsEditMode] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);

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
    const [buildMetadata, setBuildMetadata] = useState({
        buildName: '',
        buildType: '',
        description: '',
        favoriteWeapon: ''
    });

    const totalWeight = equipmentWeight + weaponWeight;

    // Get equipped weapons for favorite weapon dropdown
    const equippedWeapons = useMemo(() => {
        return weapons
            .filter(weapon => weapon && weapon.weapon)
            .map(weapon => ({
                name: weapon.weapon.name,
                infusion: weapon.infusion
            }));
    }, [weapons]);

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
        // Build metadata from modal
        buildName: buildMetadata.buildName,
        buildType: buildMetadata.buildType,
        description: buildMetadata.description,
        favoriteWeapon: buildMetadata.favoriteWeapon,
        
        // Existing build data
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
    }), [equipment, talismans, stats, weapons, spells, totalWeight, buildMetadata]);

    // Updated save function to open modal first
    const saveBuild = useCallback(async () => {
        setIsSaveModalOpen(true);
    }, []);

    // Actual save function called from modal
    const handleSaveFromModal = useCallback(async (modalData) => {
        if (isLoading) return;

        setIsLoading(true);
        setBuildMetadata(modalData);

        try {
            // Create final build data with modal information
            const finalBuildData = {
                ...buildData,
                ...modalData,
                timestamp: new Date().toISOString()
            };

            // Simulate async operation (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 100));

            // Save to local storage (temporary)
            saveBuildToLocal(finalBuildData);

            // console.log(JSON.stringify(finalBuildData, null, 2));
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

    // Helper functions to find items by name
    const findArmorByName = (name) => {
        if (!name) return null;
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
        const allWeapons = [...EldenRingDataWeapons, ...EldenRingDataWeaponsDLC];
        return allWeapons.find(weapon => weapon.name === name) || null;
    };

    const findSpellByName = (name) => {
        if (!name) return null;
        const allSpells = [
            ...EldenRingDataSorceries.map(s => ({ ...s, type: "Sorcery" })),
            ...EldenRingDataIncantations.map(i => ({ ...i, type: "Incantation" }))
        ];
        return allSpells.find(spell => spell.name === name) || null;
    };

    // Load build data if in edit mode - MOVE THIS BEFORE OTHER USEEFFECTS
    useEffect(() => {
        if (isEditMode && isClient) {
            const editBuildData = localStorage.getItem('editBuildData');
            if (editBuildData) {
                try {
                    const buildData = JSON.parse(editBuildData);
                    console.log('Loading build data for editing:', buildData);

                    // Load build metadata
                    setBuildMetadata({
                        buildName: buildData.buildName || '',
                        buildType: buildData.buildType || '',
                        description: buildData.description || '',
                        favoriteWeapon: buildData.favoriteWeapon || ''
                    });

                    // Load stats FIRST
                    if (buildData.stats) {
                        setStats(buildData.stats);
                    }

                    // Load equipment with full data objects
                    const transformedEquipment = {
                        HEAD: findArmorByName(buildData.equipment?.head),
                        CHEST: findArmorByName(buildData.equipment?.chest),
                        HANDS: findArmorByName(buildData.equipment?.hands),
                        LEGS: findArmorByName(buildData.equipment?.legs)
                    };
                    
                    // Use setTimeout to ensure state updates happen in next tick
                    setTimeout(() => {
                        setEquipment(transformedEquipment);
                        
                        // Calculate equipment weight
                        const armorWeight = Object.values(transformedEquipment).reduce((total, item) => {
                            return total + (item?.weight || 0);
                        }, 0);
                        setEquipmentWeight(armorWeight);

                        // Load talismans with full data objects
                        const transformedTalismans = [
                            findTalismanByName(buildData.talismans?.slot1),
                            findTalismanByName(buildData.talismans?.slot2),
                            findTalismanByName(buildData.talismans?.slot3),
                            findTalismanByName(buildData.talismans?.slot4)
                        ];
                        setTalismans(transformedTalismans);

                        // Load weapons with full data objects
                        const transformedWeapons = Object.values(buildData.weapons || {}).map(weaponSlot => {
                            if (!weaponSlot?.name) return null;
                            const weaponData = findWeaponByName(weaponSlot.name);
                            if (!weaponData) return null;
                            
                            return {
                                weapon: weaponData,
                                infusion: weaponSlot.infusion || null
                            };
                        });
                        
                        // Ensure we have exactly 6 slots
                        while (transformedWeapons.length < 6) {
                            transformedWeapons.push(null);
                        }
                        setWeapons(transformedWeapons);

                        // Calculate weapon weight
                        const weaponsWeight = transformedWeapons.reduce((total, slot) => {
                            const weapon = slot?.weapon;
                            return total + (weapon?.weight || 0);
                        }, 0);
                        setWeaponWeight(weaponsWeight);

                        // Load spells with full data objects
                        const spellNames = Object.values(buildData.spells || {});
                        const transformedSpells = [];
                        
                        // Process up to 12 spell slots
                        for (let i = 0; i < 12; i++) {
                            const spellName = spellNames[i];
                            if (spellName) {
                                const spellData = findSpellByName(spellName);
                                transformedSpells.push(spellData);
                            } else {
                                transformedSpells.push(null);
                            }
                        }
                        setSpells(transformedSpells);

                        toast.success('Build loaded for editing!');
                    }, 100);

                    // Clear localStorage after loading
                    localStorage.removeItem('editBuildData');
                    
                } catch (error) {
                    console.error('Error loading build data:', error);
                    toast.error('Failed to load build data');
                    localStorage.removeItem('editBuildData');
                }
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
            <SaveBuildModal 
                isOpen={isSaveModalOpen} 
                setIsOpen={setIsSaveModalOpen}
                onSave={handleSaveFromModal}
                equippedWeapons={equippedWeapons}
                initialData={buildMetadata}
            />

            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 lg:gap-0 max-w-screen-xl mx-auto px-4">
                    <div className="flex-1">
                        <h1
                            className="text-3xl sm:text-4xl font-bold mb-2 sm:mb-4 tracking-wider text-[#e5c77b] drop-shadow-lg"
                            style={{ fontFamily: 'serif' }}
                        >
                            {isEditMode ? 'Edit Build' : 'Elden Ring Build Planner'}
                        </h1>
                        <p className="text-[#c0a857] text-base sm:text-lg tracking-wide leading-snug">
                            {isEditMode
                                ? 'Modify your existing build below.'
                                : 'Strategize like a true Tarnished. Manage your Elden Ring builds below.'}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors duration-200"
                        >
                            Back to Dashboard
                        </button>

                        <button
                            onClick={saveBuild}
                            disabled={isLoading}
                            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 shadow-lg ${isLoading
                                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                                    : 'bg-[#e5c77b] text-[#19140e] hover:bg-[#c0a857] hover:scale-105'
                                }`}
                        >
                            {isLoading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                        <circle
                                            className="opacity-25"
                                            cx="12"
                                            cy="12"
                                            r="10"
                                            stroke="currentColor"
                                            strokeWidth="4"
                                            fill="none"
                                        />
                                        <path
                                            className="opacity-75"
                                            fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                        />
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
                    <EquipmentGrid 
                        onEquipmentChange={handleEquipmentChange} 
                        onTalismansChange={handleTalismansChange}
                        initialEquipment={equipment}
                        initialTalismans={talismans}
                    />
                </section>

                {/* Required Stats / Current Stats Panel */}
                <StatsSection equipmentWeight={totalWeight} stats={stats} setStats={setStats} />

                {/* Weapons */}
                <WeaponSection 
                    onWeaponsChange={handleWeaponsChange} 
                    stats={stats}
                    initialWeapons={weapons}
                />

                {/* Spells Section */}
                <SpellSelection 
                    talismans={talismans} 
                    stats={stats} 
                    onSpellsChange={handleSpellsChange}
                    initialSpells={spells}
                />
            </div>
        </main>
    );
};

export default BuildCreator;
