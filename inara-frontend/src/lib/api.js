export async function getProducts() {
  // simple fetch to local mock file
  const res = await fetch("/src/mock/products.json");
  if (!res.ok) throw new Error("Failed to load products");
  return res.json();
}

export async function getProductById(id) {
  const list = await getProducts();
  return list.find(p => String(p.id) === String(id));
}
