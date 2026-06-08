import { Logging } from '../utils/logging';

export class Unitra {
  private static readonly log = Logging.createSource( 'unitra' );
  private static cacheRevision: number = -1;
  private static cache: Unitra;

  public static create () : Unitra {
    return new Unitra();
  }

  private constructor () {}
}
