import type { ReferenceState } from './node';

export interface HookRegistry {
  'core.service.serialize': {
    ctx: {
      state: ReferenceState;
    };
    value: string;
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
    ? ( ctx: HookCtx< K >, value: V ) => V
    : ( ctx: HookCtx< K > ) => void;

export type HookDef< K extends HookId > = {
  handler: HookHandler< K >;
  priority?: number;
};

export type HookImplMap = { readonly [ K in HookId ]?: ReadonlyArray< HookDef< K > > };

export type HookPipeline< K extends HookId > = (
  ctx: HookCtx< K >, value?: HookValue< K >
) => HookValue< K > | undefined;

export interface IHookEngine {
  invalidate: ( id: HookId ) => void;
  add: < K extends HookId > ( id: K, handler: HookHandler< K >, priority?: number ) => void;
  merge: ( hooks: HookImplMap ) => void;
  run: < K extends HookId > ( id: K, ctx: HookCtx< K > ) => void;
  run: < K extends HookId > ( id: K, ctx: HookCtx< K >, value: HookValue< K > ) => HookValue< K >;
}
