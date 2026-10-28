/*const WP_API_URL = "http://localhost/aaaibwewp.com/graphql"; */

export async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' };

  const res = await fetch(WP_API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  const json = await res.json();
  if (json.errors) {
    console.error(json.errors);
    throw new Error('Falha ao buscar dados na API do WordPress');
  }

  return json.data;
}