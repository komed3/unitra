import { UnitraError } from './UnitraError';

export const catchToError = < T > ( fn: () => T ) : T | UnitraError => {
  try { return fn() }
  catch ( err ) { return UnitraError.from( err ) }
};

export const matchError = < T > (
  value: T | UnitraError,
  onError: 'log' | 'print' | ( ( error: UnitraError ) => void )
) : T | undefined => {
  if ( ! UnitraError.is( value ) ) return value;

  return onError === 'log' ? ( value.log(), undefined )
    : onError === 'print' ? ( console.log( value.format() ), undefined )
    : ( onError( value ), undefined );
};

