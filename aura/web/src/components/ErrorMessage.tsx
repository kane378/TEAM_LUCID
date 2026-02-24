interface Props {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: Props) {
  return (
    <div style={{ textAlign: 'center', padding: 60 }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
      <p style={{ color: '#e53e3e', marginBottom: 16, fontSize: 14 }}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} style={{ padding: '8px 20px', background: '#6C63FF', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 600 }}>
          Try Again
        </button>
      )}
    </div>
  )
}
