import video from "@/assets/simple_acasa.mp4";


export default function Dashboard() {
  return (
    <div className="relative h-full w-full flex items-center justify-center overflow-hidden rounded-[2.5rem] bg-black shadow-2xl border border-white/5">
      
      {/* --- CINEMATIC VIDEO BACKGROUND --- */}
      {/* Using an overlay to darken and tint the video */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover  opacity-50"
        >
          {/* Use the video URL generated/provided previously here */}
          <source src={video} type="video/mp4" />
        </video>
        
        {/* Subtle Vignette & Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-transparent to-black/50" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-50" />
      </div>

      {/* --- MINIMALIST TEXT CONTENT --- */}
      <div className="relative z-10 flex flex-col items-center animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white select-none">
          SMART <span className="text-primary italic">BARRIER</span>
        </h1>
        
        <div className="mt-6 flex items-center gap-4 opacity-40">
           <div className="h-px w-12 bg-white" />
           <span className="text-[10px] font-mono uppercase tracking-[0.8em] text-white">
             Foarte fain
           </span>
           <div className="h-px w-12 bg-white" />
        </div>
      </div>

    </div>
  );
}