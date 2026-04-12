import { useState, useMemo, useCallback } from "react";
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

/* Bir kart için 4 şık üret: doğru eser + aynı dönemden 3 yanlış eser */
function generateSiklar(kart, tumKartlar) {
  const dogru = kart.eser.ad;
  const havuz = tumKartlar
    .filter((k) => k.donem === kart.donem && k.eser.ad !== dogru)
    .map((k) => k.eser.ad);
  const yedek = tumKartlar
    .filter((k) => k.eser.ad !== dogru && !havuz.includes(k.eser.ad))
    .map((k) => k.eser.ad);
  const birlesik = shuffle([...new Set([...havuz, ...yedek])]);
  const yanlisSiklar = birlesik.slice(0, 3);
  return shuffle([
    { ad: dogru, dogru: true },
    ...yanlisSiklar.map((ad) => ({ ad, dogru: false })),
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
  const oran = Math.round((bildiSayisi / toplam) * 100);
  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(to bottom, #020617, #0f172a)",
      color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        <div style={{ fontSize: "56px", marginBottom: "16px" }}>
          {oran >= 80 ? "🎯" : oran >= 50 ? "📚" : "💪"}
        </div>
        <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#64748b", marginBottom: "4px", letterSpacing: "0.1em", textTransform: "uppercase" }}>
          {modLabel}
        </p>
        <h2 style={{ fontSize: "28px", fontWeight: "900", marginBottom: "8px", fontFamily: "Georgia, serif" }}>
          Quiz Bitti!
        </h2>
        <p style={{ fontFamily: "monospace", fontSize: "13px", color: "#94a3b8", marginBottom: "32px" }}>
          {toplam} sorudan {bildiSayisi} doğru · %{oran}
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>
          <div style={{ background: "#16a34a20", border: "1px solid #16a34a40", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "32px", fontWeight: "900", color: "#4ade80" }}>{bildiSayisi}</div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#86efac" }}>Doğru</div>
          </div>
          <div style={{ background: "#dc262620", border: "1px solid #dc262640", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontSize: "32px", fontWeight: "900", color: "#f87171" }}>{bilmediSayisi}</div>
            <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#fca5a5" }}>Yanlış</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {bilmediSayisi > 0 && (
            <button
              onClick={() => onExit("tekrar", bilmediList)}
              style={{
                padding: "14px", borderRadius: "10px", fontFamily: "monospace",
                fontWeight: "700", fontSize: "13px", cursor: "pointer",
                background: "#dc262620", border: "1px solid #dc262660", color: "#f87171",
              }}
            >
              Yanlışları Tekrar Çöz ({bilmediSayisi})
            </button>
          )}
          <button
            onClick={() => onExit("cikis")}
            style={{
              padding: "14px", borderRadius: "10px", fontFamily: "monospace",
              fontWeight: "700", fontSize: "13px", cursor: "pointer",
              background: "#1e293b", border: "1px solid #334155", color: "#94a3b8",
            }}
          >
            Ana Sayfaya Dön
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Üst Bar (quiz modları ortak) ────────────────────────────────── */
function QuizBar({ index, toplam, bildi, bilmedi, donemColor, donemAccent, onExit, modLabel }) {
  return (
    <>
      <div style={{
        borderBottom: "1px solid #1e293b", padding: "14px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        maxWidth: "640px", margin: "0 auto", width: "100%",
      }}>
        <button
          onClick={() => onExit("cikis")}
          style={{
            display: "flex", alignItems: "center", gap: "6px",
            background: "none", border: "1px solid #334155",
            color: "#94a3b8", padding: "6px 12px", borderRadius: "8px",
            fontFamily: "monospace", fontSize: "12px", cursor: "pointer",
          }}
        >
          <IconArrowLeft /> Çık
        </button>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "monospace", fontSize: "11px", color: "#475569", letterSpacing: "0.05em" }}>{modLabel}</div>
          <div style={{ fontFamily: "monospace", fontSize: "13px", color: "#94a3b8" }}>{index + 1} / {toplam}</div>
        </div>
        <span style={{ fontFamily: "monospace", fontSize: "12px" }}>
          <span style={{ color: "#4ade80" }}>✓ {bildi}</span>{"  "}
          <span style={{ color: "#f87171" }}>✗ {bilmedi}</span>
        </span>
      </div>
      <div style={{ background: "#1e293b", height: "4px" }}>
        <div style={{
          height: "100%", width: `${(index / toplam) * 100}%`,
          background: `linear-gradient(to right, ${donemColor}, ${donemAccent})`,
          transition: "width 0.3s ease",
        }} />
      </div>
    </>
  );
}

/* ─── Klasik Quiz (kartı çevir → bildim/bilmedim) ─────────────────── */
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
    else { setIndex(i => i + 1); setCevrildi(false); }
  }, [cevrildi, index, kartlar]);

  if (bitti) {
    return (
      <SonucEkrani
        toplam={kartlar.length}
        bildiSayisi={bildiList.length}
        bilmediSayisi={bilmediList.length}
        bilmediList={bilmediList}
        onExit={onExit}
        modLabel="Klasik Quiz"
      />
    );
  }
  if (!kart) return null;
  const turRenk = turRenkleri[kart.eser.tur] || turRenkleri.default;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #020617, #0f172a)", color: "#fff", display: "flex", flexDirection: "column" }}>
      <QuizBar index={index} toplam={kartlar.length} bildi={bildiList.length} bilmedi={bilmediList.length}
        donemColor={donemColor} donemAccent={donemAccent} onExit={onExit} modLabel="KLASİK" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
        <div onClick={() => setCevrildi(!cevrildi)} style={{ width: "100%", maxWidth: "480px", height: "280px", perspective: "1000px", cursor: "pointer" }}>
          <div style={{
            position: "relative", width: "100%", height: "100%",
            transformStyle: "preserve-3d", transition: "transform 0.5s ease",
            transform: cevrildi ? "rotateY(180deg)" : "rotateY(0deg)",
          }}>
            <div style={{
              position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
              borderRadius: "16px", background: "linear-gradient(145deg, #1e293b, #0f172a)",
              border: `1px solid ${donemAccent}30`, padding: "28px",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <span style={{ fontSize: "10px", fontFamily: "monospace", padding: "3px 8px", borderRadius: "20px", background: turRenk + "20", color: turRenk, border: `1px solid ${turRenk}40`, fontWeight: "bold" }}>{kart.eser.tur}</span>
                  {kart.eser.yil && <span style={{ fontSize: "11px", fontFamily: "monospace", color: "#64748b" }}>{kart.eser.yil}</span>}
                </div>
                <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#64748b", marginBottom: "8px" }}>Bu eserin yazarı kim?</p>
                <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#f1f5f9", fontFamily: "Georgia, serif", lineHeight: "1.3", margin: 0 }}>{kart.eser.ad}</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#334155" }}>
                <IconRotate /><span style={{ fontSize: "11px", fontFamily: "monospace" }}>Cevabı görmek için tıkla</span>
              </div>
            </div>
            <div style={{
              position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)", borderRadius: "16px",
              background: `linear-gradient(145deg, ${donemColor}cc, #0f172a)`,
              border: `1px solid ${donemAccent}50`, padding: "28px",
              display: "flex", flexDirection: "column", justifyContent: "space-between",
            }}>
              <div>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: `linear-gradient(135deg, ${donemColor}, ${donemAccent})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "18px", color: "#fff", marginBottom: "12px" }}>
                  {kart.yazar.ad[0]}
                </div>
                <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 4px 0" }}>{kart.yazar.ad}</h2>
                <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#94a3b8", margin: "0 0 12px 0" }}>{kart.yazar.dogum}</p>
                {kart.eser.aciklama && (
                  <p style={{ fontSize: "11px", color: "#cbd5e1", lineHeight: "1.6", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", margin: 0 }}>
                    {kart.eser.aciklama}
                  </p>
                )}
              </div>
              <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#475569", margin: 0 }}>Bildin mi?</p>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "16px", marginTop: "24px", width: "100%", maxWidth: "480px" }}>
          <button onClick={() => handleCevap(false)} disabled={!cevrildi}
            style={{ flex: 1, padding: "14px", borderRadius: "12px", fontFamily: "monospace", fontWeight: "700", fontSize: "13px", cursor: cevrildi ? "pointer" : "not-allowed", background: cevrildi ? "#dc262620" : "#0f172a", border: `1px solid ${cevrildi ? "#dc2626" : "#1e293b"}`, color: cevrildi ? "#f87171" : "#334155", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <IconX /> Bilmedim
          </button>
          <button onClick={() => handleCevap(true)} disabled={!cevrildi}
            style={{ flex: 1, padding: "14px", borderRadius: "12px", fontFamily: "monospace", fontWeight: "700", fontSize: "13px", cursor: cevrildi ? "pointer" : "not-allowed", background: cevrildi ? "#16a34a20" : "#0f172a", border: `1px solid ${cevrildi ? "#16a34a" : "#1e293b"}`, color: cevrildi ? "#4ade80" : "#334155", transition: "all 0.2s", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
            <IconCheck /> Bildim
          </button>
        </div>
        {!cevrildi && (
          <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#334155", marginTop: "12px" }}>
            Cevabı görmeden değerlendirme yapamazsın
          </p>
        )}
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

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
    return (
      <SonucEkrani
        toplam={kartlar.length}
        bildiSayisi={dogruSayisi}
        bilmediSayisi={yanlisList.length}
        bilmediList={yanlisList}
        onExit={onExit}
        modLabel="Şıklı Quiz"
      />
    );
  }
  if (!kart) return null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #020617, #0f172a)", color: "#fff", display: "flex", flexDirection: "column" }}>
      <QuizBar index={index} toplam={kartlar.length} bildi={dogruSayisi} bilmedi={yanlisList.length}
        donemColor={donemColor} donemAccent={donemAccent} onExit={onExit} modLabel="ŞIKLI" />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "32px 24px" }}>
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
              BU YAZARA AİT ESER HANGİSİDİR?
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{
                width: "48px", height: "48px", borderRadius: "50%", flexShrink: 0,
                background: `linear-gradient(135deg, ${donemColor}, ${donemAccent})`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontWeight: "bold", fontSize: "20px", color: "#fff",
              }}>
                {kart.yazar.ad[0]}
              </div>
              <div>
                <h2 style={{ fontSize: "22px", fontWeight: "700", color: "#f1f5f9", margin: "0 0 4px 0", fontFamily: "Georgia, serif" }}>
                  {kart.yazar.ad}
                </h2>
                <p style={{ fontSize: "11px", fontFamily: "monospace", color: "#94a3b8", margin: 0 }}>
                  {kart.yazar.dogum} · {kart.donem}
                </p>
              </div>
            </div>
          </div>

          {/* Şıklar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {siklar.map((sik, i) => {
              const secilenBu = secilen === i;
              const secilenVar = secilen !== null;
              const dogruBu = sik.dogru;

              let borderColor = "#334155";
              let bgColor = "transparent";
              let textColor = "#cbd5e1";

              if (secilenVar) {
                if (dogruBu) {
                  borderColor = "#16a34a";
                  bgColor = "#16a34a18";
                  textColor = "#4ade80";
                } else if (secilenBu) {
                  borderColor = "#dc2626";
                  bgColor = "#dc262618";
                  textColor = "#f87171";
                } else {
                  borderColor = "#1e293b";
                  textColor = "#475569";
                }
              }

              const harf = ["A", "B", "C", "D"][i];

              return (
                <button
                  key={i}
                  onClick={() => handleSec(i)}
                  disabled={secilenVar}
                  style={{
                    width: "100%", padding: "14px 16px", borderRadius: "10px",
                    border: `1.5px solid ${borderColor}`,
                    background: bgColor, color: textColor,
                    fontFamily: "monospace", fontSize: "13px", fontWeight: "600",
                    cursor: secilenVar ? "default" : "pointer",
                    textAlign: "left", display: "flex", alignItems: "center", gap: "12px",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={e => { if (!secilenVar) e.currentTarget.style.borderColor = donemAccent; }}
                  onMouseLeave={e => { if (!secilenVar) e.currentTarget.style.borderColor = "#334155"; }}
                >
                  <span style={{
                    width: "24px", height: "24px", borderRadius: "6px", flexShrink: 0,
                    border: `1.5px solid ${borderColor}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "11px", fontWeight: "700",
                    background: secilenVar && dogruBu ? "#16a34a30" : secilenVar && secilenBu ? "#dc262630" : "transparent",
                  }}>
                    {secilenVar && dogruBu ? "✓" : secilenVar && secilenBu ? "✗" : harf}
                  </span>
                  {sik.ad}
                </button>
              );
            })}
          </div>

          {/* Sonraki */}
          {secilen !== null && (
            <button
              onClick={handleSonraki}
              style={{
                width: "100%", marginTop: "16px", padding: "14px",
                borderRadius: "10px", fontFamily: "monospace",
                fontWeight: "700", fontSize: "13px", cursor: "pointer",
                background: donemAccent + "25", border: `1px solid ${donemAccent}`,
                color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}
            >
              {index + 1 >= kartlar.length ? "Sonuçları Gör" : "Sonraki Soru"} <IconArrowRight />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Flip Kart (ana sayfa) ───────────────────────────────────────── */
function FlipKart({ yazar, eser, donemColor, donemAccent }) {
  const [cevrildi, setCevrildi] = useState(false);
  const turRenk = turRenkleri[eser.tur] || turRenkleri.default;
  return (
    <div onClick={() => setCevrildi(!cevrildi)} style={{ perspective: "1000px", cursor: "pointer", height: "220px" }}>
      <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d", transition: "transform 0.5s ease", transform: cevrildi ? "rotateY(180deg)" : "rotateY(0deg)" }}>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: "12px", background: "linear-gradient(145deg, #1e293b, #0f172a)", border: `1px solid ${donemAccent}30`, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: `0 4px 20px ${donemAccent}15` }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
              <span style={{ fontSize: "10px", fontFamily: "monospace", padding: "3px 8px", borderRadius: "20px", background: turRenk + "20", color: turRenk, border: `1px solid ${turRenk}40`, fontWeight: "bold" }}>{eser.tur}</span>
              {eser.yil && <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#64748b" }}>{eser.yil}</span>}
            </div>
            <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#f1f5f9", lineHeight: "1.4", margin: "0 0 8px 0", fontFamily: "Georgia, serif" }}>{eser.ad}</h3>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            {eser.osymYil && eser.osymYil !== "ÖSYM Sık" ? (
              <span style={{ fontSize: "9px", fontFamily: "monospace", color: "#c8922a", background: "#c8922a15", border: "1px solid #c8922a30", padding: "2px 6px", borderRadius: "10px", fontWeight: "bold" }}>★ {eser.osymYil}</span>
            ) : eser.osymYil === "ÖSYM Sık" ? (
              <span style={{ fontSize: "9px", fontFamily: "monospace", color: "#c8922a", background: "#c8922a15", border: "1px solid #c8922a30", padding: "2px 6px", borderRadius: "10px" }}>★ Sık</span>
            ) : <span />}
            <span style={{ fontSize: "9px", fontFamily: "monospace", color: "#475569" }}>çevir →</span>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", transform: "rotateY(180deg)", borderRadius: "12px", background: `linear-gradient(145deg, ${donemColor}cc, #0f172a)`, border: `1px solid ${donemAccent}50`, padding: "20px", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: `0 4px 20px ${donemAccent}25` }}>
          <div>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: `linear-gradient(135deg, ${donemColor}, ${donemAccent})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "15px", color: "#fff", marginBottom: "10px" }}>{yazar.ad[0]}</div>
            <p style={{ fontWeight: "700", fontSize: "15px", color: "#f1f5f9", margin: "0 0 4px 0" }}>{yazar.ad}</p>
            <p style={{ fontSize: "10px", fontFamily: "monospace", color: "#94a3b8", margin: "0 0 10px 0" }}>{yazar.dogum}</p>
            {eser.aciklama && (
              <p style={{ fontSize: "11px", color: "#cbd5e1", lineHeight: "1.6", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical", margin: 0 }}>{eser.aciklama}</p>
            )}
          </div>
          <span style={{ fontSize: "9px", fontFamily: "monospace", color: "#475569", alignSelf: "flex-end" }}>← geri</span>
        </div>
      </div>
    </div>
  );
}

/* ─── Ana Sayfa ───────────────────────────────────────────────────── */
export default function Home() {
  const [aktifDonem, setAktifDonem] = useState(Object.keys(data)[0]);
  const [aramaMetni, setAramaMetni] = useState("");
  const [aktifTur, setAktifTur] = useState("Tümü");
  const [sadeceSık, setSadeceSık] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [quizModu, setQuizModu] = useState(null);
  const [quizKartlar, setQuizKartlar] = useState(null);
  const [quizKey, setQuizKey] = useState(0); // ← tekrar çöz fix

  const donemBilgi = data[aktifDonem];

  const tumTurler = useMemo(() => {
    const turler = new Set(["Tümü"]);
    Object.values(data).forEach(d => d.yazarlar.forEach(y => y.eserler.forEach(e => turler.add(e.tur))));
    return Array.from(turler);
  }, []);

  const toplamKart = useMemo(() =>
    Object.values(data).reduce((t, d) => t + d.yazarlar.reduce((s, y) => s + y.eserler.length, 0), 0), []);

  const tumKartlar = useMemo(() => {
    const k = [];
    Object.entries(data).forEach(([donem, bilgi]) =>
      bilgi.yazarlar.forEach(yazar => yazar.eserler.forEach(eser => k.push({ yazar, eser, donem }))));
    return k;
  }, []);

  const kartlar = useMemo(() => {
    const filtered = [];
    donemBilgi.yazarlar.forEach(yazar => {
      yazar.eserler.forEach(eser => {
        const turUygun = aktifTur === "Tümü" || eser.tur === aktifTur;
        const aramaUygun = aramaMetni === "" ||
          yazar.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
          eser.ad.toLowerCase().includes(aramaMetni.toLowerCase());
        const sikUygun = !sadeceSık || eser.osymYil !== "ÖSYM Sık";
        if (turUygun && aramaUygun && sikUygun) filtered.push({ yazar, eser, donem: aktifDonem });
      });
    });
    return filtered;
  }, [aktifDonem, aramaMetni, aktifTur, sadeceSık, donemBilgi]);

  const shuffledKartlar = useMemo(() => shuffled ? shuffle(kartlar) : kartlar, [shuffled, kartlar]);

  const handleStartQuiz = (kaynakKartlar, mod) => {
    setQuizKartlar(shuffle(kaynakKartlar));
    setQuizModu(mod);
    setQuizKey(k => k + 1);
  };

  const handleExitQuiz = (mod, yanlisList) => {
    if (mod === "tekrar" && yanlisList?.length > 0) {
      setQuizKartlar(shuffle(yanlisList));
      setQuizKey(k => k + 1); // yeni key → QuizScreen remount → state sıfırlanır
    } else {
      setQuizModu(null);
      setQuizKartlar(null);
    }
  };

  if (quizModu === "klasik" && quizKartlar) {
    return <KlasikQuizScreen key={quizKey} kartlar={quizKartlar} onExit={handleExitQuiz} />;
  }
  if (quizModu === "sikli" && quizKartlar) {
    return <SikliQuizScreen key={quizKey} kartlar={quizKartlar} tumKartlar={tumKartlar} onExit={handleExitQuiz} />;
  }

  const btnBase = {
    display: "flex", alignItems: "center", gap: "8px",
    padding: "8px 16px", borderRadius: "8px",
    fontFamily: "monospace", fontSize: "12px", fontWeight: "700",
    cursor: "pointer", whiteSpace: "nowrap", transition: "opacity 0.15s",
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(to bottom, #020617, #0f172a, #020617)", color: "#fff" }}>
      {/* Header */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "32px 24px 28px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
          <div style={{ fontFamily: "monospace", fontSize: "10px", letterSpacing: "0.15em", color: "#64748b", marginBottom: "12px", textTransform: "uppercase" }}>
            Türk Edebiyatı · AYT/YKS Hazırlık
          </div>
          <h1 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: "900", background: "linear-gradient(to right,#fff,#cbd5e1,#94a3b8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontFamily: "Georgia,serif", margin: "0 0 8px 0" }}>
            Yazar &amp; Eser Kartları
          </h1>
          <p style={{ fontFamily: "monospace", fontSize: "12px", color: "#64748b" }}>
            {toplamKart} kart · Önde eser → arkada yazar · Tıklayarak çevirin
          </p>
        </div>
      </div>

      {/* Dönem seçimi */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
            {Object.keys(data).map(donem => {
              const aktif = aktifDonem === donem;
              return (
                <button key={donem}
                  onClick={() => { setAktifDonem(donem); setAramaMetni(""); setAktifTur("Tümü"); setSadeceSık(false); setShuffled(false); }}
                  style={{ ...btnBase, background: aktif ? data[donem].accent + "20" : "transparent", border: `1px solid ${aktif ? data[donem].accent : "#334155"}`, color: aktif ? "#fff" : "#94a3b8" }}>
                  {donem}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ position: "relative" }}>
            <div style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#64748b" }}><IconSearch /></div>
            <input type="text" placeholder="Yazar veya eser ara..." value={aramaMetni} onChange={e => setAramaMetni(e.target.value)}
              style={{ width: "100%", background: "rgba(15,23,42,0.8)", border: "1px solid #334155", borderRadius: "8px", paddingLeft: "40px", paddingRight: "16px", paddingTop: "8px", paddingBottom: "8px", fontSize: "13px", fontFamily: "monospace", color: "#fff", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {tumTurler.map(tur => {
              const aktif = aktifTur === tur;
              const renk = turRenkleri[tur] || donemBilgi.accent;
              return (
                <button key={tur} onClick={() => setAktifTur(tur)}
                  style={{ ...btnBase, padding: "4px 12px", fontSize: "11px", background: aktif ? renk + "20" : "transparent", border: `1px solid ${aktif ? renk : "#334155"}`, color: aktif ? "#fff" : "#94a3b8" }}>
                  {tur}
                </button>
              );
            })}
          </div>
          <div>
            <button onClick={() => setSadeceSık(!sadeceSık)}
              style={{ ...btnBase, padding: "4px 12px", fontSize: "11px", background: sadeceSık ? "#c8922a20" : "transparent", border: `1px solid ${sadeceSık ? "#c8922a" : "#334155"}`, color: sadeceSık ? "#fff" : "#94a3b8" }}>
              ★ Yıl Belli
            </button>
          </div>
        </div>
      </div>

      {/* Aksiyonlar */}
      <div style={{ borderBottom: "1px solid #1e293b", padding: "16px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto", display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={() => setShuffled(!shuffled)}
            style={{ ...btnBase, background: shuffled ? donemBilgi.accent + "20" : "transparent", border: `1px solid ${shuffled ? donemBilgi.accent : "#334155"}`, color: shuffled ? "#fff" : "#94a3b8" }}>
            <IconShuffle /> {shuffled ? "Karıştırıldı!" : "Karıştır"}
          </button>

          <button onClick={() => handleStartQuiz(kartlar, "klasik")}
            style={{ ...btnBase, background: "transparent", border: "1px solid rgba(168,85,247,0.5)", color: "#c084fc" }}>
            <IconPlay /> Klasik Quiz ({kartlar.length})
          </button>
          <button onClick={() => handleStartQuiz(tumKartlar, "klasik")}
            style={{ ...btnBase, background: "transparent", border: "1px solid rgba(245,158,11,0.4)", color: "#fbbf24" }}>
            <IconZap /> Tümü Klasik ({tumKartlar.length})
          </button>

          <button onClick={() => handleStartQuiz(kartlar, "sikli")}
            style={{ ...btnBase, background: "transparent", border: "1px solid rgba(56,189,248,0.5)", color: "#38bdf8" }}>
            <IconList /> Şıklı Quiz ({kartlar.length})
          </button>
          <button onClick={() => handleStartQuiz(tumKartlar, "sikli")}
            style={{ ...btnBase, background: "transparent", border: "1px solid rgba(52,211,153,0.5)", color: "#34d399" }}>
            <IconList /> Tümü Şıklı ({tumKartlar.length})
          </button>
        </div>
      </div>

      {/* Kartlar */}
      <div style={{ padding: "32px 24px" }}>
        <div style={{ maxWidth: "1152px", margin: "0 auto" }}>
          {kartlar.length === 0 ? (
            <div style={{ textAlign: "center", padding: "48px 0" }}>
              <p style={{ fontFamily: "monospace", fontSize: "13px", color: "#64748b" }}>Sonuç bulunamadı.</p>
            </div>
          ) : shuffled ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "24px" }}>
              {shuffledKartlar.map((k, i) => (
                <FlipKart key={i} yazar={k.yazar} eser={k.eser} donemColor={donemBilgi.color} donemAccent={donemBilgi.accent} />
              ))}
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
              {donemBilgi.yazarlar.map(yazar => {
                const yk = kartlar.filter(k => k.yazar.ad === yazar.ad);
                if (!yk.length) return null;
                return (
                  <div key={yazar.ad}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: `linear-gradient(135deg,${donemBilgi.color},${donemBilgi.accent})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "16px", color: "#fff", flexShrink: 0 }}>
                        {yazar.ad[0]}
                      </div>
                      <div>
                        <h3 style={{ fontWeight: "600", fontSize: "15px", color: "#f1f5f9", margin: 0 }}>{yazar.ad}</h3>
                        <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#64748b", margin: 0 }}>{yazar.dogum} · {yk.length} eser</p>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: "20px" }}>
                      {yk.map(k => (
                        <FlipKart key={k.eser.ad} yazar={k.yazar} eser={k.eser} donemColor={donemBilgi.color} donemAccent={donemBilgi.accent} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div style={{ borderTop: "1px solid #1e293b", padding: "24px", textAlign: "center" }}>
        <p style={{ fontFamily: "monospace", fontSize: "11px", color: "#334155" }}>
          Kaynak: kopilotrehberlik.com · edebiyatfatihi.com · ozeldersalani.com · sorumatik.co
        </p>
      </div>
    </div>
  );
}
