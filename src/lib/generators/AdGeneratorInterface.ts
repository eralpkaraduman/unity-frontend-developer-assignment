import AdConfiguration from './AdConfiguration';

export default interface AdGeneratorInterface {
  configuration: AdConfiguration;
  generate(outPath: string): Promise<string>;
}
