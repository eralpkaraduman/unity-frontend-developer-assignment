import * as tsLint from 'tslint';
import ts from 'typescript';

export const TypeScriptLintErrorKey = 'TYPE_SCRIPT_LINT_ERROR';

export class TranspilerError extends Error {
  public readonly linterOutput: string;
  constructor(linterOutpur: string) {
    super(TypeScriptLintErrorKey);
    this.linterOutput = linterOutpur;
  }
}

function transpile(script: string, scriptPathForLogging: string): string {
  const linter = new tsLint.Linter({
    fix: false,
    formatter: 'stylish',
  });
  const linterConfiguration = tsLint.Linter.findConfiguration(
    'tslint.json',
    scriptPathForLogging,
  )!.results!;
  linter.lint(scriptPathForLogging, script, linterConfiguration);
  const { failures: linterFailures, output: linterOutput } = linter.getResult();

  if (linterFailures.length) {
    throw new TranspilerError(linterOutput);
  }

  const transpileResult = ts.transpileModule(script, {
    compilerOptions: {
      alwaysStrict: true,
      lib: ['es2017', 'dom'],
      module: ts.ModuleKind.None,
      moduleResolution: ts.ModuleResolutionKind.NodeJs,
      strict: true,
      target: ts.ScriptTarget.ES3,
      traceResolution: true,
    },
    fileName: scriptPathForLogging,
  });
  return transpileResult.outputText;
}

export default { transpile };
