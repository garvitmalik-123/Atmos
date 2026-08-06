# Atmos Spring Boot Backend

Replaces the old Node/Express backend with the exact same API contract, so the
existing React frontend (`Weather.jsx`, `HomepageNews.jsx`, `NewsBar.jsx`,
`FeaturedNews.jsx`) works without any code changes.

## Endpoints

- `GET /health`
- `GET /api/news?country=&category=&pageSize=&page=`
- `GET /api/weather?city=` or `?lat=&lon=`
- `GET /api/forecast?city=` or `?lat=&lon=`

## Configuration

Keys live in `src/main/resources/application.properties` (with env-var overrides):

```properties
server.port=${PORT:5000}
news.api.key=${NEWS_API_KEY:b4cb64a5613d4ac9baf751ccc0936b0e}
weather.api.key=${WEATHER_API_KEY:YOUR_WEATHER_API_KEY}
```

Your NewsAPI key (`b4cb64a5613d4ac9baf751ccc0936b0e`) is already set as the
default. **Replace `YOUR_WEATHER_API_KEY`** with a real OpenWeatherMap key
(https://openweathermap.org/api) — you didn't send one, so weather calls
will 500 until you add it. Either edit the file directly or set an
environment variable:

```bash
export WEATHER_API_KEY=your_real_key
```

⚠️ Security note: for a real deployment, don't commit real API keys into
`application.properties` — use environment variables or a secrets manager,
and rotate any key that's ever been shared in plaintext (e.g. in a chat
message).

## Run it

```bash
cd SpringBackend
mvn spring-boot:run
```

Or build a jar:

```bash
mvn clean package
java -jar target/atmos-backend.jar
```

The server listens on port `5000` by default (same as the old Node backend),
so the frontend's `.env` (`VITE_BACKEND_URL=http://localhost:5000`) needs no
changes.
