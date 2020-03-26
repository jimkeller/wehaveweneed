import fetch from 'node-fetch';

export async function lookup(address) {
  const params = new URLSearchParams({
    q: address,
    limit: "1",
    format: "json"
  });
  const ENDPOINT = `https://nominatim.openstreetmap.org/search?${params.toString()}`;
  const ret = await fetch(ENDPOINT).then(res => res.json());
  const data = ret[0];

  return {
    latitude: Number(data.lat),
    longitude: Number(data.lon)
  }
}