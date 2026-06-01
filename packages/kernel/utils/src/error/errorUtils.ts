import { UnitraError } from './UnitraError';

export const catchToError = < T > ( fn: () => T, safe: boolean = true ) => {
  try { return fn() } catch ( err: unknown ) {
    const error = UnitraError.from( err );

    if ( safe ) throw error.format();
    error.log();
  }
}
