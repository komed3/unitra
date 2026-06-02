export const safeJsonStringify = ( value: unknown, space?: string | number ) : string => {
  try {
    const seen = new WeakSet< object >();

    return JSON.stringify( value, ( _key, value ) => {
      if ( value instanceof Map ) return Object.fromEntries( value );
      if ( value instanceof Set ) return Array.from( value );
      if ( typeof value === 'bigint' ) return value.toString();

      if ( typeof value === 'object' && value !== null ) {
        if ( seen.has( value ) ) return '[Circular]';
        seen.add( value );
      }

      return value;
    }, space );
  } catch ( error ) {
    return `Unable to stringify value: ${ String( error ) }`;
  }
};
