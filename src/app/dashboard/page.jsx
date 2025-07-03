"use client"

import React from 'react'
import { useRouter } from "next/navigation";
import BuildCardsGrid from '../components/BuildCardsGrid'
import EldenRingDataWeapons from '../../../public/EldenRingData/data/weapons.json'
import tempPlayerBuild from '../components/tempplayerbuild.json'



const Dashboard = () => {
    const router = useRouter();

    function EnrichWeaponData(buildData, buildIndex) {
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
            const weapon = EldenRingDataWeapons.find(w => w.name === weaponName);
            
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
            name: tempPlayerBuild.username,
            level: totalLevel,
            class: "Wretch", // Since we don't have class info in the JSON
            mainWeapon: mainWeapon ? `${mainWeapon.name}${mainWeapon.infusion ? ` (${mainWeapon.infusion})` : ''}` : "No Weapon",
            mainWeaponImage: findWeaponImage(weaponName),
            description: `Equipment Load: ${buildData.totalWeight}kg`,
            buildIndex: buildIndex
        };
    }

    const builds = tempPlayerBuild.builds.map((build, index) => EnrichWeaponData(build, index));

    const handleClickGoToBuild = () => {
        router.push("./buildcreator");
    };

    const handleCardClick = (buildIndex) => {
        router.push(`./buildviewer?build=${buildIndex}`);
    };

    return (
        <main className="min-h-screen p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b] ">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 tracking-wider text-[#e5c77b] drop-shadow-lg" style={{ fontFamily: 'serif' }}>
                    Online Builds
                </h1>
                <p className="text-[#c0a857] mb-8 text-lg tracking-wide">
                    Strategize like a true Tarnished. Manage your Elden Ring builds below.
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


                <div className="flex flex-row flex-wrap gap-4 items-start justify-start w-[100%]">
                    {builds.map((build, idx) => (
                        <div key={idx} className='w-[calc(33.333%-1rem)] cursor-pointer' onClick={() => handleCardClick(build.buildIndex)}>
                            <BuildCardsGrid
                                title={build.name}
                                description={`Level: ${build.level} | Class: ${build.class} | ${build.description}`}
                                mainWeapon={{
                                    name: build.mainWeapon,
                                    image: build.mainWeaponImage
                                }}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </main>
    )
}

export default Dashboard
