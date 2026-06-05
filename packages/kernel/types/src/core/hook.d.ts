import type { UnitraContext } from './unitra';

export interface HookRegistry {
  'core.service.serialize': {
    ctx: {};
    value: string;
  };
}

export type HookId = keyof HookRegistry;
export type HookSpec< K extends HookId > = HookRegistry[ K ];
export type HookCtx< K extends HookId > = HookSpec< K >[ 'ctx' ];
export type HookValue< K extends HookId > = HookSpec< K > extends { value: infer V } ? V : void;
export type HookOut< K extends HookId > = HookValue< K > | undefined;

export type HookHandler< K extends HookId > =
  HookSpec< K > extends { value: infer V }
    ? ( ctx: UnitraContext, hookCtx: HookCtx< K >, value: V ) => V
    : ( ctx: UnitraContext, hookCtx: HookCtx< K > ) => void;

export type HookPipeline< K extends HookId > = (
  hookCtx: HookCtx< K >,
  value?: HookValue< K >
) => HookOut< K >;

export type HookDef< K extends HookId > = {
  handler: HookHandler< K >;
  priority?: number;
};

export type HookImplMap = {
  readonly [ K in HookId ]?: ReadonlyArray< HookDef< K > >;
};

export type HookEntry = Array< [ HookId, ReadonlyArray< HookDef< HookId > > ] >;

export interface IHook {
  invalidate: ( id: HookId ) => void;
  add: < K extends HookId > ( id: K, handler: HookHandler< K >, priority?: number ) => void;
  merge: ( hooks: HookImplMap ) => void;
  run: < K extends HookId > ( id: K, hookCtx: HookCtx< K >, value: HookValue< K > ) => HookOut< K >;
}
