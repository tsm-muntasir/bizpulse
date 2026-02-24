const crypto = require('crypto');
const env = require('../config/env');
const studyPlanRepo = require('../repositories/studyPlanRepository');
const flashcardRepo = require('../repositories/flashcardRepository');
const subscriptionService = require('./subscriptionService');

function hashPrompt(prompt) {
  return crypto.createHash('sha256').update(prompt).digest('hex');
}

function fallbackPlan(subjectId) {
  const now = new Date();
  return {
    subjectId,
    validFrom: now.toISOString(),
    validTo: new Date(now.getTime() + 7 * 86400000).toISOString(),
    tasks: [
      { title: 'Revision Session', topic: 'Core Topics', estimatedMinutes: 60, dueDate: now.toISOString() },
      { title: 'Practice Problems', topic: 'Past Questions', estimatedMinutes: 90, dueDate: new Date(now.getTime() + 86400000).toISOString() }
    ]
  };
}

function fallbackFlashcards(count) {
  return Array.from({ length: count }, (_, i) => ({
    front: `Key concept ${i + 1}?`,
    back: `Definition and explanation for concept ${i + 1}`,
    tags: ['fallback']
  }));
}

async function callAiStructured(prompt, schemaHint) {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.ai.apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: `Return strict JSON only. Follow this schema: ${schemaHint}` },
        { role: 'user', content: prompt }
      ],
      temperature: 0.3
    })
  });

  if (!response.ok) {
    throw new Error(`AI provider error ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content;
  return JSON.parse(text);
}

async function generateStudyPlan(userId, payload) {
  await subscriptionService.consumeAiQuota(userId);

  const prompt = `Create a 7-day study plan for subject ${payload.subjectId}. Goals: ${payload.goals.join(', ')}. Available hours/week: ${payload.availableHoursPerWeek}.`;
  const schemaHint = '{"subjectId":"string","validFrom":"iso-date","validTo":"iso-date","tasks":[{"title":"string","topic":"string","estimatedMinutes":60,"dueDate":"iso-date"}]}';

  let aiOutput;
  try {
    aiOutput = await callAiStructured(prompt, schemaHint);
  } catch (_err) {
    aiOutput = fallbackPlan(payload.subjectId);
  }

  const doc = await studyPlanRepo.create({
    userId,
    subjectId: payload.subjectId,
    source: 'ai',
    aiModel: 'gpt-4o-mini',
    generationPromptHash: hashPrompt(prompt),
    tasks: aiOutput.tasks.map((task) => ({ ...task, status: 'todo' })),
    validFrom: aiOutput.validFrom,
    validTo: aiOutput.validTo
  });

  return doc;
}

async function generateFlashcards(userId, payload) {
  await subscriptionService.consumeAiQuota(userId);

  const prompt = `Generate ${payload.count} flashcards for topic ${payload.topic}. Content: ${payload.content}`;
  const schemaHint = '{"cards":[{"front":"string","back":"string","tags":["string"]}]}' ;

  let aiOutput;
  try {
    aiOutput = await callAiStructured(prompt, schemaHint);
  } catch (_err) {
    aiOutput = { cards: fallbackFlashcards(payload.count) };
  }

  const docs = aiOutput.cards.map((card) => ({
    userId,
    subjectId: payload.subjectId,
    front: card.front,
    back: card.back,
    tags: card.tags || [],
    source: 'ai'
  }));

  return flashcardRepo.insertMany(docs);
}

module.exports = { generateStudyPlan, generateFlashcards };
