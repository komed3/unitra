export type HookHandler< C, I = void, O = void > = ( ctx: C, input?: I ) => O;

export type HookDefinition< C, I = void, O = void > = {
  handler: HookHandler< C, I, O >;
  priority?: number;
};
