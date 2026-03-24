"use client";

import { useThree } from "@react-three/fiber";

export function UIButtons() {
  // 获取相机控制器（需要从 ThreeScene 中暴露，这里简化，实际可以全局存储）
  // 为了简单，我们用一个按钮触发页面刷新或者通过 ref 控制，但为了演示，先留空
  const resetCamera = () => {
    // 实际可通过全局 store 或 ref 调用 OrbitControls 的 reset 方法
    // 这里仅作为示例，可自行扩展
    console.log("Reset camera (implement via ref)");
  };

  return (
    <div className="fixed bottom-4 right-4 z-10 flex gap-2">
      <button
        onClick={resetCamera}
        className="bg-black/70 text-white px-3 py-2 rounded-lg backdrop-blur-sm hover:bg-black/90 transition"
      >
        Reset Camera
      </button>
      {/* 其他常驻按钮可继续添加 */}
    </div>
  );
}