'use client';
import React from 'react';
import { EquipmentGrid } from '../components/EquipmentGrid';
import { StatsPanel } from '../components/StatsPanel';
import { WeaponCard } from '../components/WeaponCard';

const BuildCreator = () => {
    return (
        <main className="min-h-screen p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b]">
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
                        <h2 className="text-xl font-semibold mb-2 text-[#e5c77b]">Equip Load</h2>
                        <p>
                            Equip Load: <span className="text-lime-400">0 / 50</span> - Light Load
                        </p>
                    </div>
                </section>

                {/* Weapon Cards */}
                <div>
                    <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <WeaponCard index={1} />
                        <WeaponCard index={2} />
                        <WeaponCard index={3} />
                    </section>
                    <section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <WeaponCard index={1} />
                        <WeaponCard index={2} />
                        <WeaponCard index={3} />
                    </section>
                </div>

                {/* Spells Section */}
                <section className="mb-6 bg-[#2d2212] p-4 rounded-xl border border-[#c0a857]">
                    <h2 className="text-xl font-semibold mb-2 text-violet-300">Spells</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="bg-[#3a2c1a] border border-[#c0a857] p-2 rounded-md text-sm"
                            >
                                <p className="text-[#c0a857]">Spell {i + 1}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </main>
    );
};

export default BuildCreator;
