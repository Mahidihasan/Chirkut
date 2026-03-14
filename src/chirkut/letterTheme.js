export const getLetterTexture = (templateId) => {
  if (templateId === "coffee") {
    return "radial-gradient(130px 92px at 86% 12%, rgba(92,59,33,0.16) 0, rgba(92,59,33,0.08) 20%, rgba(92,59,33,0) 44%), radial-gradient(100px 75px at 16% 72%, rgba(116,78,48,0.1) 0, rgba(116,78,48,0) 48%), repeating-radial-gradient(circle at 42% 54%, rgba(98,67,41,0.05) 0 1px, rgba(0,0,0,0) 1px 2px)";
  }
  if (templateId === "canvas") {
    return "repeating-linear-gradient(0deg, rgba(118,92,66,0.08) 0 1px, rgba(0,0,0,0) 1px 4px), repeating-linear-gradient(90deg, rgba(118,92,66,0.07) 0 1px, rgba(0,0,0,0) 1px 4px), radial-gradient(circle at 22% 18%, rgba(255,255,255,0.26) 0, rgba(255,255,255,0) 35%)";
  }
  if (templateId === "retro") {
    return "radial-gradient(circle at 50% 50%, rgba(0,0,0,0) 56%, rgba(64,45,20,0.2) 100%), radial-gradient(120px 82px at 10% 12%, rgba(57,36,16,0.12) 0, rgba(57,36,16,0) 60%), radial-gradient(110px 72px at 94% 88%, rgba(57,36,16,0.14) 0, rgba(57,36,16,0) 62%), linear-gradient(172deg, rgba(255,247,218,0.1) 0, rgba(255,247,218,0) 34%), repeating-radial-gradient(circle at 52% 48%, rgba(46,28,10,0.035) 0 1px, rgba(0,0,0,0) 1px 2px)";
  }
  return "none";
};
