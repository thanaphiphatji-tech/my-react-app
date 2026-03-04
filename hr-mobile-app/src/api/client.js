const BASE_URL =
  import.meta.env.DEV
    ? '/gas'
    : 'https://script.google.com/macros/s/AKfycbyEX2_dopaayoa10XBwG1zqxI0_GOsWeLTNIML8O5TqlLPNHmBfuKC0GfSHEOzPylQ82g/exec';

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

  const formData = new URLSearchParams();
  formData.append('payload', JSON.stringify(body));

  const res = await fetch(`${BASE_URL}?path=${path}`, {
    method: 'POST',
    body: formData
  });

  const json = await res.json();

  if (!json.success) {
    throw new Error(json.data?.error || 'Unknown error');
  } 

  return json.data;
}