import React, { useState, useCallback, useMemo } from "react";
import { data, turRenkleri } from "./data";

/* ─── Yardımcı ────────────────────────────────────────────────────── */
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/* Bir kart için 4 şık üret: doğru yazar + aynı dönemden 3 yanlış yazar */
function generateSiklar(kart, tumKartlar) {
  const dogruYazar = kart.yazar.ad;
  // Aynı dönemin farklı yazarlarını bul
  const donemYazarlari = Array.from(new Set(
    tumKartlar
      .filter(k => k.donem === kart.donem && k.yazar.ad !== dogruYazar)
      .map(k => k.yazar.ad)
  ));
  
  // Eğer yeterli yanlış şık yoksa, diğer dönemlerden de al
  let yanlisSiklar = shuffle(donemYazarlari).slice(0, 3);
  if (yanlisSiklar.length < 3) {
    const digerDonemYazarlari = Array.from(new Set(
      tumKartlar
        .filter(k => k.donem !== kart.donem && k.yazar.ad !== dogruYazar)
        .map(k => k.yazar.ad)
    ));
    yanlisSiklar = [
      ...yanlisSiklar,
      ...shuffle(digerDonemYazarlari).slice(0, 3 - yanlisSiklar.length)
    ];
  }
  
  return shuffle([
    { ad: dogruYazar, dogru: true },
    ...yanlisSiklar.map(ad => ({ ad, dogru: false })),
  ]);
}

/* ─── SVG İkonlar ─────────────────────────────────────────────────── */
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconShuffle = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/>
    <polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/>
    <line x1="4" y1="4" x2="9" y2="9"/>
  </svg>
);
const IconPlay = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const IconZap = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);
const IconRotate = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
  </svg>
);
const IconCheck = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
  </svg>
);
const IconArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconList = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
    <line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>
  </svg>
);

/* ─── Ortak Sonuç Ekranı ──────────────────────────────────────────── */
function SonucEkrani({ toplam, bildiSayisi, bilmediSayisi, bilmediList, onExit, modLabel }) {
  const yuzde = Math.round((bildiSayisi / toplam) * 100);
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #020617, #0f172a)", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ textAlign: "center", maxWidth: "500px" }}>
        <h2 style={{ fontSize: "32px", fontWeight: "700", margin: "0 0 12px 0", fontFamily: "Georgia, serif" }}>
          Quiz Bitti!
        </h2>
        <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#94a3b8", margin: "0 0 32px 0" }}>
          {modLabel}
        </p>
        <div style={{ background: "#1e293b", border: "1px solid #334155", borderRadius: "12px", padding: "32px", marginBottom: "32px" }}>
          <div style={{ fontSize: "48px", fontWeight: "900", color: "#10b981", marginBottom: "12px" }}>
            {yuzde}%
          </div>
          <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#cbd5e1", marginBottom: "20px" }}>
            <div>{bildiSayisi} / {toplam} doğru</div>
            <div style={{ color: "#ef4444", marginTop: "8px" }}>{bilmediSayisi} yanlış</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <button onClick={() => onExit()} style={{ padding: "12px 24px", background: "#3b82f6", border: "none", borderRadius: "6px", color: "#fff", fontWeight: "700", cursor: "pointer", fontFamily: "monospace", fontSize: "12px" }}>
            <IconArrowLeft /> Geri Dön
          </button>
          {bilmediList && bilmediList.length > 0 && (
            <button onClick={() => onExit("tekrar", bilmediList)} style={{ padding: "12px 24px", background: "#8b5cf6", border: "none", borderRadius: "6px", color: "#fff", fontWeight: "700", cursor: "pointer", fontFamily: "monospace", fontSize: "12px" }}>
              <IconRotate /> Tekrar Et ({bilmediList.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Quiz Bar ────────────────────────────────────────────────────── */
function QuizBar({ index, toplam, bildi, bilmedi, donemColor, donemAccent, onExit, modLabel }) {
  return (
    <div style={{ background: `linear-gradient(to right, ${donemColor}40, transparent)`, borderBottom: `1px solid ${donemAccent}30`, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#94a3b8", letterSpacing: "0.08em" }}>
          {modLabel}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: "12px", color: "#cbd5e1" }}>
          {index + 1} / {toplam}
        </div>
        <div style={{ display: "flex", gap: "16px", fontFamily: "monospace", fontSize: "11px" }}>
          <div style={{ color: "#10b981" }}>✓ {bildi}</div>
          <div style={{ color: "#ef4444" }}>✕ {bilmedi}</div>
        </div>
      </div>
      <button onClick={onExit} style={{ padding: "6px 12px", background: "transparent", border: "1px solid #64748b", borderRadius: "4px", color: "#94a3b8", fontFamily: "monospace", fontSize: "11px", cursor: "pointer" }}>
        <IconArrowLeft /> Çık
      </button>
    </div>
  );
}

/* ─── Klasik Quiz ──────────────────────────────────────────────────── */
function KlasikQuizScreen({ kartlar, onExit }) {
  const [index, setIndex] = useState(0);
  const [cevrildi, setCevrildi] = useState(false);
  const [bildiList, setBildiList] = useState([]);
  const [bilmediList, setBilmediList] = useState([]);
  const [bitti, setBitti] = useState(false);

  const kart = kartlar[index];
  const donemBilgi = data[kart?.donem] || {};
  const donemColor = donemBilgi.color || "#1e293b";
  const donemAccent = donemBilgi.accent || "#64748b";

  const handleCevap = useCallback((bildi) => {
    if (!cevrildi) return;
    if (bildi) setBildiList(p => [...p, kartlar[index]]);
    else setBilmediList(p => [...p, kartlar[index]]);
    if (index + 1 >= kartlar.length) setBitti(true);
    else { setCevrildi(false); setIndex(i => i + 1); }
  }, [cevrildi, index, kartlar]);

  if (bitti) {
    return <SonucEkrani toplam={kartlar.length} bildiSayisi={bildiList.length} bilmediSayisi={bilmediList.length}
      bilmediList={bilmediList} onExit={onExit} modLabel="Klasik Quiz" />;
  }
  if (!kart) return null;
  const turRenk = turRenkleri[kart.eser.tur] || turRenkleri.default;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, minHeight: "100vh", background: "linear-gradient(to bottom, #020617, #0f172a)", color: "#fff", display: "flex", flexDirection: "column", zIndex: 9999 }}>
      <QuizBar index={index} toplam={kartlar.length} bildi={bildiList.length} bilmedi={bilmediList.length}
        donemColor={donemColor} donemAccent={donemAccent} onExit={onExit} modLabel="KLASİK" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div onClick={() => setCevrildi(!cevrildi)} style={{ perspective: "1000px", cursor: "pointer", width: "100%", maxWidth: "400px", height: "280px" }}>
          <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform 0.5s ease", transform: cevrildi ? "rotateY(180deg)" : "rotateY(0deg)" }}>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: "12px", background: "linear-gradient(145deg, #1e293b, #0f172a)", border: `1px solid ${donemAccent}30`, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: `0 4px 20px ${donemAccent}15` }}>
              <div></div>
              <div style={{ textAlign: "center" }}>
                <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 8px 0", fontFamily: "Georgia, serif" }}>
                  {kart.eser.ad}
                </h2>
                <p style={{ fontSize: "12px", fontFamily: "monospace", color: "#94a3b8", margin: 0 }}>
                  <span style={{ background: `${turRenk}30`, padding: "4px 8px", borderRadius: "4px", marginRight: "8px" }}>
                    {kart.eser.tur}
                  </span>
                </p>
              </div>
              <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#64748b", textAlign: "center" }}>
                Tıkla
              </div>
            </div>
            <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: "12px", background: "linear-gradient(145deg, #0f172a, #1e293b)", border: `1px solid ${donemAccent}40`, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: `0 4px 20px ${donemAccent}15` }}>
              <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#64748b", letterSpacing: "0.08em" }}>
                {kart.yazar.dogum}
              </div>
              <div style={{ textAlign: "center" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 6px 0", fontFamily: "Georgia, serif" }}>
                  {kart.yazar.ad}
                </h3>
                <p style={{ fontSize: "10px", fontFamily: "monospace", color: "#94a3b8", margin: 0 }}>
                  {kart.yazar.ozellik}
                </p>
              </div>
              <div></div>
            </div>
          </div>
        </div>

        <div style={{ height: "48px", marginTop: "32px", display: "flex", gap: "12px" }}>
          {cevrildi && (
            <>
              <button onClick={() => handleCevap(true)} style={{ padding: "12px 24px", background: "#10b981", border: "none", borderRadius: "6px", color: "#fff", fontWeight: "700", cursor: "pointer", fontFamily: "monospace", fontSize: "12px" }}>
                <IconCheck /> Bildim
              </button>
              <button onClick={() => handleCevap(false)} style={{ padding: "12px 24px", background: "#ef4444", border: "none", borderRadius: "6px", color: "#fff", fontWeight: "700", cursor: "pointer", fontFamily: "monospace", fontSize: "12px" }}>
                <IconX /> Bilmedim
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Şıklı Quiz ──────────────────────────────────────────────────── */
function SikliQuizScreen({ kartlar, tumKartlar, onExit }) {
  const [index, setIndex] = useState(0);
  const [secilen, setSecilen] = useState(null);
  const [dogruSayisi, setDogruSayisi] = useState(0);
  const [yanlisList, setYanlisList] = useState([]);
  const [bitti, setBitti] = useState(false);

  const kart = kartlar[index];
  const donemBilgi = data[kart?.donem] || {};
  const donemColor = donemBilgi.color || "#1e293b";
  const donemAccent = donemBilgi.accent || "#64748b";

  const siklar = useMemo(() => {
    if (!kart) return [];
    return generateSiklar(kart, tumKartlar);
  }, [index, kart, tumKartlar]);

  const handleSec = (sikIndex) => {
    if (secilen !== null) return;
    const dogru = siklar[sikIndex].dogru;
    setSecilen(sikIndex);
    if (dogru) setDogruSayisi(s => s + 1);
    else setYanlisList(p => [...p, kart]);
  };

  const handleSonraki = () => {
    if (index + 1 >= kartlar.length) setBitti(true);
    else { setIndex(i => i + 1); setSecilen(null); }
  };

  if (bitti) {
    return <SonucEkrani toplam={kartlar.length} bildiSayisi={dogruSayisi} bilmediSayisi={yanlisList.length}
      bilmediList={yanlisList} onExit={onExit} modLabel="Şıklı Quiz" />;
  }
  if (!kart) return null;

  return (
    <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, minHeight: "100vh", background: "linear-gradient(to bottom, #020617, #0f172a)", color: "#fff", display: "flex", flexDirection: "column", zIndex: 9999 }}>
      <QuizBar index={index} toplam={kartlar.length} bildi={dogruSayisi} bilmedi={yanlisList.length}
        donemColor={donemColor} donemAccent={donemAccent} onExit={onExit} modLabel="ŞIKLI" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px 120px 24px", position: "relative" }}>
        <div style={{ width: "100%", maxWidth: "520px" }}>

          {/* Soru */}
          <div style={{
            borderRadius: "16px",
            background: `linear-gradient(145deg, ${donemColor}99, #0f172a)`,
            border: `1px solid ${donemAccent}40`,
            padding: "28px",
            marginBottom: "20px",
          }}>
            <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#64748b", marginBottom: "12px", letterSpacing: "0.08em" }}>
              BU ESERIN YAZARI KİMDİR?
            </p>
            <div style={{ textAlign: "center" }}>
              <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 8px 0", fontFamily: "Georgia, serif" }}>
                {kart.eser.ad}
              </h2>
              <p style={{ fontSize: "12px", fontFamily: "monospace", color: "#94a3b8", margin: 0 }}>
                <span style={{ background: `${donemAccent}30`, padding: "4px 8px", borderRadius: "4px", marginRight: "8px" }}>
                  {kart.eser.tur}
                </span>
                {kart.eser.yil && <span>{kart.eser.yil}</span>}
              </p>
            </div>
          </div>

          {/* Şıklar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "48px" }}>
            {siklar.map((sik, i) => {
              const secildi = secilen === i;
              const dogru = sik.dogru;
              const goster = secilen !== null && secildi;
              return (
                <button key={i} onClick={() => handleSec(i)} disabled={secilen !== null}
                  style={{
                    padding: "12px 16px", borderRadius: "8px", border: "1px solid #334155",
                    background: goster ? (dogru ? "#10b98130" : "#ef444430") : "transparent",
                    color: goster ? (dogru ? "#10b981" : "#ef4444") : "#94a3b8",
                    fontFamily: "monospace", fontSize: "12px", cursor: secilen === null ? "pointer" : "default",
                    display: "flex", alignItems: "center", gap: "8px", fontWeight: "600",
                  }}>
                  {goster && (dogru ? <IconCheck /> : <IconX />)}
                  {sik.ad}
                </button>
              );
            })}
          </div>

          {/* Sonraki Butonu - Placeholder */}
          <div style={{ height: "48px" }} />
        </div>

        {/* Sonraki Butonu - Sabit Konumda */}
        <div style={{ position: "absolute", bottom: "24px", left: "50%", transform: "translateX(-50%)", width: "calc(100% - 48px)", maxWidth: "520px" }}>
          <button onClick={handleSonraki} disabled={secilen === null}
            style={{
              padding: "12px 24px", background: secilen !== null ? "#c8922a" : "#64748b40",
              border: "none", borderRadius: "6px", color: secilen !== null ? "#000" : "#64748b",
              fontWeight: "700", cursor: secilen !== null ? "pointer" : "default",
              fontFamily: "monospace", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              opacity: secilen !== null ? 1 : 0.5, width: "100%",
            }}>
            <IconArrowRight /> Sonraki
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Flip Kart (ana sayfa) ───────────────────────────────────────── */
function FlipKart({ yazar, eser, donemColor, donemAccent }) {
  const [cevrildi, setCevrildi] = useState(false);
  const [displayedYazar, setDisplayedYazar] = useState(yazar);
  const turRenk = turRenkleri[eser.tur] || turRenkleri.default;
  
  // Yeni karta geçince cevrildi ve displayedYazar'u sıfırla
  React.useEffect(() => {
    setCevrildi(false);
    setDisplayedYazar(yazar);
  }, [yazar]);
  
  const handleFlip = () => {
    if (!cevrildi) {
      // Kartı çevirirken arka yüzü 150ms sonra güncelle
      setTimeout(() => {
        setDisplayedYazar(yazar);
      }, 150);
    }
    setCevrildi(!cevrildi);
  };

  return (
    <div onClick={handleFlip} style={{ perspective: "1000px", cursor: "pointer", height: "220px" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform 0.5s ease", transform: cevrildi ? "rotateY(180deg)" : "rotateY(0deg)" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: "12px", background: "linear-gradient(145deg, #1e293b, #0f172a)", border: `1px solid ${donemAccent}30`, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: `0 4px 20px ${donemAccent}15` }}>
          <div></div>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 6px 0", fontFamily: "Georgia, serif" }}>
              {eser.ad}
            </h3>
            <p style={{ fontSize: "10px", fontFamily: "monospace", color: "#94a3b8", margin: 0 }}>
              <span style={{ background: `${turRenk}30`, padding: "2px 6px", borderRadius: "3px", marginRight: "6px" }}>
                {eser.tur}
              </span>
            </p>
          </div>
          <div style={{ fontSize: "10px", fontFamily: "monospace", color: "#64748b", textAlign: "center" }}>
            Tıkla
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: "12px", background: "linear-gradient(145deg, #0f172a, #1e293b)", border: `1px solid ${donemAccent}40`, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: `0 4px 20px ${donemAccent}15` }}>
          <div style={{ fontFamily: "monospace", fontSize: "9px", color: "#64748b", letterSpacing: "0.08em" }}>
            {displayedYazar.dogum}
          </div>
          <div style={{ textAlign: "center" }}>
            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 6px 0", fontFamily: "Georgia, serif" }}>
              {displayedYazar.ad}
            </h3>
            <p style={{ fontSize: "10px", fontFamily: "monospace", color: "#94a3b8", margin: 0 }}>
              {displayedYazar.ozellik}
            </p>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

/* ─── Button Base Style ──────────────────────────────────────────── */
const btnBase = {
  padding: "6px 12px",
  fontSize: "11px",
  fontFamily: "monospace",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "600",
};

/* ─── Ana App ────────────────────────────────────────────────────── */
export default function App() {
  const [quizModu, setQuizModu] = useState(null);
  const [quizKartlar, setQuizKartlar] = useState(null);
  const [quizKey, setQuizKey] = useState(0);
  const [aktifDonem, setAktifDonem] = useState("İslamiyet Öncesi & Geçiş");
  const [aktifTur, setAktifTur] = useState("Tümü");
  const [sadeceSık, setSadeceSık] = useState(false);
  const [aramaMetni, setAramaMetni] = useState("");
  const [shuffled, setShuffled] = useState(false);

  // Tüm dönemlerden kartları çıkar
  const tumKartlar = useMemo(() => {
    return Object.entries(data).flatMap(([donem, donemData]) => 
      (donemData.yazarlar || []).flatMap(yazar => 
        (yazar.eserler || []).map(eser => ({
          yazar: { ad: yazar.ad, dogum: yazar.dogum, ozellik: yazar.ozellik },
          eser: { ad: eser.ad, tur: eser.tur, yil: eser.yil, aciklama: eser.aciklama },
          donem: donem,
          osymSik: eser.osymYil === "ÖSYM Sık"
        }))
      )
    );
  }, []);

  const donemBilgi = data[aktifDonem] || {};

  // Seçili dönemden kartları çıkar
  let kartlar = useMemo(() => {
    return (donemBilgi.yazarlar || []).flatMap(yazar => 
      (yazar.eserler || []).map(eser => ({
        yazar: { ad: yazar.ad, dogum: yazar.dogum, ozellik: yazar.ozellik },
        eser: { ad: eser.ad, tur: eser.tur, yil: eser.yil, aciklama: eser.aciklama },
        donem: aktifDonem,
        osymSik: eser.osymYil === "ÖSYM Sık"
      }))
    );
  }, [aktifDonem, donemBilgi]);

  if (aktifTur !== "Tümü") kartlar = kartlar.filter(k => k.eser.tur === aktifTur);
  if (aramaMetni) kartlar = kartlar.filter(k => k.eser.ad.toLowerCase().includes(aramaMetni.toLowerCase()) || k.yazar.ad.toLowerCase().includes(aramaMetni.toLowerCase()));
  if (sadeceSık) kartlar = kartlar.filter(k => k.osymSik);

  const shuffledKartlar = useMemo(() => shuffled ? shuffle(kartlar) : kartlar, [shuffled, kartlar]);
  const toplamKart = tumKartlar.length;

  const handleStartQuiz = useCallback((kaynakKartlar, mod) => {
    setQuizModu(mod);
    setQuizKartlar(shuffle(kaynakKartlar));
    setQuizKey(k => k + 1);
  }, []);

  const handleExitQuiz = (tip, bilmediList) => {
    if (tip === "tekrar" && bilmediList && bilmediList.length > 0) {
      handleStartQuiz(bilmediList, quizModu);
      setQuizKey(k => k + 1);
    } else {
      setQuizModu(null);
      setQuizKartlar(null);
      setQuizKey(k => k + 1);
    }
  };

  return (
    <div style={{ background: "#020617", color: "#fff", minHeight: "100vh" }}>
      {/* Başlık */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "32px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.15em", color: "#64748b", marginBottom: "12px", textTransform: "uppercase" }}>
            Türk Edebiyatı · AYT/YKS Hazırlık
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: "900", background: "linear-gradient(to right,#fff,#cbd5e1,#94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "Georgia,serif", margin: "0 0 8px 0" }}>
            Yazar & Eser Kartları
          </h1>
          <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#64748b" }}>
            {toplamKart} kart · Önde eser → arkada yazar · Tıklayarak çevirin
          </p>
        </div>
      </div>

      {/* Dönem Seçimi */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {Object.keys(data).map(donem => (
            <button key={donem} onClick={() => { setAktifDonem(donem); setAramaMetni(""); setAktifTur("Tümü"); setSadeceSık(false); setShuffled(false); }}
              style={{ ...btnBase, background: aktifDonem === donem ? "#c8922a" : "#334155", border: `1px solid ${aktifDonem === donem ? "#d4a574" : "#475569"}`, color: aktifDonem === donem ? "#000" : "#cbd5e1" }}>
              {donem}
            </button>
          ))}
        </div>
      </div>

      {/* Filtreler */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
          {/* Arama */}
          <div style={{ marginBottom: "12px", display: "flex", gap: "8px", alignItems: "center" }}>
            <IconSearch />
            <input type="text" placeholder="Yazar veya eser ara..." value={aramaMetni} onChange={e => setAramaMetni(e.target.value)}
              style={{ flex: 1, background: "#1e293b", border: "1px solid #334155", borderRadius: "6px", padding: "8px 12px", color: "#fff", fontFamily: "monospace", fontSize: "12px" }} />
          </div>

          {/* Tür Filtreleri */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            <button onClick={() => setAktifTur("Tümü")} style={{ ...btnBase, background: aktifTur === "Tümü" ? "#c8922a" : "transparent", border: `1px solid ${aktifTur === "Tümü" ? "#d4a574" : "#334155"}`, color: aktifTur === "Tümü" ? "#000" : "#94a3b8" }}>
              Tümü ({kartlar.length})
            </button>
            {Array.from(new Set(kartlar.map(k => k.eser.tur))).sort().map(tur => {
              const turKartSayisi = kartlar.filter(k => k.eser.tur === tur).length;
              if (turKartSayisi === 0) return null;
              return (
                <button key={tur} onClick={() => setAktifTur(tur)} style={{ ...btnBase, background: aktifTur === tur ? "#c8922a" : "transparent", border: `1px solid ${aktifTur === tur ? "#d4a574" : "#334155"}`, color: aktifTur === tur ? "#000" : "#94a3b8" }}>
                  {tur} ({turKartSayisi})
                </button>
              );
            })}
            <button onClick={() => setSadeceSık(!sadeceSık)} style={{ ...btnBase, background: sadeceSık ? "#c8922a" : "transparent", border: `1px solid ${sadeceSık ? "#d4a574" : "#334155"}`, color: sadeceSık ? "#000" : "#94a3b8" }}>
              ⭐ ÖSYM Sık
            </button>
          </div>
        </div>
      </div>

      {/* Quiz Başlat */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <button onClick={() => handleStartQuiz(kartlar, "klasik")}
            style={{ ...btnBase, background: "#3b82f6", border: "1px solid #60a5fa", color: "#fff" }}>
            <IconPlay /> Klasik Quiz ({kartlar.length})
          </button>
          <button onClick={() => handleStartQuiz(tumKartlar, "klasik")}
            style={{ ...btnBase, background: "#c8922a", border: "1px solid #d4a574", color: "#000" }}>
            <IconZap /> Tümü Klasik ({tumKartlar.length})
          </button>
          <button onClick={() => handleStartQuiz(shuffle(kartlar), "sikli")}
            style={{ ...btnBase, background: "#8b5cf6", border: "1px solid #a78bfa", color: "#fff" }}>
            <IconShuffle /> Şıklı Quiz ({kartlar.length})
          </button>
          <button onClick={() => handleStartQuiz(shuffle(tumKartlar), "sikli")}
            style={{ ...btnBase, background: "#06b6d4", border: "1px solid #22d3ee", color: "#000" }}>
            <IconList /> Tümü Şıklı ({tumKartlar.length})
          </button>
          <div style={{ marginLeft: "auto" }} />
          <button onClick={() => setShuffled(!shuffled)}
            style={{ ...btnBase, background: shuffled ? "#10b981" : "#64748b", border: shuffled ? "1px solid #34d399" : "1px solid #94a3b8", color: "#fff" }}>
            <IconShuffle /> {shuffled ? "Gruplandır" : "Karıştır"}
          </button>
        </div>
      </div>

      {quizModu === "klasik" && (
        <KlasikQuizScreen key={quizKey} kartlar={quizKartlar} onExit={handleExitQuiz} />
      )}
      {quizModu === "sikli" && (
        <SikliQuizScreen key={quizKey} kartlar={quizKartlar} tumKartlar={tumKartlar} onExit={handleExitQuiz} />
      )}

      {!quizModu && (
        <div style={{ maxWidth: "1152px", margin: "0 auto", padding: "24px" }}>
          {!shuffled ? (
            // Yazar başlıkları ile gruplandırılmış görünüm
            <div>
              {(donemBilgi.yazarlar || []).map((yazar, yi) => {
                const yazarKartlari = kartlar.filter(k => k.yazar.ad === yazar.ad);
                if (yazarKartlari.length === 0) return null;
                return (
                  <div key={yi} style={{ marginBottom: "32px" }}>
                    <div style={{ marginBottom: "16px", paddingBottom: "12px", borderBottom: "1px solid #1e293b" }}>
                      <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 4px 0", fontFamily: "Georgia, serif" }}>
                        {yazar.ad}
                      </h3>
                      <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#64748b", margin: 0 }}>
                        {yazar.dogum} · {yazarKartlari.length} eser
                      </p>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
                      {yazarKartlari.map((k, i) => (
                        <FlipKart key={i} yazar={k.yazar} eser={k.eser} donemColor={donemBilgi.color} donemAccent={donemBilgi.accent} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            // Karıştırılmış görünüm - sadece kartlar
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "16px" }}>
              {shuffledKartlar.map((k, i) => (
                <FlipKart key={i} yazar={k.yazar} eser={k.eser} donemColor={donemBilgi.color} donemAccent={donemBilgi.accent} />
              ))}
            </div>
          )}
        </div>
      )}

      <div style={{ borderTop: "1px solid #1e293b", padding: "24px", textAlign: "center" }}>
        <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#334155" }}>
          Kaynak: kopilotrehberlik.com · edebiyatfatihi.com · ozeldersalani.com · sorumatik.co
        </p>
      </div>
    </div>
  );
}
