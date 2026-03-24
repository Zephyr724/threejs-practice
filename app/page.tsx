"use client";

import { useState, useCallback } from "react";
import { ThreeScene } from "./components/ThreeScene";
import { UIButtons } from "./components/UIButtons";
import { ProjectModal } from "./components/ProjectModal";
import { CameraProvider } from "./context/CameraContext";
import Link from "next/link";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    url: string;
  } | null>(null);

  // 打开模态框
  const openModal = useCallback((title: string, url: string) => {
    setModalContent({ title, url });
    setModalOpen(true);
  }, []);

  // 关闭模态框
  const closeModal = useCallback(() => {
    setModalOpen(false);
    setModalContent(null);
  }, []);

  return (
    <CameraProvider>
      <div className="relative w-full h-screen overflow-hidden">
        {/* 3D 场景 */}
        <ThreeScene onOpenModal={openModal} />

        {/* 常驻 UI 按钮 */}
        <UIButtons />
        <Link
          href="/model-demo"
          className="fixed bottom-4 left-4 z-20 bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          实验：导入日本食物卡车模型
        </Link>

        {/* 项目模态框 */}
        {modalOpen && modalContent && (
          <ProjectModal
            title={modalContent.title}
            url={modalContent.url}
            onClose={closeModal}
          />
        )}
      </div>
    </CameraProvider>
  );
}
