# Sanvi Shringaar and Gift Corner — Shop Price Catalog

A simple website for your shop so any family member can look up the price of
an item, and whoever you choose can add or update photos, names, and prices.

- **Public catalog** — anyone with the link can browse sections (Lipstick, Bindi,
  Bangles, etc.) and see each item's photo and price range (min–max).
- **Family login** — a single shared username/password lets you add categories,
  add items, upload photos, and edit prices.
- **Search** — type a product name or brand to find it instantly across all
  sections.

Built with React (frontend), Node.js/Express (backend/API), and MongoDB
(database). Photos are stored on Cloudinary (free) so they load fast and
don't get lost when the server restarts.

---

## 1. Project structure

```
sanvi-shringaar/
  backend/     -> Express API + MongoDB (deploy to Render)
  frontend/    -> React website (deploy to Vercel)
```

---

## 2. Before you deploy: create three free accounts

You need three free accounts. All of them work fine on their free tiers for
a shop catalog like this.

### 2.1 MongoDB Atlas (the database)

1. Go to https://www.mongodb.com/cloud/atlas/register and sign up (free).
2. Create a new **free (M0) cluster** — any provider/region is fine, pick one
   close to India, e.g. Mumbai.
3. Under **Database Access**, create a database user (username + password).
   Save these — you'll need them.
4. Under **Network Access**, click **Add IP Address** → **Allow access from
   anywhere** (0.0.0.0/0). This is needed because Render's servers don't have
   a fixed IP.
5. Click **Connect** on your cluster → **Drivers** → copy the connection
   string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<username>` and `<password>` with your database user's
   credentials, and add a database name before the `?`, e.g.:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/sanvi-shringaar?retryWrites=true&w=majority
   ```
   Keep this string — it's your `MONGO_URI`.

### 2.2 Cloudinary (photo storage)

1. Go to https://cloudinary.com/users/register_free and sign up (free).
2. On your Cloudinary **Dashboard**, you'll immediately see three values:
   **Cloud name**, **API Key**, **API Secret**. Keep these — you'll need them.

### 2.3 GitHub (to connect your code to Render and Vercel)

1. Go to https://github.com and create a free account if you don't have one.
2. Create a new empty repository, e.g. `sanvi-shringaar`.
3. Upload this project to it. Easiest way if you're not familiar with git:
   on the repository page, click **Add file → Upload files**, and drag in
   the `backend` and `frontend` folders (or the whole project). Commit the
   changes.

   If you do have git installed, from inside the project folder:
   ```bash
   cd sanvi-shringaar
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-username>/sanvi-shringaar.git
   git push -u origin main
   ```

---

## 3. Deploy the backend to Render

1. Go to https://render.com and sign up (free), then connect your GitHub
   account.
2. Click **New +** → **Web Service**.
3. Select your `sanvi-shringaar` repository.
4. Fill in the settings:
   - **Name**: `sanvi-shringaar-api` (or anything you like)
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free
5. Scroll to **Environment Variables** and add each of these (values from
   step 2 above):

   | Key | Value |
   |---|---|
   | `MONGO_URI` | your MongoDB connection string |
   | `JWT_SECRET` | any long random string, e.g. `sanvi2026-secret-key-xyz` |
   | `ADMIN_USERNAME` | the username your family will use to log in, e.g. `sanvi_admin` |
   | `ADMIN_PASSWORD` | a password only trusted family members know |
   | `CLOUDINARY_CLOUD_NAME` | from Cloudinary dashboard |
   | `CLOUDINARY_API_KEY` | from Cloudinary dashboard |
   | `CLOUDINARY_API_SECRET` | from Cloudinary dashboard |
   | `CLIENT_URL` | leave blank for now — you'll fill this in after step 4 |

6. Click **Create Web Service**. Render will build and deploy it — this
   takes a few minutes. Once done, you'll get a URL like:
   ```
   https://sanvi-shringaar-api.onrender.com
   ```
   Copy this URL — it's your backend URL. Visiting it in a browser should
   show `{"message":"Sanvi Shringaar and Gift Corner API is running"}`.

   > **Note:** Render's free tier "sleeps" a web service after 15 minutes of
   > no traffic, so the first request after a while can take 20–30 seconds
   > to wake up. This is normal on the free plan.

---

## 4. Deploy the frontend to Vercel

1. Go to https://vercel.com and sign up (free), then connect your GitHub
   account.
2. Click **Add New** → **Project**, and select your `sanvi-shringaar`
   repository.
3. When asked to configure the project:
   - **Root Directory**: click **Edit** and set it to `frontend`
   - **Framework Preset**: Vercel should auto-detect **Vite**
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `dist` (default)
4. Open **Environment Variables** and add:

   | Key | Value |
   |---|---|
   | `VITE_API_URL` | your Render backend URL from step 3, e.g. `https://sanvi-shringaar-api.onrender.com` (no trailing slash) |

5. Click **Deploy**. After a minute or two you'll get a URL like:
   ```
   https://sanvi-shringaar.vercel.app
   ```
   This is your website — share this link with family members.

---

## 5. Connect the two together (final step)

Now that you have your Vercel URL, go back to Render:

1. Open your Render web service → **Environment**.
2. Set `CLIENT_URL` to your Vercel URL, e.g.:
   ```
   https://sanvi-shringaar.vercel.app
   ```
   (You can list more than one URL separated by commas if needed.)
3. Save changes — Render will automatically redeploy.

That's it. Visit your Vercel URL, click **Family Login**, sign in with the
`ADMIN_USERNAME` / `ADMIN_PASSWORD` you set in step 3, and start adding
categories and items.

---

## 6. Using the site day-to-day

- **Everyone** (no login needed): open the site, browse sections, or use the
  search bar at the top to find an item's price instantly.
- **Family members with the login**: click **Family Login** (top right),
  sign in, then go to **Admin**:
  - **Categories tab** — add a new section (e.g. "Lipstick", "Bindi",
    "Bangles"), optionally with a cover photo.
  - **Items tab** — add a new item: choose its category, upload a photo,
    enter its **name**, **minimum price**, and **maximum price** (if the
    item has one fixed price, enter the same number in both boxes), and
    optionally a brand and notes. You can edit or delete any item any time.
- Everyone you share the `ADMIN_USERNAME`/`ADMIN_PASSWORD` with can add or
  edit prices. Everyone else can only view.

---

## 7. Running it on your own computer (optional, for testing)

**Backend:**
```bash
cd backend
npm install
cp .env.example .env      # then fill in your real values in .env
npm run dev
```
Runs on http://localhost:5000

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000
npm run dev
```
Runs on http://localhost:5173

---

## 8. Troubleshooting

- **"Network Error" or blank page on the live site** — check that
  `VITE_API_URL` in Vercel matches your Render URL exactly (no trailing
  slash), and that `CLIENT_URL` in Render matches your Vercel URL exactly.
  Redeploy after changing either one.
- **Login fails** — double check `ADMIN_USERNAME`/`ADMIN_PASSWORD` in
  Render's environment variables match what you're typing on the site.
- **Photos don't upload** — double check the three `CLOUDINARY_*` values in
  Render are copied correctly from your Cloudinary dashboard.
- **Site is slow the first time someone opens it** — this is Render's free
  tier "waking up" after being idle; it's normal and only happens once
  every 15 minutes of inactivity.
- **Changed an environment variable and nothing happened** — both Render and
  Vercel need a redeploy to pick up new environment variables; this
  usually happens automatically, but you can also trigger it manually from
  each dashboard.
