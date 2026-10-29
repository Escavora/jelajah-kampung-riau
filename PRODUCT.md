# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

- **Siswa kelas 4 SD di Pekanbaru (9–10 tahun)**, bermain berkelompok 3–4 anak di satu tablet lanskap selama satu sesi 30–35 menit. Kemampuan membaca beragam, sentuhan jari belum presisi, jadi setiap instruksi juga punya suara.
- **Guru kelas**, menyiapkan sesi dan mendampingi kelompok. Waktunya terbatas dan tidak semua guru akrab dengan teknologi. Belum ada layar khusus guru.
- **Peneliti atau pengembang**, membaca log aksi yang anonim untuk analisis di spreadsheet.

## Product Purpose

Media pembelajaran IPAS tentang lingkungan alam dan lingkungan buatan, posisinya sebagai pendalaman untuk kelas 4. Konsep abstrak diubah jadi aturan permainan: elemen alam ditemukan, elemen buatan dibangun. Sukses berarti anak bisa mengelompokkan lingkungan disertai alasan, menghubungkan kebutuhan warga dengan lingkungan yang tepat, dan memilih tindakan menjaga lingkungan, sementara guru tetap bisa menilai kontribusi tiap anak dalam kerja kelompok.

## Positioning

Contoh lingkungan diambil dari sekitar anak Pekanbaru (Sungai Siak, Masjid An-Nur, Selaso Jatuh Kembar, Danau Buatan Lembah Sari), bukan gunung dan laut dari buku umum. Kerja kelompok dinilai per individu lewat rotasi peran yang dikunci sistem dan log aksi, tanpa soal tambahan.

## Operating Context

Dipakai di kelas sekolah dasar dengan internet yang bisa putus. Satu tablet dipegang bergantian oleh anggota kelompok sesuai giliran peran. Guru membuka sesi dari Beranda. Alur lengkap ada di prd.md bagian 5.

## Capabilities and Constraints

- React + Vite + TypeScript, deploy ke Vercel, tanpa backend di v1. Data tersimpan lokal di perangkat.
- Harus tetap jalan offline setelah dibuka sekali (PWA).
- Tablet lanskap 1280 x 800 sebagai basis, minimum 1024 x 768. Mode potret tidak didukung di v1.
- Tidak ada akun login, sinkronisasi real time, multiplayer lintas perangkat, atau bank soal.
- Belum diputuskan: maskot Badrul final, pengisi voice over, gaya ilustrasi final.

## Brand Commitments

- Nama produk: **Jelajah Kampung Riau**.
- Identitas budaya **Melayu Riau** wajib terasa. Unsur yang disetujui: motif ukiran dan tenun Melayu, bentuk atap selembayung dari Selaso Jatuh Kembar, dan warna adat Melayu. Tulisan Arab Melayu (Jawi) tidak dipakai.
- Semua unsur budaya perlu dicek ahli budaya atau guru setempat sebelum uji coba ke siswa.
- Ornamen budaya tampil penuh di layar pembuka, transisi, dan rapor. Di layar kerja Fase 1–5 cukup berupa bingkai, warna, dan pola tepi tipis supaya fokus anak tidak pecah.
- Gaya bahasa di layar: "kalian" untuk kelompok, "kamu" untuk refleksi individu, umpan balik berupa cerita, bukan penilaian.

## Evidence on Hand

- prd.md dan design.md di root proyek.
- Konten anak di `src/content/*.json`, belum divalidasi ahli materi.
- PDF "Jelajah Lingkungan di Sekitar Kita" sebagai acuan gaya awal (tidak ada di repo).
- Belum ada ilustrasi final, rekaman voice over, atau foto. Jangan mengarang testimoni, data uji coba, atau klaim efektivitas.

## Product Principles

1. Satu layar, satu tugas, satu aksi utama.
2. Suara dulu, teks kemudian.
3. Aturan permainan mengajarkan konsep alam dan buatan.
4. Salah adalah bagian dari cerita: tidak ada tanda silang merah atau skor di layar siswa.
5. Dekat dengan Pekanbaru dan budaya Melayu Riau.

## Accessibility & Inclusion

- Target sentuh minimal 64 x 64 px dengan jarak 16 px.
- Teks di layar siswa minimal 18 px. Kontras WCAG 4.5:1 untuk teks biasa dan 3:1 untuk teks besar.
- Kategori tidak pernah dibedakan hanya dengan warna: alam (hijau, daun, tepi bergelombang), buatan (oranye, bata, tepi lurus), diskusi (ungu, panah dua arah, tepi putus-putus).
- Tidak ada timer hitung mundur dan tidak ada konten berkedip lebih dari 3 kali per detik. Hormati pengaturan reduce motion.
