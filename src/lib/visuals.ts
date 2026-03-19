export function fellowAvatarUrl(name: string) {
  const seed = encodeURIComponent(name.toLowerCase());
  return `https://api.dicebear.com/9.x/shapes/svg?seed=${seed}&backgroundColor=b6e3f4,c0aede,d1d4f9&radius=18`;
}

export function startupIconLabel(sector: string) {
  const key = sector.toLowerCase();
  if (key.includes("agri")) return "AGR";
  if (key.includes("health")) return "HLT";
  if (key.includes("fin")) return "FIN";
  if (key.includes("ed")) return "EDU";
  if (key.includes("clean")) return "CLN";
  if (key.includes("logi")) return "LOG";
  return "STR";
}
