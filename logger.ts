import chalk from "chalk";

interface LoggerOptions {
  errorsOnly?: boolean;
  isVerbose?: boolean;
}

export default class Logger {
  isVerbose: boolean;
  errorsOnly: boolean;

  constructor({ isVerbose, errorsOnly }: LoggerOptions) {
    this.errorsOnly = errorsOnly || false;
    this.isVerbose = this.errorsOnly ? false : isVerbose || false;
  }

  info(...msgs: string[]) {
    if (this.isVerbose) {
      msgs.forEach(msg => {
        console.log(chalk.blue(msg));
      });
    }
  }

  warn(...msgs: string[]) {
    if (!this.errorsOnly) {
      msgs.forEach(msg => {
        console.log(chalk.yellow(msg));
      });
    }
  }

  log(...msgs: string[]) {
    if (!this.errorsOnly) {
      msgs.forEach(msg => {
        console.log(chalk.white(msg));
      });
    }
  }

  success(...msgs: string[]) {
    if (!this.errorsOnly) {
      msgs.forEach(msg => {
        console.log(chalk.green(msg));
      });
    }
  }

  error(...msgs: string[]) {
    msgs.forEach(msg => {
      console.log(chalk.red(msg));
    });
  }
}
