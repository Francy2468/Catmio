export default function LoadingSpinner({ size = 'md' }) {
  const sizes = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-[3px]',
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div
        className={`${sizes[size] || sizes.md} border-blue-500 border-t-transparent rounded-full animate-spin`}
      />
    </div>
  )
}
