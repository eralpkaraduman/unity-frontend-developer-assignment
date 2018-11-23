import path from 'path';

import * as tsLint from "tslint";
import ts from 'typescript';

import * as HTMLGenerator from '../HtmlGenerator';
import AdConfiguration from './AdConfiguration';
import InterstitialAdUnitGenerator from './InterstitialAdUnitGenerator';

const TooFewImagesErrorKey = 'IMAGES_TOO_FEW';
const TypeScriptLintErrorKey = 'TYPE_SCRIPT_LINT_ERROR';
const minimumImagecount = 3;
const templatePath = path.resolve('src', 'templates', 'interstitial-carousel-ad-unit', 'template.ejs');
const scriptPath = path.resolve('src', 'templates', 'interstitial-carousel-ad-unit', 'script.ts');
const scriptBaseName = path.basename(scriptPath);
import {readFileContents} from '../utils';

const linterOptions: tsLint.ILinterOptions = {fix: false, formatter: 'stylish'};

export default class InterstitialCarouselAdUnitGenerator extends InterstitialAdUnitGenerator { // TODO: rename to ..Generator
  private readonly linterConfiguration: tsLint.Configuration.IConfigurationFile;

  constructor() {
    super();
    this.linterConfiguration = tsLint.Linter.findConfiguration('tslint.json', scriptPath)!.results!;
  }

  public async generate(outPath: string): Promise<string> {
    const {
      title,
      images,
      description,
      buttonText,
      buttonUrl,
    }: AdConfiguration = this.configuration || { images: [] };

    if (images.length < minimumImagecount) {
      throw new Error(TooFewImagesErrorKey);
    }

    const typeScriptSource = await readFileContents(scriptPath);

    const transpileResult = ts.transpileModule(typeScriptSource, {
      compilerOptions: {
        alwaysStrict: true,
        lib: ['es2017', 'dom'],
        module: ts.ModuleKind.CommonJS,
        strict: true,
        target: ts.ScriptTarget.ES3,
        traceResolution: true,
      },
    });

    const commonJsSource = transpileResult.outputText;

    const linter = new tsLint.Linter(linterOptions);
    linter.lint(scriptBaseName, typeScriptSource, this.linterConfiguration);
    const {
      failures: linterFailures,
      output: linterOutput,
    } = linter.getResult();

    if (linterFailures.length) {
      // tslint:disable-next-line:no-console
      console.debug('[generator] Linter Errors:\n' + linterOutput);
      throw new Error(TypeScriptLintErrorKey);
    }

    await HTMLGenerator.generate(
      templatePath, outPath,
      { title, images, description, buttonUrl, buttonText, script: commonJsSource },
    );

    return outPath;
  }
}
