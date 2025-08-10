import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
      <h1 className="text-3xl md:text-4xl font-headline">Page Not Found</h1>
      <p className="mt-3 text-muted-foreground max-w-xl">
        The page you’re looking for doesn’t exist. Try heading back to the arcade and pick a game!
      </p>
      <div className="mt-6">
        <Link href="/" className="underline">Return to Home</Link>
      </div>
    </main>
  );
}


