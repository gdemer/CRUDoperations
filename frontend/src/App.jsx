import { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from './api.js';

const emptyForm = { name: '', price: '' };

export default function App() {
  const [products, setProducts] = useState([]);   // data from the API
  const [form, setForm] = useState(emptyForm);    // what is typed in the form
  const [editingId, setEditingId] = useState(null); // null = creating, number = editing
  const [error, setError] = useState('');

  // READ: load the list once, when the page first appears.
  async function load() {
    try {
      setProducts(await getProducts());
      setError('');
    } catch (e) {
      setError('Could not load products. Is the backend running? ' + e.message);
    }
  }
  useEffect(() => { load(); }, []);

  // CREATE or UPDATE, depending on whether we are editing.
  async function handleSubmit(e) {
    e.preventDefault();
    const payload = { name: form.name, price: Number(form.price) };
    try {
      if (editingId === null) await createProduct(payload);
      else await updateProduct(editingId, payload);
      setForm(emptyForm);
      setEditingId(null);
      await load();            // re-read so the screen matches the database
    } catch (e) {
      setError(e.message);
    }
  }

  function startEdit(p) {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price) });
    setError('');
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(emptyForm);
  }

  // DELETE
  async function handleDelete(id) {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      if (editingId === id) cancelEdit();
      await load();
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <main className="container">
      <h1>Products</h1>

      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          placeholder="Price"
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          required
        />
        <button type="submit">{editingId === null ? 'Add product' : 'Save changes'}</button>
        {editingId !== null && (
          <button type="button" className="secondary" onClick={cancelEdit}>Cancel</button>
        )}
      </form>

      {error && <p className="error">{error}</p>}

      <table>
        <thead>
          <tr><th>ID</th><th>Name</th><th>Price</th><th></th></tr>
        </thead>
        <tbody>
          {products.length === 0 && (
            <tr><td colSpan="4" className="empty">No products yet. Add one above.</td></tr>
          )}
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price.toFixed(2)}</td>
              <td className="actions">
                <button className="secondary" onClick={() => startEdit(p)}>Edit</button>
                <button className="danger" onClick={() => handleDelete(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
