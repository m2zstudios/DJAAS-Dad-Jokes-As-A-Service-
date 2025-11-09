// index.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// load jokes
const JOKES = JSON.parse(fs.readFileSync(path.join(__dirname, 'jokes.json'), 'utf8'));

// simple in-memory premium keys (replace with DB / stripe webhook in prod)
const PREMIUM_KEYS = new Set([
  // example: 'test-premium-key-123'
]);

// helpers
function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function filterByType(type) {
  return JOKES.filter(j => {
    if (!type) return true;
    return (j.type && j.type.toLowerCase() === type.toLowerCase());
  });
}

// rate limit for free endpoints
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120 // 120 requests per minute per IP
});
app.use(limiter);

// middleware to check premium key (very simple)
function checkPremium(req, res, next) {
  const key = req.header('x-api-key') || req.query.api_key;
  if (key && PREMIUM_KEYS.has(key)) {
    req.isPremium = true;
  } else {
    req.isPremium = false;
  }
  next();
}
app.use(checkPremium);

// endpoints

// health
app.get('/', (req, res) => {
  res.json({
    service: "DJaaS (Dad-Jokes-as-a-Service)",
    endpoints: ["/joke", "/jokes", "/random", "/meta"]
  });
});

// get one joke
// optional query params: type, explain=true, lang
app.get('/joke', (req, res) => {
  const { type, explain, lang } = req.query;
  const pool = filterByType(type);
  if (pool.length === 0) return res.status(404).json({ error: "No jokes found for that type" });

  // premium users can get AI placeholder (if you integrate later)
  if (req.isPremium && req.query.fresh === 'true') {
    // placeholder: you can integrate an AI generator here
    // return res.json({ joke: "AI generated fresh joke (premium)..." });
  }

  const chosen = pickRandom(pool);
  const out = { joke: chosen.joke, id: chosen.id, type: chosen.type || 'general' };
  if (explain === 'true' && chosen.explanation) out.explanation = chosen.explanation;
  res.json(out);
});

// get N jokes
app.get('/jokes', (req, res) => {
  let { count = 10, type } = req.query;
  count = Math.min(100, parseInt(count) || 10);
  const pool = filterByType(type);
  const selected = [];
  for (let i = 0; i < count; i++) {
    selected.push(pickRandom(pool));
  }
  res.json({ count: selected.length, jokes: selected.map(j => ({ id: j.id, joke: j.joke, type: j.type })) });
});

// random alias
app.get('/random', (req, res) => {
  res.redirect(302, '/joke');
});

// meta
app.get('/meta', (req, res) => {
  res.json({ total_jokes: JOKES.length, premium: req.isPremium });
});

// simple admin route to add premium key (not secure - for dev only)
app.post('/admin/add-key', (req, res) => {
  const { key, secret } = req.body;
  if (secret !== process.env.ADMIN_SECRET) return res.status(403).json({ error: "forbidden" });
  PREMIUM_KEYS.add(key);
  res.json({ ok: true, added: key });
});

// start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`DJaaS listening on port ${PORT}`);
});
