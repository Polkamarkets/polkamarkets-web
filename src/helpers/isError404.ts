import type { SerializedError } from '@reduxjs/toolkit';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';

export default function isError404(
  error?: FetchBaseQueryError | SerializedError
) {
  return typeof error === 'object' && 'status' in error && error.status === 404;
}
