export type HookHandler< C extends {}, I = void, O = void > = ( ctx: C, input?: I ) => O;

export type HookDefinition< C extends {}, I = void, O = void > = {
  handler: HookHandler< C, I, O >;
  priority?: number;
};
