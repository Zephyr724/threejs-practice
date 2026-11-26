"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ThreeEvent, useFrame, useThree } from "@react-three/fiber";
import { Html, OrbitControls } from "@react-three/drei";
import { Vector3 } from "three";

// 三个练习共用一个简单方块，避免引入模型加载或边界计算。
const BOX_POSITION: [number, number, number] = [2, 0, 0];
const HOME_POSITION = new Vector3(0, 2, 8);
const HOME_TARGET = new Vector3(0, 0, 0);
const FOCUS_POSITION = new Vector3(2, 1.2, 3);
const FOCUS_TARGET = new Vector3(2, 0, 0);

// 练习一：onClick 的 event 告诉我们点中了哪个物体。
export function ClickLesson() {
  const [clickedName, setClickedName] = useState("还没有点击方块");

  function handleClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();
    setClickedName(event.object.name);
    console.log("实际命中:", event.object.name);
    console.log("注册事件:", event.eventObject.name);
  }

  return (
    <>
      <mesh name="demo_box_01" position={BOX_POSITION} onClick={handleClick}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#4f86c6" />
      </mesh>
      <Html fullscreen style={{ pointerEvents: "none" }}>
        <div className="p-4 text-sm text-white">命中的物体：{clickedName}</div>
      </Html>
    </>
  );
}

// 练习二：直接指定聚焦站位，不用 Box3。
export function FixedFocusLesson() {
  const { camera } = useThree();
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);

  function focusBox(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    // position 是相机站在哪里。
    camera.position.copy(FOCUS_POSITION);
    // target 是 OrbitControls 围绕旋转、始终看向的中心。
    controls.current!.target.copy(FOCUS_TARGET);
    // 手动改相机后，让控制器同步到新视角。
    controls.current!.update();
  }

  return (
    <>
      <OrbitControls ref={controls} enableDamping={false} enablePan={false} />
      <mesh name="demo_box_01" position={BOX_POSITION} onClick={focusBox}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial color="#4f86c6" />
      </mesh>
    </>
  );
}

type Phase = "idle" | "moving" | "focused";

// 每秒接近目标的速度；数字越大，相机移动越快。
const MOVE_SPEED = 5;
// 相机和观察中心都足够接近终点时，认为移动结束。
const ARRIVAL_DISTANCE = 0.01;

// 练习三：平滑移动，并让第二次点击只在聚焦完成后生效。
export function SmoothFocusLesson() {
  const { camera } = useThree();
  const controls = useRef<React.ComponentRef<typeof OrbitControls>>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [active, setActive] = useState(false);

  // useFrame 每帧运行。ref 可以立即更新，让点击事件读到最新阶段。
  // phase 这个 React state 用来更新画面文字和方块颜色。
  const phaseRef = useRef<Phase>("idle");
  const arrivalPhase = useRef<"idle" | "focused">("focused");
  const destinationPosition = useRef(FOCUS_POSITION);
  const destinationTarget = useRef(FOCUS_TARGET);
  const currentTarget = useRef(HOME_TARGET.clone());

  const startMove = useCallback(
    (position: Vector3, target: Vector3, nextPhase: "idle" | "focused") => {
      destinationPosition.current = position;
      destinationTarget.current = target;
      arrivalPhase.current = nextPhase;
      phaseRef.current = "moving";
      setPhase("moving");

      // 动画移动期间停用鼠标控制，避免两者同时改相机。
      if (controls.current) controls.current.enabled = false;
    },
    [],
  );

  function handleBoxClick(event: ThreeEvent<MouseEvent>) {
    event.stopPropagation();

    if (phaseRef.current === "idle") {
      // 第一次点击只开始聚焦，不执行方块动作。
      startMove(FOCUS_POSITION, FOCUS_TARGET, "focused");
    } else if (phaseRef.current === "focused") {
      // 只有移动结束后，第二次点击才切换颜色。
      setActive((previous) => !previous);
    }
    // moving 期间的点击被忽略。
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape" || phaseRef.current === "idle") return;
      startMove(HOME_POSITION, HOME_TARGET, "idle");
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startMove]);

  useFrame((_, delta) => {
    if (phaseRef.current !== "moving") return;

    const position = destinationPosition.current;
    const target = destinationTarget.current;

    // delta 是上一帧到这一帧经过的秒数。
    // alpha 表示这一帧走完剩余距离的比例；这样速度不直接依赖帧率。
    const alpha = 1 - Math.exp(-MOVE_SPEED * delta);
    camera.position.lerp(position, alpha);
    currentTarget.current.lerp(target, alpha);
    camera.lookAt(currentTarget.current);

    const positionDone = camera.position.distanceTo(position) < ARRIVAL_DISTANCE;
    const targetDone = currentTarget.current.distanceTo(target) < ARRIVAL_DISTANCE;
    if (!positionDone || !targetDone) return;

    // 插值只会不断接近终点；足够近时把数值准确对齐。
    camera.position.copy(position);
    currentTarget.current.copy(target);
    camera.lookAt(currentTarget.current);
    controls.current!.target.copy(target);

    phaseRef.current = arrivalPhase.current;
    setPhase(arrivalPhase.current);

    // 聚焦后保持固定视角；返回初始状态后才恢复鼠标控制。
    if (arrivalPhase.current === "idle") {
      controls.current!.enabled = true;
      controls.current!.update();
    }
  });

  const instruction = {
    idle: "第一次点击：聚焦",
    moving: "相机移动中：点击暂时无效",
    focused: "第二次点击：切换颜色；Esc 返回",
  }[phase];

  return (
    <>
      <OrbitControls ref={controls} enableDamping={false} enablePan={false} />
      <mesh name="demo_box_01" position={BOX_POSITION} onClick={handleBoxClick}>
        <boxGeometry args={[1, 1, 1]} />
        <meshBasicMaterial
          color={phase === "moving" ? "#fbbf24" : active ? "#f97316" : "#4f86c6"}
        />
      </mesh>
      <Html fullscreen style={{ pointerEvents: "none" }}>
        <div className="p-4 text-sm text-white">状态：{phase} · {instruction}</div>
      </Html>
    </>
  );
}
