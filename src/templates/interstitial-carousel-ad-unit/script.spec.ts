import test from 'ava';
import fs from 'fs';
import path from 'path';
import rewire from 'rewire';
import ScriptTranspiler from '../../lib/ScriptTranspiler';
import {
  generateRandomString,
  readFileContents,
  writeFileContents,
} from '../../lib/utils';
const scriptPath = path.resolve(
  'src',
  'templates',
  'interstitial-carousel-ad-unit',
  'script.ts',
);
const windowMock = `
const window: any = {
  document: {
    addEventListener: () => ({}),
  },
};`;

test.beforeEach(async t => {
  const scriptContents = await readFileContents(scriptPath);
  const transpiledScript = ScriptTranspiler.transpile(
    `${windowMock}${scriptContents}`,
    scriptPath,
  );
  const transpiledScriptPath = await writeFileContents(
    path.resolve('temp', `${generateRandomString()}.script.js`),
    transpiledScript,
  );

  const rewiredScript = rewire(transpiledScriptPath);
  t.context = { ...t.context, rewiredScript, transpiledScriptPath };
});

test.afterEach.always(async t => {
  const { transpiledScriptPath } = t.context as any;
  try {
    fs.unlinkSync(transpiledScriptPath);
  } catch (e) {
    t.log(e);
  }
});

test('should calculate target index', async t => {
  const { rewiredScript } = t.context as any;
  const calculateTargetIndex = rewiredScript.__get__('calculateTargetIndex');
  t.is(calculateTargetIndex(0, +1, 3), 1);
  t.is(calculateTargetIndex(0, -1, 3), 2);
  t.is(calculateTargetIndex(0, +2, 3), 2);
  t.is(calculateTargetIndex(0, +3, 3), 0);
  t.is(calculateTargetIndex(0, -2, 3), 1);
  t.is(calculateTargetIndex(0, -3, 3), 0);
  t.is(calculateTargetIndex(0, 0, 0), 0);
  t.is(calculateTargetIndex(2, +1, 3), 0);
  t.is(calculateTargetIndex(0, -1, 0), 0);
  t.is(calculateTargetIndex(0, +1, 0), 0);
  t.is(calculateTargetIndex(-1, 0, 0), -1);
  t.is(calculateTargetIndex(NaN, 0, 0), NaN);
  t.is(calculateTargetIndex(0, NaN, 0), 0);
  t.is(calculateTargetIndex(0, 0, NaN), 0);
  t.is(calculateTargetIndex(null, 0, 0), null);
  t.is(calculateTargetIndex(0, null, 0), 0);
  t.is(calculateTargetIndex(0, 0, null), 0);
});

test('should strip index from dot button element', async t => {
  const { rewiredScript } = t.context as any;
  const stripIndexFromDotButtonElement = rewiredScript.__get__('stripIndexFromDotButtonElement');
  t.is(stripIndexFromDotButtonElement({id: 'carousel-navigation-dot-index-0'}), 0);
  t.is(stripIndexFromDotButtonElement({id: 'carousel-navigation-dot-index-2'}), 2);
});

test('should calculate scroll amout for index', async t => {
  const { rewiredScript } = t.context as any;
  const calculateScrollPosition = rewiredScript.__get__('calculateScrollPosition');
  t.is(calculateScrollPosition(0, 3, 30), 0);
  t.is(calculateScrollPosition(1, 3, 30), 10);
  t.is(calculateScrollPosition(2, 3, 30), 20);
});
