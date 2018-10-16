import test from "ava";
import * as sinon from "sinon";
import Logger from "./logger";

const makeBlue = (s: string): string => `\u001b[34m${s}\u001b[39m`;
const makeGreen = (s: string): string => `\u001b[32m${s}\u001b[39m`;
const makeRed = (s: string): string => `\u001b[31m${s}\u001b[39m`;
const makeWhite = (s: string): string => `\u001b[37m${s}\u001b[39m`;
const makeYellow = (s: string): string => `\u001b[33m${s}\u001b[39m`;

test.serial("when logger is verbose it should log at the info level", t => {
  const spy = sinon.spy();
  console.log = spy;
  const logger = new Logger({ isVerbose: true });

  logger.info("some", "test");

  const [firstCall, secondCall] = spy.getCalls();

  t.is(firstCall.args[0], makeBlue("some"));
  t.is(secondCall.args[0], makeBlue("test"));
});

test.serial(
  "when logger is not verbose it should not log at the info level",
  t => {
    const spy = sinon.spy();
    console.log = spy;
    const logger = new Logger({});

    logger.info("some", "test");

    t.is(spy.getCalls().length, 0);
  }
);

test.serial(
  "when logger is not only providing errors it should log at the warn level",
  t => {
    const spy = sinon.spy();
    console.log = spy;
    const logger = new Logger({});

    logger.warn("some", "test");

    const [firstCall, secondCall] = spy.getCalls();

    t.is(firstCall.args[0], makeYellow("some"));
    t.is(secondCall.args[0], makeYellow("test"));
  }
);

test.serial(
  "when logger is only providing errors it should not log at the warn level",
  t => {
    const spy = sinon.spy();
    console.log = spy;
    const logger = new Logger({ errorsOnly: true });

    logger.warn("some", "test");

    t.is(spy.getCalls().length, 0);
  }
);

test.serial(
  "when logger is not only providing errors it should log at the log level",
  t => {
    const spy = sinon.spy();
    console.log = spy;
    const logger = new Logger({});

    logger.log("some", "test");

    const [firstCall, secondCall] = spy.getCalls();

    t.is(firstCall.args[0], makeWhite("some"));
    t.is(secondCall.args[0], makeWhite("test"));
  }
);

test.serial(
  "when logger is only providing errors it should not log at the log level",
  t => {
    const spy = sinon.spy();
    console.log = spy;
    const logger = new Logger({ errorsOnly: true });

    logger.log("some", "test");

    t.is(spy.getCalls().length, 0);
  }
);

test.serial(
  "when logger is not only providing errors it should log at the success level",
  t => {
    const spy = sinon.spy();
    console.log = spy;
    const logger = new Logger({});

    logger.success("some", "test");

    const [firstCall, secondCall] = spy.getCalls();

    t.is(firstCall.args[0], makeGreen("some"));
    t.is(secondCall.args[0], makeGreen("test"));
  }
);

test.serial(
  "when logger is only providing errors it should not log at the success level",
  t => {
    const spy = sinon.spy();
    console.log = spy;
    const logger = new Logger({ errorsOnly: true });

    logger.success("some", "test");

    t.is(spy.getCalls().length, 0);
  }
);

test.serial(
  "when logger is not only providing errors it should log at the error level",
  t => {
    const spy = sinon.spy();
    console.log = spy;
    const logger = new Logger({});

    logger.error("some", "test");

    const [firstCall, secondCall] = spy.getCalls();

    t.is(firstCall.args[0], makeRed("some"));
    t.is(secondCall.args[0], makeRed("test"));
  }
);

test.serial(
  "when logger is only providing errors it should log at the error level",
  t => {
    const spy = sinon.spy();
    console.log = spy;
    const logger = new Logger({ errorsOnly: true });

    logger.error("some", "test");

    const [firstCall, secondCall] = spy.getCalls();

    t.is(firstCall.args[0], makeRed("some"));
    t.is(secondCall.args[0], makeRed("test"));
  }
);
