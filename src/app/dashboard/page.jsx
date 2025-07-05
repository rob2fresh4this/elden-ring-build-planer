"use client"

import React from 'react'
import { useRouter } from "next/navigation";
import BuildCardsGrid from '../components/BuildCardsGrid'
import EldenRingDataWeapons from '../../../public/EldenRingData/data/weapons.json'
import EldenRingDataWeaponsDLC from '../../../public/EldenRingData/data/weaponsDLC.json'
import tempPlayerBuild from '../components/tempplayerbuild.json'



const Dashboard = () => {
    const router = useRouter();

    function EnrichWeaponData(buildData, buildIndex, playerIndex, playerName) {
        // Get the main weapon from slot1 or the first available weapon
        const mainWeapon = buildData.weapons.slot1 ||
            buildData.weapons.slot2 ||
            buildData.weapons.slot3 ||
            buildData.weapons.slot4 ||
            buildData.weapons.slot5 ||
            buildData.weapons.slot6;

        const weaponName = mainWeapon?.name;

        const findWeaponImage = (weaponName) => {
            if (!weaponName) return null;
            // Search in both base game and DLC weapons
            const allWeapons = [...EldenRingDataWeapons, ...EldenRingDataWeaponsDLC];
            const weapon = allWeapons.find(w => w.name === weaponName);

            if (!weapon) {
                console.warn(`Weapon not found: ${weaponName}`);
                return null;
            } else if (weapon.image.startsWith("https://eldenring.fanapis.com/images/weapons/")) {
                const baseUrl = "https://eldenring.fanapis.com/images/weapons/";
                return weapon.image.slice(baseUrl.length);
            }
            return weapon ? weapon.image : null;
        }

        // Calculate total level from stats
        const totalLevel = Object.values(buildData.stats).reduce((sum, stat) => sum + stat, 0) - 80; // Subtract base stats

        return {
            name: playerName,
            level: totalLevel,
            class: "Wretch", // Since we don't have class info in the JSON
            mainWeapon: mainWeapon ? `${mainWeapon.name}${mainWeapon.infusion ? ` (${mainWeapon.infusion})` : ''}` : "No Weapon",
            mainWeaponImage: findWeaponImage(weaponName),
            description: `Equipment Load: ${buildData.totalWeight}kg`,
            buildIndex: buildIndex,
            playerIndex: playerIndex,
            buildData: buildData
        };
    }

    const handleClickGoToBuild = () => {
        router.push("./buildcreator");
    };

    const handleCardClick = (playerIndex, buildIndex) => {
        // Store the build data for the viewer
        const buildData = tempPlayerBuild.players[playerIndex].builds[buildIndex];
        localStorage.setItem('viewBuildData', JSON.stringify({
            ...buildData,
            playerName: tempPlayerBuild.players[playerIndex].username
        }));
        router.push(`./buildviewer?player=${playerIndex}&build=${buildIndex}`);
    };

    return (
        <main className="min-h-screen p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b] ">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 tracking-wider text-[#e5c77b] drop-shadow-lg" style={{ fontFamily: 'serif' }}>
                    Online Builds
                </h1>
                <p className="text-[#c0a857] mb-8 text-lg tracking-wide">
                    Strategize like a true Tarnished. Explore builds from fellow players below.
                </p>

                {/* Create + Button */}
                <div className="flex justify-end">
                    <button
                        className="mb-8 px-5 py-2 rounded-lg bg-[#e5c77b] text-[#2d2212] font-bold text-lg shadow-lg hover:bg-[#c0a857] transition-colors duration-200"
                        style={{ fontFamily: 'serif', letterSpacing: '0.05em' }}
                        onClick={handleClickGoToBuild}
                    >
                        Create New Build +
                    </button>
                </div>

                {/* Group builds by player */}
                {tempPlayerBuild.players.map((player, playerIndex) => (
                    <div key={playerIndex} className="mb-12">
                        <h2 className="text-2xl font-bold mb-6 text-[#e5c77b] border-b border-[#c0a857] pb-2" style={{ fontFamily: 'serif' }}>
                            {player.username}'s Builds ({player.builds.length})
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {player.builds.map((build, buildIndex) => {
                                const enrichedBuild = EnrichWeaponData(build, buildIndex, playerIndex, player.username);
                                return (
                                    <div
                                        key={buildIndex}
                                        className='cursor-pointer transform transition-transform hover:scale-105'
                                        onClick={() => handleCardClick(playerIndex, buildIndex)}
                                    >
                                        <BuildCardsGrid
                                            title={`${enrichedBuild.name}'s Build #${buildIndex + 1}`}
                                            description={`Level: ${enrichedBuild.level} | Class: ${enrichedBuild.class} | ${enrichedBuild.description}`}
                                            mainWeapon={{
                                                name: enrichedBuild.mainWeapon,
                                                image: enrichedBuild.mainWeaponImage
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Dashboard
