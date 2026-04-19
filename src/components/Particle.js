import React from "react";
import Particles from "react-tsparticles";

function Particle() {
  return (
    <Particles
      id="tsparticles"
      params={{
        particles: {
          number: { value: 60, density: { enable: true, value_area: 1200 } },
          color: { value: "#00ff41" },
          shape: { type: "circle" },
          opacity: { value: 0.15, random: true, anim: { enable: true, speed: 0.4, opacity_min: 0.05, sync: false } },
          size: { value: 1.5, random: true },
          line_linked: {
            enable: true,
            distance: 140,
            color: "#00ff41",
            opacity: 0.07,
            width: 1,
          },
          move: {
            enable: true,
            speed: 0.8,
            direction: "none",
            random: true,
            straight: false,
            out_mode: "out",
            bounce: false,
          },
        },
        interactivity: {
          detect_on: "canvas",
          events: {
            onhover: { enable: true, mode: "grab" },
            onclick: { enable: false },
            resize: true,
          },
          modes: {
            grab: { distance: 120, line_linked: { opacity: 0.2 } },
          },
        },
        retina_detect: true,
      }}
    />
  );
}

export default Particle;
