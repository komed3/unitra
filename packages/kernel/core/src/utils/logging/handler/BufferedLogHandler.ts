import type { ILogHandler, LogEntry } from '@unitra/types/utils/logging';
import { LogHandler } from './LogHandler';

export type BufferedLogHandlerConfig = {
  flushSize?: number;
  flushInterval?: number;
};

export class BufferedLogHandler extends LogHandler< BufferedLogHandlerConfig > {
  private readonly buffer: LogEntry[] = [];
  private readonly interval?: NodeJS.Timeout;

  public get size () : number {
    return this.buffer.length;
  }

  public get pending () : ReadonlyArray< LogEntry > {
    return this.buffer;
  }

  constructor (
    private readonly target: ILogHandler,
    config: BufferedLogHandlerConfig = {}
  ) {
    super( config );

    if ( config.flushInterval !== undefined && config.flushInterval > 0 )
      this.interval = setInterval( () => this.flush(), config.flushInterval );
  }

  public override write ( entry: LogEntry ) : void {
    this.buffer.push( entry );

    if ( this.config.flushSize !== undefined && this.buffer.length >= this.config.flushSize )
      this.flush();
  }

  public flush () : void {
    if ( this.buffer.length === 0 ) return;

    const entries = this.buffer.splice( 0, this.buffer.length );
    for ( const entry of entries ) this.target.write( entry );
  }

  public dispose () : void {
    if ( this.interval ) clearInterval( this.interval );
    this.flush();
  }
}
