# Design: Jelajah Kampung Riau

Dokumen ini menerjemahkan prd.md ke keputusan visual dan interaksi. Semua angka di sini jadi acuan saat membangun komponen React dan konfigurasi Tailwind.

| Item | Keterangan |
|---|---|
| Versi | 0.2 (draft, tema Melayu Riau) |
| Acuan | prd.md v0.1, PRODUCT.md, dan PDF "Jelajah Lingkungan di Sekitar Kita" |
| Perangkat utama | Tablet lanskap, basis desain 1280 x 800 px |
| Perangkat minimum | 1024 x 768 px |

---

## 1. Prinsip Desain

1. **Satu layar, satu tugas.** Anak kelas 4 tidak perlu memilih dari banyak hal sekaligus. Tiap layar hanya punya satu aksi utama yang menonjol.
2. **Suara dulu, teks kemudian.** Setiap instruksi bisa didengar. Teks berfungsi sebagai pendamping, bukan satu-satunya jalan.
3. **Aturan permainan mengajarkan konsep.** Elemen alam terlihat "tertanam" dan tidak bisa digeser. Elemen buatan terlihat seperti blok yang bisa diangkat. Bentuk visual ikut menjelaskan perbedaan kategori.
4. **Salah itu bagian dari cerita.** Tidak ada tanda silang merah, bunyi gagal yang keras, atau skor yang turun di depan anak.
5. **Dekat dengan Pekanbaru dan budaya Melayu Riau.** Ilustrasi, nama tempat, contoh, dan ornamen selalu diambil dari lingkungan anak.

## 2. Arah Visual

**Gagasan:** aplikasi ini adalah rumah panggung Melayu yang sedang dibangun anak-anak sendiri. Layar kerja dibingkai seperti serambi Selaso Jatuh Kembar: lisplang marun di atas, kelim tenun di bawah, lantai gading yang tenang di tengah.

- **Marun songket** menjadi bingkai (bilah atas, bilah bawah, latar layar pembuka). **Emas** dipakai seperti benang songket: aksi utama, progres, dan ornamen. **Gading** adalah lantai tempat anak bekerja.
- **Hijau, oranye, dan ungu hanya milik kategori** alam, buatan, dan diskusi. Warna adat hijau sengaja tidak dipakai di bingkai supaya tidak tertukar dengan kategori Alam.
- Biru hanya untuk air (Sungai Siak di peta), bukan untuk bingkai atau tombol.
- Kanvas kampung digambar dari sudut atas agak miring (semi top down), sama seperti peta di PDF, supaya anak langsung mengenali.
- **Ornamen penuh** (latar bunga tabur, atap pelana dengan selembayung) hanya di layar pembuka, transisi, dan rapor. **Di layar kerja** Fase 1 sampai 5, ornamen cukup berupa bingkai: lebah bergantung di bawah bilah atas dan kelim pucuk rebung di atas bilah bawah.
- Tulisan Arab Melayu (Jawi) tidak dipakai.
- Semua ornamen perlu dicek ahli budaya atau guru setempat sebelum uji coba ke siswa.

### 2.1 Ornamen Melayu

Semua ornamen digambar sebagai SVG di `src/components/Ornamen.tsx`, bentuknya disederhanakan untuk layar anak.

| Ornamen | Bentuk | Makna yang dipakai | Tempat |
|---|---|---|---|
| Pucuk rebung | Deret segitiga rebung dengan garis daun | Tumbuh dan harapan | Kelim bilah bawah, kelim layar pembuka, progres fase |
| Lebah bergantung | Tetesan emas menggantung dari garis | Hiasan lisplang rumah Melayu | Di bawah bilah atas, di bawah atap layar pembuka |
| Selembayung | Dua tanduk bersilang dengan ujung melingkar | Puncak atap Selaso Jatuh Kembar | Puncak atap layar pembuka |
| Bunga tabur | Bunga empat kelopak dan belah ketupat kecil | Motif tabur kain songket | Latar marun layar pembuka, opasitas 16% |
| Atap pelana | Segitiga marun tua dengan lisplang emas dan bunga di pelana | Rumah adat Selaso | Layar pembuka |

**Gerakan khas:** progres fase digambar sebagai deret pucuk rebung di bilah atas. Pucuk yang selesai berwarna emas, dan pucuk yang baru saja selesai disepuh emas dari pangkal ke ujung (`motion-slow`) saat layar fase berikutnya muncul.

**Maskot (opsional)**
- Maskot: anak laki-laki berbaju Melayu (baju kurung cekak musang hijau, kain samping, tanjak), file `public/maskot.png` hasil olahan `maskot.png` di root (latar putih dibuang). Namanya **Badrul** (komponen `Badrul`).
- Muncul di pojok kiri bawah saat memberi instruksi, petunjuk, dan cerita umpan balik.
- Kalau maskot dipakai, pastikan ada validasi dari guru setempat bahwa karakter ini akrab bagi anak.

## 3. Warna

### 3.1 Palet dunia Melayu

| Token | Hex | Pakai untuk |
|---|---|---|
| `marun-500` | `#9E2B3B` | Segitiga pelana atap, variasi marun |
| `marun-700` | `#7A1F2B` | Bilah atas dan bawah, latar layar pembuka, judul di atas gading, tombol sekunder |
| `marun-900` | `#4A1019` | Teks di atas emas, atap, cincin fokus di atas gading |
| `emas-100` | `#FCF0CC` | Sorotan lembut, pilihan terpilih, seleksi teks |
| `emas-400` | `#F0B323` | Tombol utama, progres selesai, ornamen, tepi tombol bulat, cincin fokus di atas marun |
| `emas-600` | `#B88507` | Tepi tombol utama, garis emas tipis di atas gading, scrollbar |
| `gading-50` | `#FFFCF5` | Kartu, panel, laci katalog |
| `gading-100` | `#FBF6E9` | Lantai kanvas dan latar halaman kerja |
| `gading-200` | `#EFE4C8` | Pembagi, tombol nonaktif |
| `tanah-900` | `#2B2A26` | Teks utama di atas gading |
| `tanah-600` | `#5E5B52` | Teks sekunder di atas gading |

Teks di atas marun memakai `gading-50` atau `emas-400`, tidak pernah abu-abu.

### 3.2 Warna kategori

| Token | Hex | Pakai untuk |
|---|---|---|
| `alam-500` | `#3E9B4F` | Isi label dan badge alam |
| `alam-700` | `#2A6B37` | Teks atau ikon alam di atas latar terang |
| `alam-100` | `#E3F3E5` | Latar lembut area alam |
| `buatan-500` | `#F58220` | Isi label dan badge buatan |
| `buatan-700` | `#A84C08` | Teks atau ikon buatan di atas latar terang |
| `buatan-100` | `#FDEBD9` | Latar lembut area buatan |
| `diskusi-500` | `#8E6CCB` | Penanda elemen diskusi (taman, danau buatan) |
| `diskusi-100` | `#EFE8FA` | Latar lembut elemen diskusi |

### 3.3 Warna fungsional

| Token | Hex | Pakai untuk |
|---|---|---|
| `langit-500` | `#1E88D0` | Air |
| `langit-700` | `#13609A` | Garis air, lencana Arsitek |
| `sungai-300` | `#7CC4EE` | Air di peta, lencana Pencatat |
| `kabut-400` | `#B8B4A6` | Elemen nonaktif |

Bintang, stiker, dan sorotan positif memakai `emas-400` (token `mentari-400` dihapus).

### 3.4 Aturan kontras dan buta warna

- Teks kecil hanya boleh memakai varian `-700` atau `tanah-900`. Varian `-500` dipakai untuk isi bidang dengan teks putih tebal ukuran besar.
- **Pengecualian:** teks putih di atas `buatan-500` hanya 2.6:1 dan tidak lolos. Label Buatan memakai teks `tanah-900`.
- Semua pasangan warna yang dipakai dicek otomatis oleh `src/lib/contrast.test.ts`, targetnya 4.5:1 untuk teks biasa dan 3:1 untuk teks besar serta ikon penting. Pasangan baru wajib ditambahkan ke tes itu.
- Hijau dan oranye bisa tertukar bagi sebagian anak buta warna merah hijau. Karena itu kategori **selalu** punya tiga penanda sekaligus:

| Kategori | Warna | Ikon | Pola tepi |
|---|---|---|---|
| Alam | Hijau | Daun | Tepi bergelombang |
| Buatan | Oranye | Batu bata | Kotak bersudut membulat sama rata (tidak runcing) |
| Diskusi | Ungu | Tanda dua arah (ikon panah bolak balik) | Tepi putus putus |

## 4. Tipografi

| Peran | Font | Bobot | Ukuran | Tinggi baris |
|---|---|---|---|---|
| Display (judul layar pembuka) | Baloo 2 | 800 | 48 px | 1.1 |
| Judul fase | Baloo 2 | 700 | 36 px | 1.15 |
| Subjudul | Baloo 2 | 600 | 26 px | 1.2 |
| Instruksi | Lexend | 500 | 24 px | 1.4 |
| Isi kartu info | Lexend | 400 | 22 px | 1.5 |
| Label tombol | Lexend | 600 | 22 px | 1 |
| Label kecil (nama elemen) | Lexend | 600 | 18 px | 1.2 |

- Kedua font tersedia gratis di Google Fonts. Andika (dari SIL) bisa jadi alternatif isi karena memang dirancang untuk pembaca pemula.
- Ukuran teks di layar siswa tidak boleh di bawah 18 px.
- Rata kiri untuk semua paragraf. Hindari rata kanan kiri seperti di PDF karena jarak antar kata jadi tidak rata dan menyulitkan pembaca lambat.
- Hindari huruf kapital semua untuk kalimat panjang.

## 5. Ruang, Bentuk, dan Bayangan

**Spasi (kelipatan 8)**

| Token | Nilai |
|---|---|
| `space-1` | 8 px |
| `space-2` | 16 px |
| `space-3` | 24 px |
| `space-4` | 32 px |
| `space-6` | 48 px |
| `space-8` | 64 px |

**Sudut**

| Token | Nilai | Pakai untuk |
|---|---|---|
| `radius-sm` | 12 px | Badge, label |
| `radius-md` | 20 px | Tombol, token elemen |
| `radius-lg` | 28 px | Kartu, panel |
| `radius-full` | 9999 px | Avatar, tombol suara |

**Bayangan**

| Token | Pakai untuk |
|---|---|
| `shadow-rest` | Kartu dan tombol diam: `0 2px 5px` marun 16% |
| `shadow-lift` | Elemen yang sedang diangkat saat drag, panel layar pembuka: `0 12px 24px` marun 26% |
| `shadow-tertanam` | Elemen alam yang "tertanam" di tanah (bayangan ke dalam) |

Bayangan selalu punya offset dan blur lembut berwarna marun. Bayangan keras tanpa blur tidak dipakai.

**Target sentuh**
- Minimal 64 x 64 px untuk semua yang bisa diketuk anak.
- Jarak antar target minimal 16 px.
- Area sentuh boleh lebih besar dari gambar yang terlihat, misalnya pin di peta tampil 48 px tapi area ketuknya 72 px.

## 6. Ikon dan Ilustrasi

- Ikon UI memakai set bergaris membulat (misalnya Lucide atau Phosphor) dengan ketebalan garis 2.5 px supaya terlihat jelas di tablet.
- Ilustrasi elemen dibuat dalam satu gaya: datar, outline lembut warna gelap dari warna isinya, bayangan dasar oval di bawah objek.
- Ukuran aset elemen 256 x 256 px, format WebP atau SVG, latar transparan.
- Setiap elemen punya dua versi: gambar normal dan siluet abu-abu untuk keadaan "belum ditemukan".
- Ilustrasi Masjid An-Nur dan Selaso Jatuh Kembar digambar ulang secara sederhana dari bentuk aslinya, bukan foto, supaya gaya tetap seragam.

## 7. Tata Letak Layar

### 7.1 Kerangka umum layar kerja

```
+--------------------------------------------------------------+
| [Fase 2 dari 5  ====-----]   [Avatar giliran]   [Suara] [||] |  bilah atas 88 px
+--------------------------------------------------------------+
|                                                    |         |
|                                                    |  Laci   |
|                Kanvas kampung                      | katalog |
|                                                    | 288 px  |
|                                                    |         |
+--------------------------------------------------------------+
| [Badrul] Instruksi singkat satu kalimat        [Tombol utama]  |  bilah bawah 112 px
+--------------------------------------------------------------+
```

- **Bilah atas:** latar `marun-700` dengan lebah bergantung emas menggantung di bawahnya. Isinya progres pucuk rebung, avatar anak yang sedang memegang peran, tombol ulangi suara, dan tombol jeda.
- **Kanvas:** lantai `gading-100`, mengisi sisa ruang. Tanpa ornamen.
- **Laci katalog:** di kanan selebar 288 px dengan token dua kolom, latar `gading-50` dengan tepi kiri emas, bisa ditutup. Hanya muncul di fase yang butuh menambah elemen. Kalau isinya lebih tinggi dari layar, bagian bawahnya memudar dan muncul tombol panah bawah 64 px yang berdenyut pelan untuk menggulir.
- **Bilah bawah:** latar `marun-700` dengan kelim pucuk rebung emas di tepi atasnya. Isinya Badrul, instruksi berwarna `gading-50`, dan satu tombol aksi utama berwarna emas. Tombol utama selalu di kanan bawah, posisinya tidak pernah berpindah antar fase.

### 7.1a Layar pembuka

Latar `marun-700` penuh dengan motif bunga tabur. Di tengah ada panel gading berbentuk rumah: atap pelana marun tua dengan lisplang emas dan selembayung di puncaknya, lebah bergantung di bawah atap, lalu Badrul, judul `marun-700`, subjudul, dan tombol emas "Mulai Jelajah". Kelim pucuk rebung emas membentang di tepi bawah layar.

### 7.2 Setup Kelompok

```
+--------------------------------------------------------------+
|                Siapa saja di kelompok ini                    |
|                                                              |
|   [Kucing]  [Burung]  [Ikan]  [Kupu]  [Kura]  [Lebah] ...    |
|                                                              |
|   Terpilih:  ( Kucing: Rara )  ( Ikan: Dimas )  ( + )        |
|                                                              |
|                                         [Mulai Jelajah  >]   |
+--------------------------------------------------------------+
```

- Avatar berupa hewan, bukan wajah manusia.
- Setelah memilih avatar, keyboard besar muncul untuk menulis nama panggilan maksimal 10 huruf.
- Tombol "Mulai" aktif setelah minimal 3 anggota terdaftar.

### 7.3 Layar Giliran

```
+--------------------------------------------------------------+
|                 Fase 2: Beri Label                           |
|          Sekarang giliran Juru Label. Siapa orangnya         |
|                                                              |
|        [Kucing Rara]   [Ikan Dimas]   [Kupu Sari]            |
|          (sudah)                                             |
+--------------------------------------------------------------+
```

- Avatar yang sudah pernah memegang peran utama tampil redup dengan tulisan "sudah", tapi tetap bisa dipilih kalau semua sudah kebagian.
- Lencana peran muncul di samping avatar terpilih di bilah atas sampai fase selesai.

### 7.4 Fase 0, Jelajah Peta
- Peta penuh layar dengan pin emas bergaris marun bertuliskan nama tempat. (Bukan oranye, karena oranye milik kategori Buatan.)
- Mengetuk pin membuka kartu info sebagai lembar yang naik dari bawah (bottom sheet) setinggi 60% layar, sehingga peta masih terlihat.
- Pin yang sudah dikunjungi berubah menampilkan stiker bintang kecil.
- Penghitung "Stiker: 3 dari 5" di bilah atas.

### 7.5 Fase 1, Tata Kampung
- Kanvas berupa tanah kosong dengan Sungai Siak mengalir dari kiri ke kanan.
- Elemen alam awalnya tampil sebagai siluet samar di posisi tetap. Diketuk sekali, siluet berubah jadi gambar penuh dengan animasi tumbuh.
- Elemen buatan diambil dari laci katalog dan diseret ke petak kosong. Kanvas memakai grid tak terlihat 6 x 4 supaya elemen rapi dan tidak saling tumpuk.
- Petak yang bisa ditempati menyala lembut saat elemen sedang diseret.

### 7.6 Langkah 3, Alam atau Buatan?
- Peta yang sama dengan Langkah 2. Tiap tempat punya lencana kecil di pojok kanan atas: "?" kalau belum dipilih, lalu ikon daun (bulat) atau bata (kotak membulat) setelah dipilih.
- Di kanan ada **dua kartu pilihan berukuran sama** (208 x 148 px, `KartuPilihan.tsx`). Yang berbeda hanya warna, bentuk sudut, pola, dan ikon, jadi pilihan tidak bergantung pada warna:
  - **Alam:** hijau tua, sudut berbentuk daun (dua sudut sangat bulat), pola urat daun, ikon daun, arti "Sudah ada sendiri".
  - **Buatan:** oranye, kotak bersudut membulat sama rata (bukan runcing), pola susunan bata, ikon bata, arti "Dibuat manusia".
- Di atas kartu ada satu baris keterangan: "Pilih satu", "Untuk [nama tempat], pilih satu", atau "Sekarang ketuk tempatnya".
- Dua cara menempel, supaya anak yang sulit menyeret tetap bisa: ketuk tempat lalu ketuk kartu, atau ketuk kartu lalu ketuk beberapa tempat.
- Gerak: kartu bernapas pelan saat ada tempat yang menunggu dijawab. Kartu yang dipegang membesar 6%, bercincin marun, bercentang, dan ikonnya meloncat sekali.
- Tombol "Kami Yakin" baru aktif setelah semua tempat berlabel. Setelah dikonfirmasi, kartu berganti menjadi satu kartu "Sudah dikunci" dengan ukuran lebar yang sama, dan lencana tiap tempat bergembok.

### 7.7 Langkah 4, Apa Gunanya?
Permainan menangkap kartu, bukan formulir pilihan.
- **Kiri:** tempat yang sedang ditanya (ilustrasi besar dengan titik progres tempat 1, 2, 3, ...), tiga kotak guna di bawahnya, dan satu kotak "Guna menurut kami". Dua kotak pertama bernomor dan wajib diisi, yang ketiga boleh.
- **Kanan:** kartu guna berbentuk gelembung bergambar (168 x 150 px, sudut 40 px) yang mengapung pelan dengan irama berbeda-beda. Susunannya bata (3 di atas, 2 atau 3 di bawah).
- **Mekanisme:** mengetuk gelembung membuatnya terbang melengkung ke kotak kosong berikutnya (`KartuTerbang`, 520 ms), lalu terpasang. Mengetuk kartu di kotak mengembalikannya jadi gelembung supaya bisa ditukar. Tidak perlu menyeret.
- **Umpan balik cerita, bukan penilaian:** kartu yang cocok mendapat bintang emas, semburan bintang, dan Badrul meloncat. Kartu yang kurang cocok mendapat tanda "?" dan Badrul bertanya pelan ("Hmm, tempat tinggal untuk Hutan? Kalau ragu, ketuk kartu di kotak untuk menukarnya."). Anak tidak pernah tertahan; Berikutnya aktif setelah dua kotak terisi.
- **Guna menurut kami:** aktif setelah dua kotak terisi, berupa satu kalimat pendek yang diketik.
- Tiap kartu guna punya ikon sendiri (`ikonGuna.ts`), placeholder sampai 12 ilustrasi kartu (bagian 15) tersedia.
- Reduce motion: kartu tidak mengapung, dan kartu langsung berpindah tanpa terbang.

### 7.8 Fase 4, Warga Butuh Apa
- Tiga kartu warga berbaris di kiri, masing-masing dengan balon kata dan tombol suara.
- Anak menyeret dari titik di kartu warga ke elemen. Garis digambar sebagai tali putus putus yang mengikuti jari.
- Garis yang tepat berubah jadi garis utuh warna `emas-400`, seperti benang emas. Garis yang kurang tepat memudar pelan lalu Badrul memberi petunjuk.

### 7.9 Fase 5, Kampung Esok Hari

```
+--------------------------------------------------------------+
| Kampung Sehat  [=========-----]                              |
+--------------------------------------------------------------+
|                                                              |
|      [Ilustrasi Sungai Siak penuh sampah, lokasi berkedip]   |
|                                                              |
+--------------------------------------------------------------+
| Pilih tindakan:  [Pungut sampah]  [Biarkan]  [Ikut buang]    |
+--------------------------------------------------------------+
```

- Meter Kampung Sehat berupa batang horizontal berisi emas (bukan hijau, supaya tidak tertukar dengan kategori Alam) dengan ikon pohon yang ikut tumbuh atau layu. Nilai awal 40; tindakan tepat +20, netral -5, merusak -15 (`src/features/phase5-event/meter.ts`, perlu validasi ahli).
- Setelah tindakan dipilih, papan aksi kecil tertancap di lokasi kejadian dan tetap ada sampai rapor.
- **Kartu pilihan** (`KartuTindakan.tsx`): tiga kartu berukuran sama, bersudut membulat 26 px, masing-masing berisi ikon dalam lingkaran dan satu kalimat pendek. Ketiganya berwarna sama, hanya ikon dan tulisannya yang beda, jadi tidak ada pilihan yang tampak seperti jawaban.
  - Pilihan yang belum cocok memudar dengan garis putus-putus abu-abu dan tulisan "sudah dicoba", tidak pernah merah, lalu Badrul bercerita.
  - Pilihan yang akhirnya dipakai berubah emas, bercentang, ikonnya meloncat, dan papan hasil tertancap di lokasi kejadian. Kartu lain meredup.

### 7.10 Refleksi Individu
- Satu layar per anak, avatar anak tampil besar di atas.
- Pilihan berupa 6 ubin bergambar, satu per fase (peta, membangun, label, kartu manfaat, warga, menjaga kampung), bukan emoji wajah, supaya pilihannya bermakna. Kartu manfaat ditambahkan supaya semua fase bisa dipilih.
- Satu isian ketik singkat dengan tombol Simpan. Tidak ada perekaman suara.

### 7.11 Rapor Kelompok
- Ilustrasi kampung hasil kerja kelompok tampil utuh sebagai "foto kenangan".
- Kalimat rapor di bawahnya, dibacakan oleh Badrul.
- Lencana per anggota berdasarkan peran yang sudah dipegang.
- Tidak ada angka skor di layar siswa.

### 7.12 Mode Guru (dicabut)
Mode Guru dan ekspor data dicabut pada 29 Oktober 2026. Belum ada layar untuk guru; rapor siswa dan log aksi tetap tersimpan di perangkat.

## 8. Komponen

| Komponen | Varian | Catatan |
|---|---|---|
| `Button` | primary, secondary, ghost | Tinggi 72 px, ikon di kiri, label maksimal 2 kata. Primary: isi emas, tepi `emas-600`, teks `marun-900`. Secondary: gading dengan tepi dan teks marun |
| `SpeakerButton` | default, playing | Bulat 64 px, gading dengan tepi emas. Saat diputar terisi emas dengan gelombang suara beranimasi |
| `PhaseProgress` | 6 langkah (Fase 0 sampai 5) | Deret pucuk rebung di atas garis emas. Langkah aktif membesar dan terisi gading, langkah selesai terisi emas, langkah yang baru selesai disepuh |
| `RoleBadge` | arsitek, juru-label, pencatat, penjaga | Ikon peran plus warna aksen tetap, tepi gading 2 px supaya terbaca di atas marun |
| `PucukRebungBand`, `LebahBergantung`, `Selembayung`, `SongketGround` | lihat 2.1 | Ornamen SVG, tidak bisa diketuk, disembunyikan dari pembaca layar |
| `AvatarPicker` | single, multi | Ubin 96 px |
| `MapPin` | default, visited | Area ketuk 72 px |
| `InfoSheet` | default | Bottom sheet, gambar kiri, teks kanan, tombol suara |
| `ElementToken` | alam-hidden, alam-found, buatan-idle, buatan-dragging, buatan-placed | Lihat bagian 9 |
| `LabelBadge` | alam, buatan, kosong, terkunci | Pakai warna, ikon, dan pola tepi |
| `BenefitCard` | default, selected, custom | 160 px persegi |
| `CitizenCard` | default, linked | Balon kata plus titik tarik |
| `ConnectorLine` | dragging, correct, retry | SVG path |
| `EventScene` | per kejadian | Ilustrasi plus penanda lokasi |
| `HealthMeter` | default | Batang plus ikon pohon |
| `ShortTextInput` | default | Satu kalimat pendek maksimal 60 huruf, dipakai untuk "Manfaat versi kami" dan janji di Refleksi |
| `StoryToast` | hint, success | Muncul dari maskot, hilang sendiri setelah suara selesai |
| `ConfirmDialog` | default | Dipakai untuk "Kami Sepakat" dan keluar sesi |

## 9. State Elemen di Kanvas

| State | Tampilan | Bisa apa |
|---|---|---|
| `alam-hidden` | Siluet abu-abu 40% opasitas, `shadow-inset` | Diketuk untuk ditemukan |
| `alam-found` | Gambar penuh, tepi bergelombang hijau tipis | Tidak bisa digeser |
| `buatan-idle` | Gambar di daftar bangunan, kotak oranye tipis bersudut membulat | Diseret |
| `buatan-dragging` | Membesar 110%, `shadow-lift`, sedikit miring 3 derajat | Mengikuti jari |
| `buatan-placed` | Ukuran normal, bayangan dasar oval | Diketuk tahan untuk dipindah atau dibuang |
| `diskusi` | Seperti buatan, ditambah tepi putus putus ungu | Sama seperti buatan |
| `selected` | Cincin `marun-700` 4 px | Menunggu label atau kartu |

**Nama pada token.** Nama tempat ditulis di bawah kotak gambar, bukan di dalamnya, maksimal dua baris 18 px tanpa dipangkas. Ukuran kotak mengikuti petak grid (`ukuranPetak` di `ElementToken.tsx`), dan label kategori di Fase 2 berupa ikon di pojok kotak supaya tidak ada teks yang bisa terpotong.

## 10. Gerak dan Animasi

| Token | Durasi | Easing | Pakai untuk |
|---|---|---|---|
| `motion-fast` | 150 ms | ease-out | Tekan tombol, sorotan |
| `motion-base` | 250 ms | ease-out | Buka kartu, ganti label |
| `motion-slow` | 400 ms | spring lembut | Elemen alam tumbuh, elemen jatuh ke petak |
| `motion-scene` | 600 ms | ease-in-out | Transisi antar fase |

- Elemen buatan yang dilepas di petak sah akan "jatuh" sedikit memantul.
- Elemen yang dilepas di luar petak sah kembali pelan ke laci, tanpa getar atau warna merah.
- Saat sistem mendeteksi pengaturan reduce motion, semua animasi diganti fade 150 ms.

### 10.1 Gerak interaktif

Tesis: **kampung tumbuh karena disentuh, dan Badrul hidup di sampingnya.** Semua gerak hanya memakai transform dan opacity, tanpa timer, tanpa getar atau kilat, dan tidak pernah dipakai sebagai tanda gagal.

| Momen | Gerak | Keyframe | Letak |
|---|---|---|---|
| Badrul diam | Bernapas pelan (3,4 detik, berulang) | `bernapas` | `Badrul.tsx` |
| Badrul bereaksi senang | Meloncat, mendarat gepeng, memantul kecil | `loncat` | Berhasil di Fase 1, 2, 4, 5, ketuk pin baru, ketuk Badrul |
| Badrul bereaksi berpikir | Kepala miring pelan lalu kembali | `miring` | Petunjuk di Fase 2, 4, 5 |
| Ketuk Badrul | Mengulang instruksi dan meloncat | `loncat` | Bilah bawah dan Beranda |
| Alam ditemukan | Tumbuh membal, riak di tanah, daun beterbangan | `tumbuh`, `riak`, `sebar` | Fase 1 |
| Bangunan ditaruh | Jatuh memantul, riak, debu menyebar | `jatuh`, `riak`, `sebar` | Fase 1 |
| Bangunan diseret | Petak sah bernapas; petak di bawah jari menyala lebih terang dan sedikit membesar | `napas` | Fase 1 |
| Bangunan dilepas di tempat salah | Meluncur pulang ke asalnya, tanpa tanda salah | WAAPI 420 ms | Fase 1 |
| Pin peta diketuk | Pin melompat; bintang dicap besar lalu menempel; penghitung membesar sebentar | `lompat`, `cap`, `bump` | Fase 0 |
| Label ditempel | Lencana kategori muncul membal | `tumbuh` | Fase 2 |
| Garis warga benar | Benang emas ditarik dari warga ke tempat, lalu tanda centang muncul | `tarik`, `tumbuh` | Fase 4 |
| Tindakan tepat | Papan aksi tumbuh dengan bintang menyembur | `tumbuh`, `sebar` | Fase 5 |
| Pindah layar | Tirai songket meluncur ke kiri membuka layar berikutnya (650 ms) | `tirai` | `GamePage.tsx` |
| Beranda | Atap jatuh memantul, panel terbit, Badrul menyapa | `jatuh`, `terbit`, `loncat` | `HomePage.tsx` |
| Rapor (momen utama) | Foto kenangan jatuh, tiap elemen terbit bergiliran, lalu judul, kalimat, lencana, dan tombol; Badrul meloncat; kilau emas melayang | `jatuh`, `terbit`, `loncat`, `kilau` | `ReportScreen.tsx` |
| Sungai | Kilau putih mengalir pelan | `aliran` | `KampungMap.tsx` |

**Batas.** Gerak berulang hanya Badrul bernapas, kilau air, dan kilau emas di rapor. Total tunda masuk bergilir paling lama 2,3 detik di rapor. Elemen yang baru muncul diberi tanda `arrive` hanya saat ia memang baru berubah, bukan tiap layar digambar ulang.

**Reduce motion.** Semua durasi turun menjadi 150 ms dan tunda masuk bergilir menjadi nol. Gerak berulang (napas Badrul, aliran air, kilau) dan partikel mati sepenuhnya. Tirai berganti menjadi pudar.

## 11. Suara

| Jenis | Volume relatif | Aturan |
|---|---|---|
| Voice over | 100% | Prioritas tertinggi. Saat diputar, efek suara lain diturunkan ke 30% |
| Efek suara | 50% | Pendek (di bawah 400 ms), bunyi alami seperti kayu, air, daun |
| Musik latar | 15% | Hanya di layar pembuka dan rapor, tidak ada di layar kerja |

- Voice over diputar otomatis sekali saat layar baru muncul, dan bisa diulang lewat `SpeakerButton`.
- Tidak ada bunyi "salah". Pilihan kurang tepat cukup dibalas suara Badrul.
- Tombol bisu global tersedia di bilah atas untuk guru.

## 12. Gaya Bahasa di Layar

- Sapaan "kalian" untuk kelompok dan "kamu" di layar refleksi individu.
- Kalimat perintah pendek dan positif. Contoh: "Seret rumah ke tanah kosong."
- Umpan balik berupa cerita, bukan penilaian.

| Situasi | Hindari | Pakai |
|---|---|---|
| Label kurang tepat | "Salah!" | "Hmm, taman ini siapa yang menanam ya. Coba diskusikan lagi." |
| Garis warga kurang tepat | "Jawaban keliru" | "Bu Ani masih demam. Ia butuh tempat berobat." |
| Tindakan kurang tepat | "Nilai berkurang" | "Wah, sungainya masih bau. Coba cara lain." |
| Fase selesai | "Benar semua 100%" | "Kampung kalian makin rapi!" |

### 12.1 Daftar istilah untuk anak kelas 4

Semua tulisan di layar siswa memakai kata di kolom kanan. Sumbernya satu: `src/content/istilah.ts` dan `ROLES` di `src/lib/roles.ts`. Id di log dan nama berkas tetap memakai istilah lama supaya data tidak berubah.

| Istilah dewasa (PRD) | Dipakai di layar | Catatan |
|---|---|---|
| Fase 0 sampai 5 | Langkah 1 sampai 6 | Anak menghitung dari 1 |
| Arsitek | Pembangun | Tugas: membangun kampung |
| Juru Label | Pemilah | Tugas: memilih Alam atau Buatan |
| Pencatat Manfaat | Pencari Guna | Tugas: mencari guna tiap tempat |
| Penjaga Kampung | Penjaga Kampung | Tetap |
| Beri Label | Alam atau Buatan? | Judul Langkah 3 |
| Kartu Manfaat | Apa Gunanya? | Judul Langkah 4 |
| Warga Butuh Apa | Bantu Warga | Judul Langkah 5 |
| Kampung Esok Hari | Jaga Kampung | Judul Langkah 6 |
| label, elemen, petak, laci | pilihan, tempat, kotak, daftar bangunan | |
| manfaat | guna | "Guna menurut kami" |
| tempat diskusi | tempat teka-teki | Taman dan Danau, bertepi ungu |
| Kami Sepakat | Kami Yakin | |
| tindakan | cara, atau nama tombolnya langsung | |
| Refleksi | Cerita Kita | |
| Rapor | Ringkasan | "Rapor" terdengar seperti nilai |

**Aturan penulisan.** Satu kalimat memuat satu hal. Petunjuk menyebut apa yang harus dilakukan, bukan nama komponennya ("Ketuk satu hewan, lalu tulis nama panggilanmu", bukan "Pilih avatar"). Tombol yang belum aktif selalu punya alasan yang terbaca ("Perlu 3 sampai 4 anggota"). Pilihan Alam dan Buatan selalu disertai arti singkatnya.

## 13. Aksesibilitas

- Semua elemen interaktif punya label teks untuk pembaca layar, walau target utama adalah anak yang melihat layar.
- Fokus keyboard terlihat jelas untuk pemakaian di laptop: cincin dua warna, garis `emas-400` 4 px dengan lingkar luar `marun-900`, sehingga terbaca di atas marun maupun gading.
- Setiap aksi seret punya cara alternatif dengan ketuk pilih lalu ketuk tujuan.
- Kategori tidak pernah dibedakan hanya dengan warna (lihat 3.4).
- Tidak ada konten yang berkedip lebih dari 3 kali per detik.

## 14. Token untuk Tailwind

Proyek memakai Tailwind v4, jadi token ditulis di blok `@theme` dalam `src/index.css`, bukan di `tailwind.config.js`. File itu adalah sumber kebenaran token; tabel di bagian 3 sampai 5 menjelaskan pemakaiannya.

| Kelompok | Nama di CSS | Contoh kelas |
|---|---|---|
| Warna | `--color-marun-700`, `--color-emas-400`, `--color-gading-100`, ... | `bg-marun-700`, `text-emas-400` |
| Font | `--font-display` (Baloo 2), `--font-body` (Lexend) | `font-display`, `font-body` |
| Ukuran teks | `--text-display`, `fase`, `sub`, `instruksi`, `isi`, `tombol`, `kecil`, `guru` | `text-instruksi` |
| Sudut | `--radius-sm` 12, `md` 20, `lg` 28 px | `rounded-md` |
| Bayangan | `--shadow-rest`, `lift`, `tertanam` | `shadow-rest` |
| Target sentuh | `@utility tap` (64 x 64 px) | `tap` |
| Gerak | `--motion-fast`, `base`, `slow`, `scene` di `:root`, `--ease-pegas` untuk pantulan | `duration-150` |

Font dipasang lokal lewat `@fontsource` (subset latin saja) supaya tetap tampil saat offline.

## 15. Daftar Aset yang Perlu Disiapkan

**Peta kampung:** `src/components/KampungMap.tsx` menggambar peta sebagai SVG 1200 x 800 (rasio 3:2) bergaya poster: rumput hijau muda, Sungai Siak berkelok di baris kedua grid, jalan setapak berpasir di garis antar petak, dan pohon bulat. Varian `peta` (Fase 0) menambah hutan, rawa, anak sungai, dan Danau Lembah Sari. Varian `kanvas` (Fase 1 sampai 5 dan Rapor) lebih bersih supaya token terbaca. Grid 6 x 4 dan pin Fase 0 (persen dari kotak peta) menumpang di atasnya lewat `MapFrame`. Peta poster lama (`peta.webp`) sudah diganti.

**Acuan gaya aset:** poster peta `image-hd.png` (3000 x 2121) dari PDF acuan: ilustrasi datar berwarna lembut, garis tipis, bayangan halus. Sepuluh ilustrasi elemen di `public/aset/elemen/*.webp` dipotong langsung dari poster itu pada resolusi asli (maksimal 480 px sisi terpanjang), jadi masih tajam untuk token sampai 112 px di layar 2x. Perlu versi 256 px bergaya sama untuk rilis; anak sungai, rawa, tanah lapang, dan Danau Buatan Lembah Sari belum punya ilustrasi dan memakai ikon.

| Aset | Jumlah | Format |
|---|---|---|
| Ilustrasi elemen (normal dan siluet) | 14 elemen x 2 | WebP atau SVG 256 px |
| Peta Pekanbaru Fase 0 | 1 | SVG |
| Latar kanvas kampung | 1 | SVG |
| Avatar hewan | 8 | SVG 96 px |
| Ikon peran | 4 | SVG |
| Ilustrasi warga | 5 | WebP 200 px |
| Ilustrasi kejadian | 3 | WebP |
| Ilustrasi kartu manfaat | sekitar 12 | SVG 160 px |
| Maskot Badrul (diam, bicara, senang, berpikir) | 4 pose | SVG |
| Rekaman voice over | sekitar 60 klip | MP3 atau OGG mono 64 kbps |
| Efek suara | sekitar 8 | MP3 pendek |

## 16. Hal yang Belum Diputuskan

- Maskot dipakai atau tidak, dan bentuk finalnya.
- Ilustrasi digambar ulang semua atau sebagian memakai aset PDF yang sudah ada.
- Suara Badrul diisi orang dewasa atau anak.
- Perlu tidaknya mode potret untuk tablet kecil. (v1: tidak, layar potret meminta tablet diputar.)
- Validasi bentuk dan makna ornamen Melayu (pucuk rebung, lebah bergantung, selembayung, bunga tabur) oleh ahli budaya atau guru setempat.
