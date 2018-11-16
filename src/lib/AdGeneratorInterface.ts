import AdConfigurationInterface from './AdConfigurationInterface';

export interface AdGeneratorInterface {
  generate(configuration: AdConfigurationInterface): string;
}
