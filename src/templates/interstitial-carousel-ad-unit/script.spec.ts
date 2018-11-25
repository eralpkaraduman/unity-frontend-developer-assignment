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

test('should test transpiled script', async t => {
  const { rewiredScript } = t.context as any;
  const func = rewiredScript.__get__('func');
  t.is(func(1, 2), 3);
});
