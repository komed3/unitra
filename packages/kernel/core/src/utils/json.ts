export const safeJsonStringify = ( value: unknown, space?: string | number ) : string => {
  try {
    const seen = new WeakSet< object >();

    return JSON.stringify( value, ( _key: string, value: unknown ) => {
      if ( value instanceof Map ) return Object.fromEntries( value );
      if ( value instanceof Set ) return Array.from( value );
      if ( typeof value === 'bigint' ) return value.toString();

      if ( typeof value === 'object' && value !== null ) {
        if ( seen.has( value ) ) return '[Circular]';
        seen.add( value );
      }

      return value;
    }, space );
  } catch ( err ) {
    return `Unable to stringify value: ${ err instanceof Error ? err.message : String( err ) }`;
  }
};
