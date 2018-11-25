export default interface AdConfiguration {
  readonly title?: string;
  readonly buttonUrl?: string;
  readonly images: ReadonlyArray<string>;
  readonly buttonText?: string;
  readonly description?: string;
}
