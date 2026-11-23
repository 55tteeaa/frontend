# Imagini pentru resurse

Administratorii pot încărca sau înlocui fotografiile din **Administrare → Imagini resurse**. Imaginea este verificată ca JPEG, PNG sau WebP (maximum 5 MB) și salvată în baza de date. După salvare, catalogul folosește imaginea încărcată; imaginile existente din acest folder rămân ca variante implicite pentru resursele care nu au încă o fotografie încărcată.

Administratorii pot crea și șterge resurse din **Administrare → Gestionare resurse**. Ștergerea elimină definitiv și rezervările asociate.

După actualizarea schemei Prisma, reconstruiește și pornește serviciul backend pentru a actualiza PostgreSQL:

```sh
cd backend
podman compose up -d --build --force-recreate api
```
