import type { GrammarToken, ParserGrammar, ParserGrammarMap } from '@unitra/types/core/parser';
import type { RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';

export class Grammar {
  private static readonly log = Logging.createSource( 'parser::grammar' );
  private cache: ParserGrammar | undefined;

  constructor ( private readonly ctx: UnitraContext ) {}

  private setOrThrow < K extends RegistryKey > (
    key: K, map: ParserGrammarMap< K >, ref: RefOf< K >,
    value: string, prefixable: boolean
  ) : void {
    if ( map.has( value ) ) throw new ParserError(
      `duplicate reference "${ value }" for ${ key } "${ ref }"`,
      { context: {} }
    );

    map.set( value, { ref, key, prefixable } );
  }

  private populateGrammarCache () : ParserGrammar {
    Grammar.log.debug( 'populate cache ...' );

    const grammar: ParserGrammar = {};
    let size = 0;

    for ( const [ k, reg ] of Object.entries( this.ctx.registry ) ) {
      const key = k as RegistryKey;
      const map = new Map();

      for ( const item of reg().values() ) {
        const prefixable = 'prefixable' in item && item.prefixable;
        this.setOrThrow( key, map, item.id, item.id, prefixable );

        if ( 'aliases' in item && item.aliases?.length )
          for ( const alias of item.aliases )
            this.setOrThrow( key, map, item.id, alias, prefixable );
      }

      grammar[ key ] = map;
      size += map.size;
    }

    Grammar.log.debug( `cache populated with ${ size } entries` );
    this.ctx.hook().run( 'core.parser.grammar', { grammar, size } );

    return grammar;
  }

  public get grammar () : ParserGrammar {
    return this.cache ??= this.populateGrammarCache();
  }

  public get < K extends RegistryKey > ( key: K ) : ParserGrammarMap< K > | undefined {
    return this.grammar[ key ];
  }

  public find < K extends RegistryKey > ( key: K, input: string ) : GrammarToken< K > | undefined {
    return this.grammar[ key ]?.get( input );
  }

  public keys () : RegistryKey[] {
    return Object.keys( this.grammar ) as RegistryKey[];
  }
}
