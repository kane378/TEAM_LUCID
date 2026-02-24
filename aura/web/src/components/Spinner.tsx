export default function Spinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div style={{ textAlign: 'center', padding: 80 }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
      <p style={{ color: '#718096', fontSize: 14 }}>{message}</p>
    </div>
  )
}
