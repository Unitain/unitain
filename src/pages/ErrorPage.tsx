import { AlertCircle } from "lucide-react"
import { Link } from "react-router-dom"

export default function ErrorPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16 text-center">
      <div className="mb-6 rounded-full bg-red-100 p-3 text-red-600 dark:bg-red-900/20 dark:text-red-400">
        <AlertCircle className="h-8 w-8" />
      </div>
      <h1 className="mb-3 text-3xl font-bold tracking-tight">Oops! Something went wrong...</h1>
      <p className="mb-6 text-muted-foreground">We couldn't find the page you're looking for.</p>
      <Link
        to="/"
        className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
      >
        Go back to homepage
      </Link>
    </div>
  )
}
