import { z } from 'zod';

// Schemas básicos
const senderRecipientSchema = z.object({
  id: z.string(),
});

const reactionSchema = z.object({
  mid: z.string(),
  action: z.literal('react'),
  reaction: z.string(),
  emoji: z.string(),
});

const messageSchema = z.object({
  mid: z.string(),
  text: z.string(),
  is_echo: z.boolean().optional(), // Solo presente en mensajes enviados
});

const messagingSchema = z.object({
  sender: senderRecipientSchema,
  recipient: senderRecipientSchema,
  timestamp: z.number(),
  reaction: reactionSchema.optional(), // Para reacciones
  message: messageSchema.optional(), // Para mensajes
});

// Schemas de cambios (changes)
const instagramValueSchema = z.union([
  z.object({
    from: z.object({
      id: z.string(),
      username: z.string(),
    }),
    media: z.object({
      id: z.string(),
      media_product_type: z
        .union([z.literal('PHOTO'), z.literal('VIDEO'), z.literal('REELS')])
        .optional(),
    }),
    id: z.string(),
    text: z.string(),
  }),
  z.object({
    from: z.object({
      id: z.string(),
      username: z.string(),
    }),
    id: z.string(),
  }),
]);

const instagramChangeSchema = z.object({
  field: z.union([z.literal('comments'), z.literal('likes')]),
  value: instagramValueSchema,
});

// Discriminated union para los tipos de `entry`
const instagramEntrySchema = z.union([
  z.object({
    id: z.string(),
    time: z.number(),
    changes: z.array(instagramChangeSchema),
  }),
  z.object({
    id: z.string(),
    time: z.number(),
    messaging: z.array(messagingSchema),
  }),
]);

// Esquema principal
const instagramBodySchema = z.object({
  object: z.literal('instagram'),
  entry: z.array(instagramEntrySchema),
});

export type InstagramBodySchema = z.infer<typeof instagramBodySchema>;

// Exportamos el esquema principal
export { instagramBodySchema };
