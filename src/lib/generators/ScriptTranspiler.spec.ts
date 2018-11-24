import test from 'ava';

import ScriptTranspiler, { TranspilerError } from './ScriptTranspiler';

const invalidSource = `
let n: number = 2;
n = 'bad code';`;

const validSource = `
function add(a: number, b: number): number {
  return a + b;
}`;

test('should not transpile a script which does not pass linter', async t => {
  await t.throwsAsync(
    async () =>
      await ScriptTranspiler.transpile(invalidSource, 'invalidSource.ts'),
    TranspilerError
  );
});

test('should transpile', async t => {
  let transpiledScript: string;
  await t.notThrowsAsync(async () => {
    transpiledScript = await ScriptTranspiler.transpile(
      validSource,
      'validSource.ts'
    );
  });
  t.truthy(transpiledScript!);
  t.is(
    eval(`
    ${transpiledScript!}
    add(2, 3);
  `),
    5
  );
});
