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
 *   seriDogruSayisi: art arda en fazla doğru cevap sayısı,
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
  // ========== SEVİYE 1: Temel Başarımlar ==========
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
    id: "eser_yazar_10",
    ad: "Eser Yazar Dedektifi",
    zorluk: 1,
    aciklama: "Eser → Yazar modunda 10 soruyu %100 doğrulukla tamamla",
    kontrol: (sonuc) => {
      return (
        sonuc.soruTipi === "ESER_YAZAR" &&
        sonuc.soruSayisi >= 10 &&
        sonuc.oran === 100
      );
    },
  },
  {
    id: "bes_dogru_serisi",
    ad: "Sağlam Başlangıç",
    zorluk: 1,
    aciklama: "Arka arkaya 5 doğru cevap ver",
    kontrol: (sonuc) => {
      return (sonuc.seriDogruSayisi ?? 0) >= 5;
    },
  },

  // ========== SEVİYE 2: Kolay Başarımlar ==========
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
    id: "elli_soru_maratonu",
    ad: "50 Soru Maratonu",
    zorluk: 2,
    aciklama: "50 soruluk bir testi %70+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return sonuc.soruSayisi >= 50 && sonuc.oran >= 70;
    },
  },
  {
    id: "karisik_ustasi_20",
    ad: "Karışık Ustası",
    zorluk: 2,
    aciklama: "Karışık soru tipinde 20 soruluk testi %80+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return (
        sonuc.soruTipi === "KARISIK" &&
        sonuc.soruSayisi >= 20 &&
        sonuc.oran >= 80
      );
    },
  },

  // ========== SEVİYE 3: Orta Başarımlar ==========
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
    id: "donem_gezgini",
    ad: "Dönem Gezgini",
    zorluk: 3,
    aciklama: "Tek testte en az 5 farklı dönem seçerek %75+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return sonuc.donemler.length >= 5 && sonuc.oran >= 75;
    },
  },
  {
    id: "servet_i_funun_ustasi",
    ad: "Servet-i Fünun Ustası",
    zorluk: 3,
    aciklama: "Servet-i Fünun & Fecr-i Ati dönemini %90+ doğrulukla tamamla (Maks soru)",
    kontrol: (sonuc) => {
      return (
        sonuc.donemler.includes("Servet-i Fünun & Fecr-i Ati (1896-1911)") &&
        sonuc.donemler.length === 1 &&
        sonuc.oran >= 90 &&
        sonuc.soruSayisi === "Maks"
      );
    },
  },
  {
    id: "milli_edebiyat_ustasi",
    ad: "Milli Edebiyat Ustası",
    zorluk: 3,
    aciklama: "Milli Edebiyat dönemini %90+ doğrulukla tamamla (Maks soru)",
    kontrol: (sonuc) => {
      return (
        sonuc.donemler.includes("Milli Edebiyat (1911-1923)") &&
        sonuc.donemler.length === 1 &&
        sonuc.oran >= 90 &&
        sonuc.soruSayisi === "Maks"
      );
    },
  },
  {
    id: "islamiyet_oncesi_kesif",
    ad: "Kökleri Keşfet",
    zorluk: 3,
    aciklama: "İslamiyet Öncesi & Geçiş dönemini %90+ doğrulukla tamamla (Maks soru)",
    kontrol: (sonuc) => {
      return (
        sonuc.donemler.includes("İslamiyet Öncesi & Geçiş") &&
        sonuc.donemler.length === 1 &&
        sonuc.oran >= 90 &&
        sonuc.soruSayisi === "Maks"
      );
    },
  },
  {
    id: "yazar_donem_ustasi",
    ad: "Yazar Dönem Ustası",
    zorluk: 3,
    aciklama: "Yazar → Dönem modunda 30 soruyu %85+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return (
        sonuc.soruTipi === "YAZAR_DONEM" &&
        sonuc.soruSayisi >= 30 &&
        sonuc.oran >= 85
      );
    },
  },

  // ========== SEVİYE 4: Orta-İleri Başarımlar ==========
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
    id: "yuz_soru_maratonu",
    ad: "100 Soru Maratonu",
    zorluk: 4,
    aciklama: "100 soruluk bir testi %85+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return sonuc.soruSayisi >= 100 && sonuc.oran >= 85;
    },
  },
  {
    id: "cumhuriyet_gezgini",
    ad: "Cumhuriyet Gezgini",
    zorluk: 4,
    aciklama: "En az 8 farklı Cumhuriyet dönemi seçerek %80+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      const cumhuriyetDonemleri = sonuc.donemler.filter((d) =>
        d.startsWith("Cumhuriyet")
      );
      return cumhuriyetDonemleri.length >= 8 && sonuc.oran >= 80;
    },
  },
  {
    id: "halk_edebiyati_ustasi",
    ad: "Halk Edebiyatı Ustası",
    zorluk: 4,
    aciklama: "Halk Edebiyatı dönemini %95+ doğrulukla tamamla (Maks soru)",
    kontrol: (sonuc) => {
      return (
        sonuc.donemler.includes("Halk Edebiyatı") &&
        sonuc.donemler.length === 1 &&
        sonuc.oran >= 95 &&
        sonuc.soruSayisi === "Maks"
      );
    },
  },
  {
    id: "eser_tur_ustasi",
    ad: "Eser Tür Ustası",
    zorluk: 4,
    aciklama: "Eser → Tür modunda 40 soruyu %90+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return (
        sonuc.soruTipi === "ESER_TUR" &&
        sonuc.soruSayisi >= 40 &&
        sonuc.oran >= 90
      );
    },
  },

  // ========== SEVİYE 5: İleri Başarımlar ==========
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
    id: "on_dogru_serisi",
    ad: "Kusursuz Seri",
    zorluk: 5,
    aciklama: "Arka arkaya 10 doğru cevap ver",
    kontrol: (sonuc) => {
      return (sonuc.seriDogruSayisi ?? 0) >= 10;
    },
  },
  {
    id: "bes_dakika_efsanesi",
    ad: "5 Dakika Efsanesi",
    zorluk: 5,
    aciklama: "10sn modunda 50 soruyu %90+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return (
        sonuc.zamanLimit === 10 &&
        sonuc.soruSayisi >= 50 &&
        sonuc.oran >= 90
      );
    },
  },

  // ========== SEVİYE 6: Uzman Başarımlar ==========
  {
    id: "anlik_karar",
    ad: "Anlık Karar",
    zorluk: 6,
    aciklama: "3sn modunda 100 soruyu %80+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      return (
        sonuc.zamanLimit === 3 &&
        sonuc.soruSayisi >= 100 &&
        sonuc.oran >= 80
      );
    },
  },
  {
    id: "tam_isabet",
    ad: "Tam İsabet",
    zorluk: 6,
    aciklama: "5sn modunda 100 soruyu %100 doğrulukla tamamla",
    kontrol: (sonuc) => {
      return (
        sonuc.zamanLimit === 5 &&
        sonuc.soruSayisi >= 100 &&
        sonuc.oran === 100
      );
    },
  },

  // ========== SEVİYE 7: Efsane Başarımlar ==========
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
  {
    id: "destansi_bilgin",
    ad: "Destansı Bilgin",
    zorluk: 7,
    aciklama: "İslamiyet Öncesi, Divan ve Halk Edebiyatını tek testte Maks soruda %90+ doğrulukla tamamla",
    kontrol: (sonuc) => {
      const hedefDonemler = [
        "İslamiyet Öncesi & Geçiş",
        "Divan Edebiyatı",
        "Halk Edebiyatı",
      ];
      const hepsiniKapsar = hedefDonemler.every((d) =>
        sonuc.donemler.includes(d)
      );
      return (
        hepsiniKapsar &&
        sonuc.soruSayisi === "Maks" &&
        sonuc.oran >= 90
      );
    },
  },
  {
    id: "zirveye_yolculuk",
    ad: "Zirveye Yolculuk",
    zorluk: 7,
    aciklama: "Tüm dönemler (Lakaplar ve Dergiler hariç), Karışık, 5sn, Maks soru, %95+",
    kontrol: (sonuc) => {
      return (
        sonuc.tumDonemlerSecili &&
        sonuc.soruTipi === "KARISIK" &&
        sonuc.zamanLimit === 5 &&
        sonuc.soruSayisi === "Maks" &&
        sonuc.oran >= 95
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
