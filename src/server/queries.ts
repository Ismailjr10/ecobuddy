import { Query } from 'modelence/server';
import { dbHabits } from './db';

export const queries = {
  'habit.getAll': new Query({ resolve: async () => dbHabits.fetch({}) }),
};