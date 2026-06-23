# Admin Portal — Phase 1 (Login, Clients, Portals)

Admin login, "Add client" (name + user ID + password), and "Add portal"
(multiple portals per client). Everything is stored in MySQL.

```
backend/   PHP API + database schema  → upload to the "backend" folder on cPanel
frontend/  React app                   → run on your computer with VS Code
```

The backend lives at `https://adminportal.seithithuli.com/backend/...` and the
frontend already has the correct `.env` file pointing to it — nothing to edit
there unless you move things later.

## Part A — Backend \& database (on cPanel)

### A1. Create the database tables

1. cPanel → **phpMyAdmin** → click `seithit1\_adminportal` on the left.
2. Click the **SQL** tab, open `backend/install.sql` from this package, copy
all of it, paste into the SQL box, click **Go**.
3. Skip this step if you already did it before — running it twice will just
show an error that the tables already exist, which is harmless.

### A2. Set your database credentials

1. cPanel → **MySQL® Databases** → confirm a user is attached to
`seithit1\_adminportal` with **ALL PRIVILEGES**. Create one if needed.
2. Open `backend/config.php` and fill in the real values:

```php
   'db\_user' => 'seithit1\_yourusername',
   'db\_pass' => 'your-password',
   ```

### A3. Upload the backend files

In cPanel File Manager, open the `backend` folder you created on the
subdomain. Upload everything that is *inside* this package's `backend/`
folder into it, so it looks like:

```
backend/
├── config.php
├── db.php
├── helpers.php
├── .htaccess
└── api/
    ├── login.php
    ├── logout.php
    ├── clients/
    └── portals/
```

(No `setup.php` / `setup.html` this time — we create the admin account
directly in the database instead, see below.)

### A4. Create your admin login

Send me the username and password you want for the admin account and I'll
generate the bcrypt hash + the exact SQL `INSERT` statement. Paste that into
phpMyAdmin's SQL tab (same place as step A1) and run it — that creates your
admin row directly, no setup page needed.

### A5. If you get a "Database connection failed" / DB ERROR message

`db.php` is currently set to show the *real* reason for a connection failure
(not just a generic message), to make this easier to debug. Once login is
working, open `db.php`, find the comment near the bottom, and switch back to
the generic error message for security — instructions are right there in the
code comment.

## Part B — Frontend (in VS Code, on your computer)

1. Install Node.js from nodejs.org if you don't have it.
2. Extract the `frontend` folder from this package onto your computer and
open it in VS Code (File → Open Folder).
3. Open a terminal in VS Code (Terminal → New Terminal) and run:

```
   npm install
   ```

4. Run:

```
   npm run dev
   ```

5. VS Code will print a local address, usually `http://localhost:5173`. Open
that in your browser.

The `.env` file already included points to `https://adminportal.seithithuli.com/backend/api`
— you shouldn't need to touch it unless your backend URL changes.

## Using it

Once both sides are working, log in at `http://localhost:5173` with the admin
account from step A4. From there:

* **+ Add client** — create a client (name, user ID, password)
* Click into a client, then **+ Add portal** — add as many portals as needed
* Remove clients or portals any time (removing a client also removes its
portals)

## Notes on security

* All passwords (admin and client) are stored hashed with bcrypt, never in
plain text.
* Logging in issues a token that expires after 7 days; logging out deletes it
immediately.
* `config.php`, `db.php`, and `helpers.php` are blocked from direct browser
access by `.htaccess`.

## Moving to a real deployed frontend later

Right now the frontend runs from your computer via `npm run dev`, which is
great for development but only works while VS Code is open. When you're
ready to make it permanently available at your subdomain, run:

```
npm run build
```

inside the `frontend` folder — this creates a `dist/` folder with plain
`index.html` and `assets/` files you can upload to your subdomain's main
folder (outside `backend`), no Node.js needed on the server.

