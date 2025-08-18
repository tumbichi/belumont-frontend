export default function sanatizeDatesFromObject<
  T extends { created_at: string; updated_at: string },
>(object: T): T & { created_at: Date; updated_at: Date } {
  return {
    ...object,
    created_at: new Date(object.created_at),
    updated_at: new Date(object.updated_at),
  };
}
