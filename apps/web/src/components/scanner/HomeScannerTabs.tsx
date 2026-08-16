"use client";

import { useState } from "react";
import { TextScanner } from "./TextScanner";
import { ImageScanner } from "./ImageScanner";
import { ScanText, ImageIcon } from "lucide-react";

export function HomeScannerTabs() {
  const [activeTab, setActiveTab] = useState<"text" | "image">("text");

  return (
    <div className="space-y-4">
      {/* Mode Switcher Tabs */}
      <div className="flex justify-center">
        <div className="inline-flex rounded-xl border border-border bg-muted/50 p-1 shadow-xs">
          <button
            type="button"
            onClick={() => setActiveTab("text")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "text"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ScanText className="size-3.5 text-primary" />
            <span>Text Detector</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("image")}
            className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all ${
              activeTab === "image"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ImageIcon className="size-3.5 text-primary" />
            <span>Image Detector</span>
            <span className="rounded-full bg-primary/15 px-1.5 py-0.2 text-[9px] font-bold text-primary">
              Phase 2
            </span>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "text" ? <TextScanner /> : <ImageScanner />}
      </div>
    </div>
  );
}
