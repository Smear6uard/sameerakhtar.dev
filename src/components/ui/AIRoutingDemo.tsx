"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface PipelineStage {
  id: string;
  name: string;
  shortName: string;
  cost: string;
  costValue: number;
  description: string;
  color: string;
}

const PIPELINE_STAGES: PipelineStage[] = [
  {
    id: "moderation",
    name: "Content Moderation",
    shortName: "Moderation",
    cost: "$0.001",
    costValue: 0.001,
    description: "AWS Rekognition",
    color: "#ef4444",
  },
  {
    id: "background",
    name: "Background Removal",
    shortName: "BG Remove",
    cost: "$0.003",
    costValue: 0.003,
    description: "BiRefNet",
    color: "#8b5cf6",
  },
  {
    id: "vision",
    name: "Vision Analysis",
    shortName: "Vision",
    cost: "$0.001",
    costValue: 0.001,
    description: "Florence-2",
    color: "#3b82f6",
  },
  {
    id: "embeddings",
    name: "Fashion Embeddings",
    shortName: "Embeddings",
    cost: "$0.00002",
    costValue: 0.00002,
    description: "FashionSigLIP",
    color: "#10b981",
  },
  {
    id: "reasoning",
    name: "Reasoning",
    shortName: "Reasoning",
    cost: "$0.002",
    costValue: 0.002,
    description: "Gemini 2.5 Flash",
    color: "#f97316",
  },
  {
    id: "storage",
    name: "Vector Storage",
    shortName: "Storage",
    cost: "—",
    costValue: 0,
    description: "pgvector",
    color: "#6366f1",
  },
];

interface QueryExample {
  text: string;
  type: "simple" | "complex";
  stages: string[];
  totalCost: string;
}

const QUERY_EXAMPLES: QueryExample[] = [
  {
    text: "Does this shirt match these pants?",
    type: "simple",
    stages: ["vision", "embeddings", "reasoning"],
    totalCost: "$0.003",
  },
  {
    text: "Build me a capsule wardrobe",
    type: "complex",
    stages: ["moderation", "background", "vision", "embeddings", "reasoning", "storage"],
    totalCost: "$0.01",
  },
  {
    text: "What's my style profile?",
    type: "simple",
    stages: ["embeddings", "reasoning", "storage"],
    totalCost: "$0.002",
  },
];

export function AIRoutingDemo() {
  const [activeStage, setActiveStage] = useState<number>(-1);
  const [currentQuery, setCurrentQuery] = useState<number>(0);
  const [isAnimating, setIsAnimating] = useState(true);
  const [runningCost, setRunningCost] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const animateQuery = useCallback(() => {
    const query = QUERY_EXAMPLES[currentQuery];
    const activeStages = PIPELINE_STAGES.filter((s) => query.stages.includes(s.id));

    setRunningCost(0);
    setActiveStage(-1);
    setShowComparison(false);

    let stageIndex = 0;
    let accumulatedCost = 0;

    const animateStage = () => {
      if (stageIndex < activeStages.length) {
        const globalIndex = PIPELINE_STAGES.findIndex(
          (s) => s.id === activeStages[stageIndex].id
        );
        setActiveStage(globalIndex);
        accumulatedCost += activeStages[stageIndex].costValue;
        setRunningCost(accumulatedCost);
        stageIndex++;
        setTimeout(animateStage, 600);
      } else {
        setShowComparison(true);
        setTimeout(() => {
          setCurrentQuery((prev) => (prev + 1) % QUERY_EXAMPLES.length);
        }, 2500);
      }
    };

    setTimeout(animateStage, 500);
  }, [currentQuery]);

  useEffect(() => {
    if (!isClient || !isAnimating) return;
    animateQuery();
  }, [currentQuery, isAnimating, isClient, animateQuery]);

  const query = QUERY_EXAMPLES[currentQuery];

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
            Live Pipeline
          </span>
        </div>
        <button
          onClick={() => setIsAnimating(!isAnimating)}
          className="font-mono text-xs text-text-muted hover:text-accent transition-colors"
        >
          {isAnimating ? "[pause]" : "[play]"}
        </button>
      </div>

      {/* Query Display */}
      <motion.div
        className="mb-6 p-3 rounded-lg border border-white/10 bg-bg-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className="font-mono text-xs text-text-muted block mb-1">Query:</span>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentQuery}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-sm text-text-primary"
              >
                &ldquo;{query.text}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>
          <div className="text-right">
            <span
              className={`inline-block px-2 py-0.5 rounded text-xs font-mono ${
                query.type === "simple"
                  ? "bg-green-500/20 text-green-400"
                  : "bg-accent/20 text-accent"
              }`}
            >
              {query.type}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Pipeline Visualization */}
      <div className="relative">
        {/* Connection lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          {PIPELINE_STAGES.slice(0, -1).map((_, i) => {
            const isActive =
              activeStage >= i && query.stages.includes(PIPELINE_STAGES[i].id);
            const nextIsActive =
              activeStage >= i + 1 &&
              query.stages.includes(PIPELINE_STAGES[i + 1].id);
            return (
              <motion.line
                key={i}
                x1="50%"
                y1={`${(i + 1) * (100 / PIPELINE_STAGES.length) - 2}%`}
                x2="50%"
                y2={`${(i + 1) * (100 / PIPELINE_STAGES.length) + 5}%`}
                stroke={isActive && nextIsActive ? "#f97316" : "rgba(255,255,255,0.1)"}
                strokeWidth="2"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Stage nodes */}
        <div className="relative z-10 space-y-2">
          {PIPELINE_STAGES.map((stage, index) => {
            const isActive = query.stages.includes(stage.id);
            const isCurrentlyProcessing = activeStage === index;
            const isProcessed = activeStage > index && isActive;

            return (
              <motion.div
                key={stage.id}
                className={`relative flex items-center gap-3 p-3 rounded-lg border transition-all duration-300 ${
                  isCurrentlyProcessing
                    ? "border-accent bg-accent/10"
                    : isProcessed
                      ? "border-white/20 bg-white/5"
                      : isActive
                        ? "border-white/10 bg-bg-secondary"
                        : "border-white/5 bg-bg-secondary/50 opacity-40"
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {/* Stage indicator */}
                <div
                  className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCurrentlyProcessing
                      ? "bg-accent"
                      : isProcessed
                        ? "bg-white/20"
                        : "bg-white/10"
                  }`}
                  style={{
                    boxShadow: isCurrentlyProcessing
                      ? `0 0 20px ${stage.color}40`
                      : "none",
                  }}
                >
                  {isCurrentlyProcessing && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-accent"
                      animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                  )}
                  <span className="font-mono text-xs text-bg-primary font-bold">
                    {index + 1}
                  </span>
                </div>

                {/* Stage info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-text-primary truncate">
                      {stage.shortName}
                    </span>
                    <span className="text-xs text-text-muted hidden sm:inline">
                      {stage.description}
                    </span>
                  </div>
                </div>

                {/* Cost */}
                <div className="text-right">
                  <motion.span
                    className={`font-mono text-xs ${
                      isCurrentlyProcessing || isProcessed
                        ? "text-accent"
                        : "text-text-muted"
                    }`}
                    animate={
                      isCurrentlyProcessing
                        ? { scale: [1, 1.1, 1] }
                        : { scale: 1 }
                    }
                    transition={{ duration: 0.3 }}
                  >
                    {stage.cost}
                  </motion.span>
                </div>

                {/* Processing indicator */}
                {isCurrentlyProcessing && (
                  <motion.div
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="flex gap-0.5">
                      {[0, 1, 2].map((i) => (
                        <motion.div
                          key={i}
                          className="w-1 h-3 bg-accent rounded-full"
                          animate={{ scaleY: [0.5, 1, 0.5] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.1,
                          }}
                        />
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Cost Summary */}
      <motion.div
        className="mt-6 p-4 rounded-lg border border-white/10 bg-bg-secondary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <span className="font-mono text-xs text-text-muted block">
              Running Cost
            </span>
            <motion.span
              key={runningCost}
              className="font-mono text-2xl font-bold text-accent"
              initial={{ scale: 1.2 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              ${runningCost.toFixed(5)}
            </motion.span>
          </div>

          <AnimatePresence>
            {showComparison && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="text-right"
              >
                <span className="font-mono text-xs text-text-muted block">
                  vs. GPT-4 Direct
                </span>
                <span className="font-mono text-lg text-red-400 line-through">
                  $0.03
                </span>
                <span className="font-mono text-xs text-green-400 ml-2">
                  10x cheaper
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress bar */}
        <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-accent rounded-full"
            initial={{ width: "0%" }}
            animate={{
              width: `${(runningCost / 0.01) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="mt-1 flex justify-between font-mono text-[10px] text-text-muted">
          <span>$0</span>
          <span>$0.01 budget</span>
        </div>
      </motion.div>

      {/* Query selector */}
      <div className="mt-4 flex gap-2">
        {QUERY_EXAMPLES.map((q, i) => (
          <button
            key={i}
            onClick={() => {
              setCurrentQuery(i);
              setIsAnimating(true);
            }}
            className={`flex-1 py-2 px-3 rounded border text-xs font-mono transition-all ${
              currentQuery === i
                ? "border-accent bg-accent/10 text-accent"
                : "border-white/10 text-text-muted hover:border-white/20"
            }`}
          >
            {q.type}
          </button>
        ))}
      </div>
    </div>
  );
}

function StaticPipeline() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="mb-4 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-500" />
        <span className="font-mono text-xs text-text-muted uppercase tracking-wider">
          AI Pipeline
        </span>
      </div>
      <div className="space-y-2">
        {PIPELINE_STAGES.map((stage, index) => (
          <div
            key={stage.id}
            className="flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-bg-secondary"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
              <span className="font-mono text-xs text-text-muted font-bold">
                {index + 1}
              </span>
            </div>
            <div className="flex-1">
              <span className="text-sm font-medium text-text-primary">
                {stage.shortName}
              </span>
            </div>
            <span className="font-mono text-xs text-text-muted">{stage.cost}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
