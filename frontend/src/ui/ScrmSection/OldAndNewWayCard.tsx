export default function OldAndNewWayCard({ title, description, children }: { title: string, description: string, children: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center bg-slate-950/95 rounded-lg p-10 mx-auto max-w-6xl">
            <div className="flex flex-col items-center justify-center">
                <img src="/images/old-way.svg" alt="Old Way" className="w-10 h-10" />
                <h2 className="text-4xl font-bold text-center text-white">{title}</h2>
                <p className="text-gray-500 text-center text-sm">{description}</p>
                <div className="flex flex-row items-start justify-start">  {children} </div>
            </div>
            
        </div>
    );
}