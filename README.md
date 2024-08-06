## Tentang

Aplikasi ini bertujuan untuk menghasilkan "roasting" atau kritik tajam terhadap profil seseorang menggunakan teknologi Google Generative AI. Berikut adalah langkah-langkah utama yang dilakukan aplikasi ini :

1. **Mengambil Data Profil Github**: Aplikas ini mengambil data profil, repositori, dan README dari pengguna GitHub yang ditentukan.
2. **Menggunakan Google Generative AI**: Data yang diambil kemudian dikirim ke model generatif dari Google untuk menghasilkan teks roasting.
3. **Menampilkan Hasil Roasting**: Hasil roasting yang dihasilkan oleh AI kemudian ditampilkkan kepada pengguna.

**Live Demo**: [https://gh-roasting.github.com/](https://gh-roasting.github.com/)

## Instalasi

1. Clone repositori ini.
2. Jalankan perintah berikut untuk menginstal dependensi:

   ```sh
   npm install
   ```

3. Buat file `.env` di root direktori dan tambahkan API key untuk Google Generative AI:

   ```
   GEMINI_API_KEY=your_api_key_here
   ```

## Menjalankan Aplikasi

Untuk menjalankan aplikasi dalam mode pengembangan, gunakan perintah berikut:

```sh
npm run dev
```
