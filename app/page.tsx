"use client";

import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ClickLesson, FixedFocusLesson, SmoothFocusLesson } from "./components/FocusLessons";

const lessons = [
  {
    title: "1 · 点击了谁",
    instruction: "点击蓝色方块，观察画布左上角显示的物体名称。",
    explanation: "onClick 的事件里，event.object 是射线实际命中的物体；event.eventObject 是绑定事件处理函数的物体。这个例子两者都是同一个方块。",
    experiment: "修改 FocusLessons.tsx 中 BOX_POSITION 的第一个数字，以及 ClickLesson 里 boxGeometry 的第一个尺寸。",
  },
  {
    title: "2 · 固定聚焦站位",
    instruction: "先拖动视角，再点击方块，观察相机跳到预设站位。",
    explanation: "camera.position 表示相机站在哪里；OrbitControls.target 表示相机朝哪里看、围绕哪里旋转。聚焦时一起设置，最后调用 controls.update()。",
    experiment: "修改 FOCUS_POSITION 的 y 与 z：y 改变俯视角，z 改变距离。",
  },
  {
    title: "3 · 平滑聚焦与第二次点击",
    instruction: "第一次点击方块聚焦；移动结束后第二次点击切换颜色；按 Esc 返回。",
    explanation: "idle → moving → focused。移动期间忽略点击并停用 OrbitControls；到达后才能执行第二次点击的动作。按 Esc 平滑回到初始视角。",
    experiment: "修改 MOVE_SPEED 和 ARRIVAL_DISTANCE：前者控制移动快慢，后者控制何时算到达。",
  },
] as const;

export default function Home() {
  const [lesson, setLesson] = useState(0);
  const current = lessons[lesson];

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-medium tracking-widest text-sky-300">THREE.JS PRACTICE</p>
        <h1 className="mt-2 text-3xl font-bold">第一次点击聚焦，第二次点击操作</h1>
        <p className="mt-3 text-slate-300">三个独立的小练习。切换步骤会重置画布，方便从头观察。</p>

        <div className="mt-7 flex flex-wrap gap-3" role="tablist" aria-label="选择练习">
          {lessons.map((item, index) => (
            <button
              key={item.title}
              type="button"
              role="tab"
              aria-selected={lesson === index}
              onClick={() => setLesson(index)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
                lesson === index
                  ? "bg-sky-400 text-slate-950"
                  : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>

        <section className="mt-5 overflow-hidden rounded-2xl border border-slate-700 bg-slate-900">
          <div className="border-b border-slate-700 px-5 py-4">
            <h2 className="text-xl font-semibold">{current.title}</h2>
            <p className="mt-1 text-sm text-slate-300">{current.instruction}</p>
          </div>
          <div className="h-[440px] bg-slate-950">
            <Canvas key={lesson} camera={{ position: [0, 2, 8], fov: 50 }}>
              {lesson === 0 && <ClickLesson />}
              {lesson === 1 && <FixedFocusLesson />}
              {lesson === 2 && <SmoothFocusLesson />}
            </Canvas>
          </div>
        </section>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h3 className="font-semibold text-sky-300">这一步在学什么</h3>
            <p className="mt-2 leading-7 text-slate-300">{current.explanation}</p>
          </section>
          <section className="rounded-xl border border-slate-700 bg-slate-900 p-5">
            <h3 className="font-semibold text-sky-300">亲手改两个数字</h3>
            <p className="mt-2 leading-7 text-slate-300">{current.experiment}</p>
          </section>
        </div>
        <p className="mt-5 text-sm text-slate-400">
          对照文档：
          <a className="ml-2 text-sky-300 underline" href="https://r3f.docs.pmnd.rs/api/events" target="_blank" rel="noreferrer">R3F 点击事件</a>
          <a className="ml-3 text-sky-300 underline" href="https://r3f.docs.pmnd.rs/api/hooks" target="_blank" rel="noreferrer">useFrame</a>
          <a className="ml-3 text-sky-300 underline" href="https://threejs.org/docs/pages/OrbitControls.html" target="_blank" rel="noreferrer">OrbitControls</a>
        </p>
      </div>
    </main>
  );
}
