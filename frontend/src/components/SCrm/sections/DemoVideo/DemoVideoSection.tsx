import React, { useState } from "react";
import { useAdminTheme } from "../../../../contexts/AdminThemeContext";

const DemoVideoSection: React.FC = () => {
    const { colors } = useAdminTheme();
    const [language, setLanguage] = useState<"en" | "hi">("en");

    return (
        <section
            id="demo"
            className=" bg-slate-950/95 py-20 "
        >
            <div className="flex flex-col justify-between items-center gap-10 border border-gray-800 rounded-2xl p-10 mx-auto max-w-6xl ">
                <span className="text-3xl font-extrabold tracking-tight text-white">
                    Watch The 2-Minute Demo
                </span>
                <div className="flex items-center gap-4 text-base font-semibold">
                    <button
                        type="button"
                        className={`transition-colors ${
                            language === "en" ? "text-white" : "text-white/60"
                        }`}
                        onClick={() => setLanguage("en")}
                    >
                        English
                    </button>
                    <button
                        type="button"
                        aria-pressed={language === "hi"}
                        onClick={() => setLanguage(language === "en" ? "hi" : "en")}
                        className="relative h-10 w-20 rounded-full bg-slate-900/80 shadow-[0_5px_15px_rgba(0,0,0,0.45)] border border-white/10 transition"
                    >
                        <span
                            className={`absolute top-1 left-1 h-8 w-8 rounded-full bg-white shadow-lg transition-transform ${
                                language === "hi" ? "translate-x-8" : ""
                            }`}
                            style={{
                                backgroundColor: colors.interactive.primary,
                            }}
                        />
                    </button>
                    <button
                        type="button"
                        className={`transition-colors ${
                            language === "hi" ? "text-white" : "text-white/60"
                        }`}
                        onClick={() => setLanguage("hi")}
                    >
                        हिन्दी
                    </button>
                </div>
                <div className="relative aspect-video w-full max-w-4xl mx-auto overflow-hidden rounded-2xl bg-black">
                    <iframe
                        title="Super CRM Demo"
                        src="https://www.youtube.com/embed/0wziA-YPHNU?rel=0"
                        className="h-full w-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                    <div className="pointer-events-none absolute inset-0 rounded-2xl border border-white/10 shadow-inner shadow-black/50" />
                </div>
            </div>
        </section>
    );
};

export default DemoVideoSection;

