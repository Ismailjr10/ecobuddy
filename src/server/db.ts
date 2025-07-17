import { Store, schema } from 'modelence/server';

export const dbHabits = new Store('habits', {
  schema: {
    userId: schema.userId(),
    lightsHours: schema.number(),
    recycled: schema.boolean(),
    date: schema.date(),
    ecoScore: schema.number().optional(),
  },
  indexes: [{ key: { date: -1 } }],
});