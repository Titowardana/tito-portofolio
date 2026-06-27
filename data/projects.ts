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
    id: "aye-bouquet",
    slug: "aye-bouquet",
    title: "Aye Bouquet",
    shortDescription:
      "Website pemesanan buket berbasis CodeIgniter 4 dan MySQL dengan katalog produk, keranjang, custom order, checkout WhatsApp, admin panel, manajemen warna, varian produk, dan arsip pesanan.",
    description:
      "Website pemesanan buket berbasis CodeIgniter 4 dan MySQL dengan katalog produk, keranjang, custom order, checkout WhatsApp, admin panel, manajemen warna, varian produk, dan arsip pesanan.",
    role: "",
    category: "",
    technologies: ["CodeIgniter 4", "PHP", "MySQL", "JavaScript"],
    image: "/images/projects/aye-bouquet.png",
    githubUrl: "",
    liveUrl: "",
    featured: true,
    active: true,
    order: 1,
  },
  {
    id: "dkp-keuangan",
    slug: "dkp-keuangan",
    title: "DKP Keuangan System",
    shortDescription:
      "Sistem slip gaji berbasis web untuk menghitung dan mengelola gaji pegawai.",
    description:
      "Platform modern dan terintegrasi untuk manajemen dan pemantauan slip gaji pegawai pada Dinas Kelautan dan Perikanan Kepri.",
    role: "",
    category: "",
    technologies: [],
    image: "/images/projects/slip-gaji.png",
    githubUrl: "",
    liveUrl: "",
    featured: true,
    active: true,
    order: 2,
  },
  {
    id: "jellyfish",
    slug: "jellyfish-classification",
    title: "Jellyfish Classification",
    shortDescription:
      "Aplikasi klasifikasi jenis ubur-ubur menggunakan transfer learning EfficientNetB0 berbasis web.",
    description:
      "Aplikasi klasifikasi jenis ubur-ubur menggunakan transfer learning EfficientNetB0 berbasis web.",
    role: "",
    category: "",
    technologies: ["Python", "TensorFlow", "EfficientNetB0", "Streamlit"],
    image: "/images/projects/jellyfish.jpg",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    active: true,
    order: 3,
  },
  // TODO: Verifikasi teknologi Educational AR (Unity, C#, AR Foundation, Blender masih spekulatif)
  {
    id: "ar-project",
    slug: "educational-ar",
    title: "Educational Augmented Reality",
    shortDescription:
      "Media pembelajaran berbasis augmented reality yang menampilkan objek 3D interaktif.",
    description:
      "Media pembelajaran berbasis augmented reality yang menampilkan objek 3D interaktif.",
    role: "",
    category: "",
    technologies: [],
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
    title: "Federated Learning Project",
    shortDescription:
      "Sistem prediksi berbasis Cross-Silo Federated Learning dengan model LSTM untuk melatih model tanpa memusatkan seluruh data.",
    description:
      "Sistem prediksi berbasis Cross-Silo Federated Learning dengan model LSTM untuk melatih model tanpa memusatkan seluruh data.",
    role: "",
    category: "",
    technologies: ["Python", "Federated Learning", "LSTM"],
    image: "/images/projects/federated-learning.jpg",
    githubUrl: "",
    liveUrl: "",
    featured: false,
    active: true,
    order: 5,
  },
];
