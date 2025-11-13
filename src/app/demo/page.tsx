import { GlowingEffectDemo } from "@/components/ui/glowing-effect-demo";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Glowing Effect Demo</h1>
          <p className="text-lg text-muted-foreground">
            Hover over the cards to see the glowing effect in action
          </p>
        </div>
        <GlowingEffectDemo />
      </div>
    </div>
  );
}

