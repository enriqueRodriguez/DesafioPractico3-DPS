import { readFile } from 'node:fs/promises';

const args = process.argv.slice(2);
const force = args.includes('--force');
const baseUrl = args.find((arg) => /^https?:\/\//i.test(arg))?.replace(/\/+$/, '');

if (!baseUrl) {
  console.error('Falta la URL base. Uso: npm run seed -- https://TU_ID.mockapi.io/api/v1');
  process.exit(1);
}

const endpoint = `${baseUrl}/books`;
const books = JSON.parse(await readFile(new URL('./books.seed.json', import.meta.url), 'utf8'));

const response = await fetch(endpoint);
const existing = response.ok ? await response.json() : [];
if (existing.length > 0 && !force) {
  console.error(
    `El recurso ya tiene ${existing.length} registro(s). Bórralos primero o agrega --force para sumar los nuevos.`,
  );
  process.exit(1);
}

for (const book of books) {
  const created = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...book, createdAt: new Date().toISOString() }),
  });
  if (!created.ok) {
    console.error(
      `Error ${created.status} al crear "${book.title}". ¿Ya creaste el recurso "books" en MockAPI?`,
    );
    process.exit(1);
  }
  console.log(`+ ${book.title}`);
}

console.log(`\nListo: ${books.length} libros cargados en ${endpoint}`);
