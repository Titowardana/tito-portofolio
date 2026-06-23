export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  imagePath: string;
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "aye-bouquet",
    title: "Aye Bouquet",
    description:
      "Website pemesanan buket berbasis CodeIgniter 4 dan MySQL dengan katalog produk, keranjang, custom order, checkout WhatsApp, admin panel, manajemen warna, varian, dan arsip pesanan.",
    technologies: ["CodeIgniter 4", "PHP", "MySQL", "JavaScript", "Tailwind CSS"],
    imagePath: "/images/projects/aye-bouquet.jpg",
    featured: true,
  },
  {
    id: "calmind",
    title: "Calmind",
    description:
      "Aplikasi wellness dan kesehatan mental untuk membantu pengguna mengelola kondisi emosional dan aktivitas harian.",
    technologies: ["Flutter", "Dart", "Firebase"],
    imagePath: "/images/projects/calmind.jpg",
    featured: true,
  },
  {
    id: "jellyfish",
    title: "Jellyfish Classification",
    description:
      "Aplikasi klasifikasi jenis ubur-ubur menggunakan EfficientNetB0 berbasis web.",
    technologies: ["Python", "TensorFlow", "EfficientNetB0", "Streamlit"],
    imagePath: "/images/projects/jellyfish.jpg",
  },
  {
    id: "ar-project",
    title: "Educational Augmented Reality",
    description:
      "Media pembelajaran berbasis augmented reality dengan objek 3D interaktif.",
    technologies: ["Unity", "C#", "AR Foundation", "Blender"],
    imagePath: "/images/projects/ar-project.jpg",
  },
  {
    id: "federated-learning",
    title: "Federated Learning Project",
    description:
      "Sistem federated learning untuk prediksi menggunakan pendekatan Cross-Silo dan model LSTM.",
    technologies: ["Python", "Federated Learning", "LSTM", "TensorFlow"],
    imagePath: "/images/projects/federated-learning.jpg",
  },
];
