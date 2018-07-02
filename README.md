[![Coverage Status](https://coveralls.io/repos/github/newsuk/jest-lint/badge.svg?branch=master)](https://coveralls.io/github/newsuk/jest-lint?branch=master)
[![Build Status](https://travis-ci.org/newsuk/jest-lint.svg?branch=master)](https://travis-ci.org/newsuk/jest-lint)

# jest-lint

A linter for Jest snapshots to help you write (in a very opinionated way) "better"
snapshots

## Install

Install globally or locally

```
yarn add --dev @thetimes/jest-lint
```

## Run

Just run `jest-lint` in any directory where `snap` files may lurk for a report

## The Code

The linter essentially has four stages for each discovered `snap` file:

```
Parse => Analyse => Report => Output
```

## Parse

In this phase it takes the Jest snapshot and turns it into a JavaScript `Object`

## Analyse

Using predefined rules it builds up a list of errors and warnings, the thresholds
of which can be optionally overridden. These errors and warnings exist at both
the snapshot file level itself as well as for each test within the file

To configure the rules create a `.jestlint` file with your overrides e.g.

```
{
  "maxFileSize": 5000,
  "genericAttributes": [
    "randomProp",
    "fixedProp"
  ],
  "genericValues": [
    "[Function]"
  ]
}
```

## Report

The report phase is split out from the analysis to enable the previous step to be
performed and written to disk (which is relatively fixed), allowing you to iterate on
different criteria to get the right balance for your codebase

## Output

Currently the only output is via the console with a litany of red, yellow and
green writing

## File Rules

### MaxFileSizeError

**config option**: `maxFileSize: number`

**default**: `10,000`

Choose the maximum file size for your snapshots, large snapshot files are hard
to diff and/or view on GitHub

## Test Rules

### GenericAttributeError

**config option**: `genericAttributes: string[]`

**default**: `[]`

There are many props, for example in `FlatList` that are just noise on a snapshot
rather than providing value to the component under test. Use this to weed out
props that aren't of use in a snapshot

### GenericValueError

**config option**: `genericValues: string[]`

**default**: `["Function"]`

There are many values such as `[Function]` that don't provide real value in a
snapshot which can be excluded without detriment to the test, thus removing
more noise

### MaxAttributeError

**config option**: `maxAttributes: number`

**default**: `5`

If an element has too many attributes then it's unlikely everyone is vital
to the component under test and will end up contributing to changes not related
to the test when things change

### MaxAttrArrayLengthError

**config option**: `maxAttributeArrayLength: number`

**default**: `5`

If a prop has a value that is very long it is unlikely the whole value is of
interest to the test and can be shortened for easier diffing, certainly for lists

### MaxAttrStringLengthError

**config option**: `maxAttributeStringLength: number`

**default**: `30`

If a prop has a value that is very long it is unlikely the whole value is of
interest to the test and can be shortened to an example for easier diffing

### MaxDepthError

**config option**: `maxDepth: number`

**default**: `10`

Deep nesting of elements is likely a sign of trying to test leaves that should
have their own tests without the rest of the snapshot. It is also likely that
they're external dependencies that will break many snapshots when they change
but not related to the test

### MaxLinesError

**config option**: `maxLines: number`

**default**: `300`

Perhaps the strongest barometer of an unspecific snapshot test is it's length.
A long snapshot is hard to read, hard to diff and is likely to change between
PRs not related to the tests

### MaxGenericElementWarning

**config option**: `maxGenericElements: number`

**default**: `10`

If a snapshot is filled with primitives with no props it is likely that either
there are too many of them in general or the test isn't specific enough. For
example 15 `div` elements suggest a lot of "div noise" rather than a specific
render test

## Additional config options

### snapPattern: string

**default**: \*\*/\*.js.snap

This is relative to the `cwd`
