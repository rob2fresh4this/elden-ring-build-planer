'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import tempPlayerBuild from '../components/tempplayerbuild.json';
import BuildDetailedView from '../components/BuildDetailedView';

const BuildViewer = () => {
    const router = useRouter();
    const [playerIndex, setPlayerIndex] = useState(null);
    const [buildIndex, setBuildIndex] = useState(null);
    const [isClient, setIsClient] = useState(false);
    const [buildData, setBuildData] = useState(null);
    const [playerName, setPlayerName] = useState('');
    const [isSimplifiedMode, setIsSimplifiedMode] = useState(true);

    // Client-side only search params handling
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const urlParams = new URLSearchParams(window.location.search);
            const pIndex = urlParams.get('player');
            const bIndex = urlParams.get('build');
            setPlayerIndex(pIndex);
            setBuildIndex(bIndex);

            if (pIndex !== null && bIndex !== null &&
                tempPlayerBuild.players[pIndex] &&
                tempPlayerBuild.players[pIndex].builds[bIndex]) {
                const player = tempPlayerBuild.players[pIndex];
                const build = player.builds[bIndex];
                setBuildData(build);
                setPlayerName(player.username);
            }
        }
    }, []);

    // Show loading state until client-side hydration
    if (!isClient) {
        return (
            <div className="min-h-screen p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#e5c77b] mx-auto mb-4"></div>
                    <p className="text-xl">Loading Build Viewer...</p>
                </div>
            </div>
        );
    }

    if (!buildData) {
        return (
            <div className="min-h-screen p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b] flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl mb-4">Build Not Found</h1>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="px-6 py-3 rounded-lg bg-[#e5c77b] text-[#19140e] font-semibold hover:bg-[#c0a857] transition-colors duration-200"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    // Calculate total level
    const totalLevel = buildData ? Object.values(buildData.stats).reduce((sum, stat) => sum + stat, 0) - 80 : 0;

    const handleEditBuild = () => {
        // Transform the build data to match BuildCreator's expected format
        const transformedBuildData = {
            stats: buildData.stats,
            equipment: {
                head: buildData.equipment.head || null,
                chest: buildData.equipment.chest || null,
                hands: buildData.equipment.hands || null,
                legs: buildData.equipment.legs || null
            },
            talismans: {
                slot1: buildData.talismans.slot1 || null,
                slot2: buildData.talismans.slot2 || null,
                slot3: buildData.talismans.slot3 || null,
                slot4: buildData.talismans.slot4 || null
            },
            weapons: buildData.weapons || {
                slot1: { name: null, infusion: null },
                slot2: { name: null, infusion: null },
                slot3: { name: null, infusion: null },
                slot4: { name: null, infusion: null },
                slot5: { name: null, infusion: null },
                slot6: { name: null, infusion: null }
            },
            spells: buildData.spells || {},
            totalWeight: buildData.totalWeight || 0,
            timestamp: new Date().toISOString()
        };

        localStorage.setItem('editBuildData', JSON.stringify(transformedBuildData));
        router.push('/buildcreator?edit=true');
    };

    return (
        <main className="min-h-screen p-0 md:p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b]">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="flex flex-col pt-3 lg:flex-row justify-between items-start lg:items-center mb-8 gap-6 lg:gap-0">
                    <div className="flex-1">
                        <h1
                            className="text-2xl sm:text-4xl font-bold mb-2 sm:mb-4 tracking-wider text-[#e5c77b] drop-shadow-lg"
                            style={{ fontFamily: 'serif' }}
                        >
                            {playerName}'s Build #{parseInt(buildIndex) + 1}
                        </h1>
                        <p className="text-[#c0a857] text-base sm:text-lg tracking-wide leading-snug">
                            Level {totalLevel} | Equipment Load: {buildData?.totalWeight || 0}
                        </p>
                    </div>

                    <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            onClick={() => setIsSimplifiedMode(!isSimplifiedMode)}
                            className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-semibold transition-colors duration-200 ${isSimplifiedMode
                                    ? 'bg-[#c0a857] text-[#19140e] hover:bg-[#a08f47]'
                                    : 'bg-[#3a2c1a] text-[#e5c77b] hover:bg-[#4a3c2a] border border-[#c0a857]'
                                }`}
                        >
                            {isSimplifiedMode ? 'Detailed View' : 'Simplified View'}
                        </button>

                        <button
                            onClick={() => router.push('/dashboard')}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-gray-600 text-white font-semibold hover:bg-gray-700 transition-colors duration-200"
                        >
                            Back to Dashboard
                        </button>

                        <button
                            onClick={handleEditBuild}
                            className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-[#e5c77b] text-[#19140e] font-semibold hover:bg-[#c0a857] transition-colors duration-200"
                        >
                            Edit This Build
                        </button>
                    </div>
                </div>


                {/* Detailed View */}
                {!isSimplifiedMode && buildData && (
                    <BuildDetailedView buildData={buildData} viewMode={true} />
                )}

                {/* Build Overview Display - Simplified Mode */}
                {isSimplifiedMode && (
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
                                    <div key={slot} className="flex">
                                        <span className="text-[#c0a857]">{slot}:</span>
                                        <span className="text-[#e5c77b] font-semibold ml-0.5">{spell || 'None'}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Simplified Mode Message */}
                {isSimplifiedMode && (
                    <div className="text-center py-8">
                        <p className="text-[#c0a857] text-lg">
                            Simplified view active. Click "Detailed View" to see interactive equipment grids and weapon details.
                        </p>
                    </div>
                )}
            </div>
        </main>
    );
};

export default BuildViewer;
