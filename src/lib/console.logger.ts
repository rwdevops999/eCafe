export interface LogFn {
  (sender: string, message?: any, ...optionalParams: any[]): void;
}

/** Basic logger interface */
export interface Logger {
    none: LogFn,
    debug: LogFn;
}

/** Log levels */
export type LogLevel = 'debug' | 'none';

const NO_OP: LogFn = (message?: any, ...optionalParams: any[]) => {};

/** Logger which outputs to the browser console */
export class ConsoleLogger implements Logger {
  readonly none: LogFn;
  readonly debug: LogFn;

  constructor(options?: { level? : LogLevel }) {
    const { level } = options || {};

    this.none = NO_OP;

    if (level === 'none') {
      this.debug = NO_OP;

      return;
    }

    this.debug = console.log.bind(console);
  }
}
