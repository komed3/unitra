import type { ParserGrammar } from '@unitra/types/core/parser';
import type { AnyRef, RegistryKey } from '@unitra/types/core/registry';
import type { UnitraContext } from '@unitra/types/core/unitra';
import { Logging } from '../../utils/logging';

export class Grammar {
  private static readonly log = Logging.createSource( 'parser::grammar' );
  private cache: ParserGrammar | undefined;

  constructor ( private readonly ctx: UnitraContext ) {}

  private populateGrammarCache () : ParserGrammar {
    Grammar.log.debug( 'populate cache ...' );

    const grammar: ParserGrammar = new Map();
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

      grammar.set( key as RegistryKey, map );
      size += map.size;
    }

    Grammar.log.debug( `cache populated with ${ size } entries` );
    this.ctx.hook().run( 'core.parser.grammar', { grammar, size } );

    return grammar;
  }

  public get grammar () : ParserGrammar {
    return this.cache ??= this.populateGrammarCache();
  }
}
