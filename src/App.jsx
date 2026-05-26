import { useState } from "react";
import { data, turRenkleri } from "./data.js";

function KartArka({ yazar, donemAccent }) {
  return (
    <div style={{
      position: "absolute", inset: 0, backfaceVisibility: "hidden",
      transform: "rotateY(180deg)",
      background: "linear-gradient(135deg,#1a1a2e 0%,#16213e 60%,#0f3460 100%)",
      borderRadius: "16px", padding: "18px",
      display: "flex", flexDirection: "column", justifyContent: "center",
      border: `2px solid ${donemAccent}40`,
    }}>
      <div style={{ fontSize: "9px", letterSpacing: "3px", color: donemAccent, fontFamily: "'Courier New',monospace", marginBottom: "5px", textTransform: "uppercase" }}>YAZAR</div>
      <div style={{ fontSize: "19px", fontWeight: "900", color: "#fff", fontFamily: "Georgia,serif", lineHeight: 1.1, marginBottom: "4px" }}>{yazar.ad}</div>
      <div style={{ fontSize: "10px", color: donemAccent, fontFamily: "'Courier New',monospace", marginBottom: "8px" }}>{yazar.dogum}</div>
      <div style={{ width: "28px", height: "2px", background: donemAccent, marginBottom: "8px" }} />
      <div style={{ fontSize: "11px", color: "#ccc", fontFamily: "Georgia,serif", fontStyle: "italic", lineHeight: 1.5 }}>{yazar.ozellik}</div>
      <div style={{ marginTop: "auto", fontSize: "10px", color: "#444", fontFamily: "'Courier New',monospace", textAlign: "right" }}>← çevir</div>
    </div>
  );
}

function KartOn({ eser, donemColor, donemAccent }) {
  const isNamed = eser.osymYil !== "ÖSYM Sık";
  return (
    <div style={{
      position: "absolute", inset: 0, backfaceVisibility: "hidden",
      background: `linear-gradient(135deg,${donemColor}ee,${donemColor}88)`,
      borderRadius: "16px", padding: "18px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      border: `1px solid ${donemAccent}60`,
    }}>
      <div>
        <div style={{ fontSize: "9px", letterSpacing: "3px", color: donemAccent, fontFamily: "'Courier New',monospace", marginBottom: "5px", textTransform: "uppercase" }}>ESER</div>
        <div style={{ fontSize: "20px", fontWeight: "900", color: "#fff", fontFamily: "Georgia,serif", lineHeight: 1.1 }}>{eser.ad}</div>
      </div>
      <div>
        <div style={{ width: "28px", height: "2px", background: donemAccent, marginBottom: "8px" }} />
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap", marginBottom: "8px" }}>
          <span style={{ background: turRenkleri[eser.tur] || turRenkleri.default, color: "#fff", padding: "2px 7px", borderRadius: "10px", fontSize: "10px" }}>{eser.tur}</span>
          <span style={{ fontSize: "10px", color: "#999", fontFamily: "'Courier New',monospace" }}>{eser.yil}</span>
        </div>
        <div style={{
          background: isNamed ? "#c8922a25" : "#ffffff10",
          border: `1px solid ${isNamed ? "#c8922a55" : "#ffffff15"}`,
          borderRadius: "7px", padding: "5px 9px",
        }}>
          <div style={{ fontSize: "9px", color: "#888", fontFamily: "'Courier New',monospace", letterSpacing: "1px" }}>ÖSYM</div>
          <div style={{ fontSize: "11px", fontWeight: "700", color: isNamed ? "#D4A574" : "#666", fontFamily: "'Courier New',monospace" }}>{eser.osymYil}</div>
        </div>
      </div>
    </div>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function Kart({ yazar, eser, donemColor, donemAccent, quizModu }) {
  const [cevrildi, setCevrildi] = useState(false);
  const [durum, setDurum] = useState(null);

  const handleCevir = () => {
    if (quizModu && !cevrildi) setCevrildi(true);
    else if (!quizModu) setCevrildi(!cevrildi);
  };

  const handleDurum = (d, e) => {
    e.stopPropagation();
    setDurum(d);
  };

  const glowColor = durum === "dogru" ? "#22c55e" : durum === "yanlis" ? "#ef4444" : donemAccent;

  return (
    <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"6px" }}>
      <div onClick={handleCevir} style={{ width:"230px", height:"200px", perspective:"1000px", cursor:"pointer", flexShrink:0 }}>
        <div style={{
          position:"relative", width:"100%", height:"100%",
          transformStyle:"preserve-3d",
          transition:"transform 0.6s cubic-bezier(0.4,0,0.2,1)",
          transform: cevrildi ? "rotateY(180deg)" : "rotateY(0deg)",
          borderRadius:"16px",
          boxShadow: durum === "dogru"
            ? "0 0 24px #22c55e80, 0 8px 24px rgba(0,0,0,0.4)"
            : durum === "yanlis"
            ? "0 0 24px #ef444480, 0 8px 24px rgba(0,0,0,0.4)"
            : cevrildi ? `0 20px 40px ${donemAccent}40` : "0 8px 24px rgba(0,0,0,0.4)",
        }}>
          <KartOn eser={eser} donemColor={donemColor} donemAccent={glowColor} />
          <KartArka yazar={yazar} donemAccent={glowColor} />
        </div>
      </div>
      {quizModu && cevrildi && (
        <div style={{ display:"flex", gap:"8px" }}>
          <button onClick={(e) => handleDurum("dogru", e)} style={{
            padding:"4px 14px", borderRadius:"10px", cursor:"pointer",
            background: durum==="dogru" ? "#22c55e" : "transparent",
            border:"1px solid #22c55e", color: durum==="dogru" ? "#fff" : "#22c55e",
            fontSize:"11px", fontFamily:"'Courier New',monospace", fontWeight:"700", transition:"all 0.2s",
          }}>✓ Bildim</button>
          <button onClick={(e) => handleDurum("yanlis", e)} style={{
            padding:"4px 14px", borderRadius:"10px", cursor:"pointer",
            background: durum==="yanlis" ? "#ef4444" : "transparent",
            border:"1px solid #ef4444", color: durum==="yanlis" ? "#fff" : "#ef4444",
            fontSize:"11px", fontFamily:"'Courier New',monospace", fontWeight:"700", transition:"all 0.2s",
          }}>✗ Bilmedim</button>
        </div>
      )}
      {quizModu && !cevrildi && (
        <div style={{ fontSize:"10px", color:"#444", fontFamily:"'Courier New',monospace" }}>
          tıkla → yazarı gör
        </div>
      )}
    </div>
  );
}

// cevaplar: { [indeks]: "dogru" | "yanlis" | null }
// cevrildi: { [indeks]: true | false }
function QuizEkrani({ kartlar, donemler, onCikis }) {
  const [indeks, setIndeks] = useState(0);
  const [cevaplar, setCevaplar] = useState({}); // indeks → "dogru"|"yanlis"|null
  const [acik, setAcik] = useState({});         // indeks → true (kart çevrildi mi)
  const [bitti, setBitti] = useState(false);
  const [baslangic] = useState(() => Date.now());
  const [sure, setSure] = useState(0);

  const kart = kartlar[indeks];
  const donemBilgi = donemler[kart?.donem] || { color:"#333", accent:"#888" };

  const kartAcik = !!acik[indeks];
  const mevcutCevap = cevaplar[indeks] || null;

  const kartCevir = () => {
    setAcik(p => ({ ...p, [indeks]: !p[indeks] }));
  };

  const cevapVer = (d) => {
    setCevaplar(p => ({ ...p, [indeks]: d }));
    setTimeout(() => {
      if (indeks + 1 < kartlar.length) {
        setIndeks(p => p + 1);
      } else {
        const finalCevaplar = { ...cevaplar, [indeks]: d };
        kartlar.forEach((_, i) => { if (!finalCevaplar[i]) finalCevaplar[i] = "yanlis"; });
        setCevaplar(finalCevaplar);
        setSure(Math.floor((Date.now() - baslangic) / 1000));
        setBitti(true);
      }
    }, 50);
  };

  // Hesaplamalar
  const dogru = Object.values(cevaplar).filter(v => v === "dogru").length;
  const yanlisSayisi = Object.values(cevaplar).filter(v => v === "yanlis").length;

  const oncekiKart = () => {
    if (indeks > 0) setIndeks(p => p - 1);
  };

  const sonrakiKart = () => {
    if (indeks + 1 < kartlar.length) {
      setIndeks(p => p + 1);
    } else {
      // Son kart — işaretlenmemişleri yanlis say
      const finalCevaplar = { ...cevaplar };
      kartlar.forEach((_, i) => {
        if (!finalCevaplar[i]) finalCevaplar[i] = "yanlis";
      });
      setCevaplar(finalCevaplar);
      setSure(Math.floor((Date.now() - baslangic) / 1000));
      setBitti(true);
    }
  };

  if (bitti) {
    const dk = Math.floor(sure / 60);
    const sn = sure % 60;
    const sureMetni = dk > 0 ? `${dk} dk ${sn} sn` : `${sn} sn`;
    const toplam = kartlar.length;
    const finalDogru = Object.values(cevaplar).filter(v => v === "dogru").length;
    const yanlisList = kartlar.filter((_, i) => cevaplar[i] !== "dogru");

    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(180deg,#0a0a0f,#12121f)", fontFamily:"Georgia,serif", color:"#fff", overflowY:"auto" }}>
        <div style={{ padding:"48px 32px 32px", textAlign:"center", borderBottom:"1px solid #ffffff10" }}>
          <div style={{ fontSize:"11px", letterSpacing:"4px", color:"#555", fontFamily:"'Courier New',monospace", marginBottom:"16px" }}>QUIZ TAMAMLANDI</div>
          <div style={{ fontSize:"56px", fontWeight:"900", color:"#fff", lineHeight:1 }}>
            {Math.round((finalDogru/toplam)*100)}<span style={{ fontSize:"28px", color:"#888" }}>%</span>
          </div>
          <div style={{ fontSize:"13px", color:"#555", fontFamily:"'Courier New',monospace", marginTop:"8px" }}>⏱ {sureMetni}</div>
          <div style={{ display:"flex", gap:"40px", justifyContent:"center", marginTop:"28px" }}>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:"32px", fontWeight:"900", color:"#22c55e" }}>{finalDogru}</div>
              <div style={{ fontSize:"11px", color:"#555", fontFamily:"'Courier New',monospace", marginTop:"4px" }}>BİLDİM</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:"32px", fontWeight:"900", color:"#ef4444" }}>{yanlisList.length}</div>
              <div style={{ fontSize:"11px", color:"#555", fontFamily:"'Courier New',monospace", marginTop:"4px" }}>BİLMEDİM</div>
            </div>
            <div style={{ textAlign:"center" }}>
              <div style={{ fontSize:"32px", fontWeight:"900", color:"#888" }}>{toplam}</div>
              <div style={{ fontSize:"11px", color:"#555", fontFamily:"'Courier New',monospace", marginTop:"4px" }}>TOPLAM</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:"12px", justifyContent:"center", marginTop:"28px", flexWrap:"wrap" }}>
            <button onClick={onCikis} style={{
              padding:"10px 24px", background:"transparent", color:"#888",
              border:"1px solid #333", borderRadius:"20px", cursor:"pointer",
              fontSize:"12px", fontFamily:"'Courier New',monospace", fontWeight:"700",
            }}>← Çık</button>
            {yanlisList.length > 0 && (
              <button onClick={() => onCikis("tekrar", yanlisList)} style={{
                padding:"10px 24px", background:"#ef4444", color:"#fff",
                border:"none", borderRadius:"20px", cursor:"pointer",
                fontSize:"12px", fontFamily:"'Courier New',monospace", fontWeight:"700",
              }}>✗ Bilemediklerimi Tekrar Sor ({yanlisList.length})</button>
            )}
          </div>
        </div>
        {yanlisList.length > 0 && (
          <div style={{ padding:"32px" }}>
            <div style={{ fontSize:"11px", letterSpacing:"3px", color:"#ef4444", fontFamily:"'Courier New',monospace", marginBottom:"20px" }}>BİLEMEDİKLERİM</div>
            <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
              {yanlisList.map((k, i) => {
                const db = donemler[k.donem] || { color:"#333", accent:"#888" };
                return (
                  <div key={i} style={{
                    background:`${db.color}44`, border:`1px solid ${db.accent}40`,
                    borderRadius:"12px", padding:"14px 18px",
                    display:"flex", alignItems:"center", gap:"16px",
                  }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:"9px", color:db.accent, fontFamily:"'Courier New',monospace", letterSpacing:"2px", marginBottom:"3px" }}>ESER</div>
                      <div style={{ fontSize:"16px", fontWeight:"700", color:"#fff" }}>{k.eser.ad}</div>
                      <div style={{ fontSize:"11px", color:"#888", fontFamily:"'Courier New',monospace", marginTop:"2px" }}>{k.eser.tur} · {k.eser.yil}</div>
                    </div>
                    <div style={{ textAlign:"right" }}>
                      <div style={{ fontSize:"9px", color:db.accent, fontFamily:"'Courier New',monospace", letterSpacing:"2px", marginBottom:"3px" }}>YAZAR</div>
                      <div style={{ fontSize:"16px", fontWeight:"700", color:"#fff" }}>{k.yazar.ad}</div>
                      <div style={{ fontSize:"11px", color:"#888", fontFamily:"'Courier New',monospace", marginTop:"2px" }}>{k.yazar.dogum}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  const glow = mevcutCevap === "dogru" ? "#22c55e" : mevcutCevap === "yanlis" ? "#ef4444" : donemBilgi.accent;

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(180deg,#0a0a0f,#12121f)", fontFamily:"Georgia,serif", color:"#fff" }}>
      {/* Üst bar */}
      <div style={{ padding:"14px 20px", display:"flex", alignItems:"center", justifyContent:"space-between", borderBottom:"1px solid #ffffff10", gap:"8px" }}>
        <button onClick={onCikis} style={{ background:"transparent", border:"1px solid #333", color:"#666", padding:"5px 12px", borderRadius:"12px", cursor:"pointer", fontSize:"11px", fontFamily:"'Courier New',monospace", flexShrink:0 }}>
          ← Çık
        </button>

        {/* Skor + navigasyon */}
        <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
          <span style={{ color:"#22c55e", fontFamily:"'Courier New',monospace", fontSize:"12px", fontWeight:"700" }}>✓ {dogru}</span>
          <span style={{ color:"#ef4444", fontFamily:"'Courier New',monospace", fontSize:"12px", fontWeight:"700" }}>✗ {yanlisSayisi}</span>

          <button onClick={oncekiKart} disabled={indeks === 0} style={{
            background:"transparent", border:"1px solid #333", color: indeks === 0 ? "#333" : "#888",
            padding:"4px 10px", borderRadius:"10px", cursor: indeks === 0 ? "default" : "pointer",
            fontSize:"13px", fontFamily:"'Courier New',monospace",
          }}>‹</button>

          <span style={{ fontSize:"11px", color:"#555", fontFamily:"'Courier New',monospace", minWidth:"50px", textAlign:"center" }}>
            {indeks+1} / {kartlar.length}
          </span>

          <button onClick={sonrakiKart} style={{
            background: indeks + 1 === kartlar.length ? "#f59e0b" : "transparent",
            border: `1px solid ${indeks + 1 === kartlar.length ? "#f59e0b" : "#333"}`,
            color: indeks + 1 === kartlar.length ? "#000" : "#888",
            padding:"4px 10px", borderRadius:"10px", cursor:"pointer",
            fontSize:"13px", fontFamily:"'Courier New',monospace", fontWeight: indeks + 1 === kartlar.length ? "700" : "400",
          }}>{indeks + 1 === kartlar.length ? "Bitir" : "›"}</button>
        </div>
      </div>

      {/* İlerleme çubuğu */}
      <div style={{ height:"3px", background:"#111", position:"relative" }}>
        <div style={{ position:"absolute", left:0, top:0, height:"100%", width:`${((indeks+1)/kartlar.length)*100}%`, background:donemBilgi.accent, transition:"width 0.4s" }} />
      </div>

      {/* Kart alanı */}
      <div style={{ display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:"36px 32px", gap:"24px" }}>
        <div style={{ fontSize:"10px", letterSpacing:"4px", color:"#444", fontFamily:"'Courier New',monospace" }}>
          {(kart.donem || "").toUpperCase()}
        </div>

        {/* Kart */}
        <div onClick={kartCevir} style={{ width:"320px", height:"260px", perspective:"1200px", cursor:"pointer" }}>
          <div style={{
            position:"relative", width:"100%", height:"100%",
            transformStyle:"preserve-3d",
            transition:"transform 0.2s cubic-bezier(0.4,0,0.2,1)",
            transform: kartAcik ? "rotateY(180deg)" : "rotateY(0deg)",
            borderRadius:"20px",
            boxShadow: mevcutCevap === "dogru"
              ? "0 0 28px #22c55e60, 0 12px 40px rgba(0,0,0,0.6)"
              : mevcutCevap === "yanlis"
              ? "0 0 28px #ef444460, 0 12px 40px rgba(0,0,0,0.6)"
              : kartAcik ? `0 24px 60px ${donemBilgi.accent}50` : "0 12px 40px rgba(0,0,0,0.6)",
          }}>
            {/* Ön */}
            <div style={{
              position:"absolute", inset:0, backfaceVisibility:"hidden",
              background:`linear-gradient(135deg,${donemBilgi.color}ee,${donemBilgi.color}88)`,
              borderRadius:"20px", padding:"28px",
              display:"flex", flexDirection:"column", justifyContent:"space-between",
              border:`1px solid ${glow}60`,
            }}>
              <div>
                <div style={{ fontSize:"9px", letterSpacing:"4px", color:glow, fontFamily:"'Courier New',monospace", marginBottom:"8px" }}>ESER</div>
                <div style={{ fontSize:"28px", fontWeight:"900", color:"#fff", fontFamily:"Georgia,serif", lineHeight:1.1 }}>{kart.eser.ad}</div>
              </div>
              <div>
                <div style={{ width:"32px", height:"2px", background:glow, marginBottom:"10px" }} />
                <span style={{ background: turRenkleri[kart.eser.tur]||"#888", color:"#fff", padding:"3px 10px", borderRadius:"12px", fontSize:"11px" }}>{kart.eser.tur}</span>
                <span style={{ fontSize:"11px", color:"#888", fontFamily:"'Courier New',monospace", marginLeft:"10px" }}>{kart.eser.yil}</span>
              </div>
              {!kartAcik && (
                <div style={{ textAlign:"center", fontSize:"11px", color:"#444", fontFamily:"'Courier New',monospace", marginTop:"12px" }}>
                  Yazarı biliyor musun? Tıkla →
                </div>
              )}
            </div>
            {/* Arka */}
            <div style={{
              position:"absolute", inset:0, backfaceVisibility:"hidden",
              transform:"rotateY(180deg)",
              background:"linear-gradient(135deg,#1a1a2e,#0f3460)",
              borderRadius:"20px", padding:"28px",
              display:"flex", flexDirection:"column", justifyContent:"center",
              border:`2px solid ${glow}50`,
            }}>
              {kartAcik && <>
                <div style={{ fontSize:"9px", letterSpacing:"4px", color:glow, fontFamily:"'Courier New',monospace", marginBottom:"8px" }}>YAZAR</div>
                <div style={{ fontSize:"30px", fontWeight:"900", color:"#fff", fontFamily:"Georgia,serif", marginBottom:"6px" }}>{kart.yazar.ad}</div>
                <div style={{ fontSize:"12px", color:glow, fontFamily:"'Courier New',monospace", marginBottom:"14px" }}>{kart.yazar.dogum}</div>
                <div style={{ width:"32px", height:"2px", background:glow, marginBottom:"14px" }} />
                <div style={{ fontSize:"13px", color:"#ccc", fontFamily:"Georgia,serif", fontStyle:"italic", lineHeight:1.6 }}>{kart.yazar.ozellik}</div>
              </>}
            </div>
          </div>
        </div>

        {/* İşaretleme butonları — kart açıksa her zaman göster, değiştirilebilir */}
        {kartAcik ? (
          <div style={{ display:"flex", gap:"14px" }}>
            <button onClick={() => cevapVer("yanlis")} style={{
              padding:"12px 28px", borderRadius:"14px", cursor:"pointer",
              background: mevcutCevap === "yanlis" ? "#ef4444" : "transparent",
              border:"2px solid #ef4444",
              color: mevcutCevap === "yanlis" ? "#fff" : "#ef4444",
              fontSize:"14px", fontFamily:"'Courier New',monospace", fontWeight:"700",
              transition:"all 0.15s",
            }}>✗ Bilmedim</button>
            <button onClick={() => cevapVer("dogru")} style={{
              padding:"12px 28px", borderRadius:"14px", cursor:"pointer",
              background: mevcutCevap === "dogru" ? "#22c55e" : "transparent",
              border:"2px solid #22c55e",
              color: mevcutCevap === "dogru" ? "#fff" : "#22c55e",
              fontSize:"14px", fontFamily:"'Courier New',monospace", fontWeight:"700",
              transition:"all 0.15s",
            }}>✓ Bildim</button>
          </div>
        ) : (
          <div style={{ fontSize:"12px", color:"#333", fontFamily:"'Courier New',monospace" }}>
            Cevabını düşün, sonra kartı çevir
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [aktifDonem, setAktifDonem] = useState(Object.keys(data)[0]);
  const [aramaMetni, setAramaMetni] = useState("");
  const [aktifTur, setAktifTur] = useState("Tümü");
  const [sadeceSık, setSadeceSık] = useState(false);
  const [quizModu, setQuizModu] = useState(false);
  const [quizKartlar, setQuizKartlar] = useState(null);
  const [shuffled, setShuffled] = useState(false);
  const [shuffleKey, setShuffleKey] = useState(0);

  const donemBilgi = data[aktifDonem];
  const tumTurler = ["Tümü","Roman","Şiir","Tiyatro","Hikâye","Deneme","Mesnevi","Anı","Gezi"];

  const toplamKart = Object.values(data).reduce((t,d) => t + d.yazarlar.reduce((s,y) => s + y.eserler.length, 0), 0);

  const tumKartlar = [];
  Object.entries(data).forEach(([donem, bilgi]) => {
    bilgi.yazarlar.forEach(yazar => {
      yazar.eserler.forEach(eser => {
        tumKartlar.push({ yazar, eser, donem });
      });
    });
  });

  const kartlar = [];
  donemBilgi.yazarlar.forEach(yazar => {
    yazar.eserler.forEach(eser => {
      const turUygun = aktifTur === "Tümü" || eser.tur === aktifTur;
      const aramaUygun = aramaMetni === "" ||
        yazar.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
        eser.ad.toLowerCase().includes(aramaMetni.toLowerCase());
      const sikUygun = !sadeceSık || eser.osymYil !== "ÖSYM Sık";
      if (turUygun && aramaUygun && sikUygun) kartlar.push({ yazar, eser, donem: aktifDonem });
    });
  });

  const karistir = () => {
    setShuffled(true);
    setShuffleKey(k => k + 1);
  };

  const shuffledKartlar = shuffled ? shuffle(kartlar) : kartlar;

  const baslat = (kaynakKartlar) => {
    setQuizKartlar(shuffle(kaynakKartlar));
    setQuizModu(true);
  };

  if (quizModu && quizKartlar) {
    return <QuizEkrani
      key={quizKartlar.map(k=>k.eser.ad).join(",")}
      kartlar={quizKartlar}
      donemler={data}
      onCikis={(mod, yanlisList) => {
        if (mod === "tekrar" && yanlisList?.length > 0) {
          setQuizKartlar(shuffle(yanlisList));
        } else {
          setQuizModu(false);
          setQuizKartlar(null);
        }
      }}
    />;
  }

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(180deg,#0a0a0f 0%,#12121f 100%)", fontFamily:"Georgia,serif", color:"#fff" }}>
      <div style={{ padding:"32px 32px 14px", borderBottom:"1px solid #ffffff10" }}>
        <div style={{ fontSize:"10px", letterSpacing:"5px", color:"#444", fontFamily:"'Courier New',monospace", marginBottom:"5px" }}>TÜRK EDEBİYATI · AYT/YKS HAZIRLIK</div>
        <h1 style={{ fontSize:"32px", fontWeight:"900", margin:0, background:`linear-gradient(135deg,#fff 0%,${donemBilgi.accent} 100%)`, WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent", transition:"all 0.5s" }}>
          Yazar & Eser Kartları
        </h1>
        <p style={{ fontSize:"11px", color:"#444", marginTop:"5px", fontFamily:"'Courier New',monospace" }}>
          {toplamKart} kart · Önde eser → arkada yazar · Tıklayarak çevirin
        </p>
      </div>

      <div style={{ display:"flex", gap:"4px", padding:"14px 32px", overflowX:"auto", flexWrap:"wrap" }}>
        {Object.keys(data).map(donem => (
          <button key={donem} onClick={() => { setAktifDonem(donem); setAramaMetni(""); setAktifTur("Tümü"); setSadeceSık(false); setShuffled(false); }} style={{
            padding:"6px 12px",
            background: aktifDonem===donem ? data[donem].accent : "transparent",
            color: aktifDonem===donem ? "#fff" : "#555",
            border:`1px solid ${aktifDonem===donem ? data[donem].accent : "#333"}`,
            borderRadius:"18px", cursor:"pointer", fontSize:"10px", fontFamily:"'Courier New',monospace",
            whiteSpace:"nowrap", transition:"all 0.3s", fontWeight: aktifDonem===donem ? "700" : "400",
          }}>{donem}</button>
        ))}
      </div>

      <div style={{ padding:"0 32px 14px", display:"flex", gap:"8px", alignItems:"center", flexWrap:"wrap" }}>
        <input placeholder="Yazar veya eser ara..." value={aramaMetni} onChange={e => setAramaMetni(e.target.value)}
          style={{ background:"#ffffff08", border:"1px solid #333", borderRadius:"8px", padding:"6px 12px", color:"#fff", fontSize:"11px", fontFamily:"'Courier New',monospace", outline:"none", width:"190px" }} />
        <div style={{ display:"flex", gap:"4px", flexWrap:"wrap" }}>
          {tumTurler.map(tur => (
            <button key={tur} onClick={() => setAktifTur(tur)} style={{
              padding:"3px 9px",
              background: aktifTur===tur ? (turRenkleri[tur]||donemBilgi.accent) : "transparent",
              color: aktifTur===tur ? "#fff" : "#555",
              border:`1px solid ${aktifTur===tur ? (turRenkleri[tur]||donemBilgi.accent) : "#333"}`,
              borderRadius:"10px", cursor:"pointer", fontSize:"10px", fontFamily:"'Courier New',monospace", transition:"all 0.2s",
            }}>{tur}</button>
          ))}
        </div>
        <button onClick={() => setSadeceSık(!sadeceSık)} style={{
          padding:"3px 11px",
          background: sadeceSık ? "#c8922a" : "transparent",
          color: sadeceSık ? "#fff" : "#555",
          border:`1px solid ${sadeceSık ? "#c8922a" : "#333"}`,
          borderRadius:"10px", cursor:"pointer", fontSize:"10px", fontFamily:"'Courier New',monospace",
        }}>★ Yıl Belli</button>
      </div>

      <div style={{ padding:"0 32px 20px", display:"flex", gap:"10px", flexWrap:"wrap" }}>
        <button onClick={karistir} style={{
          padding:"8px 18px", borderRadius:"12px", cursor:"pointer",
          background: shuffled ? donemBilgi.accent : "transparent",
          border:`1.5px solid ${donemBilgi.accent}`,
          color: shuffled ? "#fff" : donemBilgi.accent,
          fontSize:"12px", fontFamily:"'Courier New',monospace", fontWeight:"700",
          display:"flex", alignItems:"center", gap:"6px", transition:"all 0.2s",
        }}>
          ⇄ {shuffled ? "Karıştırıldı!" : "Karıştır"}
        </button>
        <button onClick={() => baslat(kartlar)} style={{
          padding:"8px 18px", borderRadius:"12px", cursor:"pointer",
          background:"transparent", border:"1.5px solid #a855f7", color:"#a855f7",
          fontSize:"12px", fontFamily:"'Courier New',monospace", fontWeight:"700",
          display:"flex", alignItems:"center", gap:"6px",
        }}>
          ▶ Bu Dönemi Quiz Yap ({kartlar.length} kart)
        </button>
        <button onClick={() => baslat(tumKartlar)} style={{
          padding:"8px 18px", borderRadius:"12px", cursor:"pointer",
          background:"transparent", border:"1.5px solid #f59e0b", color:"#f59e0b",
          fontSize:"12px", fontFamily:"'Courier New',monospace", fontWeight:"700",
          display:"flex", alignItems:"center", gap:"6px",
        }}>
          ★ Tümünü Quiz Yap ({tumKartlar.length} kart)
        </button>
      </div>

      {shuffled ? (
        <div key={shuffleKey} style={{ padding:"0 32px 24px", display:"flex", gap:"14px", flexWrap:"wrap" }}>
          {shuffledKartlar.map(({ yazar, eser }, i) => (
            <Kart key={eser.ad + i} yazar={yazar} eser={eser} donemColor={donemBilgi.color} donemAccent={donemBilgi.accent} quizModu={false} />
          ))}
        </div>
      ) : (
        donemBilgi.yazarlar.map(yazar => {
          const yk = kartlar.filter(k => k.yazar.ad === yazar.ad);
          if (!yk.length) return null;
          return (
            <div key={yazar.ad} style={{ padding:"0 32px 24px" }}>
              <div style={{ display:"flex", alignItems:"center", gap:"10px", marginBottom:"12px" }}>
                <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:`linear-gradient(135deg,${donemBilgi.color},${donemBilgi.accent})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:"13px", fontWeight:"900", color:"#fff", flexShrink:0 }}>
                  {yazar.ad[0]}
                </div>
                <div>
                  <div style={{ fontSize:"16px", fontWeight:"700", color:"#fff" }}>{yazar.ad}</div>
                  <div style={{ fontSize:"10px", color:donemBilgi.accent, fontFamily:"'Courier New',monospace" }}>{yazar.dogum} · {yk.length} eser</div>
                </div>
              </div>
              <div style={{ display:"flex", gap:"12px", flexWrap:"wrap" }}>
                {yk.map(({ yazar:y, eser }) => (
                  <Kart key={eser.ad} yazar={y} eser={eser} donemColor={donemBilgi.color} donemAccent={donemBilgi.accent} quizModu={false} />
                ))}
              </div>
            </div>
          );
        })
      )}

      {kartlar.length === 0 && (
        <div style={{ textAlign:"center", padding:"60px", color:"#333", fontFamily:"'Courier New',monospace" }}>Sonuç bulunamadı.</div>
      )}

      <div style={{ padding:"14px 32px", borderTop:"1px solid #ffffff08", fontSize:"10px", color:"#222", fontFamily:"'Courier New',monospace", textAlign:"center" }}>
        Kaynak: kopilotrehberlik.com · edebiyatfatihi.com · ozeldersalani.com · sorumatik.co
      </div>
    </div>
  );
}
