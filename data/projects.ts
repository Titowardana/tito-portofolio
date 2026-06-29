export interface Project {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  role: string;
  category: string;
  technologies: string[];
  image: string;
  githubUrl: string;
  liveUrl: string;
  featured: boolean;
  active: boolean;
  order: number;
}

export const projects: Project[] = [
  {
    id: "calmind-aplikasi-pendukung-kesehatan-mental",
    slug: "calmind-aplikasi-pendukung-kesehatan-mental",
    title: "Calmind — Aplikasi Pendukung Kesehatan Mental",
    shortDescription: "Calmind merupakan aplikasi yang dirancang untuk membantu pengguna menjaga kesejahteraan emosional melalui fitur pemantauan suasana hati, jurnal harian, latihan relaksasi, dan informasi edukatif mengenai kesehatan mental.",
    description: "Calmind dikembangkan sebagai aplikasi pendukung kesehatan mental yang membantu pengguna lebih memahami kondisi emosional mereka dalam kehidupan sehari-hari. Aplikasi ini menyediakan beberapa fitur seperti pencatatan suasana hati, jurnal pribadi, latihan pernapasan dan relaksasi, serta konten edukatif yang berkaitan dengan kesehatan mental.\r\n\r\nTampilan aplikasi dirancang dengan konsep yang sederhana, nyaman, dan menenangkan agar pengguna dapat menggunakan setiap fitur dengan mudah. Selain berfokus pada fungsi, pengembangan Calmind juga memperhatikan pengalaman pengguna melalui navigasi yang jelas, desain responsif, serta pemilihan warna yang sesuai dengan tema kesehatan dan ketenangan.\r\n\r\nMelalui proyek ini, saya mempelajari proses perancangan antarmuka, penyusunan alur pengguna, pengembangan fitur aplikasi, pengelolaan data, serta pengujian sistem. Calmind dibuat sebagai sarana pendukung kesejahteraan emosional dan bukan sebagai pengganti diagnosis atau penanganan profesional dari tenaga kesehatan.",
    role: "",
    category: "Aplikasi Kesehatan / Mobile Application",
    technologies: ["Flutter", "Dart", "Firebase", "Figma", "Stitch"],
    image: "https://owxtxcuebi4shsr9.public.blob.vercel-storage.com/30249bcb-28b9-4f88-8a77-050fe98488ba.png",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    active: true,
    order: 0,
  },
  {
    id: "smart-courier-simulasi-pencarian-rute-pengiriman",
    slug: "smart-courier-simulasi-pencarian-rute-pengiriman",
    title: "Smart Courier — Simulasi Pencarian Rute Pengiriman",
    shortDescription: "Smart Courier merupakan aplikasi simulasi berbasis web yang memvisualisasikan proses pencarian rute pengiriman dari titik awal menuju tujuan pada sebuah peta. Pengguna dapat mengunggah gambar peta, menentukan posisi secara acak, menjalankan atau menjeda simulasi, mengatur kecepatan kurir, serta melihat jalur yang dilalui secara langsung.",
    description: "Smart Courier adalah aplikasi simulasi berbasis web yang dikembangkan untuk memvisualisasikan proses pencarian rute pengiriman pada sebuah peta. Aplikasi ini menampilkan pergerakan kurir dari posisi awal menuju titik tujuan melalui jalur yang telah dihitung oleh sistem.\r\n\r\nPengguna dapat mengunggah gambar peta sebagai area simulasi, menentukan posisi awal dan tujuan secara acak, serta mengontrol proses simulasi melalui tombol mulai, jeda, dan ulangi. Kecepatan pergerakan kurir juga dapat disesuaikan menggunakan slider agar proses pencarian rute dapat diamati dengan lebih jelas.\r\n\r\nVisualisasi dilakukan melalui elemen Canvas, dengan penanda berbeda untuk posisi awal, tujuan, dan posisi kurir. Sistem juga menampilkan informasi panjang jalur dalam satuan langkah sehingga pengguna dapat melihat seberapa jauh rute yang dihasilkan.\r\n\r\nMelalui proyek ini, saya mempelajari penerapan logika pencarian jalur, manipulasi Canvas, pengelolaan interaksi pengguna menggunakan JavaScript, pengunggahan gambar, animasi pergerakan objek, serta pembuatan antarmuka yang responsif menggunakan Tailwind CSS.",
    role: "Frontend Developer",
    category: "Algorithm Implementer",
    technologies: ["HTML", "CSS", "JavaScript", "Tailwind CSS", "HTML5 Canvas", "Font Awesome"],
    image: "https://owxtxcuebi4shsr9.public.blob.vercel-storage.com/b8c8b043-c1d8-465e-8730-8b9ef0cfa0b2.png",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    active: true,
    order: 0,
  },
  {
    id: "aye-bouquet",
    slug: "aye-bouquet",
    title: "Aye Bouquet",
    shortDescription: "Website pemesanan buket berbasis CodeIgniter 4 dan MySQL dengan katalog produk, keranjang, custom order, checkout WhatsApp, admin panel, manajemen warna, varian produk, dan arsip pesanan.",
    description: "Aye Bouquet adalah website e-commerce berbasis web yang dirancang untuk mempermudah pelanggan dalam melihat dan memesan berbagai produk buket, seperti buket bunga, buket uang, buket makanan, selempang, bloom box, dan hadiah custom.\r\n\r\nPelanggan dapat menjelajahi katalog, mencari dan memfilter produk berdasarkan kategori, harga, serta warna, memilih varian ukuran, menambahkan produk ke keranjang, dan mengisi data pengiriman pada proses checkout. Sistem juga mendukung pemesanan custom dan menghasilkan format pesan WhatsApp secara otomatis berdasarkan produk, jumlah, varian, catatan, dan jadwal pengiriman yang dipilih.\r\n\r\nPada sisi admin, tersedia dashboard untuk mengelola produk, kategori, gambar, varian harga, warna, opsi custom, pesanan, arsip pesanan, testimoni, FAQ, galeri, dan informasi bisnis. Website dirancang responsif untuk desktop maupun perangkat mobile serta mendukung tampilan mode terang dan gelap.\r\n\r\nMelalui proyek ini, saya memperoleh pengalaman dalam pengembangan aplikasi web full-stack, pengelolaan database, pembuatan sistem autentikasi, pengembangan fitur transaksi, perancangan antarmuka, serta pengujian dan deployment website.",
    role: "",
    category: "",
    technologies: ["PHP", "CodeIgniter 4", "MySQL", "HTML", "CSS", "JavaScript", "Tailwind CSS"],
    image: "/images/projects/aye-bouquet.png",
    githubUrl: "",
    liveUrl: "https://ayebouquet.web.id/",
    featured: true,
    active: true,
    order: 1,
  },
  {
    id: "dkp-keuangan",
    slug: "dkp-keuangan",
    title: "Sistem Informasi Pengelolaan Slip Gaji DKP Kepulauan Riau",
    shortDescription: "Sistem informasi berbasis web yang dikembangkan untuk membantu pengelolaan data pegawai dan proses penggajian di Dinas Kelautan dan Perikanan Provinsi Kepulauan Riau. Sistem mencakup pembuatan slip gaji, import data SIPD, verifikasi dan persetujuan bendahara, finalisasi pembayaran, pembuatan laporan, serta unduh slip dalam format PDF.",
    description: "Sistem Informasi Pengelolaan Slip Gaji DKP merupakan aplikasi berbasis web yang dikembangkan untuk membantu proses administrasi penggajian di Dinas Kelautan dan Perikanan Provinsi Kepulauan Riau. Sistem ini dirancang agar pengelolaan data pegawai, slip gaji, dan tahapan pemeriksaan payroll dapat dilakukan secara lebih terstruktur dan efisien.\r\n\r\nPada sisi admin, sistem menyediakan fitur pengelolaan data pegawai, pembuatan dan pengeditan slip gaji, import data penggajian dari SIPD, pemantauan status slip, pembuatan laporan, serta proses backup dan restore database. Komponen penghasilan dan potongan, seperti gaji pokok, tunjangan, pajak, dan potongan lainnya, dapat dikelola melalui sistem.\r\n\r\nPada sisi bendahara, tersedia alur pemeriksaan yang terdiri dari verifikasi, persetujuan, finalisasi periode penggajian, serta pencatatan status pembayaran. Sistem juga menyimpan histori perubahan status sehingga setiap tahapan proses penggajian dapat dipantau.\r\n\r\nSlip gaji dapat ditampilkan dan diunduh dalam format PDF, baik secara individual maupun sekaligus dalam bentuk file ZIP. Selain itu, sistem menyediakan laporan rekapitulasi yang menampilkan jumlah slip, total pendapatan, total potongan, dan total gaji bersih pada setiap periode.\r\n\r\nMelalui proyek ini, saya memperoleh pengalaman dalam pengembangan aplikasi web berbasis role, pengelolaan database, pemrosesan data payroll, pembuatan dokumen PDF, import data, pencatatan aktivitas, serta penerapan alur kerja administrasi pada lingkungan instansi pemerintahan.",
    role: "Full-Stack Developer",
    category: "Information System / Payroll Management",
    technologies: ["PHP", "CodeIgniter 4", "MySQL", "HTML", "CSS", "JavaScript", "Dompdf"],
    image: "/images/projects/slip-gaji.png",
    githubUrl: "",
    liveUrl: "",
    featured: true,
    active: true,
    order: 2,
  },
  {
    id: "jellyfish-classification",
    slug: "jellyfish-classification",
    title: "Jellyfish Classification",
    shortDescription: "Aplikasi klasifikasi jenis ubur-ubur menggunakan transfer learning EfficientNetB0 berbasis web.",
    description: "Proyek ini dikembangkan untuk mengklasifikasikan beberapa jenis ubur-ubur menggunakan teknik pengolahan citra dan deep learning. Model dibangun menggunakan arsitektur EfficientNetB0 dengan pendekatan transfer learning agar proses pelatihan lebih efisien dan mampu memberikan hasil klasifikasi yang baik.\r\n\r\nDataset gambar terlebih dahulu melalui beberapa tahap preprocessing, seperti resize, normalisasi, dan augmentasi data. Setelah proses pelatihan dan evaluasi selesai, model diintegrasikan ke dalam aplikasi berbasis web sehingga pengguna dapat mengunggah gambar ubur-ubur dan memperoleh hasil prediksi berupa nama kelas serta tingkat confidence.\r\n\r\nMelalui proyek ini, saya mempelajari proses persiapan dataset, preprocessing citra, augmentasi data, transfer learning, pelatihan model, evaluasi performa, serta integrasi model machine learning ke dalam antarmuka berbasis web.",
    role: "Machine Learning Developer",
    category: "Pengolahan Citra",
    technologies: ["Python", "TensorFlow", "Keras", "EfficientNetB0", "NumPy", "Scikit-learn", "Pillow", "Streamlit"],
    image: "https://owxtxcuebi4shsr9.public.blob.vercel-storage.com/2186b0fb-bd84-4752-80e8-48920996d6eb.jpg",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    active: true,
    order: 3,
  },
  {
    id: "educational-ar",
    slug: "educational-ar",
    title: "Educational Augmented Reality",
    shortDescription: "Educational Augmented Reality merupakan media pembelajaran interaktif yang memanfaatkan teknologi augmented reality untuk menampilkan objek tiga dimensi, informasi, dan materi edukasi melalui perangkat mobile. Proyek ini dirancang untuk membuat proses belajar menjadi lebih menarik, visual, dan mudah dipahami.",
    description: "Educational Augmented Reality adalah proyek media pembelajaran yang menggabungkan materi edukasi dengan teknologi augmented reality. Melalui aplikasi ini, pengguna dapat memindai marker atau objek tertentu menggunakan kamera perangkat untuk menampilkan model tiga dimensi, animasi, teks informasi, serta elemen interaktif yang berkaitan dengan materi pembelajaran.\r\n\r\nProyek ini dikembangkan untuk membantu menyampaikan materi yang sulit dipahami apabila hanya dijelaskan melalui teks atau gambar dua dimensi. Dengan visualisasi AR, pengguna dapat mengamati objek dari berbagai sudut, berinteraksi dengan materi, serta memperoleh pengalaman belajar yang lebih menarik dan kontekstual.\r\n\r\nDalam proses pengembangannya, saya terlibat dalam penyusunan materi, pembuatan alur interaksi, pengaturan marker, penempatan objek tiga dimensi, perancangan antarmuka, serta pengujian pengalaman pengguna. Desain aplikasi dibuat sederhana agar dapat digunakan dengan mudah oleh siswa maupun pengguna yang baru mengenal teknologi augmented reality.\r\n\r\nMelalui proyek ini, saya mempelajari penerapan teknologi AR dalam bidang pendidikan, pengelolaan aset tiga dimensi, perancangan interaksi pengguna, penyusunan media pembelajaran digital, serta evaluasi kemudahan penggunaan aplikasi.",
    role: "AR Developer & UI/UX Designer",
    category: "Educational Technology / Augmented Reality",
    technologies: ["Assemblr Studio", "Marker-Based AR", "3D Assets"],
    image: "/images/projects/AR-Kartini.png",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    active: true,
    order: 4,
  },
  {
    id: "federated-learning",
    slug: "federated-learning",
    title: "Jejak Tanah Melayu — Website Wisata dan Budaya Kepulauan Riau",
    shortDescription: "Jejak Tanah Melayu merupakan website informasi wisata dan budaya yang memperkenalkan sejarah Melayu, destinasi unggulan, serta kekayaan budaya di Kepulauan Riau. Website ini dirancang dengan tampilan yang sederhana, informatif, dan mudah digunakan oleh pengunjung.",
    description: "Jejak Tanah Melayu adalah website yang dikembangkan untuk memperkenalkan sejarah, budaya, dan destinasi wisata Melayu di Kepulauan Riau. Website ini menyajikan informasi mengenai perkembangan peradaban Melayu, tradisi masyarakat, peninggalan sejarah, serta berbagai lokasi wisata yang memiliki nilai budaya dan sejarah.\r\n\r\nPengunjung dapat menjelajahi beberapa bagian utama, seperti halaman beranda, sejarah Melayu, daftar destinasi, dan informasi tim pengembang. Pada halaman beranda, pengguna akan mendapatkan gambaran umum mengenai budaya Melayu serta beberapa rekomendasi wisata yang dapat dikunjungi.\r\n\r\nTampilan website dirancang responsif agar tetap nyaman digunakan melalui perangkat desktop maupun mobile. Pemilihan warna kuning keemasan, cokelat, dan putih digunakan untuk menyesuaikan identitas visual dengan nuansa Melayu, sejarah, dan kebudayaan Kepulauan Riau.\r\n\r\nMelalui proyek ini, saya mempelajari proses perancangan struktur website, pengembangan antarmuka, penyusunan konten informasi, penerapan navigasi, serta pembuatan tampilan yang responsif dan mudah dipahami oleh pengguna.",
    role: "Frontend Developer",
    category: "Website Informasi / Pariwisata dan Budaya",
    technologies: ["HTML", "CSS", "JavaScript"],
    image: "https://owxtxcuebi4shsr9.public.blob.vercel-storage.com/f883d98e-56f4-44a0-aa63-79d78df361f5.png",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    active: true,
    order: 5,
  },
];
