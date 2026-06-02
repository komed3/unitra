import type { SerializedError } from '@unitra/types/error';
import { UnitraError } from './UnitraError';

export function serializeError ( error: Error ) : SerializedError;
export function serializeError ( error: unknown ) : unknown;

export function serializeError ( error: unknown ) : SerializedError | unknown {
  if ( ! ( error instanceof Error ) ) return error;

  return { ...{
    name: error.name, message: error.message, stack: error.stack,
    cause: serializeError( ( error as Error & { cause?: unknown } ).cause )
  }, ...( error instanceof UnitraError ? {
    code: error.code, summary: error.summary, data: error.data
  } : {} ) };
};
