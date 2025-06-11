import React from "react";

export const TalismanSection = () => {
    const talismans = [
        { name: "Dragoncrest Greatshield", effect: "Increase physical defense" },
        { name: "Radagon's Scarseal", effect: "Boosts STR but increases damage taken" },
        { name: "Erdtree's Favor", effect: "Raises max HP, stamina, equip load" },
        { name: "", effect: "" },
    ];

    return (
        <section className="w-full rounded-xl p-4 mb-6">
            <h2
                className="text-xl font-bold mb-3 tracking-wide text-[#e5c77b] drop-shadow"
                style={{ fontFamily: "serif" }}
            >
                Talismans
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {talismans.map((t, i) => (
                    <div
                        key={i}
                        className="p-3 bg-[#2d2212] border border-[#e5c77b] rounded-lg text-sm shadow transition hover:bg-[#3a2c1a]"
                    >
                        <p className="text-[#e5c77b] font-semibold" style={{ fontFamily: "serif" }}>
                            {t.name || "Empty Slot"}
                        </p>
                        <p className="text-[#c0a857]">{t.effect}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};
