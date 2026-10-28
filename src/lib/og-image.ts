export function generateOGImage(title: string) {
  return `https://api.satori.vercel.app/og?title=${encodeURIComponent(title)}`;
}