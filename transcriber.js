function replaceSubs(from) {
  return from
    .replace(/\\th/gi, "þ")
    .replace(/\\dh/gi, "ð")
    .replace(/\\ae/gi, "æ")
    .replace(/\\ch/gi, "ȝ")
    .replace("ƿ", "w")
    .replace("Ƿ", "w")
    .replace("Þ", "þ")
    .replace("Ð", "ð")
    .replace("Ȝ", "ȝ")
    .toLowerCase();
}

function transcribe(from) {
  // TODO
  from = replaceSubs(from);
  return from;
}
