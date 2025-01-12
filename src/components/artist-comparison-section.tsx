import Image from 'next/image';

export default function ArtistComparisonSection() {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between w-full max-w-6xl gap-8 p-8">
      <div className="flex flex-col gap-6 max-w-xl">
        <h1 className="text-5xl font-bold">
          Artist Comparison
          <br />
          by Viberate
        </h1>
        <p className="text-lg text-gray-700 dark:text-gray-300">
          Compare the social media and streaming stats of any two artists out there.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="#"
            className="bg-[#4154F1] text-white px-6 py-3 rounded-md hover:bg-[#3445d2] transition-colors"
          >
            Get Started For Free
          </a>
          <div className="flex items-center gap-2 text-sm">
            <span className="rotate-[-45deg] text-lg">↙</span>
            <span>Full Analytics Only $19.90/mo</span>
          </div>
        </div>
        <p className="text-sm">No credit card required!</p>
      </div>
      
      <div className="relative w-full max-w-md">
        <Image
          src="/comparison-preview.png"
          alt="Artist comparison dashboard preview"
          width={500}
          height={400}
          className="rounded-lg shadow-xl"
        />
      </div>
    </div>
  );
}
