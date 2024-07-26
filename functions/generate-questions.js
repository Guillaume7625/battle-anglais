const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  const { topic, difficulty } = JSON.parse(event.body);

  const prompt = `Générez 5 questions de niveau ${difficulty} d'anglais pour des élèves de niveau 4ème et CM2 sur le thème "${topic}". 
  Assurez-vous que chaque question couvre un sous-thème différent et qu'aucune question ne se ressemble.
  Pour chaque question, fournissez :
  1. La question en anglais
  2. Quatre options de réponse (A, B, C, D)
  3. La réponse correcte
  4. Une explication détaillée en français de la réponse, incluant des astuces pour éviter les erreurs courantes
  
  Formatez le résultat en JSON selon ce modèle :
  {
      "questions": [
          {
              "question": "...",
              "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
              "correctAnswer": "A",
              "explanation": "..."
          },
          ...
      ]
  }`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: prompt}],
        temperature: 0.7,
        max_tokens: 2000
      })
    });

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch from OpenAI API' })
    };
  }
};

