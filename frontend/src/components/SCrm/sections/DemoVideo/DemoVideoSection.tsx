import React from "react";

const DemoVideoSection: React.FC = () => {

    return (
        <section
            id="demo"
            className=" bg-slate-950/95 py-20 "
        >
            <div className="flex flex-col justify-between items-center gap-10 border border-gray-800 rounded-2xl p-10 mx-auto max-w-6xl ">
                <span className="text-3xl font-extrabold tracking-tight text-white">
                    Watch The 2-Minute Demo
                </span>
               
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

