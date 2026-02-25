# Setup Backend untuk Portfolio

API key Gemini sudah dipindahkan ke backend untuk keamanan! Berikut cara deploy:

## Struktur Project

```
├── api/
│   └── chat.js              (Backend API - Gemini)
├── .env.local               (Local - API key disini)
├── .gitignore               (Jangan push .env.local!)
├── package.json             (Dependencies)
├── vercel.json              (Config Vercel)
├── index.html, style.css, script.js, etc (Frontend)
```

## Deploy ke Vercel (Rekomendasi)

### 1. Install Node modules (Optional untuk local testing)
```bash
npm install
```

### 2. Commit ke GitHub
```bash
git add .
git commit -m "Add Gemini backend API"
git push origin main
```

### 3. Deploy ke Vercel
- Buka https://vercel.com
- Click "Add New..." → "Project"
- Import GitHub repository
- Click "Deploy"

### 4. Set Environment Variable di Vercel
- Buka Vercel Dashboard
- Pilih project → Settings → Environment Variables
- Tambah variable:
  - **Name**: `GEMINI_API_KEY`
   - **Value**: `AIzaSyDt-GmLhXO6lULNsE8gu10UWfHg_-NEFws`
- Click "Save"
- Redeploy project

### 5. Done! 🎉
Website sudah live di Vercel dengan backend API yang aman.

---

## Local Testing (Optional)

Jika ingin test di local:

```bash
# Install Vercel CLI
npm install -g vercel

# Login dengan Akun Vercel
vercel login

# Test di local dengan environment variables
vercel dev
```

Site akan available di `http://localhost:3000`

---

## File yang Dibuat

- ✅ `api/chat.js` - Backend API untuk Gemini
- ✅ `.env.local` - Environment variables (jangan di-push!)
- ✅ `.gitignore` - Ignore sensitive files
- ✅ `package.json` - Dependencies
- ✅ `vercel.json` - Vercel configuration
- ✅ `script.js` - Updated dengan backend endpoint

---

## Security Notes

- ✅ API key di `.env.local` (local saja)
- ✅ API key di Environment Variables Vercel (tidak terlihat di repo)
- ✅ Frontend hanya kirim message ke `/api/chat`
- ✅ Backend yang handle API key (aman!)

---

## Troubleshooting

**Error: "API key tidak ditemukan"**
- Pastikan environment variable `GEMINI_API_KEY` sudah di-set di Vercel

**Error: "Gagal terhubung ke server"**
- Refresh page
- Cek koneksi internet
- Cek Console (F12) untuk error detail

**Local test tidak jalan**
- Pastikan `node_modules` sudah di-install: `npm install`
- Restart terminal

---

**Created: February 25, 2026**
