function normalizeInput(from) {
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
    .normalize()
    .toLowerCase();
}

let is = (() => {
  let FRONT_VOWELS = [ 'i', 'a', 'e', 'æ' ];
  let BACK_VOWELS = [ 'o', 'u', 'y' ];
  let VOWELS = FRONT_VOWELS + BACK_VOWELS;
  let CONSONANTS = [
    'b', 'c', 'd', 'ð', 'f', 'g', 'h', 'l', 'm',
    'n', 'p', 'r', 's', 't', 'þ', 'w', 'x'
  ];
  
  let is_vowel = VOWELS.includes.bind(VOWELS);
  is_vowel.front = FRONT_VOWELS.includes.bind(FRONT_VOWELS);
  is_vowel.back = BACK_VOWELS.includes.bind(BACK_VOWELS);
  let is_consonant = CONSONANTS.includes.bind(CONSONANTS);
  return {
    vowel: is_vowel,
    consonant: is_consonant,
    punctuation: c => !is_vowel(c) && !is_consonant(c),
    letter: c => is_vowel(c) || is_consonant(c),
  };
})();

function singleSub(text, pos) {
  let current = text[pos];
  let next = text[pos + 1];
  let prev = text[pos - 1];
  switch (current) {
    // TODO: determine if vowel is long or short when no macron
    case 'a':
    case 'æ':
      return ['æ', 1];
    case 'ā':
      return ['ɑː', 1];
    case 'e':
      if (next === 'a') return ['ɛ', 2];
      if (next === 'o') return ['ɛ', 2];
      if (!is.letter(next)) return ['ə', 1];
      return ['ɛ', 1];
    case 'ē':
      if (next === 'ā' || next === 'a') return ['ɛə', 2];
      if (next === 'ō' || next === 'o') return ['ɛo', 2];
      return ['eː', 1];
    case 'i':
      if (next === 'e') return ['ɛ', 2];
      return ['ɪ', 1];
    case 'ī':
      if (next === 'e' || next === 'ē') return ['ie', 2];
      return ['iː', 1];
    case 'o':
      return ['ɔ', 1];
    case 'ō':
      return ['oː', 1];
    case 'u':
      return ['ʊ', 1];
    case 'ū':
      return ['uː', 1];
    case 'y':
      return ['ɪ', 1];
    case 'ȳ':
      return ['ɯ', 1];
    case 'c':
      if (next == 'g') return ['dʒ', 2];
      if (is.vowel.front(next) || is.vowel.front(prev)) return ['tʃ', 1];
      if (is.vowel(prev) && is.letter(next)) return ['tʃ', 1];
      // TODO: "sometimes after 'n' or 'l'" is /tʃ/
      return ['k', 1];
    case 'f':
      // TODO: Investigate positions where this is voiced
      return ['f', 1];
    case 'g':
      if (is.vowel.back(prev) && is.vowel.back(next)) return ['x', 1];
      if (is.punctuation(prev)) return ['g', 1];
      if (is.consonant(next) || is.vowel.back(next) || next == 'æ') return ['g', 1];
      if (is.vowel.front(prev) || is.vowel.front(next)) return ['j', 1];
      return [false, 1];
    case 'h':
      if (is.punctuation(prev) || is.consonant(prev)) return ['h', 1];
      if (is.vowel.back(prev)) return ['x', 1];
      if (is.vowel.front(prev)) return ['ç', 1];
      return [false, 1];
    case 'r':
      if (is.punctuation(prev) && !is.consonant(next)) return ['r', 1];
      return ['ɹ', 1];
    case 's':
      if (next == 'c') return ['ʃ', 2];
      // TODO: Investigate positions where this is voiced
      return ['s', 1];
    case 'n':
      if (next == 'g') {
        // TODO: Investigate /ng/ vs /ŋ/
        // hypothesis: ending is /ŋ/, others are /ng/
        if (is.punctuation(text[pos + 2])) return ['ŋ', 2];
        return ['ng', 2];
      }
      return ['n', 1];
    // simple translation: letters to symbols
    case 'x': return ['ks', 1];
    case 'ȝ': return ['γ', 1];
    case 'þ': return ['θ', 1];
    // happen to be the same in Old English and IPA
    case 'b': case 'd': case 'ð': case 'l': case 'm': case 'p':
    case 't': case 'w':
      return [current, 1];
    // anything else is punctuation, whitespace, etc and is transcribed as-is
    default:
      return [current, 1];
  }
  // if this ever runs, we have /big/ issues
  console.err(`missed a case! from='${text.splice(Math.max(pos-2, 0), Math.min(pos+2, from.length))}', pos=${pos}`);
}

function transcribe(from) {
  from = normalizeInput(from);
  let output = "";
  for (let i = 0; i < from.length;) {
    let [send, advance] = singleSub(from, i, output);
    if (send === false) {
      let l = Math.max(i - 5, 0);
      let r = Math.min(i + 5, from.length);
      return [
        `Failed transcription around position ${i}: ${from.slice(l, r)}`,
        false
      ];
    }
    i += advance;
    output += send;
  }
  return [ output, true ];
}
