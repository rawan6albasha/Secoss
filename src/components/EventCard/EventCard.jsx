import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Button from "../ui/Button";
import { getLocalizedText } from "../../utils/i18n-helpers";

// ⏱️ countdown دقيق بالثواني
const getTimeParts = (date) => {
  const diff = new Date(date) - new Date();

  if (diff <= 0) {
    return { done: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: false,
  };
};

const EventCard = ({
  title,
  description,
  image,
  date,
  location,
  actionLabel,
  actionLink,
  alt,
}) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || "ar";
  const [timeLeft, setTimeLeft] = useState(getTimeParts(date));
useEffect(() => {
  const interval = setInterval(() => {
    setTimeLeft(getTimeParts(date));
  }, 1000);

  return () => clearInterval(interval);
}, [date]);

  const localizedTitle = getLocalizedText(title, currentLang);
  const localizedDescription = getLocalizedText(description, currentLang);
  const localizedLocation = getLocalizedText(location, currentLang);
  const localizedActionLabel = getLocalizedText(actionLabel, currentLang);
  const isArabic = currentLang.startsWith("ar");
  const unitLabels = isArabic
    ? { days: "يوم", hours: "ساعة", minutes: "دقيقة", seconds: "ثانية" }
    : { days: "Days", hours: "Hours", minutes: "Minutes", seconds: "Seconds" };

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      className="relative z-0 h-full w-full overflow-hidden rounded-3xl shadow-lg group"
    >

      {/* 🔥 Background Image */}
      <img
        src={image}
        alt={getLocalizedText(alt, currentLang) || localizedTitle}
        className="absolute inset-0 z-0 w-full h-full object-cover group-hover:scale-110 transition duration-700"
      />

      {/* Overlay */}
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Content */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 text-white">

        {/* Location */}
        {localizedLocation && (
          <p className="text-sm opacity-80 mb-1">📍 {localizedLocation}</p>
        )}

        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold leading-snug mb-2">
          {localizedTitle}
        </h2>

        {/* Description */}
        <p className="text-sm opacity-90 line-clamp-2 mb-4">
          {localizedDescription}
        </p>

        {/* ⏱️ Countdown */}
        {!timeLeft.done ? (
          <div className="flex gap-2 mb-4">

            {["days", "hours", "minutes", "seconds"].map((unit) => (
              <div
                key={unit}
                className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl text-center min-w-[60px]"
              >
                <p className="text-lg font-bold animate-pulse">
                  {timeLeft[unit].toString().padStart(2, "0")}
                </p>
                <span className="text-[10px] opacity-70">
                  {unitLabels[unit]}
                </span>
              </div>
            ))}

          </div>
        ) : (
          <p className="text-accent font-bold mb-4">🚀 بدأ الحدث</p>
        )}

        {/* Button */}
        {localizedActionLabel && actionLink && (
          <Button href={actionLink} variant="accent">
            {localizedActionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EventCard;