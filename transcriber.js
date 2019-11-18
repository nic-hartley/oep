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
  let output = "";
  for (let letter of from) {
    switch (letter) {
      default: // anything else is punctuation, whitespace, etc
        output += letter;
    }
  }
  return output;
}
