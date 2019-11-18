function replaceSubs(from) {
  return from.
    replace("\\th", "þ").
    replace("\\dh", "ð").
    replace("Þ", "þ").
    replace("Ð", "ð").
    toLowerCase();
}

function transcribe(from) {
  // TODO
  from = replaceSubs(from);
  return from;
}
