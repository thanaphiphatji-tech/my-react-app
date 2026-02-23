const BASE_URL =
  import.meta.env.DEV
    ? '/gas'
<<<<<<< HEAD
    : 'https://script.google.com/macros/s/AKfycby1YzD0g7VJq-NPMfulSu6re6Ikwh7HeU3uwl_OAIWXCadHvtAzT8oork-KJbwCdFvKmA/exec';
=======
    : 'https://script.google.com/macros/s/AKfycbwxTqnfz7jgmLS2ths4yY5eNgY0KSczrA1YZGXj_ErcSlCldxdBvN4jmRSlEn8Fb9U/exec';
>>>>>>> 7aff341 (update entry page and routing)

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