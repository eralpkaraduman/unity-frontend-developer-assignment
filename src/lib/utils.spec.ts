import test from 'ava';
import path from 'path';
import fs from 'fs';

import {
  generateRandomString,
  writeFileContents,
  readFileContents,
  NotFoundError,
  trimTextWithElipsis,
} from './utils';

test('should generate random file name', async t => {
  const a = generateRandomString();
  t.truthy(a);
  t.is(typeof a, 'string');
  t.truthy(a.length > 0);
  const b = generateRandomString();
  t.falsy(a === b);
});

test.before(async t => {
  t.context = {
    ...t.context,
    missingFilePath: path.resolve('temp', `${generateRandomString()}.txt`),
    testFileContents: generateRandomString(),
    testFilePath: path.resolve('temp', `${generateRandomString()}.txt`),
  };
});

test('should be able to write a file', async t => {
  const { testFilePath, testFileContents } = t.context as any;
  // tslint:disable-next-line:no-let
  let result = null;
  await t.notThrowsAsync(
    async () =>
      (result = await writeFileContents(testFilePath, testFileContents))
  );
  t.truthy(result);
  t.is(result, testFilePath);
});

test('should be able to read a file', async t => {
  const { testFilePath, testFileContents, missingFilePath } = t.context as any;
  // tslint:disable-next-line:no-let
  let contents = null;
  await t.notThrowsAsync(
    async () => (contents = await readFileContents(testFilePath)),
  );
  t.is(contents, testFileContents);
  await t.throwsAsync(
    async () => await await readFileContents(missingFilePath),
    NotFoundError.message,
  );
});

test.after(async t => {
  const { testFilePath } = t.context as any;
  fs.unlinkSync(testFilePath);
});

test('should trim text with elipsis', async t => {
  t.is(
    trimTextWithElipsis('A Too long button text consectetur adipiscing elit, sed do eiusmod tempor.', 40),
    'A Too long button text consectetur ad...',
  );
  t.is(trimTextWithElipsis(`
    A Too long
    button text
    consectetur adipiscing
    elit, sed do
    eiusmod tempor.`, 40),
    'A Too long button text consectetur ad...',
  );
  t.is(trimTextWithElipsis(undefined, 10), undefined);
  t.is(trimTextWithElipsis(undefined, NaN), undefined);
  t.is(trimTextWithElipsis('Test', NaN), 'Test');
  t.is(trimTextWithElipsis('No elipsis', 10), 'No elipsis');
  t.is(trimTextWithElipsis('No elipsis', 10.9), 'No elipsis');
  t.is(trimTextWithElipsis('No elipsis', -10), 'No elipsis');
  t.is(trimTextWithElipsis('No elipsis', 500), 'No elipsis');
  t.is(trimTextWithElipsis('No elipsis', -500.0), 'No elipsis');
  t.is(trimTextWithElipsis('Test', 0), 'Test');
  t.is(trimTextWithElipsis('Test', -1), 'Test');
  t.is(trimTextWithElipsis('Test', 0.1), 'Test');
  t.is(trimTextWithElipsis(' Excess whitespace  ', 17), 'Excess whitespace');
  t.is(trimTextWithElipsis(' Should trim  ', 10), 'Should ...');
});
