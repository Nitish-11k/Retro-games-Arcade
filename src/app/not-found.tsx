import Link from 'next/link'
import { Button } from '@/components/ui/button'
 
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 flex items-center justify-center">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-red-400 font-headline">404</h1>
        <h2 className="text-2xl font-semibold">Page Not Found</h2>
        <p className="text-gray-400 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Return Home
          </Button>
        </Link>
      </div>
    </div>
  )
}