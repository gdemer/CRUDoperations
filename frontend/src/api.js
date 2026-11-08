// api.js — the ONLY place that talks to the backend.
// Each function matches one CRUD operation / one HTTP method.
const BASE = '/api/products';

async function request(url, options) {
  const res = await fetch(url, options);
  if (res.status === 204) return null;            // DELETE returns no body
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed'); // show server's message
  return data;
}

const json = (method, body) => ({
  method,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const getProducts   = ()           => request(BASE);
export const createProduct = (p)          => request(BASE, json('POST', p));
export const updateProduct = (id, p)      => request(`${BASE}/${id}`, json('PUT', p));
export const deleteProduct = (id)         => request(`${BASE}/${id}`, { method: 'DELETE' });
