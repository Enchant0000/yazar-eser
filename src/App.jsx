import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/Card";
import { QuizScreen } from "@/components/QuizScreen";
import { data, turRenkleri } from "@/data";
import { Search, Shuffle, Play, Zap } from "lucide-react";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Home() {
  const [aktifDonem, setAktifDonem] = useState(Object.keys(data)[0]);
  const [aramaMetni, setAramaMetni] = useState("");
  const [aktifTur, setAktifTur] = useState("Tümü");
  const [sadeceSık, setSadeceSık] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [quizModu, setQuizModu] = useState(false);
  const [quizKartlar, setQuizKartlar] = useState(null);

  const donemBilgi = data[aktifDonem];
  
  const tumTurler = useMemo(() => {
    const turler = new Set();
    turler.add("Tümü");
    Object.values(data).forEach((donem) => {
      donem.yazarlar.forEach((yazar) => {
        yazar.eserler.forEach((eser) => {
          turler.add(eser.tur);
        });
      });
    });
    return Array.from(turler);
  }, []);

  const toplamKart = Object.values(data).reduce(
    (t, d) => t + d.yazarlar.reduce((s, y) => s + y.eserler.length, 0),
    0
  );

  const tumKartlar = useMemo(() => {
    const kartlar = [];
    Object.entries(data).forEach(([donem, bilgi]) => {
      bilgi.yazarlar.forEach((yazar) => {
        yazar.eserler.forEach((eser) => {
          kartlar.push({ yazar, eser, donem });
        });
      });
    });
    return kartlar;
  }, []);

  const kartlar = useMemo(() => {
    const filtered = [];
    donemBilgi.yazarlar.forEach((yazar) => {
      yazar.eserler.forEach((eser) => {
        const turUygun = aktifTur === "Tümü" || eser.tur === aktifTur;
        const aramaUygun =
          aramaMetni === "" ||
          yazar.ad.toLowerCase().includes(aramaMetni.toLowerCase()) ||
          eser.ad.toLowerCase().includes(aramaMetni.toLowerCase());
        const sikUygun = !sadeceSık || eser.osymYil !== "ÖSYM Sık";
        if (turUygun && aramaUygun && sikUygun) {
          filtered.push({ yazar, eser, donem: aktifDonem });
        }
      });
    });
    return filtered;
  }, [aktifDonem, aramaMetni, aktifTur, sadeceSık]);

  const shuffledKartlar = useMemo(
    () => (shuffled ? shuffle(kartlar) : kartlar),
    [shuffled, kartlar]
  );

  const handleStartQuiz = (kaynakKartlar) => {
    setQuizKartlar(shuffle(kaynakKartlar));
    setQuizModu(true);
  };

  const handleExitQuiz = (mod, yanlisList) => {
    if (mod === "tekrar" && yanlisList && yanlisList.length > 0) {
      setQuizKartlar(shuffle(yanlisList));
    } else {
      setQuizModu(false);
      setQuizKartlar(null);
    }
  };

  if (quizModu && quizKartlar) {
    return (
      <QuizScreen
        kartlar={quizKartlar}
        donemler={data}
        onExit={handleExitQuiz}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-xs font-mono tracking-widest text-gray-500 mb-3 uppercase">
              Türk Edebiyatı · AYT/YKS Hazırlık
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3">
              <span
                className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Yazar & Eser Kartları
              </span>
            </h1>
            <p className="text-sm text-gray-400 font-mono">
              {toplamKart} kart · Önde eser → arkada yazar · Tıklayarak çevirin
            </p>
          </motion.div>
        </div>
      </div>

      {/* Dönem seçimi */}
      <div className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {Object.keys(data).map((donem) => (
              <motion.button
                key={donem}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setAktifDonem(donem);
                  setAramaMetni("");
                  setAktifTur("Tümü");
                  setSadeceSık(false);
                  setShuffled(false);
                }}
                className={`px-4 py-2 rounded-lg font-mono text-xs font-bold whitespace-nowrap transition-all border ${
                  aktifDonem === donem
                    ? "border-transparent text-white"
                    : "border-gray-700 text-gray-400 hover:text-gray-300"
                }`}
                style={{
                  backgroundColor:
                    aktifDonem === donem ? data[donem].accent + "20" : "transparent",
                  borderColor:
                    aktifDonem === donem ? data[donem].accent : undefined,
                }}
              >
                {donem}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Filtreler */}
      <div className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto space-y-4">
          {/* Arama */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              type="text"
              placeholder="Yazar veya eser ara..."
              value={aramaMetni}
              onChange={(e) => setAramaMetni(e.target.value)}
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm font-mono text-white placeholder-gray-500 focus:outline-none focus:border-gray-600 focus:ring-1 focus:ring-gray-600"
            />
          </div>

          {/* Tür filtreleri */}
          <div className="flex gap-2 flex-wrap">
            {tumTurler.map((tur) => (
              <motion.button
                key={tur}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setAktifTur(tur)}
                className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all border ${
                  aktifTur === tur
                    ? "text-white border-transparent"
                    : "text-gray-400 border-gray-700 hover:text-gray-300"
                }`}
                style={{
                  backgroundColor:
                    aktifTur === tur
                      ? (turRenkleri[tur] || donemBilgi.accent) + "20"
                      : "transparent",
                  borderColor:
                    aktifTur === tur
                      ? turRenkleri[tur] || donemBilgi.accent
                      : undefined,
                }}
              >
                {tur}
              </motion.button>
            ))}
          </div>

          {/* ÖSYM Sık filtresi */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSadeceSık(!sadeceSık)}
              className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition-all border ${
                sadeceSık
                  ? "text-white border-transparent"
                  : "text-gray-400 border-gray-700 hover:text-gray-300"
              }`}
              style={{
                backgroundColor: sadeceSık ? "#c8922a20" : "transparent",
                borderColor: sadeceSık ? "#c8922a" : undefined,
              }}
            >
              ★ Yıl Belli
            </motion.button>
          </div>
        </div>
      </div>

      {/* Aksiyonlar */}
      <div className="border-b border-gray-800 px-4 py-4">
        <div className="max-w-6xl mx-auto flex gap-3 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShuffled(!shuffled)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all border ${
              shuffled
                ? "text-white border-transparent"
                : "text-gray-400 border-gray-700 hover:text-gray-300"
            }`}
            style={{
              backgroundColor: shuffled ? donemBilgi.accent + "20" : "transparent",
              borderColor: shuffled ? donemBilgi.accent : undefined,
            }}
          >
            <Shuffle size={16} />
            {shuffled ? "Karıştırıldı!" : "Karıştır"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStartQuiz(kartlar)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all border border-purple-500/50 text-purple-400 hover:text-purple-300 hover:border-purple-400"
          >
            <Play size={16} />
            Bu Dönemi Quiz Yap ({kartlar.length})
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleStartQuiz(tumKartlar)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all border border-amber-500/50 text-amber-400 hover:text-amber-300 hover:border-amber-400"
          >
            <Zap size={16} />
            Tümünü Quiz Yap ({tumKartlar.length})
          </motion.button>
        </div>
      </div>

      {/* Kartlar */}
      <div className="px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {kartlar.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-mono text-sm">
                Sonuç bulunamadı.
              </p>
            </div>
          ) : shuffled ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {shuffledKartlar.map((k, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Card
                    yazar={k.yazar}
                    eser={k.eser}
                    donemColor={donemBilgi.color}
                    donemAccent={donemBilgi.accent}
                  />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="space-y-8">
              {donemBilgi.yazarlar.map((yazar) => {
                const yk = kartlar.filter((k) => k.yazar.ad === yazar.ad);
                if (!yk.length) return null;

                return (
                  <motion.div
                    key={yazar.ad}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white"
                        style={{
                          background: `linear-gradient(135deg, ${donemBilgi.color}, ${donemBilgi.accent})`,
                        }}
                      >
                        {yazar.ad[0]}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">
                          {yazar.ad}
                        </h3>
                        <p className="text-xs font-mono text-gray-500">
                          {yazar.dogum} · {yk.length} eser
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {yk.map((k, i) => (
                        <motion.div
                          key={k.eser.ad}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.05 }}
                        >
                          <Card
                            yazar={k.yazar}
                            eser={k.eser}
                            donemColor={donemBilgi.color}
                            donemAccent={donemBilgi.accent}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 px-4 py-6 text-center">
        <p className="text-xs font-mono text-gray-600">
          Kaynak: kopilotrehberlik.com · edebiyatfatihi.com · ozeldersalani.com
          · sorumatik.co
        </p>
      </div>
    </div>
  );
}
