# PRD: Jelajah Kampung Riau

Media pembelajaran digital IPAS untuk siswa kelas 4 SD tentang lingkungan alam dan lingkungan buatan, berbasis muatan lokal Kota Pekanbaru.

| Item | Keterangan |
|---|---|
| Versi dokumen | 0.1 (draft) |
| Penyusun | Alief |
| Tanggal | 29 Oktober 2026 |
| Stack | React (Vite) dan deploy ke Vercel |
| Status | Siap masuk tahap prototipe |

---

## 1. Latar Belakang

Materi kenampakan alam dan buatan biasanya diajarkan lewat gambar statis dan hafalan definisi. Anak bisa menyebut "sungai itu alam", tapi belum tentu paham kenapa taman yang penuh pohon justru termasuk buatan. Di sisi lain, contoh di buku sering tidak dekat dengan anak Pekanbaru. Gunung dan laut jarang mereka temui, padahal Sungai Siak, Masjid An-Nur, dan Selaso Jatuh Kembar ada di sekitar mereka.

Media ini mencoba menjawab dua hal sekaligus. Pertama, konsep abstrak diubah jadi aturan permainan (alam ditemukan, buatan dibangun). Kedua, kerja kelompok tetap bisa dinilai per individu lewat pencatatan peran dan aksi.

**Catatan kurikulum.** Topik kenampakan alam dan buatan di buku IPAS muncul di kelas 3, sedangkan CP Fase B berlaku untuk kelas 3 dan 4. Posisi media ini untuk kelas 4 adalah **pendalaman**, dengan penekanan pada hubungan sebab akibat dan aksi menjaga lingkungan. Rujukan CP wajib diambil dari dokumen resmi BSKAP, bukan blog.

## 2. Tujuan

**Tujuan pembelajaran (untuk siswa)**
- I1. Mengenali ragam lingkungan di sekitar tempat tinggal.
- I2. Mengelompokkan lingkungan ke dalam kategori alam dan buatan disertai alasan.
- I3. Menjelaskan manfaat tiap lingkungan bagi manusia.
- I4. Menghubungkan kebutuhan warga dengan lingkungan yang tepat.
- I5. Memilih tindakan yang tepat untuk menjaga lingkungan.

**Tujuan produk**
- Bisa dimainkan satu kelompok (3 sampai 4 siswa) di satu tablet dalam 30 sampai 35 menit.
- Mencatat kontribusi tiap anggota kelompok tanpa memberi soal tambahan.
- Menghasilkan rapor kelompok dan mencatat log aksi di perangkat.
- Tetap jalan saat internet sekolah putus di tengah sesi.

**Bukan tujuan (di luar cakupan v1)**
- Akun login siswa atau guru.
- Sinkronisasi data antar perangkat secara real time.
- Mode multiplayer lintas perangkat.
- Bank soal pilihan ganda.
- Perekaman suara oleh siswa (voice note). Isian bebas hanya lewat ketikan singkat.
- Mode Guru (PIN, tampilan rubrik, pemutar voice note) dan ekspor data CSV, JSON, atau ZIP. Dicabut pada 29 Oktober 2026; rapor dan log tetap dihitung dan disimpan lokal.

## 3. Pengguna

| Persona | Kebutuhan utama | Batasan |
|---|---|---|
| Siswa kelas 4 (9 sampai 10 tahun) | Instruksi singkat, bisa dimainkan dengan jari, ada suara | Kemampuan membaca beragam, sentuhan jari belum presisi |
| Guru kelas | Menyiapkan sesi dengan cepat, melihat hasil tiap kelompok, mengekspor data | Waktu terbatas, tidak semua guru akrab dengan teknologi |
| Peneliti atau pengembang | Data log yang rapi untuk analisis | Data harus anonim dan bisa diolah di spreadsheet |

## 4. Konten

### 4.1 Katalog elemen

| Kategori | Elemen | Catatan |
|---|---|---|
| Alam | Sungai Siak, anak sungai, pepohonan/hutan, rawa, tanah lapang | Tidak bisa diseret. Hanya bisa "ditemukan" dengan diketuk |
| Buatan | Rumah, Selaso Jatuh Kembar, Masjid An-Nur, sekolah, puskesmas, jalan, jembatan | Bisa diseret dan ditaruh di peta |
| Elemen diskusi | Taman, Danau Buatan Lembah Sari | Kunci jawaban: buatan. Dipakai sengaja untuk memancing debat kelompok |

Gunung dan laut **tidak dipakai** karena tidak mewakili kondisi Pekanbaru yang relatif datar.

### 4.2 Koreksi konten dari versi PDF

- Taman dipindah dari legenda "Lingkungan Alam" ke elemen diskusi dengan kunci buatan.
- Jembatan diberi pin dan kartu info sendiri.
- Klaim "4 menara melambangkan empat sahabat Nabi" dihapus sampai ada rujukan ilmiah.
- Frasa "payung elektrik raksasa ala Masjid Nabawi" diganti "payung besar yang bisa membuka dan menutup".
- Selaso Jatuh Kembar ditulis sebagai "balai pertemuan adat", bukan "tidak digunakan sebagai tempat tinggal pribadi".

### 4.3 Aturan teks untuk anak

- Maksimal 3 kalimat per kartu info, tiap kalimat maksimal sekitar 12 kata.
- Setiap teks punya rekaman suara (voice over).
- Kalimat ditutup dengan alasan kategori. Contoh: "Taman ditanam dan ditata manusia. Jadi taman termasuk lingkungan buatan."

### 4.4 Kartu warga (Fase 4)

Diambil acak 3 dari daftar berikut.

| Warga berkata | Elemen tepat |
|---|---|
| "Aku mau salat Jumat." | Masjid An-Nur |
| "Aku sedang demam." | Puskesmas |
| "Aku mau ke seberang Sungai Siak." | Jembatan |
| "Warga mau musyawarah kampung." | Selaso Jatuh Kembar |
| "Aku mau mencuci baju." | Rumah atau sungai (dua jawaban diterima, pemicu diskusi) |

### 4.5 Kejadian (Fase 5)

| Kejadian | Pilihan tindakan | Tindakan tepat |
|---|---|---|
| Sungai Siak penuh sampah | Ikut buang sampah ke sungai, gotong royong memungut sampah, biarkan saja | Gotong royong memungut sampah |
| Pohon ditebang | Tanam pohon baru, tebang lebih banyak, tidak peduli | Tanam pohon baru |
| Jalan tergenang setelah hujan | Bersihkan selokan, buang sampah ke selokan, main di genangan | Bersihkan selokan |

Kejadian kabut asap bisa ditambahkan di v2 setelah data pendukungnya diambil dari sumber resmi.

## 5. Alur Aplikasi

```
Beranda Guru -> Setup Kelompok -> Fase 0 Jelajah Peta -> Fase 1 Tata Kampung
-> Fase 2 Beri Label -> Fase 3 Kartu Manfaat -> Fase 4 Warga Butuh Apa
-> Fase 5 Kampung Esok Hari -> Refleksi Individu -> Rapor Kelompok
```

### 5.1 Setup kelompok
- Guru membuka sesi baru dan memasukkan kode kelompok (misalnya "Kelompok 3").
- Tiap anggota memilih avatar dan menulis nama panggilan saja.
- Sistem menyiapkan rotasi peran: Arsitek, Juru Label, Pencatat Manfaat, Penjaga Kampung.

### 5.2 Rotasi peran
- Di awal tiap fase muncul layar "Giliran siapa" berisi avatar anggota.
- Peran utama fase itu dipegang anggota yang dipilih. Sistem mencegah satu anak memegang peran utama dua kali sebelum semua kebagian.
- Setiap aksi dicatat dengan `actorId` milik pemegang peran.

### 5.3 Rincian fase

**Fase 0, Jelajah Peta (5 menit)**
- Peta Pekanbaru dengan pin. Ketuk pin untuk membuka kartu info dan memutar voice over.
- Tiap pin yang dikunjungi memberi stiker. Minimal 5 pin dikunjungi untuk lanjut.

**Fase 1, Tata Kampung (I1, 6 menit)**
- Kanvas kampung kosong dengan sungai sebagai latar tetap.
- Elemen alam ditemukan dengan diketuk. Elemen buatan diseret dari laci katalog.
- Target: minimal 3 elemen alam dan 3 elemen buatan, termasuk minimal 1 elemen diskusi.

**Fase 2, Beri Label (I2, 6 menit)**
- Juru Label menempelkan label alam atau buatan di tiap elemen.
- Label baru terkunci setelah tombol "Kami Sepakat" ditekan.
- Setiap perubahan label sebelum dikunci disimpan sebagai riwayat.

**Fase 3, Kartu Manfaat (I3, 6 menit)**
- Tiap elemen minimal 2 kartu manfaat bergambar.
- Satu kartu kosong "Manfaat versi kami" diisi lewat ketikan satu kalimat pendek.

**Fase 4, Warga Butuh Apa (I4, 5 menit)**
- 3 warga muncul di pinggir layar. Kelompok menarik garis dari warga ke elemen.
- Kalau elemen yang dibutuhkan belum ada, muncul pesan "Kampung kita masih kurang sesuatu nih" dan laci katalog terbuka lagi.

**Fase 5, Kampung Esok Hari (I5, 5 menit)**
- 3 kejadian muncul bergantian. Penjaga Kampung memilih 1 dari 3 tindakan.
- Meter "Kampung Sehat" naik atau turun.
- Pilihan kurang tepat dibalas cerita singkat, bukan tanda silang. Kelompok boleh mencoba lagi dan percobaan ulang tetap dicatat.

**Refleksi Individu (1 menit per anak)**
- Tiap anak memilih emoji bagian paling seru.
- Tiap anak mengetik satu hal yang akan dilakukan untuk menjaga lingkungan.

**Rapor Kelompok**
- Kalimat ringkas, contoh: "Kampung kalian punya 4 lingkungan alam dan 5 lingkungan buatan, dan kalian menjaganya dengan 3 tindakan."
- Level rubrik tiap indikator dihitung dari log (`lib/scoring.ts`) dan tidak ditampilkan di layar siswa. Belum ada layar untuk guru.

## 6. Rubrik Penilaian (draft, perlu validasi ahli materi)

| Indikator | Mulai | Berkembang | Mahir |
|---|---|---|---|
| I1 Ragam lingkungan | Menata kurang dari 3 jenis lingkungan | Menata 3 sampai 5 jenis dari satu kategori dominan | Menata 6 atau lebih jenis yang seimbang alam dan buatan |
| I2 Klasifikasi | Label benar kurang dari 50% | Label benar 50 sampai 80% atau benar setelah lebih dari 2 kali ubah | Label benar lebih dari 80% termasuk elemen diskusi |
| I3 Manfaat | Kurang dari 2 kartu benar per elemen | 2 kartu benar per elemen | 2 kartu benar dan mengisi manfaat versi sendiri yang relevan |
| I4 Kebutuhan warga | Benar 1 dari 3 | Benar 2 dari 3, atau 3 dengan petunjuk | Benar 3 dari 3 dan menambah elemen sendiri saat kurang |
| I5 Tindakan | Benar 1 dari 3 | Benar 2 dari 3, atau 3 dengan percobaan ulang | Benar 3 dari 3 pada percobaan pertama |

Rubrik level individu untuk I5 diambil dari isi refleksi dan dinilai manual oleh guru.

## 7. Kebutuhan Fungsional

| ID | Kebutuhan | Prioritas |
|---|---|---|
| F-01 | Setup kelompok dengan avatar dan nama panggilan | Wajib |
| F-02 | Rotasi peran otomatis per fase | Wajib |
| F-03 | Peta interaktif dengan pin dan kartu info bersuara | Wajib |
| F-04 | Drag and drop elemen buatan yang ramah sentuhan | Wajib |
| F-05 | Label dengan tombol kunci "Kami Sepakat" dan riwayat perubahan | Wajib |
| F-06 | Kartu manfaat bergambar | Wajib |
| F-07 | ~~Rekam voice note dengan batas durasi~~ Dicabut, diganti ketikan singkat | Dicabut |
| F-08 | Garis hubung warga ke elemen | Wajib |
| F-09 | Kejadian dengan meter Kampung Sehat | Wajib |
| F-10 | Refleksi individu | Wajib |
| F-11 | Rapor kelompok otomatis | Wajib |
| F-12 | ~~Mode Guru dilindungi PIN~~ Dicabut | Dicabut |
| F-13 | ~~Ekspor data sesi ke CSV dan JSON, voice note ke ZIP~~ Dicabut | Dicabut |
| F-14 | Lanjutkan sesi jika tab tertutup atau baterai habis | Sebaiknya |
| F-15 | Bisa dimainkan offline setelah dibuka pertama kali (PWA) | Sebaiknya |
| F-16 | Pengaturan durasi fase oleh guru | Opsional |

## 8. Kebutuhan Nonfungsional

**Aksesibilitas dan ergonomi anak**
- Target sentuh minimal 64 x 64 px dengan jarak antar target minimal 16 px. Angka ini sengaja di atas pedoman WCAG karena jari anak kurang presisi.
- Warna tidak boleh jadi satu-satunya penanda. Alam memakai hijau dan ikon daun, buatan memakai oranye dan ikon batu bata.
- Tidak ada timer hitung mundur. Progres ditunjukkan lewat progress bar.
- Semua instruksi punya voice over hasil rekaman manusia, bukan text to speech, supaya pelafalan nama lokal tepat.

**Performa**
- Ukuran bundle awal di bawah 500 KB (gzip), di luar aset audio dan gambar.
- Aset gambar memakai WebP atau SVG.
- Waktu muat pertama kurang dari 3 detik di jaringan 4G.

**Perangkat target**
- Tablet Android dan iPad, orientasi lanskap.
- Laptop layar sentuh sebagai cadangan.

**Privasi**
- Tidak ada nama lengkap, foto wajah, atau data pribadi lain.
- Data tersimpan lokal di perangkat. Tidak ada pengiriman ke server pada v1.

## 9. Arsitektur Teknis

### 9.1 Stack

| Lapisan | Pilihan | Alasan |
|---|---|---|
| Build tool | Vite | Cepat, konfigurasi minimal, didukung Vercel |
| UI | React 18 dan TypeScript | Sesuai permintaan, tipe data log lebih aman |
| Styling | Tailwind CSS | Cepat untuk prototipe, token warna mudah dijaga |
| Routing | React Router | Navigasi antar fase |
| State | Zustand | Ringan, mudah dipersist |
| Drag and drop | dnd-kit | Mendukung sensor sentuh |
| Animasi | Framer Motion | Transisi fase dan umpan balik |
| Penyimpanan | localStorage untuk state dan log | Tanpa backend |
| PWA | vite-plugin-pwa | Mode offline |
| Hosting | Vercel | Deploy otomatis dari GitHub, HTTPS bawaan untuk izin mikrofon |

### 9.2 Struktur folder

```
src/
  assets/          gambar elemen, peta, audio voice over
  content/         elements.json, citizens.json, events.json, rubric.json
  components/      tombol, kartu, avatar, progress bar
  features/
    setup/
    phase0-explore/
    phase1-build/
    phase2-label/
    phase3-benefit/
    phase4-citizen/
    phase5-event/
    reflection/
    report/
    teacher/
  store/           sessionStore, logStore
  lib/             logger, scoring, export, audio
  routes.tsx
  main.tsx
```

Konten disimpan di file JSON terpisah supaya guru atau ahli materi bisa merevisi teks tanpa menyentuh komponen.

### 9.3 Model data

**Elemen**
```json
{
  "id": "taman",
  "nama": "Taman",
  "kategori": "buatan",
  "diskusi": true,
  "info": "Taman ditanam dan ditata manusia. Jadi taman termasuk lingkungan buatan.",
  "audio": "/audio/taman.mp3",
  "manfaat": ["udara-segar", "tempat-bermain"]
}
```

**Log aksi**
```json
{
  "sessionId": "2026-11-03-k3",
  "groupId": "kelompok-3",
  "phase": 2,
  "role": "juru-label",
  "actorId": "avatar-kucing",
  "action": "label_changed",
  "payload": { "elementId": "taman", "from": "alam", "to": "buatan" },
  "timestamp": "2026-11-03T08:14:22+07:00"
}
```

Daftar `action` minimal: `pin_opened`, `element_found`, `element_placed`, `element_removed`, `label_changed`, `label_locked`, `benefit_attached`, `citizen_linked`, `hint_used`, `event_action_chosen`, `reflection_submitted`, `phase_completed`.

### 9.4 Penilaian otomatis
- Fungsi `scoring.ts` membaca log dan konten, lalu menghitung level rubrik tiap indikator.
- Skor dihitung ulang dari log, bukan disimpan terpisah, supaya hasilnya selalu konsisten dengan jejak aksi.

### 9.5 Deploy
- Repo GitHub terhubung ke Vercel. Setiap push ke `main` otomatis deploy ke produksi, branch lain jadi preview.
- Pengaturan build: framework Vite, perintah `npm run build`, folder keluaran `dist`.
- Tambahkan `vercel.json` berisi rewrite semua rute ke `index.html` supaya refresh di halaman fase tidak menghasilkan 404.

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

## 10. Kriteria Penerimaan

- Satu sesi penuh bisa diselesaikan di tablet tanpa error dalam 35 menit.
- Setiap aksi pada daftar `action` tercatat lengkap dengan `actorId` dan `phase`.
- Ekspor CSV terbuka rapi di Excel atau Google Sheets dengan satu baris per aksi.
- Refresh browser di tengah fase mengembalikan siswa ke fase yang sama tanpa kehilangan data.
- Setelah dibuka sekali dengan internet, aplikasi tetap bisa dimainkan dalam mode pesawat.
- Semua tombol lolos ukuran target sentuh minimal di poin 8.
- Semua teks lolos aturan panjang di poin 4.3 dan punya file audio.

## 11. Rencana Pengujian

- **Uji fungsional** dengan Vitest untuk logika `scoring` dan `logger`.
- **Uji perangkat** di minimal satu tablet Android dan satu iPad.
- **Validasi ahli** materi IPAS dan ahli media sebelum uji coba ke siswa.
- **Uji coba terbatas** dengan 1 sampai 2 kelompok, guru mencatat kendala di lembar observasi.
- **Uji kepraktisan** dengan angket guru dan siswa setelah sesi.

## 12. Milestone

| Minggu | Target |
|---|---|
| 1 | Setup proyek, struktur folder, file konten JSON, deploy kosong ke Vercel |
| 2 | Setup kelompok, rotasi peran, Fase 0 peta interaktif |
| 3 | Fase 1 drag and drop dan Fase 2 label dengan riwayat |
| 4 | Fase 3 kartu manfaat |
| 5 | Fase 4 garis hubung dan Fase 5 kejadian |
| 6 | Refleksi dan rapor |
| 7 | PWA offline, rekaman voice over, polishing aksesibilitas |
| 8 | Validasi ahli dan uji coba terbatas |

## 13. Risiko dan Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| Internet sekolah tidak stabil | Sesi terhenti | PWA dan penyimpanan lokal |
| Satu anak mendominasi perangkat | Data individu bias | Rotasi peran yang dikunci sistem |
| Data tersebar di banyak tablet | Rekap guru repot | Ekspor per perangkat dengan nama file berisi kode kelompok |
| Fakta muatan lokal keliru | Miskonsepsi siswa | Validasi ahli materi dan rujukan di tiap kartu info |

## 14. Hal yang Belum Diputuskan

- Durasi tiap fase tetap atau bisa diatur guru.
- Gaya ilustrasi final, apakah melanjutkan gaya PDF atau dibuat ulang dalam SVG.
- Pengisi voice over (guru, mahasiswa, atau anak).
- Perlu tidaknya backend (misalnya Supabase) di v2 untuk rekap lintas perangkat.

## 15. Referensi

- Badan Standar, Kurikulum, dan Asesmen Pendidikan. Capaian Pembelajaran IPAS Fase B (gunakan salinan keputusan resmi terbaru).
- Undang-Undang Nomor 44 Tahun 2024, Pasal 5, tentang karakteristik wilayah Kota Pekanbaru.
- Mayer, R. E. (2021). *Multimedia Learning* (3rd ed.). Cambridge University Press.
- Utari, G. D., Wenda, D. D. N., & Zunaidah, F. N. (2026). Efektivitas Multimedia Interaktif Berbasis Tradisi Nyadranan dalam Pembelajaran IPAS di Sekolah Dasar. *Prosiding SEMDIKJAR*, 9, 290 sampai 299. https://doi.org/10.29407/pysh6g87
- Pengembangan Media Pembelajaran Interaktif Berbasis Kearifan Lokal pada Pembelajaran IPAS Kelas V SD. *PRIMED*. https://doi.org/10.36636/primed.v6i1.7419
- Sularti (2024). Representasi Makna Ragam Hias pada Rumah Adat Selaso Jatuh Kembar Riau. Skripsi, Universitas Negeri Medan.
- W3C. Web Content Accessibility Guidelines (WCAG) 2.2, kriteria 1.4.1 (Use of Color) dan 2.5.8 (Target Size).
