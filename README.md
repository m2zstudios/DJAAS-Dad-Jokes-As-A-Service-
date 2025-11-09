😂 Dad-Jokes-as-a-Service (DJaaS)

Because the world deserves more bad jokes.
And your apps deserve even worse.

A lightweight, zero-config REST API that serves random dad jokes on demand — perfect for bots, websites, CLIs, landing pages, error pages, productivity apps, or anywhere you want to inject wholesome cringe.

🚀 API Usage

Base URL

https://<your-domain>/dad


Method: GET
Rate Limit: 120 req/min/IP (customizable)

Example Response

{
  "joke": "I tried to catch fog yesterday. Mist."
}

🛠️ Self-Hosting

Clone the repo

git clone https://github.com/<your-username>/dad-jokes-as-a-service.git
cd dad-jokes-as-a-service


Install dependencies

npm install


Start the server

npm start


API will be available at:

http://localhost:3000/dad


Use custom port:

PORT=5000 npm start

📂 Project Structure
dad-jokes-as-a-service/
├── index.js          # Express API
├── jokes.json        # 1000+ dad jokes
├── package.json
└── README.md

🤖 Use-Cases

Chatbots needing “instant cringe”

Slack/Discord “dad-joke” commands

Fun error pages

Student or dev projects

Bots that roast people politely

Apps that require humor injection

Content fillers & placeholders

👤 Author

Built by humans. Powered by bad humor.

📄 License

MIT — you can fork, remix, copy, or build something even worse.
