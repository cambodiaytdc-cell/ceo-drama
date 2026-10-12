import VideoPlayer from '@/components/VideoPlayer';

export default function Page() {
  return (
    <main className="min-h-screen bg-[#0b0f19] text-white flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-5xl mb-6 text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Cinematic Modular Video Player</h1>
        <p className="text-gray-400 text-sm">Separated into Dedicated Desktop & Mobile Players</p>
      </div>
      <VideoPlayer />
    </main>
  );
}
