interface Props {
  message: string
  action?: string
  onAction?: () => void
}

export default function EmptyState({ message, action, onAction }: Props) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">📭</div>
      <p>{message}</p>
      {action && onAction && (
        <button className="btn btn-wine" onClick={onAction}>{action}</button>
      )}
    </div>
  )
}
