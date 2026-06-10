import type { AnyRef, RegistryKey } from '@unitra/types/core/registry';
import type { IParser, ParserResult, ParserToken, TokenCache } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';

export class Parser implements IParser {
  private static readonly OPERATOR_MAP = {
    '*': '*', '×': '*', '·': '*', '/': '/', '^': '^'
  } as const;

  private static readonly DIGIT_MAP = [ '.', 'e', '-', '+', '/' ];

  private static readonly NATURAL_MAP = {
    'per': '/', 'over': '/', 'square': '^2', 'squared': '^2',
    'cube': '^3', 'cubed': '^3'
  } as const;

  private static log = Logging.createSource( 'parser' );
  private tokenCache: TokenCache | undefined;

  constructor ( private readonly ctx: UnitraContext ) {}

  private get tokens () : TokenCache {
    return this.tokenCache ??= ( () => {
      Parser.log.debug( 'populate token cache ...' );

      const tokens: TokenCache = new Map();
      let size = 0;

      for ( const [ key, reg ] of Object.entries( this.ctx.registry ) ) {
        const map = new Map< string, [ AnyRef, boolean ] >();

        for ( const item of reg().values() ) {
          const prefixable = 'prefixable' in item && item.prefixable;
          map.set( item.id, [ item.id, prefixable ] );

          if ( 'aliases' in item && item.aliases?.length )
            for ( const alias of item.aliases )
              map.set( alias, [ item.id, prefixable ] );
        }

        tokens.set( key as RegistryKey, map );
        size += map.size;
      }

      Parser.log.debug( `token cache populated with ${ size } entries` );
      this.ctx.hook().run( 'core.service.parser.cache', { tokens } );

      return tokens;
    } )();
  }

  private isDigit ( c: string ) : boolean {
    return c >= '0' && c <= '9';
  }

  private isAlpha ( c: string ) : boolean {
    return ( c >= 'a' && c <= 'z' ) || ( c >= 'A' && c <= 'Z' );
  }

  private parseNumber ( raw: string ) : number {
    return 0;
  }

  private tokenize ( input: string ) : ParserToken[] {
    const tokens: ParserToken[] = [];
    let i = 0;

    const pushOperator = ( op: string ) => {
      const mapped = Parser.OPERATOR_MAP[ op as keyof typeof Parser.OPERATOR_MAP ];
      if ( mapped ) tokens.push( { type: 'operator', value: mapped } );
    };

    const pushNatural = ( nat: string ) => {
      const mapped = Parser.NATURAL_MAP[ nat as keyof typeof Parser.NATURAL_MAP ];
      if ( mapped ) {
        if ( mapped === '^2' || mapped === '^3' ) {
          tokens.push( { type: 'operator', value: '^' } );
          tokens.push( { type: 'number', value: Number( mapped.slice( 1 ) ) } );
        }

        else tokens.push( { type: 'operator', value: mapped } );
      }
    };

    while ( i < input.length ) {
      const c = input[ i ];

      if ( c === ' ' || c === '\t' || c === '\n' ) { i++; continue }
      if ( Object.keys( Parser.OPERATOR_MAP ).includes( c ) ) { pushOperator( c ); i++; continue }
      if ( c === '(' ) { tokens.push( { type: 'lparen' } ); i++; continue }
      if ( c === ')' ) { tokens.push( { type: 'rparen' } ); i++; continue }

      if ( this.isDigit( c ) || c === '.' ) {
        let start = i, hasSlash = false;

        while ( i < input.length ) {
          const ch = input[ i ];
          if ( ! this.isDigit( ch ) && ! Parser.DIGIT_MAP.includes( ch ) ) break;
          if ( ch === '/' ) hasSlash = true;
          i++;
        }

        const raw = input.slice( start, i );
        tokens.push( { type: 'number', value: this.parseNumber( raw ) } );
        continue;
      }

      if ( this.isAlpha( c ) ) {
        let start = i;

        while ( i < input.length && this.isAlpha( input[ i ] ) ) i++;
        let raw = input.slice( start, i ).toLowerCase();

        if ( raw in Parser.NATURAL_MAP ) pushNatural( raw );
        else tokens.push( { type: 'identifier', value: raw } );
        continue;
      }

      throw new ParserError(
        `unexpected character "${ c }" at position ${ i }`,
        { context: { input, position: i } }
      );
    }

    this.ctx.hook().run( 'core.service.parser.tokenize', { input, tokens } );
    return this.insertImplicitMultiplication( tokens );
  }

  private insertImplicitMultiplication ( tokens: ParserToken[] ) : ParserToken[] {
    const result: ParserToken[] = [];

    const isValue = ( t: ParserToken ) =>
      t.type === 'number' || t.type === 'identifier' || t.type === 'rparen';

    const isValueStart = ( t: ParserToken ) =>
      t.type === 'number' || t.type === 'identifier' || t.type === 'lparen';

    for ( let i = 0; i < tokens.length; i++ ) {
      const curr = tokens[ i ];
      const next = tokens[ i + 1 ];

      result.push( curr );
      if ( ! next ) continue;

      if ( isValue( curr ) && isValueStart( next ) )
        result.push( { type: 'operator', value: '*' } );
    }

    return result;
  }

  private parseInput ( result: ParserResult, input: string ) : void {
    try {
      const tokens = this.tokenize( input );
    } catch ( err ) {
      if ( err instanceof ParserError ) result.error = err;
      else result.error = new ParserError( 'failed to parse input', { context: { input }, cause: err } );
    }
  }

  public parse ( input: unknown ) : ParserResult {
    input = this.ctx.hook().run( 'core.service.parser.before', {}, input );
    const result = { state: { nodes: [] } } as ParserResult;

    if ( this.ctx.service.assert().isState( input ) ) result.state = input;

    else if ( this.ctx.service.assert().isSerializedState( input ) ) {
      try { result.state = this.ctx.service.serialize().toReferenceState( input ) }
      catch ( err ) { result.error = new ParserError(
        'failed to parse serialized state',
        { context: { input }, cause: err }
      ) }
    }

    else this.parseInput( result, String( input ) );

    this.ctx.hook().run( 'core.service.parser.after', { result, input } );
    return result;
  }
}
