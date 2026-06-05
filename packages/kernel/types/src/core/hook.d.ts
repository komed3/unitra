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

export type HookValue< K extends HookId > =
  HookSpec< K > extends { value: infer V }
    ? V
    : void;

export type HookHandler< K extends HookId > =
  HookSpec< K > extends { value: infer V }
    ? ( ctx: UnitraContext, hookCtx: HookCtx< K >, value: V ) => V
    : ( ctx: UnitraContext, hookCtx: HookCtx< K > ) => void;
