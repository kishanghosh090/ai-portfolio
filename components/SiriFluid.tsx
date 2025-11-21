"use client";
import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function SiriFluid({ active }: { active: boolean }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    const uniforms = {
      u_time: { value: 0 },
      u_active: { value: 0 },
      u_resolution: {
        value: new THREE.Vector2(
          window.innerWidth,
          window.innerHeight
        ),
      },
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      transparent: true,
      fragmentShader: `
        precision mediump float;
        uniform float u_time;
        uniform float u_active;
        uniform vec2 u_resolution;

        void main() {
          vec2 uv = gl_FragCoord.xy / u_resolution;
          uv = uv * 2.0 - 1.0;

          float dist = length(uv);

          // Wave ring
          float wave = sin(dist * 25.0 - u_time * 4.0);

          // Smooth round glow
          float glow = smoothstep(0.6, 0.0, dist + wave * 0.03);

          // Siri-like gradient
          vec3 blue = vec3(0.0, 0.45, 1.0);
          vec3 pink = vec3(1.0, 0.1, 0.5);
          vec3 purple = vec3(0.5, 0.0, 1.0);

          vec3 color = mix(blue, pink, uv.x * 0.5 + 0.5);
          color = mix(color, purple, uv.y * 0.5 + 0.5);

          color *= glow * u_active;

          gl_FragColor = vec4(color, glow * u_active);
        }
      `,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    let frameId: number;

    const animate = () => {
      uniforms.u_time.value += 0.02;
      uniforms.u_active.value = THREE.MathUtils.lerp(
        uniforms.u_active.value,
        active ? 1 : 0,
        0.08
      );

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.u_resolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      container.removeChild(renderer.domElement);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [active]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 9999 }}
    />
  );
}
