import test from 'ava';
import path from 'path';
import fs from 'fs';

import {
  generateRandomString,
  writeFileContents,
  readFileContents
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
  t.context = {...t.context,
    testFilePath: path.resolve(
      'temp',
      `${generateRandomString()}.txt`
    ),
    missingFilePath: path.resolve(
      'temp',
      `${generateRandomString()}.txt`
    ),
    testFileContents: generateRandomString()
  }
});

test('should be able to write a file', async t => {
  const {testFilePath, testFileContents} = t.context as any;
  let result = null;
  await t.notThrowsAsync(
    async () => result = await writeFileContents(testFilePath, testFileContents)
  )
  t.truthy(result);
  t.is(result, testFilePath);
});

test('should be able to read a file', async t => {
  const {testFilePath, testFileContents, missingFilePath} = t.context as any;
  let contents = null;
  await t.notThrowsAsync(
    async () => contents = await readFileContents(testFilePath)
  )
  t.is(contents, testFileContents);
  await t.throwsAsync(
    async () => await await readFileContents(missingFilePath),
    'Not Found'
  );
});

test.after(async t => {
  const {testFilePath} = t.context as any;
  fs.unlinkSync(testFilePath);
});