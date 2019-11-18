function replaceSubs(from) {
  return from.
    replace(/\\th/gi, "þ").
    replace(/\\dh/gi, "ð").
    replace(/\\ae/gi, "æ").
    replace("Þ", "þ").
    replace("Ð", "ð").
    toLowerCase();
}

function transcribe(from) {
  // TODO
  from = replaceSubs(from);
  return from;
}
