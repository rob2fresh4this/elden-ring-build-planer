'use client';
import React, { useState } from 'react';
import { EquipmentGrid } from '../components/EquipmentGrid';
import SpellSelection from '../components/SpellSelection';
import { WeaponSection } from '../components/WeaponSection';
import { Toaster } from 'react-hot-toast';
import StatsSection from '../components/StatsSection';

const BuildCreator = () => {
    const [equipmentWeight, setEquipmentWeight] = useState(0);
    const [weaponWeight, setWeaponWeight] = useState(0);
    
    const totalWeight = equipmentWeight + weaponWeight;

    const handleEquipmentChange = (totalArmorWeight) => {
        setEquipmentWeight(totalArmorWeight);
    };

    const handleWeaponsChange = (totalWeaponWeight) => {
        setWeaponWeight(totalWeaponWeight);
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
                </p>                {/* Equipment and Loadout Grid */}
                <section className="mb-6">
                    <EquipmentGrid onEquipmentChange={handleEquipmentChange} />
                </section>                {/* Required Stats / Current Stats Panel */}
                <StatsSection equipmentWeight={totalWeight} />

                {/* Weapons */}
                <WeaponSection onWeaponsChange={handleWeaponsChange} />

                {/* Spells Section */}
                <SpellSelection />
            </div>
        </main>
    );
};

export default BuildCreator;
