import { UnitraError } from './UnitraError';

export const handleError = ( err: unknown, safe: boolean = true ) => {
  const error = UnitraError.from( err );

  if ( safe ) throw error.format();
  error.log();
};

export const catchToError = < T > ( fn: () => T, safe: boolean = true ) => {
  try { return fn() }
  catch ( err ) { handleError( err, safe ) }
}
