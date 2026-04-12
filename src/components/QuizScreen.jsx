import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ArrowRight, RotateCcw, Trophy, X } from "lucide-react";

export function QuizScreen({ kartlar, donemler, onExit }) {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [dogru, setDogru] = useState(0);
  const [yanlisList, setYanlisList] = useState([]);
  const [bitti, setBitti] = useState(false);

  const kart = kartlar[index];
  const toplam = kartlar.length;
  const ilerleme = Math.round((index / toplam) * 100);

  const donemBilgi = kart
    ? Object.entries(donemler).find(([key]) => key === kart.donem)?.[1] ||
      Object.values(donemler)[0]
    : null;

  const handleBildim = () => {
    setDogru((d) => d + 1);
    sonraki(true);
  };

  const handleBilmedim = () => {
    setYanlisList((l) => [...l, kart]);
    sonraki(false);
  };

  const sonraki = (_dogru) => {
    if (index + 1 >= toplam) {
      setBitti(true);
    } else {
      setIndex((i) => i + 1);
      setRevealed(false);
    }
  };

  if (bitti) {
    const yanlis = toplam - dogru;
    const oran = Math.round((dogru / toplam) * 100);
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <Trophy size={56} className="mx-auto mb-6 text-amber-400" />
          <h2 className="text-3xl font-black mb-2" style={{ fontFamily: "Georgia, serif" }}>
            Quiz Tamamlandı!
          </h2>
          <p className="text-gray-400 font-mono text-sm mb-8">{toplam} kart · {oran}% başarı</p>

          {/* Skor çubuğu */}
          <div className="bg-gray-800 rounded-full h-3 mb-8 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${oran}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              className="h-full rounded-full"
              style={{ backgroundColor: oran >= 70 ? "#22c55e" : oran >= 40 ? "#f59e0b" : "#ef4444" }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-green-900/30 border border-green-700/40 rounded-xl p-4">
              <p className="text-3xl font-black text-green-400">{dogru}</p>
              <p className="text-xs font-mono text-green-600 mt-1">Bildim</p>
            </div>
            <div className="bg-red-900/30 border border-red-700/40 rounded-xl p-4">
              <p className="text-3xl font-black text-red-400">{yanlis}</p>
              <p className="text-xs font-mono text-red-600 mt-1">Bilmedim</p>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {yanlisList.length > 0 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => onExit("tekrar", yanlisList)}
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono font-bold text-sm bg-amber-500/20 border border-amber-500/50 text-amber-400 hover:bg-amber-500/30 transition-all"
              >
                <RotateCcw size={16} />
                Yanlışları Tekrar ({yanlisList.length})
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onExit("cikis", null)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-mono font-bold text-sm bg-gray-700/50 border border-gray-600 text-gray-300 hover:bg-gray-700 transition-all"
            >
              <X size={16} />
              Kartlara Dön
            </motion.button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* Üst bar */}
      <div className="border-b border-gray-800 px-4 py-4 flex items-center justify-between">
        <button
          onClick={() => onExit("cikis", null)}
          className="text-gray-500 hover:text-gray-300 transition-colors"
        >
          <X size={20} />
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono text-gray-500">
            {index + 1} / {toplam}
          </span>
          <div className="w-32 bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <motion.div
              animate={{ width: `${ilerleme}%` }}
              className="h-full rounded-full bg-purple-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs font-mono">
          <span className="text-green-400">{dogru} ✓</span>
          <span className="text-red-400">{yanlisList.length} ✗</span>
        </div>
      </div>

      {/* Kart alanı */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
            className="w-full max-w-lg"
          >
            {/* Soru yüzü */}
            <div
              className="rounded-2xl border p-8 mb-6 text-center min-h-[200px] flex flex-col justify-center"
              style={{
                background: `linear-gradient(135deg, ${donemBilgi?.color || "#1e293b"}cc, ${donemBilgi?.color || "#1e293b"}44)`,
                borderColor: (donemBilgi?.accent || "#4b5563") + "50",
              }}
            >
              <p className="text-xs font-mono text-gray-500 mb-4 uppercase tracking-widest">
                Bu eserin yazarı kim?
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-white mb-3" style={{ fontFamily: "Georgia, serif" }}>
                {kart.eser.ad}
              </h2>
              <div className="flex items-center justify-center gap-3">
                <span
                  className="text-xs font-mono px-2 py-1 rounded-md font-bold"
                  style={{
                    backgroundColor: (donemBilgi?.accent || "#6b7280") + "25",
                    color: donemBilgi?.accent || "#9ca3af",
                  }}
                >
                  {kart.eser.tur}
                </span>
                {kart.eser.yil && (
                  <span className="text-xs font-mono text-gray-500">{kart.eser.yil}</span>
                )}
              </div>
            </div>

            {/* Cevap / Butonlar */}
            {!revealed ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setRevealed(true)}
                className="w-full py-4 rounded-xl font-mono font-bold text-sm border border-purple-500/50 text-purple-400 hover:bg-purple-500/10 transition-all flex items-center justify-center gap-2"
              >
                <ArrowRight size={16} />
                Cevabı Göster
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* Yazar cevabı */}
                <div className="bg-slate-800/80 border border-slate-600/40 rounded-xl p-5 mb-4 text-center">
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
                      style={{
                        background: `linear-gradient(135deg, ${donemBilgi?.color || "#334155"}, ${donemBilgi?.accent || "#64748b"})`,
                      }}
                    >
                      {kart.yazar.ad[0]}
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-white text-lg">{kart.yazar.ad}</p>
                      <p className="text-xs font-mono text-gray-400">{kart.yazar.dogum}</p>
                    </div>
                  </div>
                  {kart.eser.aciklama && (
                    <p className="text-xs text-gray-400 leading-relaxed mt-3">{kart.eser.aciklama}</p>
                  )}
                </div>

                {/* Bildim / Bilmedim */}
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBilmedim}
                    className="flex items-center justify-center gap-2 py-4 rounded-xl font-mono font-bold text-sm bg-red-900/30 border border-red-700/50 text-red-400 hover:bg-red-900/50 transition-all"
                  >
                    <XCircle size={18} />
                    Bilmedim
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleBildim}
                    className="flex items-center justify-center gap-2 py-4 rounded-xl font-mono font-bold text-sm bg-green-900/30 border border-green-700/50 text-green-400 hover:bg-green-900/50 transition-all"
                  >
                    <CheckCircle size={18} />
                    Bildim
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
