export function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="relative w-10 h-10">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="w-10 h-10 border-4 border-eco-mint rounded-full animate-spin border-t-eco-green"></div>
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  )
} 