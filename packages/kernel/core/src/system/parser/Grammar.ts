import type { GrammarToken, IGrammar, ParserGrammar, ParserGrammarMap } from '@unitra/types/core/parser';
import type { RefOf, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { ParserError } from '../../utils/error';
import { Logging } from '../../utils/logging';

export class Grammar implements IGrammar {
  private static readonly log = Logging.createSource( 'parser::grammar' );
  private cache: ParserGrammar | null = null;

  constructor ( private readonly ctx: UnitraContext ) {}

  private setOrThrow < K extends RegistryKey > ( key: K, ref: RefOf< K >, value: string, prefixable: boolean ) : number {
    if ( this.cache && key in this.cache && this.cache[ key ]?.has( value ) )
      throw new ParserError( `duplicate reference "${ value }" for ${ key } "${ ref }"`, { context: {} } );

    ( ( this.cache ??= {} )[ key ] ??= new Map() ).set( value, { ref, key, prefixable } );
    return 1;
  }

  private populateGrammarCache () : void {
    Grammar.log.debug( 'populate cache ...' );
    let size = 0;

    for ( const [ k, reg ] of Object.entries( this.ctx.registry ) ) {
      const key = k as RegistryKey;

      for ( const item of reg().values() ) {
        const prefixable = 'prefixable' in item && item.prefixable;
        size += this.setOrThrow( key, item.id, item.id, prefixable );

        if ( 'aliases' in item && item.aliases?.length )
          for ( const alias of item.aliases )
            size += this.setOrThrow( key, item.id, alias, prefixable );
      }
    }

    Grammar.log.debug( `cache populated with ${ size } entries` );
    this.ctx.hook().run( 'core.parser.grammar', { grammar: this.cache!, size } );
  }

  public get grammar () : ParserGrammar {
    if ( ! this.cache ) this.populateGrammarCache();
    return this.cache!;
  }

  public invalidate () : void {
    Grammar.log.debug( 'invalidate cache' );
    this.cache = null;
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
