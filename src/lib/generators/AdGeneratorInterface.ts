import AdConfiguration from './AdConfiguration';

export default interface AdGeneratorInterface {
  setConfiguration(configuration: AdConfiguration): AdGeneratorInterface;
  generate(outPath: string): Promise<string>;
}
