/*
 * achievements.js
 * Başarım sistemi tanımları ve kontrol fonksiyonları
 * Bu dosyayı src/ klasörüne koyun.
 *
 * Her başarımın yapısı:
 * {
 *   id: "benzersiz_id",           // Benzersiz tanımlayıcı
 *   ad: "Başarım Adı",           // Görünen isim
 *   zorluk: 3,                    // 1-7 arası yıldız sayısı
 *   aciklama: "Kazanma yolu",    // Nasıl kazanılacağı
 *   kontrol: (sonuc) => bool,    // Koşul fonksiyonu - true dönerse başarım kazanılır
 * }
 *
 * kontrol fonksiyonuna gelen `sonuc` objesi:
 * {
 *   donemler: ["seçili dönemler"],
 *   soruSayisi: toplam soru sayısı,
 *   dogruSayisi: doğru cevap sayısı,
 *   yanlisSayisi: yanlış cevap sayısı,
 *   oran: yüzde doğruluk oranı (0-100),
 *   zamanLimit: null | 3 | 5 | 10,
 *   soruTipi: "ESER_YAZAR" | "YAZAR_DONEM" | "ESER_TUR" | "KARISIK",
 *   tumDonemlerSecili: boolean (Lakaplar ve Dergi/Gazeteler hariç tüm dönemler seçili mi),
 * }
 *
 * Yeni başarım eklemek için:
 * 1. Aşağıdaki diziye yeni bir obje ekleyin
 * 2. Benzersiz bir id verin
 * 3. kontrol fonksiyonunu yazın
 */

// Lakaplar ve Dergi/Gazeteler hariç tutulacak dönemler
export const HARIC_DONEMLER = ["Lakaplar", "Önemli Dergi ve Gazeteler"];

export const basarimlar = [
  {
    id: "tanzimat_fatihi_5sn",
    ad: "Tanzimat Fatihi 5sn",
    zorluk: 3,
    aciklama: "Test merkezinden Tanzimat dönemini 5sn modunda %95 doğrulukla tamamla",
    kontrol: (sonuc) => {
      return (
        sonuc.donemler.length === 1 &&
        sonuc.donemler.includes("Tanzimat (1860-1896)") &&
        sonuc.zamanLimit === 5 &&
        sonuc.oran >= 95 &&
        sonuc.soruSayisi === "Maks"
      );
    },
  },
  {
    id: "ilk_adim",
    ad: "İlk Adım",
    zorluk: 1,
    aciklama: "Test merkezinden herhangi bir testi tamamla",
    kontrol: (sonuc) => {
      return sonuc.soruSayisi > 0;
    },
  },
  {
    id: "mukemmel_10",
    ad: "Mükemmel 10",
    zorluk: 2,
    aciklama: "10 soruluk bir testi %100 doğrulukla tamamla",
    kontrol: (sonuc) => {
      return sonuc.soruSayisi >= 10 && sonuc.oran === 100;
    },
  },
  {
    id: "hiz_canavari",
    ad: "Hız Canavarı",
    zorluk: 4,
    aciklama: "3sn modunda 20 soruyu %80+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return (
        sonuc.zamanLimit === 3 &&
        sonuc.soruSayisi >= 20 &&
        sonuc.oran >= 80
      );
    },
  },
  {
    id: "divan_ustasi",
    ad: "Divan Ustası",
    zorluk: 3,
    aciklama: "Divan Edebiyatı dönemini %90+ doğrulukla tamamla (Maks soru)",
    kontrol: (sonuc) => {
      return (
        sonuc.donemler.includes("Divan Edebiyatı") &&
        sonuc.donemler.length === 1 &&
        sonuc.oran >= 90 &&
        sonuc.soruSayisi === "Maks"
      );
    },
  },
  {
    id: "elli_soru_maratonu",
    ad: "50 Soru Maratonu",
    zorluk: 2,
    aciklama: "50 soruluk bir testi %70+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return sonuc.soruSayisi >= 50 && sonuc.oran >= 70;
    },
  },
  {
    id: "yuz_soru_maratonu",
    ad: "100 Soru Maratonu",
    zorluk: 4,
    aciklama: "100 soruluk bir testi %85+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return sonuc.soruSayisi >= 100 && sonuc.oran >= 85;
    },
  },
  {
    id: "donem_gezgini",
    ad: "Dönem Gezgini",
    zorluk: 3,
    aciklama: "Tek testte en az 5 farklı dönem seçerek %75+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return sonuc.donemler.length >= 5 && sonuc.oran >= 75;
    },
  },
  {
    id: "zamansiz_bilge",
    ad: "Zamansız Bilge",
    zorluk: 5,
    aciklama: "3sn modunda 50 soruyu %90+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return (
        sonuc.zamanLimit === 3 &&
        sonuc.soruSayisi >= 50 &&
        sonuc.oran >= 90
      );
    },
  },
  {
    id: "yazar_eser_kitabi",
    ad: "Yazar Eser Kitabı",
    zorluk: 7,
    aciklama: "Test merkezinden tüm dönemleri (Lakaplar ve Dergiler hariç) 5sn modunda Maks soruda %100 doğrulukla tamamla",
    kontrol: (sonuc) => {
      return (
        sonuc.tumDonemlerSecili &&
        sonuc.zamanLimit === 5 &&
        sonuc.oran === 100 &&
        sonuc.soruSayisi === "Maks"
      );
    },
  },
];

/* ─── localStorage Yardımcıları ──────────────────────────────────── */

const STORAGE_KEY = "yazar_eser_basarimlar";

export function kazanilanBasarimlariGetir() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    return JSON.parse(saved); // [{id, tarih}]
  } catch {
    return [];
  }
}

export function basarimKaydet(id) {
  const mevcut = kazanilanBasarimlariGetir();
  if (mevcut.find((b) => b.id === id)) return; // zaten kazanılmış
  mevcut.push({ id, tarih: Date.now() });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mevcut));
}

export function basarimlariSifirla() {
  localStorage.removeItem(STORAGE_KEY);
}

/**
 * Test sonucunu kontrol edip yeni kazanılan başarımları döndürür.
 * @param {object} sonuc - Test sonuç objesi
 * @returns {Array} Yeni kazanılan başarım objeleri
 */
export function basarimlariKontrolEt(sonuc) {
  const kazanilanlar = kazanilanBasarimlariGetir();
  const kazanilanIdler = kazanilanlar.map((b) => b.id);
  const yeniKazanilanlar = [];

  basarimlar.forEach((basarim) => {
    if (kazanilanIdler.includes(basarim.id)) return; // zaten kazanılmış
    try {
      if (basarim.kontrol(sonuc)) {
        basarimKaydet(basarim.id);
        yeniKazanilanlar.push(basarim);
      }
    } catch {
      // kontrol fonksiyonu hata verirse atla
    }
  });

  return yeniKazanilanlar;
}
