import { Module, time } from 'modelence/server';
import { dbHabits } from './db';
import { generateText } from '@modelence/ai';

export default new Module('eco', {
  stores: [dbHabits],
  cronJobs: {
    sendEcoReport: {
      description: 'Send weekly EcoScore report',
      interval: time.minutes(1), // Demo mode; use time.days(7) for production
      async handler() {
        const habits = await dbHabits.fetch({});
        for (const habit of habits) {
          let ecoScore = 100 - (habit.lightsHours * 5);
          ecoScore = Math.max(0, Math.min(100, ecoScore));
          const aiResponse = await generateText({
            provider: 'openai',
            model: 'gpt-4o',
            messages: [{ role: 'user', content: `EcoScore for ${habit.lightsHours} hours and recycled: ${habit.recycled}. Suggest tip.` }],
          });
          const aiScoreMatch = aiResponse.match(/ecoScore: (\d+)/i);
          const finalScore = aiScoreMatch ? Math.max(0, Math.min(100, parseInt(aiScoreMatch[1], 10))) : ecoScore;
          await dbHabits.update({ _id: habit._id }, { ecoScore: finalScore });
          console.log(`Updated ${habit._id} with ecoScore: ${finalScore}, Tip: ${aiResponse}`);
        }
        const totalScore = habits.reduce((sum, h) => sum + (h.ecoScore || 0), 0) / habits.length || 0;
        const ecoLevel = totalScore > 80 ? 'Eco Warrior' : totalScore > 50 ? 'Green Sprout' : 'Seedling';
        const report = await generateText({
          provider: 'openai',
          model: 'gpt-4o',
          messages: [{ role: 'user', content: `Weekly report: Avg ${totalScore}, level ${ecoLevel}. Tips?` }],
        });
        console.log(`EcoReport: ${report}`);
      },
    },
  },
});