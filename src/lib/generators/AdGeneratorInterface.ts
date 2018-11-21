import AdConfiguration from './AdConfiguration';

export default interface AdGeneratorInterface {
  configuration: AdConfiguration; // tslint:disable-line:readonly-keyword
  generate(outPath: string): Promise<string>;
}
