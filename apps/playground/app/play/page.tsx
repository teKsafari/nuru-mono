import ElectronicsSimulator from "@/components/(electronics)/electronics-simulator";

export default function PlayPage() {
  return (
    <main className="font-mono min-h-screen p-4 md:p-8 pt-14 bg-background">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-foreground">Nuru Playground</h1>
        <p className="mb-8 text-muted-foreground">
          Andika kodi ya vifaa vya elektroniki kwa lugha unayopenda zaidi - Nuru!
        </p>
        <ElectronicsSimulator />
      </div>
    </main>
  );
}
