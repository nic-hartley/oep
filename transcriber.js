function replaceSubs(from) {
  return from.
    replace(/\\th/i, "þ").
    replace(/\\dh/i, "ð").
    replace(/\\ae/i, "æ").
    replace("Þ", "þ").
    replace("Ð", "ð").
    toLowerCase();
}

function transcribe(from) {
  // TODO
  from = replaceSubs(from);
  return from;
}
