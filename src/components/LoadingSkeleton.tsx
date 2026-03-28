interface LoadingSkeletonProps {
  count?: number
  type?: 'admin' | 'card' | 'menu'
}

export default function LoadingSkeleton({
  count = 3,
  type = 'card',
}: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, index) => index)
  const wrapperClass =
    type === 'menu'
      ? 'menu-list'
      : type === 'admin'
        ? 'skeleton-admin'
        : 'skeleton-grid'

  return (
    <div className={wrapperClass}>
      {items.map((item) => (
        <div className="skeleton-card" key={item}>
          <div className="skeleton-block skeleton-emoji" />
          <div className="skeleton-body">
            <div className="skeleton-block skeleton-line skeleton-line-lg" />
            <div className="skeleton-block skeleton-line skeleton-line-md" />
            <div className="skeleton-block skeleton-line skeleton-line-sm" />
          </div>
        </div>
      ))}
    </div>
  )
}
