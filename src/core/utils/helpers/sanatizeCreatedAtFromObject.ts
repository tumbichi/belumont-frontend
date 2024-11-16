export default function sanatizeCreatedAtFromObject<T extends { created_at: string }>(
  object: T
): T & { created_at: Date } {
  return {
    ...object,
    created_at: new Date(object.created_at),
  };
}
