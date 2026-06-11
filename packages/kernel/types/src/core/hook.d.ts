import type { ReferenceState } from '../node';
import type { AnyToken, ParsedFactor, ParserGrammar, ParserResult, ParserToken } from './parser';
import type { IUnitra, UnitraContext } from './unitra';

export interface HookRegistry {
  'core.bootstrap.init': {
    ctx: {};
  };
  'core.factory.unit.next': {
    ctx: {
      state: ReferenceState;
    };
  };
  'core.parser.grammar': {
    ctx: {
      grammar: ParserGrammar;
      size: number;
    };
  };
  'core.parser.factorize': {
    ctx: {
      tokens: AnyToken[];
      factors: ParsedFactor[];
    };
  };
  'core.parser.input': {
    ctx: {};
    value: unknown;
  };
  'core.parser.result': {
    ctx: {
      result: ParserResult;
    };
  };
  'core.parser.tokenize': {
    ctx: {
      input: string;
      tokens: ParserToken[];
    };
  };
  'core.service.deserialize': {
    ctx: {
      state: ReferenceState;
    };
  };
  'core.service.serialize': {
    value: string;
    ctx: {
      state: ReferenceState;
    };
  };
  'core.unitra.create': {
    ctx: {
      self: IUnitra;
    }
  };
}

export type HookId = keyof HookRegistry;
export type HookSpec< K extends HookId > = HookRegistry[ K ];
export type HookCtx< K extends HookId > = HookSpec< K >[ 'ctx' ];

export type HookValue< K extends HookId > =
  HookSpec< K > extends { value: infer V }
    ? V
    : void;

export type HookHandler< K extends HookId > =
  HookSpec< K > extends { value: infer V }
    ? ( ctx: UnitraContext, hookCtx: HookCtx< K >, value: V ) => V
    : ( ctx: UnitraContext, hookCtx: HookCtx< K > ) => void;

export type HookPipeline< K extends HookId > = (
  hookCtx: HookCtx< K >,
  value?: HookValue< K >
) => HookValue< K > | undefined;

export type HookDef< K extends HookId > = {
  handler: HookHandler< K >;
  priority?: number;
};

export type HookImplMap = {
  readonly [ K in HookId ]?:
    ReadonlyArray< HookDef< K > >;
};

export type HookEntries = Array< [
  HookId,
  ReadonlyArray< HookDef< HookId > >
] >;

export interface IHookEngine {
  invalidate ( id: HookId ) : void;
  add < K extends HookId > ( id: K, handler: HookHandler< K >, priority?: number ) : void;
  merge ( hooks: HookImplMap ) : void;
  run < K extends HookId > ( id: K, hookCtx: HookCtx< K >, value?: HookValue< K > ) : HookValue< K >;
}

export type HookAccessor = () => IHookEngine;
