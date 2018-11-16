import AdConfiguration from './AdConfiguration';

export default interface AdGeneratorInterface {
  configuration: AdConfiguration;
  generate(): Promise<string>;
}
