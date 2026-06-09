import type { AnyRef, RegistryKey } from '@unitra/types/core/registry';
import type { IParser, ParserResult, TokenCache } from '@unitra/types/core/service';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';

export class Parser implements IParser {
  private static log = Logging.createSource( 'parser' );
  private tokenCache: TokenCache | undefined;

  constructor ( private readonly ctx: UnitraContext ) {}

  private get token () : TokenCache {
    return this.tokenCache ??= ( () => {
      Parser.log.debug( 'populate token cache ...' );

      const token: TokenCache = new Map();
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

        token.set( key as RegistryKey, map );
        size += map.size;
      }

      Parser.log.debug( `token cache populated with ${ size } entries` );
      this.ctx.hook().run( 'core.service.parser.token', { token } );

      return token;
    } )();
  }

  private parseInput ( result: ParserResult, input: string ) : void {}

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
