interface EmptyStateProps {
  action?: string
  message: string
  onAction?: () => void
}

export default function EmptyState({
  action,
  message,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">○</div>
      <p>{message}</p>
      {action && onAction && (
        <button className="btn btn-wine" onClick={onAction} type="button">
          {action}
        </button>
      )}
    </div>
  )
}
