import type { ReferenceState } from './node';

export interface HookRegistry {
  'core.service.serialize': {
    ctx: {
      state: ReferenceState;
    };
    input: string;
    output: string;
  };
}

export type HookId = keyof HookRegistry;
export type HookSpec< K extends HookId > = HookRegistry[ K ];

export type HookHandler< S extends HookSpec > =
  S extends { input: infer I; output: infer O }
    ? ( ctx: S[ 'ctx' ], input: I ) => O
    : S extends { input: infer I }
      ? ( ctx: S[ 'ctx' ], input: I ) => void
      : S extends { output: infer O }
        ? ( ctx: S[ 'ctx' ] ) => O
        : ( ctx: S[ 'ctx' ] ) => void;

export type HookDef< K extends HookId > = {
  handler: HookHandler< HookSpec< K > >;
  priority?: number;
};

export type HookImplMap = { readonly [ K in HookId ]?: ReadonlyArray< HookDef< K > > };
