export function getProfileAvatarBackgroundColor(seed: string): string {
  const normalizedSeed = seed.trim().toLowerCase();
  if (!normalizedSeed) return "hsl(220, 14%, 45%)";
  let hash = 0;
  for (let i = 0; i < normalizedSeed.length; i++) {
    hash = normalizedSeed.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 68%, 42%)`;
}
