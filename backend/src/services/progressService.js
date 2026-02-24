const progressRepo = require('../repositories/progressRepository');

async function getDashboard(userId) {
  const rows = await progressRepo.dashboardByUser(userId, 30);

  const totals = rows.reduce(
    (acc, row) => {
      acc.planned += row.plannedMinutes;
      acc.completed += row.completedMinutes;
      acc.accuracy += row.accuracyScore;
      return acc;
    },
    { planned: 0, completed: 0, accuracy: 0 }
  );

  const avgAccuracy = rows.length ? totals.accuracy / rows.length : 0;
  const completionRate = totals.planned ? (totals.completed / totals.planned) * 100 : 0;

  const weaknessMap = new Map();
  for (const row of rows) {
    for (const topic of row.weaknessTopics) {
      weaknessMap.set(topic, (weaknessMap.get(topic) || 0) + 1);
    }
  }

  const weakness = [...weaknessMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([topic, count]) => ({ topic, occurrences: count }));

  return {
    completionRate: Number(completionRate.toFixed(2)),
    avgAccuracy: Number(avgAccuracy.toFixed(2)),
    totalStudyMinutes: totals.completed,
    weakness,
    streakCount: rows.length ? rows[rows.length - 1].streakCount : 0,
    timeline: rows
  };
}

module.exports = { getDashboard };
