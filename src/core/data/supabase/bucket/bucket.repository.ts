import getSingedUrlFromRecipeEbook from "./services/getSingedUrlFromRecipeEbook";

export interface BucketRepositoryReturn {
  getSingedUrlFromRecipeEbook: () => Promise<string>;
}

const BucketRepository = (): BucketRepositoryReturn => ({
  getSingedUrlFromRecipeEbook,
});

export default BucketRepository;
