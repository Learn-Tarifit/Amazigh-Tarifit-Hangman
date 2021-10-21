String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

var hangman = {
  // (A) GAME SETTINGS
  // Total number of allowed guesses before hanging
  guesses : 10,
  // Available words for guessing
  //dictionary : ["impreɛss", "inɣɛcapable", "satisfɣɛaction", "devɣɛelop", "deɣɛtermine"],
  dictionary : {"head": "azeǧif", "brain": "aǧi", "hair": "aceɛur", "ponytail": "ajeṭṭuy", "eyes": "tiṭṭawin", "eyebrows": "tammiwin", "eyelashes": "abriwen", "ear": "ameẓẓuɣ", "nose": "tinzar", "mouth": "aqemmum", "teeth": "tiɣmas", "lips": "ancucen", "tongue": "iřes", "throat": "iri", "shoulder": "taɣṛut", "back": "aɛrur", "hand": "afus", "finger": "aḍaḍ", "thumb": "imez", "nails": "iccaren", "bellybutton": "tamit", "belly": "aɛeddis", "knee": "afud", "foot": "aḍar", "toe": "tafdent", "water": "aman", "milk": "aceffay", "buttermilk": "aɣi", "sugar": "ssukar", "bread": "aɣrum", "meat": "aysum", "egg": "tamǧač", "honey": "tammant", "rice": "aruẓ", "tea": "atay", "coffee": "řqehwa", "olive oil": "zzect", "butter": "dhen", "cheese": "furmaj", "chocolate": "cukulati", "cookies": "ɣayita", "soft ice": "laḍu", "candy": "ḥalawat", "ice": "pulu", "apple": "tateffaḥt", "honey melon": "abettix", "water melon": "dellaḥ", "pommegranate": "aremman", "banana": "platanu / banan", "apricot": "řmecmec", "pear": "řfiras", "peach": "řxux", "plums": "řbaquq", "orange": "aletcini", "potato": "baṭaṭa", "peas": "tinifin", "onion": "řebser", "cucumber": "řexyar", "carrot": "xizzu", "garlic": "ticart", "pepper": "řferfeř", "tomato": "tumaɛtic", "almond": "ǧuz", "nuts": "tqawit", "walnut": "taɣyact", "bird": "ajḍiḍ", "pigeon": "adbir", "chick": "afiǧus", "chicken": "tayaziṭ", "rooster": "ayaẓiḍ", "donkey": "aɣyur", "horse": "ayis/akida", "camel": "ařɣem", "cat": "amuc", "dog": "aqzin", "lamb": "izmar", "sheep": "icarri", "cow": "tafunast", "calf": "aɛejmi", "bull": "ayenduz", "goat": "taɣat", "bunny": "aqenni", "bunny (in the wild)": "ayarẓiẓ", "hedgehog": "insi", "pig": "iřef", "lion": "buharu", "hyena": "ifis", "fox": "icɛeb", "panther": "aɣiřas", "monkey": "řqard", "snake": "afiɣar", "mouse": "aɣarda", "frog": "aqaqriw", "bee": "tazizwit", "grasshopper": "burxes", "scorpion": "taɣirdent", "worm": "akecca", "fishes": "iserman", "1 o'clock": "waḥit", "4 o'clock": "arebɛa ", "3 o'clock": "tesɛa", "12 o'clock": "tenɛac", "half past 2": "tnayen d uzyen", "half past 5": "xemsa d uzyen", "half past 10": "ɛecra d uzyen", "half past 12": "tenɛac d uzyen", "quarter past 3": "trata urbeɛ", "quarter to 4": "arebɛa qel arbeɛ", "5 minutes to 9": "tesɛa qel xemsa", "5 minutes over 6": "setta uxemsa", "10 minutes to 7": "sebɛa qel ɛecra", "10 minutes over 8": "tmenya uɛecra", "20 mintues before 2": "tnayen qel ɛicrin", "20 minutes over 11": "ḥitac uɛicrin", "25 mintues over 1": "waḥit uxemsa uɛicrin", "25 mintues before 12": "tenɛac qel xemsa uɛicrin", "yellow": "awraɣ", "black": "abarcan", "red": "azeggʷaɣ", "blue": "aḥmaymi", "purple": "azbaybi", "green": "azegza", "brown": "aqehwi", "pink": "arusa", "white": "acemřař"},

  // (B) FLAGS
  word : null, // Current chosen word
  word_def: null, // Chosen word definition
  wordlen : 0, // Word length
  actual_wordlen : 0, // Actual word length without spaces
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
    var dic = ['A', 'B', 'C', 'Č', 'D', 'Ḍ', 'E', 'F', 'G', 'Ǧ', 'Ɣ', 'H', 'Ḥ', 'I', 'J', 'K', 'L', 'M', 'N', 'Ɛ', 'Q', 'R', 'Ř', 'Ṛ', 'S', 'Ṣ', 'T', 'Ṭ', 'U', 'W', 'X', 'Y', 'Z', 'Ẓ'];
    for (var i=0; i<dic.length; i++) {
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
    let key_dict = Object.keys(hangman.dictionary);
    hangman.word_def = key_dict[Math.floor(Math.random() * Math.floor(key_dict.length))];
    hangman.word = hangman.dictionary[hangman.word_def];
    hangman.word = hangman.word.toUpperCase();
    hangman.wordlen = hangman.word.length;
    hangman.actual_wordlen = hangman.word.replaceAll(' ', '').length;
    console.log(hangman.wordlen);
    console.log(hangman.actual_wordlen);
    console.log('-');
    // CHEAT!
    // console.log(hangman.word);

    // (F3) DRAW THE BLANKS
    hangman.hWord.innerHTML = "";
    for (var i=0; i<hangman.word.length; i++) {
      var charnow = document.createElement("span");
      var xx="_";
      if (hangman.word[i] == " ") {
        xx = " ";
      }
      charnow.innerHTML = xx;
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
      console.log(hangman.wordlen);
      console.log(hangman.actual_wordlen);
      console.log(hangman.rights);
      if (hangman.rights == hangman.actual_wordlen) {
        hangman.toggle(true);
        alert("YOU WIN!, " + hangman.word.toLowerCase() + " = " + hangman.word_def);
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
        alert("YOU LOSE!, " + hangman.word.toLowerCase() + " = " + hangman.word_def);
      }
    }

    // (G4) DISABLE SELECTED CHARACTER
    this.disabled = true;
  }
};

window.addEventListener("DOMContentLoaded", hangman.init);
