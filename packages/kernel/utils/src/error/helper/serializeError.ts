import type { SerializedError } from '@unitra/types/error';
import { UnitraError } from '../UnitraError';

export function serializeError ( error: Error ) : SerializedError;
export function serializeError ( error: unknown ) : unknown;

export function serializeError ( error: unknown ) : SerializedError | unknown {
  if ( ! ( error instanceof Error ) ) return error;

  return {
    name: error.name,
    code: error instanceof UnitraError ? error.code : undefined,
    message: error.message,
    stack: error.stack,
    data: error instanceof UnitraError ? error.data : undefined,
    cause: serializeError( ( error as Error & { cause?: unknown } ).cause )
  };
};
