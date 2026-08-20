interface MessageProps {
  message?: string;
}

export function LoadingState() {
  return <p className="state-box">Loading data...</p>;
}

export function ErrorState({ message = 'Something went wrong.' }: MessageProps) {
  return <p className="state-box state-box--error">{message}</p>;
}

export function EmptyState({ message = 'No data available.' }: MessageProps) {
  return <p className="state-box">{message}</p>;
}
