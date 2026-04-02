"use client";

import dynamic from "next/dynamic";

const SplineViewer = dynamic(() => import("@/components/layout/SplineViewer"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
        </div>
    ),
});

export default function HeroSpline() {
    return (
        <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden">
            {/* 
              Zoom-out trick: render the Spline viewer at a much larger size,
              then scale it down visually with CSS transform.
            */}
            <div
                className="absolute z-10"
                style={{
                    width: "180%",
                    height: "180%",
                    top: "50%",
                    left: "56%",
                    transform: "translate(-50%, -50%) scale(0.7)",
                }}
            >
                <SplineViewer
                    url="https://prod.spline.design/VuMC04E-SR4iK26z/scene.splinecode"
                    className="w-full h-full"
                />
            </div>
            
            {/* Soft Ground Shadow Effect */}
            <div className="absolute left-[56%] bottom-[12%] -translate-x-1/2 w-[220px] h-[35px] bg-black/[0.08] dark:bg-primary/[0.15] blur-[22px] rounded-[50%] -z-0 animate-pulse-slow"></div>
        </div>
    );
}
