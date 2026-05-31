export const safeJsonStringify = ( value: unknown, space?: string | number ) : string => {
  try { return JSON.stringify( value, null, space ) }
  catch ( error ) { return `Unable to stringify value: ${ String( error ) }` }
};
