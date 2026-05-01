export type PipelineNode = {
  id: string
  x: number
  y: number
  width: number
  height: number
  title: string
  sublabel?: string
  items?: readonly string[]
}

export type PipelineEdge = {
  from: string
  to: string
}

export type Pipeline = {
  viewBox: { width: number; height: number }
  nodes: readonly PipelineNode[]
  edges: readonly PipelineEdge[]
  cycleOrder: readonly string[]
}

const styleum: Pipeline = {
  viewBox: { width: 720, height: 360 },
  nodes: [
    {
      id: 'wardrobe',
      x: 25,
      y: 150,
      width: 130,
      height: 60,
      title: 'Wardrobe',
      sublabel: 'user photos',
    },
    {
      id: 'segmentation',
      x: 205,
      y: 70,
      width: 130,
      height: 60,
      title: 'Segmentation',
      sublabel: 'BiRefNet',
    },
    {
      id: 'body',
      x: 205,
      y: 230,
      width: 130,
      height: 60,
      title: 'Body Profile',
      sublabel: 'Rekognition',
    },
    {
      id: 'attributes',
      x: 385,
      y: 70,
      width: 130,
      height: 60,
      title: 'Attributes',
      sublabel: 'Florence-2',
    },
    {
      id: 'embeddings',
      x: 385,
      y: 230,
      width: 130,
      height: 60,
      title: 'Embeddings',
      sublabel: 'FashionSigLIP',
    },
    { id: 'outfit', x: 565, y: 150, width: 130, height: 60, title: 'Outfit', sublabel: 'Gemini' },
  ],
  edges: [
    { from: 'wardrobe', to: 'segmentation' },
    { from: 'wardrobe', to: 'body' },
    { from: 'segmentation', to: 'attributes' },
    { from: 'body', to: 'embeddings' },
    { from: 'attributes', to: 'outfit' },
    { from: 'embeddings', to: 'outfit' },
  ],
  cycleOrder: ['wardrobe', 'segmentation', 'body', 'attributes', 'embeddings', 'outfit'],
}

const hazardlens: Pipeline = {
  viewBox: { width: 720, height: 360 },
  nodes: [
    {
      id: 'camera',
      x: 25,
      y: 150,
      width: 130,
      height: 60,
      title: 'Camera Feed',
      sublabel: 'live video',
    },
    {
      id: 'yolo',
      x: 205,
      y: 70,
      width: 130,
      height: 60,
      title: 'YOLO26',
      sublabel: 'PPE detection',
    },
    { id: 'zones', x: 205, y: 230, width: 130, height: 60, title: 'Zones', sublabel: 'site map' },
    {
      id: 'tracker',
      x: 385,
      y: 70,
      width: 130,
      height: 60,
      title: 'Tracker',
      sublabel: 'centroids',
    },
    {
      id: 'risk',
      x: 385,
      y: 230,
      width: 130,
      height: 60,
      title: 'Risk Engine',
      sublabel: 'severity',
    },
    {
      id: 'dashboard',
      x: 565,
      y: 150,
      width: 130,
      height: 60,
      title: 'Dashboard',
      sublabel: 'alerts',
    },
  ],
  edges: [
    { from: 'camera', to: 'yolo' },
    { from: 'camera', to: 'zones' },
    { from: 'yolo', to: 'tracker' },
    { from: 'zones', to: 'risk' },
    { from: 'tracker', to: 'dashboard' },
    { from: 'risk', to: 'dashboard' },
  ],
  cycleOrder: ['camera', 'yolo', 'zones', 'tracker', 'risk', 'dashboard'],
}

const llmRouter: Pipeline = {
  viewBox: { width: 720, height: 360 },
  nodes: [
    { id: 'prompt', x: 18, y: 150, width: 110, height: 60, title: 'Prompt', sublabel: 'request' },
    {
      id: 'signals',
      x: 158,
      y: 70,
      width: 110,
      height: 60,
      title: 'Signals',
      sublabel: '6 features',
    },
    {
      id: 'budget',
      x: 158,
      y: 230,
      width: 110,
      height: 60,
      title: 'Budget',
      sublabel: 'cost rules',
    },
    { id: 'classifier', x: 298, y: 150, width: 110, height: 60, title: 'Classifier' },
    {
      id: 'providers',
      x: 438,
      y: 70,
      width: 138,
      height: 220,
      title: 'Provider Pool',
      items: ['GPT-4', 'Claude', 'Gemini', 'DeepSeek'],
    },
    { id: 'response', x: 606, y: 150, width: 96, height: 60, title: 'Response' },
  ],
  edges: [
    { from: 'prompt', to: 'signals' },
    { from: 'prompt', to: 'budget' },
    { from: 'signals', to: 'classifier' },
    { from: 'budget', to: 'classifier' },
    { from: 'classifier', to: 'providers' },
    { from: 'providers', to: 'response' },
  ],
  cycleOrder: ['prompt', 'signals', 'budget', 'classifier', 'providers', 'response'],
}

export const PIPELINES: Record<string, Pipeline> = {
  styleum,
  hazardlens,
  'llm-router': llmRouter,
}

export const NODE_GLOW_HOLD_MS = 1200
export const NODE_GLOW_GAP_MS = 300
