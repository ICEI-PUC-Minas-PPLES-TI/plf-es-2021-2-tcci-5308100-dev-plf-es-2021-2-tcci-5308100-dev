export default interface ISeed {
  seed: () => Promise<void>;
}
