const root = 'https://site.api.espn.com/apis/site/v2/sports/basketball/nba';
const feeds = {
  team: '/teams/18',
  schedule: '/teams/18/schedule',
  news: '/news?team=18&limit=30',
  scoreboard: '/scoreboard?limit=100',
  leaders: '/teams/18/leaders',
};
export default async (request) => {
  const feed = new URL(request.url).searchParams.get('feed');
  if (!Object.hasOwn(feeds, feed)) return Response.json({error:'Unknown feed'}, {status:400});
  try {
    const upstream = await fetch(root + feeds[feed], {
      headers: { 'Accept': 'application/json', 'User-Agent': 'TheDailyFan/0.3' },
      signal: AbortSignal.timeout(9000),
    });
    if (!upstream.ok) return Response.json({error:'Sports provider unavailable', status:upstream.status}, {status:502});
    const data = await upstream.json();
    return Response.json(data, {headers:{'Cache-Control':'public, max-age=120, s-maxage=120'}});
  } catch (error) {
    return Response.json({error:'Unable to reach sports provider'}, {status:502});
  }
};
export const config = { path: '/.netlify/functions/espn' };
