"use client";

import { Suspense, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { OrbitControls, Environment, Html } from "@react-three/drei";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader.js";
import * as THREE from "three";

// 加载带材质的 OBJ 模型
function FoodTruckModel() {
  const groupRef = useRef<THREE.Group>(null);

  // 1. 加载材质文件
  const material = useLoader(MTLLoader, "/models/food-truck/foodtruck.mtl");
  // 2. 加载 OBJ 文件，并应用材质
  const obj = useLoader(
    OBJLoader,
    "/models/food-truck/foodtruck.obj",
    (loader) => {
      material.preload();
      loader.setMaterials(material);
    },
  );

  return (
    <primitive ref={groupRef} object={obj} scale={0.5} position={[0, -1, 0]} />
  );
}

// 加载占位符
function Loader() {
  return (
    <Html center>
      <div className="bg-white/80 px-4 py-2 rounded shadow">
        Loading model...
      </div>
    </Html>
  );
}

export default function ModelDemoPage() {
  return (
    <div className="w-full h-screen bg-gray-100">
      <div className="absolute top-4 left-4 z-10 bg-white/80 px-3 py-1 rounded shadow text-sm">
        Model: Japanese Food Truck | Drag to rotate
      </div>
      <Canvas
        camera={{ position: [3, 2, 5], fov: 45 }}
        shadows
        gl={{ preserveDrawingBuffer: true }}
      >
        {/* 环境光 + 主光源 + 补光，便于观察材质 */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 7]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-3, 2, 4]} intensity={0.5} color="#ffaa66" />
        <spotLight position={[2, 3, 4]} angle={0.3} intensity={0.6} />
        {/* 可选：添加一个地面网格辅助观察位置 */}
        <gridHelper
          args={[10, 20, "#888888", "#cccccc"]}
          position={[0, -1.2, 0]}
        />
        <Suspense fallback={<Loader />}>
          <FoodTruckModel />
        </Suspense>
        <OrbitControls enablePan enableZoom enableRotate />
        <Environment preset="city" background={false} />{" "}
        {/* 环境贴图增强金属/玻璃质感 */}
      </Canvas>
    </div>
  );
}
