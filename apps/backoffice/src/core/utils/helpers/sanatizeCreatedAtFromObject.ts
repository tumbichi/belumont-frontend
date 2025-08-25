export default function sanatizeCreatedAtFromObject<
  T extends { created_at: string | null },
>(object: T): T & { created_at: Date | null } {
  return {
    ...object,
    created_at: object.created_at ? new Date(object.created_at) : null,
  };
}
