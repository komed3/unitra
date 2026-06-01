import { UnitraError } from './UnitraError';

export const catchToError = < T > ( fn: () => T ) : T | UnitraError => {
  try { return fn() }
  catch ( err ) { return UnitraError.from( err ) }
};
