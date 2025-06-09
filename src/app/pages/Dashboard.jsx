import React from 'react'
import BuildCardsGrid from '../components/BuildCardsGrid'
import EldenRingDataWeapons from '../../../EldenRingData/data/weapons.json'
// import EldenRingImageWeapins from ''


const Dashboard = () => {

    const playerdata = {
        name: "Tarnished42069",
        level: 50,
        class: "Confessor",
        weaponNoInfusions: "Claymore",
        mainWeapon: "Fire Art Claymore",
        mainWeaponImage: EldenRingDataWeapons.find(
            (weapon) => weapon.name.toLowerCase() === "claymore"
        )?.image || "/placeholder.png",
        description: "A balanced build focusing on strength and faith."
    };

    console.log(playerdata);


    return (
        <main className="min-h-screen p-6 bg-gradient-to-br from-[#19140e] via-[#2d2212] to-[#3a2c1a] text-[#e5c77b]">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-bold mb-4 tracking-wider text-[#e5c77b] drop-shadow-lg" style={{ fontFamily: 'serif' }}>
                    Your Builds
                </h1>
                <p className="text-[#c0a857] mb-8 text-lg tracking-wide">
                    Strategize like a true Tarnished. Manage your Elden Ring builds below.
                </p>

                <BuildCardsGrid
                    title={playerdata.name}
                    description={`Level: ${playerdata.level} | Class: ${playerdata.class} | ${playerdata.description}`}
                    mainWeapon={{
                        name: playerdata.mainWeapon,
                        image: playerdata.mainWeaponImage
                    }}
                />

            </div>
        </main>
    )
}

export default Dashboard
