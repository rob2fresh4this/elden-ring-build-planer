"use client"

import React from 'react'
import { useRouter } from "next/navigation";
import BuildCardsGrid from '../components/BuildCardsGrid'
import EldenRingDataWeapons from '../../../public/EldenRingData/data/weapons.json'



const Dashboard = () => {
    const router = useRouter();

    const playerdata = {
        name: "Tarnished42069",
        level: 50,
        class: "Confessor",
        weaponNoInfusions: "Claymore",
        mainWeapon: "Fire Art Claymore",
        description: "A balanced build focusing on strength and faith."
    };

    const playerdata2 = {
        name: "johnEldenRing",
        level: 75,
        class: "Samurai",
        weaponNoInfusions: "Moonveil",
        mainWeapon: "Moonveil Katana",
        description: "A dexterity build with a focus on magic damage."
    };

    function EnrichWeaponData(playerdata) {
        const weaponData = playerdata;
        const weaponName = weaponData.weaponNoInfusions;

        const findWeaponImage = (weaponName) => {
            const weapon = EldenRingDataWeapons.find(w => w.name === weaponName);
            // example of link: https://eldenring.fanapis.com/images/weapons/17f69d938dal0i1p7cva71qgpwuo6w.png
            // need to remove the "https://eldenring.fanapis.com/images/weapons/" part
            if (!weapon) {
                console.warn(`Weapon not found: ${weaponName}`);
                return null;
            }else if (weapon.image.startsWith("https://eldenring.fanapis.com/images/weapons/")) {
                // Remove the base URL part
                const baseUrl = "https://eldenring.fanapis.com/images/weapons/";
                for (let i = 0; i < weapon.image.length; i++) {
                    if (weapon.image.startsWith(baseUrl)) {
                        return weapon.image.slice(baseUrl.length);
                    }
                }
            }
            return weapon ? weapon.image : null;
        }
        return {
            name: weaponData.name,
            level: weaponData.level,
            class: weaponData.class,
            mainWeapon: weaponData.mainWeapon,
            mainWeaponImage: findWeaponImage(weaponName),
            description: weaponData.description
        };
    }

    console.log("Enriched Player Data:", EnrichWeaponData(playerdata));



    const builds = [
        EnrichWeaponData(playerdata),
        EnrichWeaponData(playerdata2)
        // Add more player build objects here as needed
    ];

    const handleClickGoToBuild = () => {
        router.push("./buildcreator");
    };

    return (
        <main className="min-h-screen p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b]">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 tracking-wider text-[#e5c77b] drop-shadow-lg" style={{ fontFamily: 'serif' }}>
                    Online Builds
                </h1>
                <p className="text-[#c0a857] mb-8 text-lg tracking-wide">
                    Strategize like a true Tarnished. Manage your Elden Ring builds below.
                </p>

                {/* Create + Button */}
                <button
                    className="mb-8 px-5 py-2 rounded-lg bg-[#e5c77b] text-[#2d2212] font-bold text-lg shadow-lg hover:bg-[#c0a857] transition-colors duration-200"
                    style={{ fontFamily: 'serif', letterSpacing: '0.05em' }}
                    onClick={handleClickGoToBuild}
                >
                    Create New Build +
                </button>


                <div className="flex flex-row flex-wrap gap-4 items-start justify-start">
                    {builds.map((build, idx) => (
                        <BuildCardsGrid
                            key={idx}
                            title={build.name}
                            description={`Level: ${build.level} | Class: ${build.class} | ${build.description}`}
                            mainWeapon={{
                                name: build.mainWeapon,
                                image: build.mainWeaponImage
                            }}
                        />
                    ))}
                </div>
            </div>
        </main>
    )
}

export default Dashboard
