import { useState } from "react";
import { motion } from "framer-motion";

export function Card({ yazar, eser, donemColor, donemAccent }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="relative cursor-pointer"
      style={{ perspective: "1000px", height: "220px" }}
      onClick={() => setFlipped(!flipped)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d", width: "100%", height: "100%" }}
      >
        {/* ÖN YÜZ — Eser adı */}
        <div
          className="absolute inset-0 rounded-xl border flex flex-col justify-between p-5"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            background: `linear-gradient(135deg, ${donemColor}cc, ${donemColor}66)`,
            borderColor: donemAccent + "40",
          }}
        >
          <div className="flex items-start justify-between gap-2">
            <span
              className="text-xs font-mono font-bold px-2 py-1 rounded-md"
              style={{
                backgroundColor: donemAccent + "25",
                color: donemAccent,
                border: `1px solid ${donemAccent}40`,
              }}
            >
              {eser.tur}
            </span>
            {eser.osymYil && eser.osymYil !== "ÖSYM Sık" && (
              <span className="text-xs font-mono text-amber-400 opacity-80">
                {eser.osymYil}
              </span>
            )}
            {eser.osymYil === "ÖSYM Sık" && (
              <span className="text-xs font-mono text-amber-400 opacity-60">
                ★ Sık
              </span>
            )}
          </div>

          <div>
            <p className="text-white font-bold text-lg leading-snug mb-1" style={{ fontFamily: "Georgia, serif" }}>
              {eser.ad}
            </p>
            {eser.yil && (
              <p className="text-xs font-mono opacity-50">{eser.yil}</p>
            )}
          </div>

          <p className="text-xs font-mono opacity-30 text-right">çevirmek için tıkla →</p>
        </div>

        {/* ARKA YÜZ — Yazar bilgisi */}
        <div
          className="absolute inset-0 rounded-xl border flex flex-col justify-between p-5"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            background: `linear-gradient(135deg, #1e293b, #0f172a)`,
            borderColor: donemAccent + "60",
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-white text-sm"
              style={{
                background: `linear-gradient(135deg, ${donemColor}, ${donemAccent})`,
              }}
            >
              {yazar.ad[0]}
            </div>
            <div>
              <p className="font-bold text-white text-base">{yazar.ad}</p>
              <p className="text-xs font-mono text-gray-400">{yazar.dogum}</p>
            </div>
          </div>

          {eser.aciklama ? (
            <p className="text-xs text-gray-300 leading-relaxed overflow-hidden" style={{ display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" }}>
              {eser.aciklama}
            </p>
          ) : (
            <p className="text-xs text-gray-500 italic font-mono">{yazar.ozellik}</p>
          )}

          <p className="text-xs font-mono opacity-30">← geri dön</p>
        </div>
      </motion.div>
    </div>
  );
}
