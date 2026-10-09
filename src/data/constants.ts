import { SchoolProfile, RPLData, StudentPeer, IKMSItem, ClassRoom } from '../types';

export const DEFAULT_SCHOOL_PROFILE: SchoolProfile = {
  namaSekolah: 'SMP Negeri 1 Madani Nusantara',
  namaGuruBK: 'Dra. Rahmawati Kusuma, M.Pd., Kons.',
  nipGuruBK: '19840512 200801 2 006',
  namaKepalaSekolah: 'Dr. H. Bambang Sujarwo, M.Pd.',
  nipKepalaSekolah: '19720315 199702 1 002',
  tahunPelajaran: '2024/2025',
  semester: 'Ganjil',
  kota: 'Kota Nusantara',
};

export const TOPIK_PRESET_SMP = [
  {
    kelas: 'Kelas 7 SMP',
    bidang: 'Sosial',
    fungsi: 'Pencegahan',
    topik: 'Membangun Pertemanan Sehat & Katakan Tidak pada Bullying',
    waktu: '2 x 40 menit',
    skkpd: 'Kematangan Hubungan dengan Teman Sebaya',
  },
  {
    kelas: 'Kelas 7 SMP',
    bidang: 'Pribadi',
    fungsi: 'Pemahaman',
    topik: 'Mengenal Perubahan Diri & Regulasi Emosi di Awal Pubertas',
    waktu: '1 x 40 menit',
    skkpd: 'Kematangan Emosi',
  },
  {
    kelas: 'Kelas 7 SMP',
    bidang: 'Belajar',
    fungsi: 'Pengembangan',
    topik: 'Menemukan Gaya Belajar Efektif di Jenjang SMP',
    waktu: '2 x 40 menit',
    skkpd: 'Kematangan Intelektual',
  },
  {
    kelas: 'Kelas 8 SMP',
    bidang: 'Pribadi',
    fungsi: 'Pencegahan',
    topik: 'Bijak Bersosial Media & Mengatasi FOMO serta Kecanduan Gadget',
    waktu: '2 x 40 menit',
    skkpd: 'Pengembangan Diri & Etika Komunikasi',
  },
  {
    kelas: 'Kelas 8 SMP',
    bidang: 'Sosial',
    fungsi: 'Pemahaman',
    topik: 'Menghadapi Tekanan Teman Sebaya (Peer Pressure) Secara Asertif',
    waktu: '1 x 40 menit',
    skkpd: 'Kesadaran Tanggung Jawab Sosial',
  },
  {
    kelas: 'Kelas 8 SMP',
    bidang: 'Belajar',
    fungsi: 'Pencegahan',
    topik: 'Manajemen Waktu: Menyeimbangkan Hobi, Game, dan Tugas Sekolah',
    waktu: '2 x 40 menit',
    skkpd: 'Kematangan Intelektual',
  },
  {
    kelas: 'Kelas 9 SMP',
    bidang: 'Karier',
    fungsi: 'Pemahaman',
    topik: 'Eksplorasi Studi Lanjutan: Memilih SMA, MA, atau SMK Sesuai Minat',
    waktu: '2 x 40 menit',
    skkpd: 'Wawasan dan Kesiapan Karier',
  },
  {
    kelas: 'Kelas 9 SMP',
    bidang: 'Pribadi',
    fungsi: 'Pengentasan',
    topik: 'Mengatasi Kecemasan Menghadapi Asesmen Kelulusan (Ujian Akhir)',
    waktu: '1 x 40 menit',
    skkpd: 'Kematangan Emosi',
  },
  {
    kelas: 'Kelas 9 SMP',
    bidang: 'Karier',
    fungsi: 'Pengembangan',
    topik: 'Mengenali Bakat, Minat, dan Tipe Kepribadian Menuju Cita-Cita',
    waktu: '2 x 40 menit',
    skkpd: 'Wawasan dan Kesiapan Karier',
  },
];

export const DEFAULT_RPL: RPLData = {
  topik: 'Membangun Pertemanan Sehat & Katakan Tidak pada Bullying',
  kelas: 'Kelas 7 SMP',
  fase: 'Fase D (SMP)',
  bidang: 'Sosial',
  fungsi: 'Pencegahan',
  alokasiWaktu: '2 x 40 menit',
  pendekatan: 'Pendekatan Deep Learning (Mindful, Meaningful, Joyful Learning) berbasis Alur ARKA',
  pendekatanDeepLearning: {
    mindfulLearning: 'Mengembangkan kesadaran penuh (Mindfulness) peserta didik dalam mengenali emosi, prasangka diri, dan kepekaan sosial saat berinteraksi dengan teman sebaya di sekolah.',
    meaningfulLearning: 'Menghubungkan esensi materi pertemanan sehat secara autentik dengan realitas pergaulan sehari-hari di SMP, menumbuhkan pemaknaan batin dan nilai empati kemanusiaan.',
    joyfulLearning: 'Menciptakan ruang bimbingan yang aman secara psikologis, bebas perundungan, interaktif, dan menggembirakan melalui dinamika kelompok yang positif.'
  },
  skkpd: 'Kematangan Hubungan dengan Teman Sebaya (Mampu membina relasi yang sehat, menghargai keberagaman, dan menunjukkan aksi nyata pencegahan perundungan)',
  dimensiDeepLearning: [
    'Karakter (Character)',
    'Kolaborasi (Collaboration)',
    'Komunikasi (Communication)',
    'Berpikir Kritis (Critical Thinking)',
  ],
  capaianLayanan: 'Peserta didik mampu memahami hakikat relasi pertemanan yang positif, mengidentifikasi faktor risiko interaksi yang merugikan (bullying fisik, verbal, relasional, maupun cyberbullying), serta menunjukkan perilaku saling menghargai, komunikasi asertif, dan kepedulian sosial di lingkungan kelas.',
  tujuanUmum: 'Peserta didik kelas 7 SMP mampu membangun relasi pertemanan yang suportif, saling menghargai perbedaan, dan memiliki keberanian moral menolak tindakan bullying melalui pembiasaan kesadaran diri dan empati mendalam.',
  tujuanKhusus: [
    '1. Peserta didik dapat menganalisis bentuk-bentuk bullying dan dampaknya bagi teman sebaya secara kritis (Kognitif/C4)',
    '2. Peserta didik dapat mengekspresikan empati dan komitmen menciptakan iklim kelas yang aman dan ramah teman (Afektif/A3)',
    '3. Peserta didik dapat mendemonstrasikan aksi nyata sebagai "Upstander" (sahabat pelindung) melalui simulasi role play (Psikomotorik/P3)'
  ],
  materiPokok: [
    'Pengertian pertemanan sehat (Healthy Friendship) vs pertemanan beracun (Toxic Peer)',
    'Mengenali 4 jenis bullying di lingkungan SMP: Fisik, Verbal, Sosial/Relasional, dan Cyberbullying',
    'Peran Bystander vs Upstander: Mengapa diam saat melihat teman dibully sama berbahayanya',
    'Strategi komunikasi asertif "I-Message" untuk menolak perlakuan tidak menyenangkan'
  ],
  mediaDanAlat: 'Video Studi Kasus "Satu Suara Melawan Bullying", Kartu Skenario ARKA, Lembar LKPD Refleksi 4F, Poster Komitmen Kelas, Spidol & Sticky Notes',
  metode: 'Deep Learning (Mindful, Meaningful, Joyful Learning), Alur ARKA, Diskusi Kolaboratif, Pemutaran Video, dan Role-Playing',
  langkahKegiatan: {
    tahapAwal: {
      waktu: '10 Menit',
      kegiatan: [
        'Guru BK menyapa peserta didik dengan hangat, memimpin doa bersama, dan memeriksa kesiapan belajar serta kehadiran siswa.',
        'Apersepsi Mindful Learning: Mengajak siswa hening sejenak (Teknik STOP / Tarik Nafas Sadar) dan Ice Breaking energik "Lingkaran Kebaikan Sebaya" untuk membangun keterbukaan emosional yang menyenangkan (Joyful).',
        'Guru BK menyampaikan topik layanan dan mengaitkannya dengan pentingnya rasa aman di sekolah (Meaningful).',
        'Menjelaskan alur kegiatan ARKA dan menyepakati kontrak belajar: saling menghargai pendapat dan menjaga kerahasiaan teman.'
      ]
    },
    tahapInti: {
      waktu: '60 Menit',
      alurARKA: {
        aktivitas: 'Aktivitas Bermakna (Meaningful Activity): Peserta didik dibagi ke dalam 5 kelompok kolaboratif. Setiap kelompok menganalisis kartu kasus dinamika pergaulan nyata di SMP (pengucilan di kantin, sindiran di status media sosial, ejekan nama orang tua) dan merancang tanggapan solutif.',
        refleksi: 'Refleksi Kritis (Critical Reflection): Guru BK memfasilitasi dialog mendalam: "Apa yang bergejolak dalam perasaan kalian saat melihat seseorang diperlakukan tidak adil?", "Mengapa seseorang merundung orang lain?", "Bagaimana rasa empati dapat mengubah suasana kelas kita?"',
        konseptualisasi: 'Konseptualisasi (Conceptualization): Peserta didik dan Guru BK bersama-sama mengkristalisasi konsep kunci: ciri pertemanan suportif, batasan pribadi yang sehat, dampak psikologis bullying, dan kekuatan menjadi seorang Upstander.',
        aplikasi: 'Aplikasi / Aksi Nyata (Real Action Application): Setiap siswa merumuskan deklarasi aksi nyata pada lembar komitmen "Sahabat Harmonis" dan menempelkan ikrar kelas pada Pohon Kebaikan Kelas.'
      }
    },
    tahapPenutup: {
      waktu: '10 Menit',
      kegiatan: [
        'Guru BK bersama perwakilan peserta didik menyimpulkan makna inti layanan hari ini (Meaningful Synthesis).',
        'Peserta didik mengisi Lembar Refleksi Diri 4F secara jujur dan mandiri.',
        'Guru BK menyampaikan penguatan afirmasi: "Keberagaman kita adalah kekuatan. Ruang BK selalu terbuka untuk kalian bercerita."',
        'Doa bersama dan penutup dengan tepuk apresiasi.'
      ]
    }
  },
  asesmen: {
    asesmenProses: [
      'Keterlibatan aktif, fokus, dan antusiasme peserta didik selama seluruh siklus alur ARKA',
      'Terciptanya iklim kelas yang aman secara psikologis, terbuka, dan saling menghormati (Mindful & Joyful)',
      'Kekompakan kolaborasi dan kedalaman argumentasi dalam diskusi kelompok',
      'Kesesuaian dinamika layanan dengan alokasi waktu 2 x 40 menit'
    ],
    asesmenHasil: {
      understanding: 'Peserta didik memahami secara komprehensif cara membedakan candaan wajar vs bullying serta langkah pencegahannya',
      comfortable: 'Peserta didik menyatakan merasa lebih didengar, aman, dan berdaya di lingkungan kelas (terukur via angket reflektif)',
      action: 'Peserta didik merumuskan rencana aksi nyata sebagai pembela teman (Upstander) dalam lembar LKPD 4F'
    }
  },
  evaluasi: {
    evaluasiProses: [
      'Tingkat antusiasme dan partisipasi aktif peserta didik saat memainkan peran studi kasus',
      'Kehangatan interaksi dan keterbukaan antar anggota kelompok',
      'Sikap saling menghormati dan tidak menyela saat teman lain berbicara',
      'Kesesuaian dinamika kelas dengan alokasi waktu 2 x 40 menit'
    ],
    evaluasiHasil: [
      'Understanding: Pemahaman peserta didik mengenai cara mendeteksi dan menolak bullying terukur melalui kuis interaktif',
      'Comfortable: Peserta didik menyatakan merasa lebih aman dan didukung di kelas melalui angket kepuasan layanan',
      'Action: Rencana aksi konkret tertuang dalam lembar komitmen LKPD Refleksi Diri 4F'
    ]
  },
  tindakLanjut: 'Guru BK melakukan pemantauan sosiometri kelas berkala. Siswa yang terindikasi sering menyendiri atau menunjukkan tanda trauma akan diberikan layanan Konseling Individual atau Bimbingan Kelompok.'
};

export const STANDARD_IKMS_ITEMS: IKMSItem[] = [
  // Pribadi (id 101 - 104)
  { id: 101, bidang: 'Pribadi', pernyataan: 'Merasa sulit membatasi waktu main game / media sosial hingga larut malam' },
  { id: 102, bidang: 'Pribadi', pernyataan: 'Sering merasa cemas dan kurang percaya diri saat berbicara di depan kelas' },
  { id: 103, bidang: 'Pribadi', pernyataan: 'Mudah terpancing emosi dan tersinggung ketika diejek atau dikritik teman' },
  { id: 104, bidang: 'Pribadi', pernyataan: 'Sering merasa sedih/kesepian dan sulit menceritakan perasaan kepada orang lain' },
  // Sosial (id 201 - 204)
  { id: 201, bidang: 'Sosial', pernyataan: 'Merasa takut tidak punya teman dekat di kelas atau dikucilkan dari kelompok' },
  { id: 202, bidang: 'Sosial', pernyataan: 'Pernah menyaksikan atau menjadi sasaran ejekan/perundungan verbal di media sosial' },
  { id: 203, bidang: 'Sosial', pernyataan: 'Merasa canggung dan sulit beradaptasi dengan teman baru di sekolah' },
  { id: 204, bidang: 'Sosial', pernyataan: 'Sulit menolak ajakan teman sebaya yang bertentangan dengan kata hati atau aturan' },
  // Belajar (id 301 - 304)
  { id: 301, bidang: 'Belajar', pernyataan: 'Kesulitan mengatur jadwal belajar mandiri di rumah dan sering menunda mengerjakan tugas' },
  { id: 302, bidang: 'Belajar', pernyataan: 'Sulit berkonsentrasi saat guru menerangkan materi di dalam kelas' },
  { id: 303, bidang: 'Belajar', pernyataan: 'Belum memahami strategi dan cara belajar yang paling efektif sesuai gaya belajar saya' },
  { id: 304, bidang: 'Belajar', pernyataan: 'Merasa sangat tertekan atau panik menjelang ujian / penilaian sumatif' },
  // Karier (id 401 - 404)
  { id: 402, bidang: 'Karier', pernyataan: 'Belum mengetahui bakat, minat, dan potensi menonjol yang ada pada diri sendiri' },
  { id: 401, bidang: 'Karier', pernyataan: 'Masih bingung memahami perbedaan mendasar serta prospek lanjut ke SMA atau SMK' },
  { id: 403, bidang: 'Karier', pernyataan: 'Pilihan cita-cita atau jurusan lanjutan berbeda dengan harapan orang tua' },
  { id: 404, bidang: 'Karier', pernyataan: 'Membutuhkan informasi mengenai ragam profesi masa depan di era digital' },
];

export const SAMPLE_STUDENTS_7A: StudentPeer[] = [
  { id: 1, nama: 'Aditya Pratama', gender: 'L', nisn: '0091238471', pilihan1Id: 2, pilihan2Id: 4, ikmsResponses: [101, 204, 301, 401], timestamp: '2026-10-08 08:15', submittedViaPortal: true },
  { id: 2, nama: 'Bagas Wicaksono', gender: 'L', nisn: '0091238472', pilihan1Id: 1, pilihan2Id: 4, ikmsResponses: [101, 103, 301, 302], timestamp: '2026-10-08 08:18', submittedViaPortal: true },
  { id: 3, nama: 'Chandra Kirana', gender: 'L', nisn: '0091238473', pilihan1Id: 1, pilihan2Id: 2, ikmsResponses: [102, 201, 301, 402], timestamp: '2026-10-08 08:20', submittedViaPortal: true },
  { id: 4, nama: 'Dinda Ayu Maharani', gender: 'P', nisn: '0091238474', pilihan1Id: 5, pilihan2Id: 6, ikmsResponses: [102, 201, 202, 304], timestamp: '2026-10-08 08:22', submittedViaPortal: true },
  { id: 5, nama: 'Eka Nurul Hidayah', gender: 'P', nisn: '0091238475', pilihan1Id: 4, pilihan2Id: 6, ikmsResponses: [201, 303, 401, 402], timestamp: '2026-10-08 08:25', submittedViaPortal: true },
  { id: 6, nama: 'Farhan Maulana', gender: 'L', nisn: '0091238476', pilihan1Id: 1, pilihan2Id: 2, ikmsResponses: [101, 202, 301, 404], timestamp: '2026-10-08 08:27', submittedViaPortal: true },
  { id: 7, nama: 'Gita Saraswati', gender: 'P', nisn: '0091238477', pilihan1Id: 4, pilihan2Id: 5, ikmsResponses: [102, 104, 201, 302], timestamp: '2026-10-08 08:30', submittedViaPortal: true },
  { id: 8, nama: 'Hendra Saputra (Sering Menyendiri)', gender: 'L', nisn: '0091238478', pilihan1Id: 1, pilihan2Id: 2, ikmsResponses: [102, 104, 201, 202, 203], timestamp: '2026-10-08 08:32', submittedViaPortal: true },
  { id: 9, nama: 'Intan Permata', gender: 'P', nisn: '0091238479', pilihan1Id: 4, pilihan2Id: 7, ikmsResponses: [201, 304, 401, 403], timestamp: '2026-10-08 08:35', submittedViaPortal: true },
  { id: 10, nama: 'Joko Susilo', gender: 'L', nisn: '0091238480', pilihan1Id: 2, pilihan2Id: 6, ikmsResponses: [101, 103, 301, 402], timestamp: '2026-10-08 08:38', submittedViaPortal: true },
  { id: 11, nama: 'Karin Amanda', gender: 'P', nisn: '0091238481', pilihan1Id: 4, pilihan2Id: 5, ikmsResponses: [102, 201, 202, 402], timestamp: '2026-10-08 08:40', submittedViaPortal: true },
  { id: 12, nama: 'Lukman Hakim', gender: 'L', nisn: '0091238482', pilihan1Id: 1, pilihan2Id: 6, ikmsResponses: [101, 301, 303, 401], timestamp: '2026-10-08 08:42', submittedViaPortal: true },
  { id: 13, nama: 'Mega Lestari (Murid Baru Pindahan)', gender: 'P', nisn: '0091238483', pilihan1Id: 4, pilihan2Id: 9, ikmsResponses: [104, 201, 203, 301], timestamp: '2026-10-08 08:45', submittedViaPortal: true },
  { id: 14, nama: 'Naufal Rizky', gender: 'L', nisn: '0091238484', pilihan1Id: 2, pilihan2Id: 1, ikmsResponses: [101, 204, 302, 404], timestamp: '2026-10-08 08:48', submittedViaPortal: true },
  { id: 15, nama: 'Olivia Ramadhani', gender: 'P', nisn: '0091238485', pilihan1Id: 5, pilihan2Id: 4, ikmsResponses: [102, 201, 304, 401], timestamp: '2026-10-08 08:50', submittedViaPortal: true },
];

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'kelas-7a',
    namaKelas: 'Kelas 7-A',
    tingkat: 'Kelas 7 SMP',
    tahunPelajaran: '2026/2027',
    kriteriaSosiometri: 'Teman Belajar Kelompok & Berbagi Cerita',
    siswa: SAMPLE_STUDENTS_7A,
    googleSheetSyncUrl: '',
    lastSyncTime: '2026-10-08 08:50',
  },
  {
    id: 'kelas-8b',
    namaKelas: 'Kelas 8-B',
    tingkat: 'Kelas 8 SMP',
    tahunPelajaran: '2026/2027',
    kriteriaSosiometri: 'Rekan Diskusi & Sahabat Kolaborasi Proyek',
    siswa: [
      { id: 1, nama: 'Andi Firmansyah', gender: 'L', pilihan1Id: 2, pilihan2Id: 3, ikmsResponses: [101, 301, 401] },
      { id: 2, nama: 'Bella Safitri', gender: 'P', pilihan1Id: 1, pilihan2Id: 4, ikmsResponses: [102, 201, 402] },
      { id: 3, nama: 'Cahyo Utomo', gender: 'L', pilihan1Id: 1, pilihan2Id: 2, ikmsResponses: [103, 302, 403] },
      { id: 4, nama: 'Dewi Lestari', gender: 'P', pilihan1Id: 2, pilihan2Id: 5, ikmsResponses: [201, 202, 304] },
      { id: 5, nama: 'Erlangga Putra', gender: 'L', pilihan1Id: 1, pilihan2Id: 2, ikmsResponses: [101, 204, 301] },
      { id: 6, nama: 'Fani Rahmawati (Terisolasi)', gender: 'P', pilihan1Id: 2, pilihan2Id: 4, ikmsResponses: [104, 201, 203] },
      { id: 7, nama: 'Gilang Ramadhan', gender: 'L', pilihan1Id: 1, pilihan2Id: 3, ikmsResponses: [301, 303, 401] },
      { id: 8, nama: 'Hany Handayani', gender: 'P', pilihan1Id: 2, pilihan2Id: 4, ikmsResponses: [102, 201, 402] },
    ],
    googleSheetSyncUrl: '',
    lastSyncTime: '2026-10-08 09:00',
  },
  {
    id: 'kelas-9c',
    namaKelas: 'Kelas 9-C',
    tingkat: 'Kelas 9 SMP',
    tahunPelajaran: '2026/2027',
    kriteriaSosiometri: 'Teman Diskusi Persiapan Pemilihan Lanjutan SMA/SMK',
    siswa: [
      { id: 1, nama: 'Alvin Pratama', gender: 'L', pilihan1Id: 2, pilihan2Id: 3, ikmsResponses: [401, 402, 403] },
      { id: 2, nama: 'Bunga Citra', gender: 'P', pilihan1Id: 1, pilihan2Id: 4, ikmsResponses: [304, 401, 402] },
      { id: 3, nama: 'Coki Pardede', gender: 'L', pilihan1Id: 1, pilihan2Id: 2, ikmsResponses: [101, 401, 404] },
      { id: 4, nama: 'Dara Puspita', gender: 'P', pilihan1Id: 2, pilihan2Id: 5, ikmsResponses: [201, 401, 403] },
      { id: 5, nama: 'Evan Dimas', gender: 'L', pilihan1Id: 1, pilihan2Id: 2, ikmsResponses: [301, 402, 404] },
      { id: 6, nama: 'Fitriani (Pendiam)', gender: 'P', pilihan1Id: 2, pilihan2Id: 4, ikmsResponses: [102, 104, 401] },
    ],
    googleSheetSyncUrl: '',
    lastSyncTime: '2026-10-08 09:15',
  },
];

export const IKMS_NEED_DATA = [
  {
    bidang: 'Pribadi',
    persentase: 68,
    warna: 'bg-blue-600',
    deskripsi: 'Regulasi emosi, kepercayaan diri, manajemen penggunaan gawai/sosmed',
    topIssues: [
      'Merasa sulit membatasi waktu main game / HP hingga larut malam (72%)',
      'Sering merasa cemas dan kurang percaya diri saat berbicara di depan kelas (65%)',
      'Mudah terpancing emosi dan tersinggung ketika diejek teman (58%)'
    ]
  },
  {
    bidang: 'Sosial',
    persentase: 74,
    warna: 'bg-indigo-600',
    deskripsi: 'Dinamika pertemanan, adaptasi lingkungan baru, pencegahan bullying',
    topIssues: [
      'Merasa takut tidak punya teman dekat di kelas / dijauhi teman (78%)',
      'Pernah menyaksikan atau mengalami ejekan fisik/verbal di grup WhatsApp (69%)',
      'Merasa bingung cara menolak ajakan teman yang merugikan (54%)'
    ]
  },
  {
    bidang: 'Belajar',
    persentase: 62,
    warna: 'bg-emerald-600',
    deskripsi: 'Strategi belajar mandiri, konsentrasi, penuntasan tugas di SMP',
    topIssues: [
      'Kesulitan membagi waktu antara mengerjakan PR dan bermain (70%)',
      'Sering menunda tugas sekolah hingga deadline mendesak (64%)',
      'Belum tahu gaya belajar yang paling cocok untuk dirinya (52%)'
    ]
  },
  {
    bidang: 'Karier',
    persentase: 55,
    warna: 'bg-amber-600',
    deskripsi: 'Eksplorasi bakat minat, cita-cita, gambaran SMA vs SMK (Fase D)',
    topIssues: [
      'Masih bingung menentukan pilihan antara lanjut ke SMA atau SMK (62%)',
      'Belum mengenali potensi bakat dan minat yang menonjol dalam diri (58%)',
      'Pilihan cita-cita berbeda dengan harapan orang tua (45%)'
    ]
  }
];

export const PRESET_KASUS_KONSELOR = [
  {
    judul: 'Siswa Kelas 7 Menarik Diri & Mengurung Diri Akibat Ejekan di Grup WhatsApp',
    kelas: 'Kelas 7 SMP',
    bidang: 'Sosial',
    fokus: 'Konseling Individual & Mediasi Teman Sebaya',
    deskripsi: 'Seorang siswi kelas 7 (Inisial AM) belakangan ini sering menangis di pojok kelas, tidak mau keluar saat jam istirahat, dan meminta pulang lebih awal dengan alasan sakit perut. Berdasarkan laporan wali kelas, AM menjadi bahan ejekan di grup WhatsApp kelas karena foto ekspresi wajahnya dijadikan stiker dan meme ejekan.'
  },
  {
    judul: 'Siswa Kelas 8 Penurunan Drastis Nilai Akademik & Mengantuk Akibat Game Online',
    kelas: 'Kelas 8 SMP',
    bidang: 'Belajar & Pribadi',
    fokus: 'Konseling Individual & Kolaborasi Orang Tua',
    deskripsi: 'Siswa kelas 8 (Inisial RF) yang sebelumnya berprestasi di peringkat 5 besar mengalami penurunan nilai ujian tajam di semester ini. Guru mata pelajaran melaporkan RF kerap tertidur di jam pertama dan tidak mengumpulkan tugas. Saat diajak bicara awal, RF mengaku bermain game Mobile Legends bersama komunitas hingga pukul 02.30 dini hari setiap malam.'
  },
  {
    judul: 'Siswa Kelas 9 Konflik dengan Orang Tua Terkait Pilihan Lanjutan SMA vs SMK',
    kelas: 'Kelas 9 SMP',
    bidang: 'Karier',
    fokus: 'Konseling Karier & Konseling Keluarga',
    deskripsi: 'Siswa kelas 9 (Inisial DN) memiliki minat besar pada desain grafis dan animasi digital serta sangat ingin mendaftar ke SMK Jurusan DKV. Namun, kedua orang tuanya bersikeras agar DN masuk SMA favorit jurusan IPA demi melanjutkan profesi keluarga. DN merasa frustrasi, mogok belajar, dan hubungan dengan orang tua menjadi sangat tegang.'
  },
  {
    judul: 'Siswa Kelas 8 Mengalami Krisis Percaya Diri & Gejala Serangan Panik',
    kelas: 'Kelas 8 SMP',
    bidang: 'Pribadi',
    fokus: 'Konseling Individual (CBT / Relaksasi)',
    deskripsi: 'Siswa kelas 8 (Inisial LK) sering mengalami keringat dingin, detak jantung kencang, dan tangan gemetar setiap kali diminta maju presentasi di kelas. LK merasa takut ditertawakan dan berpikiran bahwa semua orang sedang menilai kelemahannya. Hal ini membuatnya sering bolos di hari presentasi tugas kelompok.'
  }
];
