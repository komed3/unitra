import type { AnyRef, RegistryKey } from '@unitra/types/core/registry';
import type { IParser, ParserResult, ParserToken, TokenCache } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';

export class Parser implements IParser {
  private static readonly OPERATOR_MAP = {
    '*': '*', '×': '*', '·': '*', '/': '/', 'per': '/', '^': '^'
  } as const;

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

  private parseInput ( result: ParserResult, input: string ) : void {}

  private tokenize ( input: string ) : ParserToken[] {
    const tokens: ParserToken[] = [];
    let i = 0;

    const peek = () => input[ i ];
    const next = () => input[ i++ ];

    const pushOperator = ( op: string ) => {
      const mapped = Parser.OPERATOR_MAP[ op as keyof typeof Parser.OPERATOR_MAP ];
      if ( mapped ) tokens.push( { type: 'operator', value: mapped } );
    };

    while ( i < input.length ) {
      let c = peek();

      if ( c === ' ' || c === '\t' || c === '\n' ) { i++; continue }
      if ( c === '(' ) { tokens.push( { type: 'lparen' } ); i++; continue }
      if ( c === ')' ) { tokens.push( { type: 'rparen' } ); i++; continue }
      if ( c === '*' || c === '/' || c === '^' || c === '×' || c === '·' ) { pushOperator( c ); i++; continue }
    }

    this.ctx.hook().run( 'core.service.parser.tokenize', { input, tokens } );
    return tokens;
  }

  public parse ( input: unknown ) : ParserResult {
    input = this.ctx.hook().run( 'core.service.parser.before', {}, input );
    const result = { state: { nodes: [] } } as ParserResult;

    if ( this.ctx.service.assert().isState( input ) ) result.state = input;

    else if ( this.ctx.service.assert().isSerializedState( input ) ) {
      try { result.state = this.ctx.service.serialize().toReferenceState( input ) }
      catch ( err ) { result.error = new ParserError(
        'failed to parse serialized state', { context: { input }, cause: err }
      ) }
    }

    else this.parseInput( result, String( input ) );

    this.ctx.hook().run( 'core.service.parser.after', { result, input } );
    return result;
  }
}
