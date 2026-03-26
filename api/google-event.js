import fetch from 'node-fetch';

const { MEASUREMENT_ID, API_SECRET } = process.env;

export async function trackEvent({ clientId, name, params = {} }) {
  try {
    await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
      {
        method: 'POST',
        body: JSON.stringify({
          client_id: clientId,
          events: [
            {
              name,
              params: {
                ...params,
              }
            }
          ]
        })
      }
    );
  } catch (e) {
    console.error('GA4 track error:', e);
  }
}