"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PipelineStage {
  id: string;
  name: string;
  shortName: string;
  baseCost: number;
  description: string;
  color: string;
  requiredFor: ("simple" | "medium" | "complex")[];
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "background",
    name: "Garment Segmentation",
    shortName: "Segmentation",
    baseCost: 0.0003,
    description: "BiRefNet",
    color: "#8b5cf6",
    requiredFor: ["simple", "medium", "complex"],
  },
  {
    id: "vision",
    name: "Attribute Extraction",
    shortName: "Attributes",
    baseCost: 0.001,
    description: "Florence-2",
    color: "#3b82f6",
    requiredFor: ["simple", "medium", "complex"],
  },
  {
    id: "embeddings",
    name: "Style Matching",
    shortName: "Embeddings",
    baseCost: 0.00002,
    description: "FashionSigLIP",
    color: "#10b981",
    requiredFor: ["simple", "medium", "complex"],
  },
  {
    id: "moderation",
    name: "Body Analysis",
    shortName: "Analysis",
    baseCost: 0.001,
    description: "AWS Rekognition",
    color: "#ef4444",
    requiredFor: ["medium", "complex"],
  },
  {
    id: "reasoning",
    name: "Outfit Composition",
    shortName: "Compose",
    baseCost: 0.002,
    description: "Gemini",
    color: "#f97316",
    requiredFor: ["simple", "medium", "complex"],
  },
];

// GPT-4 Vision baseline costs for comparison
const GPT4_VISION_COST_PER_IMAGE = 0.01; // ~$0.01 per image with GPT-4 Vision
const GPT4_REASONING_COST = 0.03; // GPT-4 reasoning cost

type ComplexityLevel = "simple" | "medium" | "complex";

interface SliderConfig {
  id: string;
  label: string;
  min: number;
  max: number;
  step: number;
  unit: string;
  defaultValue: number;
}

const SLIDERS: SliderConfig[] = [
  {
    id: "images",
    label: "Images to Process",
    min: 1,
    max: 50,
    step: 1,
    unit: "",
    defaultValue: 5,
  },
  {
    id: "complexity",
    label: "Query Complexity",
    min: 0,
    max: 2,
    step: 1,
    unit: "",
    defaultValue: 1,
  },
];

const COMPLEXITY_LABELS: Record<number, { label: string; level: ComplexityLevel }> = {
  0: { label: "Simple", level: "simple" },
  1: { label: "Medium", level: "medium" },
  2: { label: "Complex", level: "complex" },
};

export function AIRoutingDemo() {
  const [sliderValues, setSliderValues] = useState<Record<string, number>>({
    images: 5,
    complexity: 1,
  });
  const [isClient, setIsClient] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [processingStage, setProcessingStage] = useState<number>(-1);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const complexityLevel = COMPLEXITY_LABELS[sliderValues.complexity].level;

  // Calculate which stages are active based on complexity
  const activeStages = useMemo(() => {
    return PIPELINE_STAGES.filter((stage) => stage.requiredFor.includes(complexityLevel));
  }, [complexityLevel]);

  // Calculate costs
  const costs = useMemo(() => {
    const imageCount = sliderValues.images;

    // Our pipeline cost
    let pipelineCost = 0;
    activeStages.forEach((stage) => {
      // Most stages scale with image count
      if (stage.id === "reasoning") {
        pipelineCost += stage.baseCost; // Fixed cost per request
      } else {
        pipelineCost += stage.baseCost * imageCount; // Scales with images
      }
    });

    // GPT-4 Vision alternative cost
    const gpt4Cost = GPT4_VISION_COST_PER_IMAGE * imageCount + GPT4_REASONING_COST;

    // Savings
    const savings = gpt4Cost - pipelineCost;
    const savingsPercent = ((savings / gpt4Cost) * 100).toFixed(0);

    return {
      pipeline: pipelineCost,
      gpt4: gpt4Cost,
      savings,
      savingsPercent,
    };
  }, [sliderValues.images, activeStages]);

  // Animate through stages when values change
  useEffect(() => {
    if (!isInteractive) return;

    setProcessingStage(-1);
    let stageIndex = 0;

    const animateStages = () => {
      if (stageIndex < activeStages.length) {
        const globalIndex = PIPELINE_STAGES.findIndex((s) => s.id === activeStages[stageIndex].id);
        setProcessingStage(globalIndex);
        stageIndex++;
        setTimeout(animateStages, 200);
      } else {
        setTimeout(() => setProcessingStage(-1), 500);
      }
    };

    const timeout = setTimeout(animateStages, 100);
    return () => clearTimeout(timeout);
  }, [sliderValues, isInteractive, activeStages]);

  const handleSliderChange = (id: string, value: number) => {
    if (!isInteractive) setIsInteractive(true);
    setSliderValues((prev) => ({ ...prev, [id]: value }));
  };

  if (!isClient) {
    return <StaticPipeline />;
  }

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
            Cost Calculator
          </span>
        </div>
        <span className="font-mono text-xs text-accent">Interactive</span>
      </div>

      {/* Sliders */}
      <div className="mb-6 space-y-4 p-4 rounded-lg border border-white/10 bg-bg-secondary">
        {SLIDERS.map((slider) => (
          <div key={slider.id}>
            <div className="flex items-center justify-between mb-2">
              <label className="font-mono text-xs text-text-muted uppercase tracking-wider">
                {slider.label}
              </label>
              <span className="font-mono text-sm text-accent font-semibold">
                {slider.id === "complexity"
                  ? COMPLEXITY_LABELS[sliderValues[slider.id]].label
                  : `${sliderValues[slider.id]}${slider.unit}`}
              </span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={slider.min}
                max={slider.max}
                step={slider.step}
                value={sliderValues[slider.id]}
                onChange={(e) => handleSliderChange(slider.id, Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:h-4
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:bg-accent
                  [&::-webkit-slider-thumb]:cursor-grab
                  [&::-webkit-slider-thumb]:active:cursor-grabbing
                  [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(249,115,22,0.5)]
                  [&::-webkit-slider-thumb]:transition-shadow
                  [&::-webkit-slider-thumb]:hover:shadow-[0_0_15px_rgba(249,115,22,0.7)]
                  [&::-moz-range-thumb]:w-4
                  [&::-moz-range-thumb]:h-4
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:bg-accent
                  [&::-moz-range-thumb]:border-0
                  [&::-moz-range-thumb]:cursor-grab"
              />
              {/* Progress fill */}
              <div
                className="absolute top-0 left-0 h-2 bg-accent/30 rounded-full pointer-events-none"
                style={{
                  width: `${((sliderValues[slider.id] - slider.min) / (slider.max - slider.min)) * 100}%`,
                }}
              />
            </div>
            {slider.id === "complexity" && (
              <div className="flex justify-between mt-1 font-mono text-[10px] text-text-muted">
                <span>Simple</span>
                <span>Medium</span>
                <span>Complex</span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pipeline Visualization */}
      <div className="relative">
        <div className="relative z-10 space-y-2">
          {PIPELINE_STAGES.map((stage, index) => {
            const isActive = activeStages.some((s) => s.id === stage.id);
            const isProcessing = processingStage === index;
            const isProcessed = processingStage > index && isActive;

            return (
              <motion.div
                key={stage.id}
                layout
                className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  isProcessing
                    ? "border-accent bg-accent/10"
                    : isProcessed
                      ? "border-white/20 bg-white/5"
                      : isActive
                        ? "border-white/10 bg-bg-secondary"
                        : "border-white/5 bg-bg-secondary/30 opacity-30"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isActive ? 1 : 0.3,
                  x: 0,
                  scale: isProcessing ? 1.02 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {/* Stage indicator */}
                <div
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isProcessing ? "bg-accent" : isActive ? "bg-white/20" : "bg-white/5"
                  }`}
                  style={{
                    boxShadow: isProcessing ? `0 0 20px ${stage.color}40` : "none",
                  }}
                >
                  {isActive ? (
                    <svg
                      className={`w-4 h-4 ${isProcessing ? "text-bg-primary" : "text-text-muted"}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="font-mono text-xs text-text-muted">—</span>
                  )}
                </div>

                {/* Stage info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-sm font-medium truncate ${
                        isActive ? "text-text-primary" : "text-text-muted"
                      }`}
                    >
                      {stage.shortName}
                    </span>
                    <span className="text-xs text-text-muted hidden sm:inline">
                      {stage.description}
                    </span>
                  </div>
                </div>

                {/* Cost */}
                <div className="text-right">
                  <span
                    className={`font-mono text-xs ${
                      isActive ? "text-accent" : "text-text-muted/50"
                    }`}
                  >
                    {stage.baseCost === 0
                      ? "—"
                      : `$${(stage.baseCost * (stage.id === "reasoning" ? 1 : sliderValues.images)).toFixed(5)}`}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cost Summary */}
      <motion.div className="mt-6 p-4 rounded-lg border border-white/10 bg-bg-secondary" layout>
        <div className="grid grid-cols-2 gap-4">
          {/* Our Cost */}
          <div>
            <span className="font-mono text-xs text-text-muted block mb-1">Styleum Cost</span>
            <motion.span
              key={costs.pipeline}
              className="font-mono text-2xl font-bold text-accent block"
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              ${costs.pipeline.toFixed(4)}
            </motion.span>
            <span className="font-mono text-[10px] text-text-muted">per request</span>
          </div>

          {/* GPT-4 Cost Comparison */}
          <div className="text-right">
            <span className="font-mono text-xs text-text-muted block mb-1">GPT-4 Vision</span>
            <span className="font-mono text-xl text-red-400 line-through block">
              ${costs.gpt4.toFixed(2)}
            </span>
            <motion.span
              key={costs.savingsPercent}
              className="font-mono text-xs text-green-400"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
            >
              You save {costs.savingsPercent}%
            </motion.span>
          </div>
        </div>

        {/* Savings Highlight */}
        <AnimatePresence>
          {costs.savings > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-white/10"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Total Savings</span>
                <span className="font-mono text-lg font-bold text-green-400">
                  ${costs.savings.toFixed(4)}
                </span>
              </div>
              <p className="mt-2 text-xs text-text-muted">
                Process {sliderValues.images} image{sliderValues.images > 1 ? "s" : ""} with{" "}
                <span className="text-accent">
                  {COMPLEXITY_LABELS[sliderValues.complexity].label.toLowerCase()}
                </span>{" "}
                analysis for {costs.savingsPercent}% less than GPT-4 Vision.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Progress bar showing cost relative to GPT-4 */}
        <div className="mt-4">
          <div className="flex justify-between font-mono text-[10px] text-text-muted mb-1">
            <span>Our cost</span>
            <span>GPT-4 cost</span>
          </div>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute left-0 top-0 h-full bg-accent rounded-full"
              initial={{ width: "0%" }}
              animate={{
                width: `${Math.min((costs.pipeline / costs.gpt4) * 100, 100)}%`,
              }}
              transition={{ duration: 0.3 }}
            />
            <div className="absolute right-0 top-0 h-full w-px bg-red-400" />
          </div>
        </div>
      </motion.div>

      {/* CTA */}
      <motion.p
        className="mt-4 text-center text-xs text-text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Drag the sliders to see how costs scale
      </motion.p>
    </div>
  );
}

function StaticPipeline() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
          Cost Calculator
        </span>
      </div>
      <div className="space-y-2">
        {PIPELINE_STAGES.slice(0, 4).map((stage, index) => (
          <div
            key={stage.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-bg-secondary"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="font-mono text-xs text-text-muted font-bold">{index + 1}</span>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-text-primary">{stage.shortName}</span>
            </div>
            <span className="font-mono text-xs text-text-muted">${stage.baseCost.toFixed(4)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 p-4 rounded-lg border border-white/10 bg-bg-secondary">
        <span className="font-mono text-2xl font-bold text-accent">$0.002</span>
        <span className="font-mono text-xs text-text-muted ml-2">per request</span>
      </div>
    </div>
  );
}
