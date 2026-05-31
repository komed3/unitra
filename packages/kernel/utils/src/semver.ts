export class Semver {
  private static readonly OPERATORS = {
    '=': ( cmp: number ) => cmp === 0,
    '>': ( cmp: number ) => cmp > 0,
    '>=': ( cmp: number ) => cmp >= 0,
    '<': ( cmp: number ) => cmp < 0,
    '<=': ( cmp: number ) => cmp <= 0
  } as const;
}
