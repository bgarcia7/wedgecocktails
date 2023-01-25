# Wedgecocktails
 --- 

## Web Application Setup
Client-facing application for selecting ingredients + getting cocktail recommendations

```bash
cd wedgecocktails/
npm install
npm run dev
```

Open http://localhost:3000

## Python API Setup
Used for cocktail recommendations and generation (openai davinci-03 and dall-e)

```bash
cd wedgecocktails/api/src
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python -m flask run
```

Open http://127.0.0.1:5000

## Helpful Links

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Next.js vercel deployment documentation](https://nextjs.org/docs/deployment)

