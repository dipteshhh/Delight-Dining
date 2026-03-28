interface Props {
  type?: 'menu' | 'admin'
  count?: number
}

export default function LoadingSkeleton({ type = 'menu', count = 4 }: Props) {
  if (type === 'admin') {
    return (
      <div className="skeleton-admin">
        {Array.from({ length: count }).map((_, i) => (
          <div className="skeleton-row" key={i}>
            <div className="skeleton-block" style={{ width: '30%' }} />
            <div className="skeleton-block" style={{ width: '20%' }} />
            <div className="skeleton-block" style={{ width: '15%' }} />
            <div className="skeleton-block" style={{ width: '10%' }} />
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="menu-list">
      {Array.from({ length: count }).map((_, i) => (
        <div className="skeleton-card" key={i}>
          <div className="skeleton-block skeleton-emoji" />
          <div style={{ flex: 1 }}>
            <div className="skeleton-block" style={{ width: '60%', height: 20, marginBottom: 8 }} />
            <div className="skeleton-block" style={{ width: '100%', height: 14, marginBottom: 6 }} />
            <div className="skeleton-block" style={{ width: '80%', height: 14 }} />
          </div>
        </div>
      ))}
    </div>
  )
}
