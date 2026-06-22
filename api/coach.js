// Vercel serverless function — Coach IA
// Appelle l'API Anthropic (Claude Haiku 4.5, le modèle le moins cher) CÔTÉ SERVEUR.
// La clé reste secrète dans la variable d'environnement ANTHROPIC_API_KEY.
// Elle n'est JAMAIS envoyée au navigateur.

const MODEL = 'claude-haiku-4-5';

const SYSTEM = [
  "Tu es un coach sportif francophone, expert en prise de muscle pour les profils ectomorphes",
  "et en calisthénie (muscle-up, planche, front lever, handstand).",
  "Tu donnes des conseils concrets, motivants et personnalisés à partir du profil fourni.",
  "Sois bref et actionnable : va droit au but, utilise des puces courtes.",
  "Reste dans le sport et la nutrition générale. Ne pose pas de diagnostic médical ;",
  "en cas de douleur ou de souci de santé, recommande de consulter un professionnel.",
  "Écris toujours en français.",
].join(' ');

const MODES = {
  conseil: {
    max: 350,
    build: function (p) {
      return "Donne UN conseil personnalisé pour aujourd'hui (4 à 6 puces max), " +
        "adapté à ce profil et à sa progression :\n\n" + p;
    },
  },
  seance: {
    max: 750,
    build: function (p, x) {
      return "Crée une séance d'entraînement pour aujourd'hui" + (x ? " (focus : " + x + ")" : "") +
        ", adaptée à ce profil. Donne 4 à 7 exercices avec séries × répétitions, " +
        "puis 1 conseil de progression. Sois concis :\n\n" + p;
    },
  },
  nutrition: {
    max: 550,
    build: function (p) {
      return "Propose un exemple de journée alimentaire (petit-déj, déjeuner, dîner, collations) " +
        "pour atteindre l'objectif calories/protéines de ce profil, en surplus. " +
        "Donne des quantités approximatives et le total estimé. Reste simple :\n\n" + p;
    },
  },
  question: {
    max: 600,
    build: function (p, x) {
      return "Question de l'utilisateur : \"" + (x || "Donne-moi un conseil.") + "\"\n\n" +
        "Profil :\n" + p + "\n\nRéponds de façon concise et personnalisée.";
    },
  },
};

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    return res.status(503).json({
      text: "Coach IA pas encore activé. Ajoute ta clé ANTHROPIC_API_KEY dans les réglages Vercel du projet, puis redéploie.",
    });
  }

  // Vercel parse le JSON automatiquement, mais on sécurise quand même.
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
  if (!body || typeof body !== 'object') body = {};

  const modeKey = MODES[body.mode] ? body.mode : 'conseil';
  const mode = MODES[modeKey];

  const profileStr = JSON.stringify(body.profile || {}).slice(0, 1800);
  const payload = (body.payload && typeof body.payload === 'object') ? body.payload : {};
  const focus = typeof payload.focus === 'string' ? payload.focus.slice(0, 200) : '';
  const question = typeof payload.question === 'string' ? payload.question.slice(0, 400) : '';

  const userText = modeKey === 'question'
    ? mode.build(profileStr, question)
    : mode.build(profileStr, focus);

  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: mode.max,
        system: SYSTEM,
        messages: [{ role: 'user', content: userText }],
      }),
    });

    const data = await r.json().catch(function () { return null; });

    if (!r.ok) {
      const msg = (data && data.error && data.error.message) || ('Erreur API (' + r.status + ')');
      return res.status(r.status).json({ error: msg });
    }

    const text = (data && Array.isArray(data.content) ? data.content : [])
      .filter(function (b) { return b && b.type === 'text'; })
      .map(function (b) { return b.text; })
      .join('\n')
      .trim();

    return res.status(200).json({ text: text || 'Pas de réponse générée.' });
  } catch (e) {
    return res.status(502).json({ error: 'Connexion à Claude impossible.' });
  }
};
