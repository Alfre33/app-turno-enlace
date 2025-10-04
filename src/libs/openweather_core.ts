export function iconToEmoji(icon?: string) {
  if (!icon) return '☁️';
  if (icon.startsWith('01')) return '☀️';
  if (icon.startsWith('02')) return '🌤️';
  if (icon.startsWith('03') || icon.startsWith('04')) return '☁️';
  if (icon.startsWith('09') || icon.startsWith('10')) return '🌧️';
  if (icon.startsWith('11')) return '⛈️';
  if (icon.startsWith('13')) return '❄️';
  if (icon.startsWith('50')) return '🌫️';
  return '☁️';
}

export function buildWeatherUrl(base: string, apiKey: string, city: string, lang: 'es' | 'en' = 'es') {
  const q = encodeURIComponent(city.trim());
  return `${base}/weather?q=${q}&appid=${apiKey}&units=metric&lang=${lang}`;
}
