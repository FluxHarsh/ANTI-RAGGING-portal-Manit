"use client";

import { DotLottieReact, setWasmUrl } from "@lottiefiles/dotlottie-react";

// Serve the renderer's WASM binary from our own /public folder instead of a
// third-party CDN, so the animation loads reliably with no external calls.
setWasmUrl("/animations/dotlottie-player.wasm");

export default function HeroAnimation() {
  return (
    <DotLottieReact
      src="/animations/Speak_out.lottie"
      loop
      autoplay
      className="h-full w-full"
    />
  );
}