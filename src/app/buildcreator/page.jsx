'use client';
import React from 'react';
import { EquipmentGrid } from '../components/EquipmentGrid';
import { StatsPanel } from '../components/StatsPanel';
import SpellSelection from '../components/SpellSelection';
import { WeaponSection } from '../components/WeaponSection';
import { Toaster } from 'react-hot-toast';

const BuildCreator = () => {
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

                {/* Equipment and Loadout Grid */}
                <section className="mb-6">
                    <EquipmentGrid />
                </section>

                {/* Required Stats / Current Stats Panel */}
                <section className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <StatsPanel />
                    <div className="bg-[#2d2212] p-4 rounded-xl border border-[#e5c77b]">
                        <h2 className="text-xl font-semibold mb-2 text-[#e5c77b]">Basic Stats</h2>
                        <p className="mb-1">
                            Level: <span className="text-lime-400">1</span>
                        </p>
                        <p className="mb-1">
                            HP: <span className="text-lime-400">600</span>
                        </p>
                        <p className="mb-1">
                            Stamina: <span className="text-lime-400">100</span>
                        </p>
                        <p className="mb-1">
                            FP: <span className="text-lime-400">100</span>
                        </p>
                        <p>
                            Equip Load: <span className="text-lime-400">0 / 50</span> - Light Load
                        </p>
                    </div>
                </section>

                {/* Weapons */}
                <WeaponSection />

                {/* Spells Section */}
                <SpellSelection />
            </div>
        </main>
    );
};

export default BuildCreator;
