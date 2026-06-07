# Setup Backend untuk Portfolio

API key sudah dipindahkan ke backend (serverless function) untuk keamanan.
Chatbot menggunakan **Sumopod API**. Berikut cara deploy:

> ⚠️ **PENTING — JANGAN PERNAH menulis nilai API key di file mana pun yang ikut di-commit
> (termasuk file dokumentasi ini).** Key hanya boleh berada di Environment Variables Vercel
> atau di `.env.local` yang sudah di-ignore git. Jika sebuah key pernah ter-commit, anggap
> key tersebut sudah bocor dan segera revoke lalu buat key baru.

## Struktur Project

```
├── api/
│   └── chat.js              (Backend API - Sumopod)
├── .env.local               (Local - API key disini, TIDAK di-commit)
├── .gitignore               (Pastikan .env.local di-ignore!)
├── package.json             (Dependencies)
├── vercel.json              (Config Vercel)
├── index.html, style.css, script.js, etc (Frontend)
```

## Deploy ke Vercel (Rekomendasi)

### 1. Install Node modules (opsional, untuk local testing)

```bash
npm install
```

### 2. Commit ke GitHub

```bash
git add .
git commit -m "Add chatbot backend API"
git push origin main
```

### 3. Deploy ke Vercel

- Buka https://vercel.com
- Klik "Add New..." → "Project"
- Import GitHub repository
- Klik "Deploy"

### 4. Set Environment Variable di Vercel

- Buka Vercel Dashboard
- Pilih project → Settings → Environment Variables
- Tambah variable:
  - **Name**: `SUMOPOD_API_KEY`
  - **Value**: `<masukkan-api-key-sumopod-kamu-di-sini>` (jangan tulis nilainya di repo)
- (Opsional) Tambah `ALLOWED_ORIGINS` untuk membatasi domain yang boleh memanggil
  endpoint, dipisah koma. Contoh: `https://bukankahhini.my.id,https://fardaaannn.github.io`
- Klik "Save"
- Redeploy project

### 5. Done! 🎉

Website sudah live di Vercel dengan backend API yang aman.

---

## Local Testing (opsional)

Jika ingin test di local:

```bash
# Install Vercel CLI
npm install -g vercel

# Login dengan akun Vercel
vercel login

# Buat file .env.local berisi:
#   SUMOPOD_API_KEY=...key-kamu...
# lalu jalankan:
vercel dev
```

Site akan tersedia di `http://localhost:3000`

---

## Security Notes

- ✅ API key hanya di `.env.local` (local) dan Environment Variables Vercel
- ✅ `.env.local` di-ignore git, tidak pernah ikut ter-commit
- ✅ Frontend hanya mengirim `message` ke `/api/chat`
- ✅ Backend yang memegang API key dan memanggil Sumopod
- ✅ Endpoint membatasi origin (CORS allowlist) dan punya rate limit sederhana

---

## Troubleshooting

**Error: "Server belum dikonfigurasi"**

- Pastikan environment variable `SUMOPOD_API_KEY` sudah di-set di Vercel lalu redeploy

**Error: "Gagal terhubung ke server"**

- Refresh page
- Cek koneksi internet
- Cek Console (F12) untuk detail error

**Chatbot menolak request dari domain tertentu**

- Tambahkan domain tersebut ke environment variable `ALLOWED_ORIGINS`

**Local test tidak jalan**

- Pastikan `node_modules` sudah di-install: `npm install`
- Restart terminal
