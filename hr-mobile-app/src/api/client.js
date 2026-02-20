const BASE_URL = '/gas';

/* GET */
export async function apiGet(path, params = {}) {

  const query = new URLSearchParams({
    path,
    ...params
  }).toString();

  const res = await fetch(`${BASE_URL}?${query}`);
  const json = await res.json();

  if (!json.success) {
    throw new Error(json.data?.error || 'Unknown error');
  }

  return json.data;
}

/* POST */
export async function apiPost(path, body = {}) {

  const res = await fetch(`${BASE_URL}?path=${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.data?.error || 'Unknown error');
  }

  return json.data;
}
