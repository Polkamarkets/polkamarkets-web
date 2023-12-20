import { useState } from 'react';

export default function useTruncatedText(text: string, maxLength: number) {
  const [truncated, setTruncated] = useState(text.length > maxLength);

  return {
    text: truncated ? `${text.slice(0, maxLength)}...` : text,
    truncated,
    setTruncated
  };
}
