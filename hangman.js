var hangman = {
  // (A) GAME SETTINGS
  // Total number of allowed guesses before hanging
  guesses : 5,
  // Available words for guessing
  dictionary : ["impreɛss", "inɣɛcapable", "satisfɣɛaction", "devɣɛelop", "deɣɛtermine"],

  // (B) FLAGS
  word : null, // Current chosen word
  wordlen : 0, // Word length
  rights : 0, // Current number of correct words
  wrongs : 0, // Current number of wrong guesses

  // (C) HTML ELEMENTS
  hImg : null, // Hangman iamge
  hWord : null, // Current word
  hChar : null, // Available characters
  hLives : null, // Lives left

  // (D) INIT
  init : function () {
    // (D1) GET HTML ELEMENTS
    hangman.hImg = document.getElementById("hangman-img");
    hangman.hWord = document.getElementById("hangman-words");
    hangman.hChar = document.getElementById("hangman-char");
    hangman.hLives = document.getElementById("hangman-lives");

    // (D2) GENERATE AVAILABLE CHARACTERS (A-Z)
    for (var i=65; i<91; i++) {
      let charnow = document.createElement("input");
      charnow.type = "button";
      charnow.value = String.fromCharCode(i);
      charnow.disabled = true;
      charnow.addEventListener("click", hangman.check);
      hangman.hChar.appendChild(charnow);
    }
    var dic = ['Ɛ', 'Ɣ'];
    for (var i=0; i<2; i++) {
      let charnow = document.createElement("input");
      
      charnow.type = "button";
      charnow.value = dic[i];
      charnow.disabled = true;
      charnow.addEventListener("click", hangman.check);
      hangman.hChar.appendChild(charnow);
    }

    // (D3) START GAME
    let rst = document.getElementById("hangman-reset");
    rst.addEventListener("click", hangman.reset);
    rst.disabled = false;
    hangman.reset();
  },

  // (E) HELPER - TOGGLE ENABLE/DISABLE ALL AVAILABLE CHARACTERS
  toggle : function (disable) {
    let all = hangman.hChar.getElementsByTagName("input");
    for (var i of all) { i.disabled = disable; }
  },

  // (F) START/RESET THE GAME
  reset : function () {
    // (F1) RESET STATS
    hangman.rights = 0;
    hangman.wrongs = 0;
    hangman.hLives.innerHTML = hangman.guesses;
    hangman.hImg.style.opacity = 0;

    // (F2) CHOOSE A RANDOM WORD FROM THE DICTIONARY
    hangman.word = hangman.dictionary[Math.floor(Math.random() * Math.floor(hangman.dictionary.length))];
    hangman.word = hangman.word.toUpperCase();
    hangman.wordlen = hangman.word.length;
    // CHEAT!
    // console.log(hangman.word);

    // (F3) DRAW THE BLANKS
    hangman.hWord.innerHTML = "";
    for (var i=0; i<hangman.word.length; i++) {
      var charnow = document.createElement("span");
      charnow.innerHTML = "_";
      charnow.id = "hangword-" + i;
      hangman.hWord.appendChild(charnow);
    }

    // (F4) ENABLE ALL CHARACTERS
    hangman.toggle(false);
  },

  // (G) CHECK IF SELECTED CHARACTER IS IN THE CURRENT WORD
  check : function () {
    // (G1) CHECK FOR HITS
    var index = 0, hits = [];
    while (index >= 0) {
      index = hangman.word.indexOf(this.value, index);
      console.log(hangman.word)
      if (index == -1) { break; }
      else {
        hits.push(index);
        index++;
      }
    }

    // (G2) CORRECT - SHOW THE HITS
    if (hits.length > 0) {
      // Reveal words
      for (var hit of hits) {
        document.getElementById("hangword-" + hit).innerHTML = this.value;
      }

      // All hit - WIN!
      hangman.rights += hits.length;
      if (hangman.rights == hangman.wordlen) {
        hangman.toggle(true);
        alert("YOU WIN!");
      }
    }

    // (G3) WRONG - MINUS LIFE & SHOW HANGMAN
    else {
      // Update hangman
      hangman.wrongs++;
      var livesleft = hangman.guesses - hangman.wrongs;
      hangman.hLives.innerHTML = livesleft;
      hangman.hImg.style.opacity = (1 - (livesleft/hangman.guesses)).toFixed(2);

      // Run out of guesses - LOSE!
      if (hangman.wrongs == hangman.guesses) {
        hangman.toggle(true);
        alert("YOU LOSE!");
      }
    }

    // (G4) DISABLE SELECTED CHARACTER
    this.disabled = true;
  }
};

window.addEventListener("DOMContentLoaded", hangman.init);
