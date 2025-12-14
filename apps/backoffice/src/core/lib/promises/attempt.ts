export type Success<T> = { data: T; error?: never };
export type Failure<E = unknown> = { data?: never; error: E };
export type Result<T, E = unknown> = Success<T> | Failure<E>;

export default async function attempt<T, E = unknown>(
  promise: Promise<T>
): Promise<Result<T, E>> {
  try {
    const data = await promise;
    return { data };
  } catch (error) {
    return { error: error as E };
  }
}
