# KARE Thamizh Mandram

Full-stack website for the Tamil cultural and literary club at Kalasalingam Academy of Research and Education.

## Stack

- React 18, Vite, TypeScript, React Router and Framer Motion
- Express, TypeScript, Mongoose and MongoDB Atlas
- JWT access tokens with httpOnly refresh cookies
- Helmet, CORS, Zod validation and auth rate limiting

## Local setup

1. Install Node.js 20 or newer.
2. Copy `.env.example` to `.env`.
3. Set `MONGODB_URI`, `JWT_SECRET`, and `JWT_REFRESH_SECRET`.
4. Run `npm install`.
5. Seed the eight signature events with `npm run seed`.
6. Start both applications with `npm run dev`.

The public client runs at `http://localhost:5173` and the API at `http://localhost:4000`.

## Routes

- `/` — cinematic public homepage
- `/about`, `/events`, `/gallery`, `/team`, `/membership`, `/blogs`, `/contact`
- `/portal` — member dashboard UI
- `/admin` — president/faculty admin UI
- `/verify/:certId` — certificate verification placeholder

API endpoints are under `/api`. Authentication uses `Authorization: Bearer <access-token>` for protected requests and a `refreshToken` httpOnly cookie for renewal.

## Deployment

### Client (Vercel or Netlify)

Set the project root to `client`, use `npm run build`, and publish `client/dist`. Configure the SPA fallback so every route serves `index.html`. Set the client API base URL when API calls are connected to the deployed server.

### Server (Render)

Create a Node web service with the repository root, build command `npm install && npm run build --workspace server`, and start command `node server/dist/index.js`. Configure all variables from `.env.example`, set `CLIENT_URL` to the deployed client origin, and use MongoDB Atlas network access rules for the Render service.

### MongoDB Atlas

Create a database named `kare-thamizh-mandram`, add the Render connection string to `MONGODB_URI`, and run the seed command once from a trusted deployment shell.

## Validation

Run `npm run build` before deployment. This builds both the Vite client and the TypeScript API.
