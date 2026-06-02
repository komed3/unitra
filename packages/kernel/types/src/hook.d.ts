export type HookHandler< C, I = void, O = void > = ( ctx: C, input?: I ) => O;
