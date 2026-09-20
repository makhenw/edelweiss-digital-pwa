# Edelweiss Digital — PWA Layer V1

## Tujuan
Layer ini membuat launcher Edelweiss Digital dapat di-install sebagai aplikasi PWA tanpa mengubah Code.gs, database, login, menu, atau UI aplikasi GAS.

## 1. Atur URL
Buka `config.js` dan ganti:

`PASTE_GAS_WEB_APP_URL_HERE`

dengan URL deployment Web App GAS Edelweiss Digital, misalnya:

`https://script.google.com/macros/s/XXXXXXXXXXXX/exec`

Jangan memakai URL `/dev` untuk instalasi produksi.

## 2. Hosting
File PWA ini harus di-host pada HTTPS dengan origin sendiri yang mendukung Service Worker, misalnya:
- GitHub Pages
- Cloudflare Pages
- Netlify
- hosting HTTPS lain

Jangan mencoba menyajikan `service-worker.js` melalui `HtmlService` Code.gs.

## 3. Perilaku
PWA ini hanya menyimpan app shell/launcher. Data, login, session, pembayaran, iuran, dan database tetap dikelola oleh GAS existing.

Service Worker sengaja tidak melakukan cache terhadap request ke:
- script.google.com
- googleusercontent.com

Ini mencegah data aplikasi lama tersimpan sebagai cache PWA.

## 4. Setelah hosting
Buka URL HTTPS PWA dari Chrome Android. Pilih Install App / Add to Home Screen.

## 5. Penting
Ini adalah PWA Layer V1 yang aman. Belum mengubah `Code.gs`.

Langkah berikutnya setelah URL hosting diketahui:
- finalisasi URL GAS
- uji login
- uji session
- uji dashboard Warga/Pengurus/Security
- uji Payment Center
- uji update Service Worker
- uji install Android
