(function () {
  'use strict';

  /**
   * Embedded 80-word bank (20 per tier: easy, medium, hard, stretch)
   * Works offline via file:// and can be extended via data/word_bank.json or localStorage.
   */
  const EMBEDDED_WORD_BANK = [
    // ================= EASY (Grade 3, 10 pts) =================
    {
      word: "bright",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "BRYT",
      partOfSpeech: "adjective",
      definition: "Giving out or reflecting a lot of light; shining.",
      exampleSentence: "The bright sun warmed the playground all afternoon.",
      hints: ["Contains a silent 'gh'", "Rhymes with light and night"]
    },
    {
      word: "catch",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "KACH",
      partOfSpeech: "verb",
      definition: "To intercept and hold something that has been thrown.",
      exampleSentence: "Run fast so you can catch the baseball in your glove.",
      hints: ["Uses '-tch' at the end after a short vowel"]
    },
    {
      word: "clock",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "KLOK",
      partOfSpeech: "noun",
      definition: "A device used for measuring and showing the time.",
      exampleSentence: "The classroom clock showed that it was time for lunch.",
      hints: ["Starts with 'cl' blend and ends with 'ck'"]
    },
    {
      word: "drink",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "DRINK",
      partOfSpeech: "verb",
      definition: "To take a liquid into the mouth and swallow.",
      exampleSentence: "Remember to drink plenty of water after soccer practice.",
      hints: ["Starts with the 'dr' blend and ends with 'nk'"]
    },
    {
      word: "earth",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "URTH",
      partOfSpeech: "noun",
      definition: "The planet on which we live; soil or ground.",
      exampleSentence: "The earth felt cool and damp after the morning rain.",
      hints: ["Starts with 'ear' and ends with 'th'"]
    },
    {
      word: "float",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "FLOHT",
      partOfSpeech: "verb",
      definition: "To rest or move on the surface of a liquid without sinking.",
      exampleSentence: "Wooden toy boats float easily on the pond.",
      hints: ["Long 'o' sound spelled with 'oa'"]
    },
    {
      word: "friend",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "FREND",
      partOfSpeech: "noun",
      definition: "A person whom one knows well and is fond of.",
      exampleSentence: "My best friend saved me a seat on the school bus.",
      hints: ["Remember 'i' before 'e': fri-end"]
    },
    {
      word: "grain",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "GRAYN",
      partOfSpeech: "noun",
      definition: "Wheat or any other cultivated cereal crop used as food.",
      exampleSentence: "Farmers harvest golden grain at the end of summer.",
      hints: ["Long 'a' sound spelled with 'ai'"]
    },
    {
      word: "happy",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "HAP-ee",
      partOfSpeech: "adjective",
      definition: "Feeling or showing pleasure or contentment.",
      exampleSentence: "The puppy wagged its tail because it was happy to see us.",
      hints: ["Double 'p' in the middle, ends with 'y'"]
    },
    {
      word: "jelly",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "JEL-ee",
      partOfSpeech: "noun",
      definition: "A sweet clear fruit spread made with fruit juice and sugar.",
      exampleSentence: "He packed a peanut butter and grape jelly sandwich.",
      hints: ["Starts with 'j' and has a double 'l'"]
    },
    {
      word: "knock",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "NOK",
      partOfSpeech: "verb",
      definition: "To strike a surface noisily to attract attention.",
      exampleSentence: "Please knock on the door before entering the room.",
      hints: ["Starts with a silent 'k' before 'n'"]
    },
    {
      word: "laugh",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "LAF",
      partOfSpeech: "verb",
      definition: "To make the spontaneous sounds of lively amusement.",
      exampleSentence: "The funny joke made the whole class laugh out loud.",
      hints: ["Vowel team 'au' followed by 'gh' making an 'f' sound"]
    },
    {
      word: "night",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "NYT",
      partOfSpeech: "noun",
      definition: "The time of darkness between sunset and sunrise.",
      exampleSentence: "Owls hunt for food quietly during the night.",
      hints: ["Uses '-ight' for the long 'i' sound"]
    },
    {
      word: "people",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "PEE-puhl",
      partOfSpeech: "noun",
      definition: "Human beings in general or considered collectively.",
      exampleSentence: "Many people gathered in the park to watch the parade.",
      hints: ["Silent 'o' in the middle: pe-o-ple"]
    },
    {
      word: "plant",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "PLANT",
      partOfSpeech: "noun",
      definition: "A living organism such as a flower, tree, or shrub.",
      exampleSentence: "We watered the tomato plant in our school garden.",
      hints: ["Starts with 'pl' blend and ends with 'nt'"]
    },
    {
      word: "school",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "SKOOL",
      partOfSpeech: "noun",
      definition: "An institution for educating children.",
      exampleSentence: "We walked to school together every morning.",
      hints: ["Starts with 'sch' where 'ch' sounds like 'k'"]
    },
    {
      word: "smile",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "SMYL",
      partOfSpeech: "noun",
      definition: "A pleased, kind, or amused facial expression.",
      exampleSentence: "Her warm smile welcomed the new student to class.",
      hints: ["Silent 'e' at the end makes the 'i' long"]
    },
    {
      word: "spring",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "SPRING",
      partOfSpeech: "noun",
      definition: "The season after winter and before summer.",
      exampleSentence: "Tulips and daffodils bloom early in the spring.",
      hints: ["Starts with the three-letter blend 'spr'"]
    },
    {
      word: "train",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "TRAYN",
      partOfSpeech: "noun",
      definition: "A series of connected railroad cars pulled by an engine.",
      exampleSentence: "The passenger train whistled as it crossed the bridge.",
      hints: ["Starts with 'tr' and uses 'ai' for the long 'a' sound"]
    },
    {
      word: "watch",
      grade: 3,
      difficulty: "easy",
      points: 10,
      phonetic: "WOCH",
      partOfSpeech: "verb",
      definition: "To look at or observe attentively over a period of time.",
      exampleSentence: "We stayed up late to watch the meteor shower.",
      hints: ["Starts with 'wa' and ends with 'tch'"]
    },

    // ================= MEDIUM (Grade 3, 15 pts) =================
    {
      word: "adventure",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "ad-VEN-cher",
      partOfSpeech: "noun",
      definition: "An unusual and exciting experience or activity.",
      exampleSentence: "Camping in the mountains was a grand family adventure.",
      hints: ["Ends with '-ture'", "Three syllables: ad-ven-ture"]
    },
    {
      word: "balloon",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "buh-LOON",
      partOfSpeech: "noun",
      definition: "A brightly colored rubber bag inflated with air or gas.",
      exampleSentence: "A red helium balloon floated up toward the ceiling.",
      hints: ["Double 'l' and double 'o': bal-loon"]
    },
    {
      word: "beneath",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "bi-NEETH",
      partOfSpeech: "preposition",
      definition: "In or to a lower position than; directly underneath.",
      exampleSentence: "The cat hid beneath the cozy blanket during the storm.",
      hints: ["Starts with 'be-' and uses 'ea' before 'th'"]
    },
    {
      word: "calendar",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "KAL-uhn-der",
      partOfSpeech: "noun",
      definition: "A chart showing the days, weeks, and months of a year.",
      exampleSentence: "She circled her birthday on the kitchen calendar.",
      hints: ["Single 'l', ends with '-dar' not '-der'"]
    },
    {
      word: "captain",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "KAP-tin",
      partOfSpeech: "noun",
      definition: "The person in command of a ship, aircraft, or sports team.",
      exampleSentence: "The ship's captain steered safely into the harbor.",
      hints: ["Second syllable is spelled '-tain'"]
    },
    {
      word: "comfortable",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "KUM-fer-tuh-buhl",
      partOfSpeech: "adjective",
      definition: "Providing physical ease and relaxation.",
      exampleSentence: "This reading chair is the most comfortable spot in the house.",
      hints: ["Root word 'comfort' plus '-able'"]
    },
    {
      word: "different",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "DIF-er-uhnt",
      partOfSpeech: "adjective",
      definition: "Not the same as another or each other; unlike.",
      exampleSentence: "Every snowflake has a different crystal pattern.",
      hints: ["Double 'f', three syllables when spelled: dif-fer-ent"]
    },
    {
      word: "enough",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "i-NUF",
      partOfSpeech: "adjective",
      definition: "As much or as many as required.",
      exampleSentence: "There were enough cupcakes for everyone in the third grade.",
      hints: ["Starts with 'e' and ends with '-ough' sounding like 'uff'"]
    },
    {
      word: "favorite",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "FAY-vuh-rit",
      partOfSpeech: "adjective",
      definition: "Preferred before all others of the same kind.",
      exampleSentence: "Blueberry pancakes are my favorite weekend breakfast.",
      hints: ["Spelled 'fa-vor-ite' with an 'o' in the middle"]
    },
    {
      word: "island",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "EYE-luhnd",
      partOfSpeech: "noun",
      definition: "A piece of land completely surrounded by water.",
      exampleSentence: "We rode a ferry boat to visit the small island.",
      hints: ["Contains a silent 's' right after 'i'"]
    },
    {
      word: "journey",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "JUR-nee",
      partOfSpeech: "noun",
      definition: "An act of traveling from one place to another.",
      exampleSentence: "The pioneers prepared supplies for a long journey west.",
      hints: ["Starts with 'jour-' and ends with '-ney'"]
    },
    {
      word: "library",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "LY-brer-ee",
      partOfSpeech: "noun",
      definition: "A building or room containing collections of books to borrow.",
      exampleSentence: "I checked out three mystery books from the public library.",
      hints: ["Don't forget the first 'r' in '-brary'"]
    },
    {
      word: "mountain",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "MOWN-tin",
      partOfSpeech: "noun",
      definition: "A large natural elevation of the earth's surface.",
      exampleSentence: "Snow covered the peak of the tall mountain all year.",
      hints: ["Uses 'ou' in the first syllable and 'ai' in the second"]
    },
    {
      word: "neighbor",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "NAY-ber",
      partOfSpeech: "noun",
      definition: "A person living next door to or very near you.",
      exampleSentence: "Our friendly neighbor helped us carry in the groceries.",
      hints: ["Uses 'eigh' for the long 'a' sound and ends with '-bor'"]
    },
    {
      word: "promise",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "PROM-is",
      partOfSpeech: "noun",
      definition: "A declaration or assurance that one will do a particular thing.",
      exampleSentence: "She kept her promise to practice the piano every day.",
      hints: ["Ends with '-ise', not '-iss'"]
    },
    {
      word: "question",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "KWES-chuhn",
      partOfSpeech: "noun",
      definition: "A sentence worded or expressed so as to elicit information.",
      exampleSentence: "Raise your hand if you have a question about the puzzle.",
      hints: ["Starts with 'qu' and ends with '-tion'"]
    },
    {
      word: "sudden",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "SUD-uhn",
      partOfSpeech: "adjective",
      definition: "Occurring or done quickly and unexpectedly.",
      exampleSentence: "A sudden gust of wind blew the leaves across the yard.",
      hints: ["Double 'd' in the middle: sud-den"]
    },
    {
      word: "treasure",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "TREZH-er",
      partOfSpeech: "noun",
      definition: "A quantity of precious metals, gems, or other valuable objects.",
      exampleSentence: "The pirate map showed where the buried treasure was hidden.",
      hints: ["Short 'e' spelled with 'ea', ends with '-sure'"]
    },
    {
      word: "trouble",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "TRUB-uhl",
      partOfSpeech: "noun",
      definition: "Difficulty or problems.",
      exampleSentence: "He had no trouble solving the last riddle.",
      hints: ["Short 'u' sound spelled with 'ou': trou-ble"]
    },
    {
      word: "weather",
      grade: 3,
      difficulty: "medium",
      points: 15,
      phonetic: "WETH-er",
      partOfSpeech: "noun",
      definition: "The state of the atmosphere with respect to sunshine, rain, or wind.",
      exampleSentence: "Sunny weather is expected for Saturday's picnic.",
      hints: ["Spelled with 'ea' in the first syllable: weath-er"]
    },

    // ================= HARD (Grade 3, 20 pts) =================
    {
      word: "accident",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "AK-si-duhnt",
      partOfSpeech: "noun",
      definition: "An unfortunate incident that happens unexpectedly and unintentionally.",
      exampleSentence: "Spilling the cup of juice was an honest accident.",
      hints: ["Double 'c' where the first is hard (k) and second is soft (s)"]
    },
    {
      word: "applause",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "uh-PLAWZ",
      partOfSpeech: "noun",
      definition: "Approval or praise expressed by clapping hands.",
      exampleSentence: "The young pianist took a bow to loud applause.",
      hints: ["Double 'p', uses 'au' and ends with '-se'"]
    },
    {
      word: "audience",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "AW-dee-uhns",
      partOfSpeech: "noun",
      definition: "The assembled spectators or listeners at a public event.",
      exampleSentence: "The audience cheered when the curtain rose on stage.",
      hints: ["Starts with 'au-' and ends with '-ience'"]
    },
    {
      word: "bicycle",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "BY-si-kuhl",
      partOfSpeech: "noun",
      definition: "A vehicle with two wheels powered by pedals.",
      exampleSentence: "She wore a helmet while riding her new bicycle.",
      hints: ["Prefix 'bi-' (two) + 'cycle' (wheel)"]
    },
    {
      word: "celebrate",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "SEL-uh-brayt",
      partOfSpeech: "verb",
      definition: "To acknowledge a significant or happy day with a joyful activity.",
      exampleSentence: "We baked a cake to celebrate the end of the school year.",
      hints: ["Starts with a soft 'c', followed by 'e-l-e': cel-e-brate"]
    },
    {
      word: "chocolate",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "CHOK-lit",
      partOfSpeech: "noun",
      definition: "A sweet food made from roasted and ground cacao seeds.",
      exampleSentence: "Warm hot chocolate tastes wonderful on a snowy day.",
      hints: ["Remember the silent middle 'o': choc-o-late"]
    },
    {
      word: "creature",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "KREE-cher",
      partOfSpeech: "noun",
      definition: "An animal, as distinct from a human being.",
      exampleSentence: "The octopus is a fascinating ocean creature.",
      hints: ["Uses 'ea' in the first syllable and '-ture' at the end"]
    },
    {
      word: "dangerous",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "DAYN-jer-uhs",
      partOfSpeech: "adjective",
      definition: "Able or likely to cause harm or injury.",
      exampleSentence: "Swimming during a thunderstorm is very dangerous.",
      hints: ["Root word 'danger' plus suffix '-ous'"]
    },
    {
      word: "disappear",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "dis-uh-PEER",
      partOfSpeech: "verb",
      definition: "To cease to be visible.",
      exampleSentence: "We watched the magician make the silver coin disappear.",
      hints: ["One 's' and two 'p's: dis + appear"]
    },
    {
      word: "elephant",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "EL-uh-fuhnt",
      partOfSpeech: "noun",
      definition: "A very large plant-eating mammal with a trunk and tusks.",
      exampleSentence: "The baby elephant sprayed water with its trunk.",
      hints: ["Uses 'ph' for the 'f' sound: el-e-phant"]
    },
    {
      word: "exercise",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "EK-ser-syz",
      partOfSpeech: "noun",
      definition: "Activity requiring physical effort to sustain or improve health.",
      exampleSentence: "Jumping rope is a fun form of daily exercise.",
      hints: ["Starts with 'ex-er-' (no 'c' after 'x') and ends with '-cise'"]
    },
    {
      word: "furniture",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "FUR-ni-cher",
      partOfSpeech: "noun",
      definition: "Large movable equipment such as tables and chairs.",
      exampleSentence: "They arranged the wooden furniture in the living room.",
      hints: ["Starts with 'fur-ni-' and ends with '-ture'"]
    },
    {
      word: "groceries",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "GROH-suh-reez",
      partOfSpeech: "noun",
      definition: "Items of food and household supplies sold in a supermarket.",
      exampleSentence: "Dad unpacked the bags of fresh groceries on the counter.",
      hints: ["Drop the 'y' in 'grocery' and add '-ies'"]
    },
    {
      word: "important",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "im-POR-tnt",
      partOfSpeech: "adjective",
      definition: "Of great significance or value.",
      exampleSentence: "Getting a good night's sleep is important before a test.",
      hints: ["Ends with '-tant' (an 'a', not an 'e')"]
    },
    {
      word: "knowledge",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "NOL-ij",
      partOfSpeech: "noun",
      definition: "Facts, information, and skills acquired through experience or education.",
      exampleSentence: "Reading books expands your knowledge of the world.",
      hints: ["Starts with 'know' and ends with 'ledge'"]
    },
    {
      word: "medicine",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "MED-i-sin",
      partOfSpeech: "noun",
      definition: "A substance taken to treat or prevent illness.",
      exampleSentence: "The doctor prescribed cherry-flavored medicine for his cough.",
      hints: ["Spelled 'med-i-cine' with a soft 'c'"]
    },
    {
      word: "orchestra",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "OR-ki-struh",
      partOfSpeech: "noun",
      definition: "A large group of musicians playing instruments together.",
      exampleSentence: "Violins and cellos tuned up in the school orchestra.",
      hints: ["Uses 'ch' for the 'k' sound: or-ches-tra"]
    },
    {
      word: "separate",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "SEP-uh-rayt",
      partOfSpeech: "verb",
      definition: "To cause to move or be apart.",
      exampleSentence: "Please separate the dark laundry from the white towels.",
      hints: ["There is 'a rat' in sep-a-rate (an 'a' in the middle)"]
    },
    {
      word: "straight",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "STRAYT",
      partOfSpeech: "adjective",
      definition: "Extending uniformly in one direction only; without a curve.",
      exampleSentence: "Use a ruler to draw a straight line across the paper.",
      hints: ["Starts with 'str' and uses '-aight'"]
    },
    {
      word: "tomorrow",
      grade: 3,
      difficulty: "hard",
      points: 20,
      phonetic: "tuh-MOR-oh",
      partOfSpeech: "noun",
      definition: "On the day after today.",
      exampleSentence: "Our class field trip to the science museum is tomorrow.",
      hints: ["Single 'm', double 'r': to-mor-row"]
    },

    // ================= STRETCH (Grade 4-5, 25 pts) =================
    {
      word: "accommodate",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "uh-KOM-uh-dayt",
      partOfSpeech: "verb",
      definition: "To provide lodging or sufficient space for.",
      exampleSentence: "The auditorium can accommodate five hundred students.",
      hints: ["Double 'c' AND double 'm': ac-com-mo-date"]
    },
    {
      word: "camouflage",
      grade: 4,
      difficulty: "stretch",
      points: 25,
      phonetic: "KAM-uh-flahzh",
      partOfSpeech: "noun",
      definition: "The disguising of animals or objects to blend in with surroundings.",
      exampleSentence: "The lizard's green skin served as natural camouflage.",
      hints: ["Uses 'ou' in the middle and ends with '-flage'"]
    },
    {
      word: "chandelier",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "shan-duh-LEER",
      partOfSpeech: "noun",
      definition: "A decorative hanging light with branches for several bulbs.",
      exampleSentence: "A crystal chandelier sparkled above the hotel lobby.",
      hints: ["Starts with 'ch' sounding like 'sh' and ends with '-lier'"]
    },
    {
      word: "choreography",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "kor-ee-OG-ruh-fee",
      partOfSpeech: "noun",
      definition: "The sequence of steps and movements in a staged dance.",
      exampleSentence: "The dancers practiced the complex choreography for weeks.",
      hints: ["Greek roots: 'choreo-' (dance) + '-graphy' (writing)"]
    },
    {
      word: "chrysanthemum",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "kri-SAN-thuh-muhm",
      partOfSpeech: "noun",
      definition: "A popular autumn garden plant with brightly colored blooms.",
      exampleSentence: "A yellow chrysanthemum bloomed beside the front porch.",
      hints: ["Starts with 'chrys-' (Greek for gold) + '-an-the-mum'"]
    },
    {
      word: "conscientious",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "kon-shee-EN-shuhs",
      partOfSpeech: "adjective",
      definition: "Wishing to do one's work or duty well and thoroughly.",
      exampleSentence: "The conscientious student double-checked every answer.",
      hints: ["Contains 'science' without the final 'e': con-sci-en-tious"]
    },
    {
      word: "entrepreneur",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "on-truh-pruh-NUR",
      partOfSpeech: "noun",
      definition: "A person who organizes and operates a business venture.",
      exampleSentence: "The young entrepreneur started a neighborhood dog-walking service.",
      hints: ["French origin: en-tre-pre-neur"]
    },
    {
      word: "fluorescent",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "floo-RES-uhnt",
      partOfSpeech: "adjective",
      definition: "Vividly colorful and glowing brightly under light.",
      exampleSentence: "She highlighted the key vocabulary words with a fluorescent marker.",
      hints: ["Starts with 'fluo-' (u before o) and has 'sc' in '-rescent'"]
    },
    {
      word: "kaleidoscope",
      grade: 4,
      difficulty: "stretch",
      points: 25,
      phonetic: "kuh-LY-duh-skohp",
      partOfSpeech: "noun",
      definition: "A tube containing mirrors and colored glass producing symmetrical patterns.",
      exampleSentence: "Turning the kaleidoscope created a shifting star of colors.",
      hints: ["Spelled 'ka-lei-do-scope' with 'ei' in the second syllable"]
    },
    {
      word: "labyrinth",
      grade: 4,
      difficulty: "stretch",
      points: 25,
      phonetic: "LAB-uh-rinth",
      partOfSpeech: "noun",
      definition: "A complicated irregular network of passages or paths; a maze.",
      exampleSentence: "The hedge garden formed a twisting green labyrinth.",
      hints: ["Uses 'y' for the short 'i' sound in the second syllable: lab-y-rinth"]
    },
    {
      word: "magnificent",
      grade: 4,
      difficulty: "stretch",
      points: 25,
      phonetic: "mag-NIF-i-suhnt",
      partOfSpeech: "adjective",
      definition: "Extremely beautiful, elaborate, or impressive.",
      exampleSentence: "We had a magnificent view of the canyon at sunset.",
      hints: ["Spelled 'mag-nif-i-cent' with a soft 'c'"]
    },
    {
      word: "mischievous",
      grade: 4,
      difficulty: "stretch",
      points: 25,
      phonetic: "MIS-chuh-vuhs",
      partOfSpeech: "adjective",
      definition: "Causing or showing a fondness for playfully causing trouble.",
      exampleSentence: "The mischievous kitten untied everyone's shoelaces.",
      hints: ["Three syllables only: 'mis-chie-vous' (no 'i' after the 'v')"]
    },
    {
      word: "onomatopoeia",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "on-uh-mat-uh-PEE-uh",
      partOfSpeech: "noun",
      definition: "A word that imitates the natural sound of a thing, like buzz or sizzle.",
      exampleSentence: "Words like splash and boom are examples of onomatopoeia.",
      hints: ["Ends with four vowels in a row: '-poeia'"]
    },
    {
      word: "parliament",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "PAR-luh-muhnt",
      partOfSpeech: "noun",
      definition: "A national legislative body of elected representatives; also a group of owls.",
      exampleSentence: "A group of owls perched in a tree is called a parliament.",
      hints: ["Contains a silent 'i': par-lia-ment"]
    },
    {
      word: "phenomenon",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "fi-NOM-uh-non",
      partOfSpeech: "noun",
      definition: "A remarkable or observable fact, event, or natural occurrence.",
      exampleSentence: "The northern lights are a breathtaking natural phenomenon.",
      hints: ["Starts with 'ph' and alternates vowels: phe-nom-e-non"]
    },
    {
      word: "pneumonia",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "noo-MOHN-yuh",
      partOfSpeech: "noun",
      definition: "An infection that inflames the air sacs in one or both lungs.",
      exampleSentence: "Warm rest and medicine helped him recover from pneumonia.",
      hints: ["Starts with a silent 'p' before 'neu-' (Greek for lung/air)"]
    },
    {
      word: "pronunciation",
      grade: 4,
      difficulty: "stretch",
      points: 25,
      phonetic: "pruh-nun-see-AY-shuhn",
      partOfSpeech: "noun",
      definition: "The way in which a word is spoken.",
      exampleSentence: "Listening carefully helps you master the pronunciation of new words.",
      hints: ["Spelled '-nun-' in the middle (not '-noun-'): pro-nun-ci-a-tion"]
    },
    {
      word: "questionnaire",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "kwes-chuh-NAIR",
      partOfSpeech: "noun",
      definition: "A set of printed or written questions with a choice of answers.",
      exampleSentence: "Students completed a short questionnaire about their favorite books.",
      hints: ["Double 'n' and ends with '-aire': question + naire"]
    },
    {
      word: "silhouette",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "sil-oo-ET",
      partOfSpeech: "noun",
      definition: "The dark shape and outline of someone or something visible against a brighter background.",
      exampleSentence: "The deer's silhouette stood out against the orange evening sky.",
      hints: ["Silent 'h' after 'l', ends with '-ouette': sil-hou-ette"]
    },
    {
      word: "ventriloquist",
      grade: 5,
      difficulty: "stretch",
      points: 25,
      phonetic: "ven-TRIL-uh-kwist",
      partOfSpeech: "noun",
      definition: "A performer who can speak without moving their lips so the voice seems to come from a puppet.",
      exampleSentence: "The talented ventriloquist made the wooden puppet tell funny stories.",
      hints: ["Latin roots for belly ('ventri-') + speaker ('-loquist')"]
    }
  ];

  /**
   * Dedicated 64-word bank for Age 4–5 (Kindergarten / Early 1st Grade Phonics & Sight Words)
   * 16 words per tier:
   * - easy: 3-letter CVC words (cat, dog, sun, hat...)
   * - medium: 4-letter blends & sight words (frog, star, jump, cake...)
   * - hard: 5-letter kindergarten words (smile, train, plant, happy...)
   * - stretch: Big-kid 1st-grade words (friend, school, garden, rainbow...)
   */
  const AGE_4_5_WORD_BANK = [
    // EASY (3-letter CVC)
    { word: "cat", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "A small furry pet that says meow.", exampleSentence: "The orange cat slept on the warm rug.", hints: ["Starts with c: c-a-t"] },
    { word: "dog", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "A friendly pet that barks and wags its tail.", exampleSentence: "Our dog loves to fetch the red ball.", hints: ["Sound it out: d-o-g"] },
    { word: "sun", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "The bright star that shines in the daytime sky.", exampleSentence: "The yellow sun is shining brightly today.", hints: ["Starts with s: s-u-n"] },
    { word: "hat", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "Something you wear on your head.", exampleSentence: "She wore a sun hat at the beach.", hints: ["Rhymes with cat: h-a-t"] },
    { word: "pig", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "A pink farm animal with a curly tail.", exampleSentence: "The little pig rolled in the mud.", hints: ["Short i in the middle: p-i-g"] },
    { word: "bed", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "A cozy place where you sleep at night.", exampleSentence: "It is time to brush your teeth and go to bed.", hints: ["Starts with b, ends with d: b-e-d"] },
    { word: "cup", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "A small container you drink water or milk from.", exampleSentence: "He poured cold milk into his blue cup.", hints: ["Starts with c: c-u-p"] },
    { word: "fox", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "A clever wild animal with a bushy orange tail.", exampleSentence: "A red fox trotted across the forest path.", hints: ["Ends with the letter x: f-o-x"] },
    { word: "jam", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "Sweet fruit spread you put on toast.", exampleSentence: "We put strawberry jam on our warm toast.", hints: ["Starts with j: j-a-m"] },
    { word: "map", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "A drawing of roads, towns, or treasure islands.", exampleSentence: "We looked at the park map to find the zoo.", hints: ["Starts with m, ends with p: m-a-p"] },
    { word: "net", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "A mesh bag used to catch butterflies or fish, or a soccer goal.", exampleSentence: "She kicked the soccer ball right into the net.", hints: ["Short e in the middle: n-e-t"] },
    { word: "pen", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "A tool with ink used for writing or drawing.", exampleSentence: "Dad signed his name with a blue pen.", hints: ["Rhymes with ten: p-e-n"] },
    { word: "bus", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "A big yellow vehicle that takes kids to school.", exampleSentence: "We waved as the yellow school bus drove by.", hints: ["Short u in the middle: b-u-s"] },
    { word: "fan", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "noun", definition: "A machine with spinning blades that blows cool air.", exampleSentence: "Turn on the fan to cool down the room.", hints: ["Rhymes with pan and can: f-a-n"] },
    { word: "hop", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "verb", definition: "To jump up and down like a bunny or frog.", exampleSentence: "Watch the little bunny hop across the grass.", hints: ["Starts with h: h-o-p"] },
    { word: "red", grade: 0, difficulty: "easy", points: 10, partOfSpeech: "adjective", definition: "The bright color of a ripe strawberry or fire truck.", exampleSentence: "She picked a shiny red apple from the basket.", hints: ["Rhymes with bed: r-e-d"] },

    // MEDIUM (4-letter Blends, Digraphs & CVCe)
    { word: "frog", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "A green jumping animal that lives near ponds and says ribbit.", exampleSentence: "The green frog jumped onto a lily pad.", hints: ["Starts with the 'fr' blend: f-r-o-g"] },
    { word: "star", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "A tiny twinkling light in the night sky.", exampleSentence: "We made a wish on the first bright star.", hints: ["Starts with 'st' and ends with 'ar'"] },
    { word: "jump", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "verb", definition: "To push yourself up into the air with your feet.", exampleSentence: "How high can you jump on the trampoline?", hints: ["Starts with j and ends with 'mp'"] },
    { word: "milk", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "A white drink that comes from cows and makes bones strong.", exampleSentence: "She drank a glass of cold milk with breakfast.", hints: ["Ends with 'lk': m-i-l-k"] },
    { word: "ship", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "A large boat that sails across the ocean.", exampleSentence: "The tall sailing ship glided across the sea.", hints: ["Starts with the 'sh' sound: s-h-i-p"] },
    { word: "cake", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "A sweet baked dessert for birthdays.", exampleSentence: "We put five candles on the birthday cake.", hints: ["Magic 'e' at the end makes the 'a' say its name"] },
    { word: "bike", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "A two-wheeled cycle that you pedal.", exampleSentence: "He rode his red bike down the driveway.", hints: ["Magic 'e' at the end: b-i-k-e"] },
    { word: "tree", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "A tall plant with a wooden trunk, branches, and leaves.", exampleSentence: "A squirrel climbed up the tall oak tree.", hints: ["Starts with 'tr' and ends with double 'ee'"] },
    { word: "fish", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "An animal with fins that swims in the water.", exampleSentence: "Colorful fish swam around the coral reef.", hints: ["Ends with the 'sh' sound: f-i-s-h"] },
    { word: "duck", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "A water bird with webbed feet that says quack.", exampleSentence: "The yellow duck paddled across the pond.", hints: ["Ends with 'ck': d-u-c-k"] },
    { word: "drum", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "A musical instrument you tap with sticks to make a beat.", exampleSentence: "He tapped a steady beat on the big drum.", hints: ["Starts with the 'dr' blend: d-r-u-m"] },
    { word: "flag", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "A piece of cloth with colors or stars that waves on a pole.", exampleSentence: "The colorful flag waved in the morning breeze.", hints: ["Starts with the 'fl' blend: f-l-a-g"] },
    { word: "nest", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "A cozy home of twigs built by a bird for its eggs.", exampleSentence: "Three blue robin eggs rested inside the nest.", hints: ["Ends with 'st': n-e-s-t"] },
    { word: "snow", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "Soft white flakes that fall from the sky in winter.", exampleSentence: "We built a happy snowman in the fresh snow.", hints: ["Starts with 'sn' and ends with 'ow'"] },
    { word: "book", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "Pages with stories and pictures that you read.", exampleSentence: "We read a funny bedtime book together.", hints: ["Double 'oo' in the middle: b-o-o-k"] },
    { word: "moon", grade: 1, difficulty: "medium", points: 15, partOfSpeech: "noun", definition: "The bright round orb that shines in the night sky.", exampleSentence: "The full moon glowed above the rooftops.", hints: ["Double 'oo' in the middle: m-o-o-n"] },

    // HARD (5-letter Kindergarten / 1st Grade Words)
    { word: "smile", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "A happy expression on your face.", exampleSentence: "Her big smile made everyone feel welcome.", hints: ["Starts with 'sm' and has a magic 'e': s-m-i-l-e"] },
    { word: "train", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "Cars on tracks pulled by a locomotive engine.", exampleSentence: "The toy train chugged around the wooden track.", hints: ["Uses 'ai' in the middle: t-r-a-i-n"] },
    { word: "clock", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "Something on the wall that tells the time.", exampleSentence: "The wall clock showed that it was noon.", hints: ["Starts with 'cl' and ends with 'ck'"] },
    { word: "plant", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "A green living thing that grows in soil.", exampleSentence: "We watered the little flower plant every day.", hints: ["Starts with 'pl' and ends with 'nt'"] },
    { word: "happy", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "adjective", definition: "Feeling joyful and glad.", exampleSentence: "The puppy was so happy to play in the yard.", hints: ["Double 'p' in the middle, ends with 'y'"] },
    { word: "green", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "adjective", definition: "The color of grass and leaves in spring.", exampleSentence: "The caterpillar munched on a green leaf.", hints: ["Starts with 'gr' and has double 'ee'"] },
    { word: "cloud", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "A fluffy white shape floating in the sky.", exampleSentence: "A puffy white cloud drifted across the blue sky.", hints: ["Starts with 'cl' and uses 'ou': c-l-o-u-d"] },
    { word: "truck", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "A big vehicle used for carrying heavy loads.", exampleSentence: "The red fire truck raced down the street.", hints: ["Starts with 'tr' and ends with 'ck'"] },
    { word: "spoon", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "A utensil you use to eat soup or cereal.", exampleSentence: "She used a spoon to eat her warm oatmeal.", hints: ["Starts with 'sp' and has double 'oo'"] },
    { word: "brush", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "A tool with bristles for painting or cleaning teeth.", exampleSentence: "Use your paint brush to add bright yellow stars.", hints: ["Starts with 'br' and ends with 'sh'"] },
    { word: "snack", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "A small bite of food between meals.", exampleSentence: "We ate apple slices and cheese for our snack.", hints: ["Starts with 'sn' and ends with 'ck'"] },
    { word: "shark", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "A large ocean fish with a fin on its back.", exampleSentence: "We saw a nurse shark at the aquarium.", hints: ["Starts with 'sh' and ends with 'ark'"] },
    { word: "whale", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "A giant ocean mammal that breathes through a blowhole.", exampleSentence: "A blue whale spouted water in the ocean.", hints: ["Starts with 'wh' and ends with magic 'e'"] },
    { word: "grape", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "A small round juicy fruit that grows in bunches.", exampleSentence: "He popped a sweet purple grape into his mouth.", hints: ["Starts with 'gr' and ends with magic 'e'"] },
    { word: "house", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "A building where a family lives.", exampleSentence: "We painted a picture of our house and garden.", hints: ["Uses 'ou' and ends with 'se': h-o-u-s-e"] },
    { word: "water", grade: 1, difficulty: "hard", points: 20, partOfSpeech: "noun", definition: "Clear liquid that falls as rain and fills rivers and cups.", exampleSentence: "Drink a cool glass of water after running.", hints: ["Starts with 'wa-' and ends with '-ter'"] },

    // STRETCH (Big Kid 6-7 Letter Words for Age 4–5)
    { word: "friend", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "Someone you like to play and share with.", exampleSentence: "My friend and I built a tall block tower.", hints: ["Spelled f-r-i-e-n-d"] },
    { word: "school", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "The place where children go to learn and play.", exampleSentence: "She carried her new backpack to school.", hints: ["Starts with 'sch' and has double 'oo'"] },
    { word: "yellow", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "adjective", definition: "The bright color of lemons, bananas, and sunflowers.", exampleSentence: "A yellow butterfly landed on the flower.", hints: ["Double 'l' in the middle, ends with 'ow'"] },
    { word: "garden", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "A patch of ground where flowers and vegetables grow.", exampleSentence: "Tomatoes and carrots are growing in our garden.", hints: ["Two syllables: gar-den"] },
    { word: "rabbit", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "A furry animal with long ears that loves carrots.", exampleSentence: "A white rabbit hopped into the clover patch.", hints: ["Double 'b' in the middle: rab-bit"] },
    { word: "planet", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "A large world in space that orbits a star, like Earth or Mars.", exampleSentence: "Earth is the blue planet that we call home.", hints: ["Two syllables: plan-et"] },
    { word: "kitten", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "A baby cat.", exampleSentence: "The playful kitten chased a ball of yarn.", hints: ["Double 't' in the middle: kit-ten"] },
    { word: "purple", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "adjective", definition: "A color made by mixing red and blue.", exampleSentence: "She colored the plum with a purple crayon.", hints: ["Starts with 'pur-' and ends with '-ple'"] },
    { word: "rocket", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "A spacecraft that blasts off into outer space.", exampleSentence: "The silver rocket zoomed up toward the stars.", hints: ["Uses 'ck' in the middle: rock-et"] },
    { word: "family", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "Parents, children, and loved ones who care for each other.", exampleSentence: "Our whole family went for a walk on the beach.", hints: ["Three syllables: fam-i-ly"] },
    { word: "summer", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "The warmest season of the year.", exampleSentence: "We love swimming at the pool during summer.", hints: ["Double 'm' in the middle: sum-mer"] },
    { word: "winter", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "The coolest season of the year when snow falls.", exampleSentence: "We wear warm coats and mittens in winter.", hints: ["Two syllables: win-ter"] },
    { word: "monkey", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "A playful tree-climbing animal with a long tail.", exampleSentence: "The clever monkey swung from branch to branch.", hints: ["Starts with 'mon-' and ends with '-key'"] },
    { word: "dragon", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "A storybook creature with wings and scales.", exampleSentence: "The friendly dragon flew over the castle.", hints: ["Two syllables: drag-on"] },
    { word: "castle", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "A grand stone fortress with towers and a moat.", exampleSentence: "We built a giant sand castle by the waves.", hints: ["Silent 't' in the middle: cas-tle"] },
    { word: "rainbow", grade: 2, difficulty: "stretch", points: 25, partOfSpeech: "noun", definition: "A colorful arch in the sky after rain.", exampleSentence: "A seven-color rainbow appeared after the rainstorm.", hints: ["Compound word: rain + bow"] }
  ];

  const TIER_ORDER = ['easy', 'medium', 'hard', 'stretch'];
  const TIER_LABELS = {
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
    stretch: 'Stretch'
  };

  const TIER_POINTS = {
    easy: 10,
    medium: 15,
    hard: 20,
    stretch: 25
  };

  const STORAGE_KEYS = {
    score: 'spellingbee_score',
    streak: 'spellingbee_streak',
    tier: 'spellingbee_tier',
    theme: 'spellingbee_theme',
    customWords: 'spellingbee_custom_words',
    ageMode: 'spellingbee_age_mode',
    mastery: 'spellingbee_mastery_v1'
  };

  const ROUND_LENGTH = 10;

  // ================= Application State =================
  const state = {
    wordBank: [...EMBEDDED_WORD_BANK],
    ageMode: 'age8_9',
    tier: 'easy',
    score: 0,
    streak: 0,
    roundScore: 0,
    roundWords: [],
    currentIndex: 0,
    submitted: false,
    missedInRound: [],
    masteryByAge: {
      age4_5: { tier: 'easy', mastered: [], missed: [] },
      age8_9: { tier: 'easy', mastered: [], missed: [] }
    },
    usedWordsByTier: {
      easy: new Set(),
      medium: new Set(),
      hard: new Set(),
      stretch: new Set()
    },
    enabledAids: new Set(),
    preferredVoice: null
  };

  // ================= DOM References =================
  const dom = {
    ageButtons: Array.from(document.querySelectorAll('.age-mode-btn')),
    tierButtons: Array.from(document.querySelectorAll('.tier-btn')),
    statusReadout: document.getElementById('status-readout'),
    themeToggle: document.getElementById('theme-toggle'),
    practiceStage: document.getElementById('practice-stage'),
    hearWordBtn: document.getElementById('hear-word-btn'),
    wordAids: document.getElementById('word-aids'),
    spellForm: document.getElementById('spell-form'),
    spellInput: document.getElementById('spell-input'),
    checkBtn: document.getElementById('check-btn'),
    feedbackArea: document.getElementById('feedback-area'),
    feedbackBanner: document.querySelector('.feedback-banner'),
    feedbackText: document.getElementById('feedback-text'),
    nextBtn: document.getElementById('next-btn'),
    diffContainer: document.getElementById('diff-container'),
    diffYours: document.getElementById('diff-yours'),
    diffCorrect: document.getElementById('diff-correct'),
    summaryStage: document.getElementById('summary-stage'),
    summaryTitle: document.querySelector('.summary-title'),
    summaryScore: document.getElementById('summary-score'),
    summaryCorrect: document.getElementById('summary-correct'),
    summaryAccuracy: document.getElementById('summary-accuracy'),
    reviewEmpty: document.getElementById('review-empty'),
    reviewList: document.getElementById('review-list'),
    practiceMissedBtn: document.getElementById('practice-missed-btn'),
    nextRoundBtn: document.getElementById('next-round-btn'),
    touchKb: document.getElementById('sb-touch-kb')
  };

  function getActiveWordBank() {
    return state.ageMode === 'age4_5' ? AGE_4_5_WORD_BANK : state.wordBank;
  }

  function getActiveMasteryProfile() {
    if (!state.masteryByAge[state.ageMode]) {
      state.masteryByAge[state.ageMode] = { tier: 'easy', mastered: [], missed: [] };
    }
    return state.masteryByAge[state.ageMode];
  }

  function recordWordResult(wordStr, isCorrect) {
    const key = (wordStr || '').trim().toLowerCase();
    if (!key) return;
    const prof = getActiveMasteryProfile();
    if (!Array.isArray(prof.mastered)) prof.mastered = [];
    if (!Array.isArray(prof.missed)) prof.missed = [];

    if (isCorrect) {
      if (!prof.mastered.includes(key)) {
        prof.mastered.push(key);
      }
      prof.missed = prof.missed.filter((w) => w !== key);
    } else {
      if (!prof.missed.includes(key)) {
        prof.missed.push(key);
      }
    }
    savePersistedState();
  }

  // ================= Persistence & URL Params =================
  function loadPersistedState() {
    try {
      const savedScore = parseInt(localStorage.getItem(STORAGE_KEYS.score), 10);
      if (!Number.isNaN(savedScore) && savedScore >= 0) {
        state.score = savedScore;
      }

      const savedStreak = parseInt(localStorage.getItem(STORAGE_KEYS.streak), 10);
      if (!Number.isNaN(savedStreak) && savedStreak >= 0) {
        state.streak = savedStreak;
      }

      const savedAge = localStorage.getItem(STORAGE_KEYS.ageMode);
      if (savedAge === 'age4_5' || savedAge === 'age8_9') {
        state.ageMode = savedAge;
      }

      const rawMastery = localStorage.getItem(STORAGE_KEYS.mastery);
      if (rawMastery) {
        const parsedMastery = JSON.parse(rawMastery);
        if (parsedMastery && typeof parsedMastery === 'object') {
          state.masteryByAge = Object.assign(state.masteryByAge, parsedMastery);
        }
      }

      const activeProf = getActiveMasteryProfile();
      const savedTier = activeProf.tier || localStorage.getItem(STORAGE_KEYS.tier);
      if (savedTier && TIER_POINTS[savedTier]) {
        state.tier = savedTier;
      }

      const savedTheme = localStorage.getItem(STORAGE_KEYS.theme);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        applyTheme(savedTheme);
      } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        applyTheme('dark');
      } else {
        applyTheme('light');
      }

      const customRaw = localStorage.getItem(STORAGE_KEYS.customWords);
      if (customRaw) {
        const customParsed = JSON.parse(customRaw);
        if (Array.isArray(customParsed)) {
          mergeWordsIntoBank(customParsed);
        }
      }
    } catch (_) {
      // Ignore storage access errors in restricted/private contexts
    }
  }

  let syncDebounceTimer = null;

  function scheduleServerBackup(extraPayload) {
    if (syncDebounceTimer) clearTimeout(syncDebounceTimer);
    syncDebounceTimer = setTimeout(() => {
      syncServerProgress(extraPayload);
    }, 1200);
  }

  async function syncServerProgress(extraPayload) {
    if (window.location.protocol === 'file:') return;
    try {
      const payload = Object.assign({
        spellingbee: {
          mastery: state.masteryByAge,
          score: state.score,
          streak: state.streak,
          ageMode: state.ageMode
        }
      }, extraPayload || {});
      const res = await fetch('/api/kids/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) return;
      const data = await res.json();
      const srvSpell = data && data.progress && data.progress.spellingbee;
      if (!srvSpell) return;

      if (srvSpell.mastery && typeof srvSpell.mastery === 'object') {
        state.masteryByAge = Object.assign({}, state.masteryByAge, srvSpell.mastery);
        try {
          localStorage.setItem(STORAGE_KEYS.mastery, JSON.stringify(state.masteryByAge));
        } catch (_) {}
      }
      if (typeof srvSpell.score === 'number' && srvSpell.score > state.score) {
        state.score = srvSpell.score;
        try {
          localStorage.setItem(STORAGE_KEYS.score, String(state.score));
        } catch (_) {}
      }
      updateTierButtonsUI();
      updateStatusReadout();
    } catch (_) {
      // Silently ignore when running on static GitHub Pages without Chief of Staff backend
    }
  }

  function savePersistedState(extraPayload) {
    try {
      const activeProf = getActiveMasteryProfile();
      activeProf.tier = state.tier;
      localStorage.setItem(STORAGE_KEYS.score, String(state.score));
      localStorage.setItem(STORAGE_KEYS.streak, String(state.streak));
      localStorage.setItem(STORAGE_KEYS.tier, state.tier);
      localStorage.setItem(STORAGE_KEYS.ageMode, state.ageMode);
      localStorage.setItem(STORAGE_KEYS.mastery, JSON.stringify(state.masteryByAge));
    } catch (_) {
      // Ignore storage write errors
    }
    scheduleServerBackup(extraPayload);
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    dom.themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
    try {
      localStorage.setItem(STORAGE_KEYS.theme, theme);
    } catch (_) {}
  }

  function parseUrlAids() {
    try {
      const params = new URLSearchParams(window.location.search);
      const rawAids = params.get('aids');
      if (!rawAids) return;

      const parts = rawAids
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      if (parts.includes('all')) {
        ['definition', 'sentence', 'phonetic', 'partofspeech', 'hints'].forEach((k) =>
          state.enabledAids.add(k)
        );
      } else {
        parts.forEach((p) => {
          if (p === 'examplesentence') state.enabledAids.add('sentence');
          else if (p === 'pos') state.enabledAids.add('partofspeech');
          else state.enabledAids.add(p);
        });
      }
    } catch (_) {}
  }

  function mergeWordsIntoBank(entries) {
    const existing = new Map(
      state.wordBank.map((item) => [item.word.toLowerCase(), item])
    );

    entries.forEach((entry) => {
      if (!entry || typeof entry.word !== 'string') return;
      const key = entry.word.trim().toLowerCase();
      if (!key) return;
      const difficulty = TIER_POINTS[entry.difficulty] ? entry.difficulty : 'easy';
      const normalized = {
        word: key,
        grade: entry.grade || (difficulty === 'stretch' ? 4 : 3),
        difficulty,
        points: entry.points || TIER_POINTS[difficulty],
        phonetic: entry.phonetic || '',
        partOfSpeech: entry.partOfSpeech || '',
        definition: entry.definition || '',
        exampleSentence: entry.exampleSentence || '',
        hints: Array.isArray(entry.hints) ? entry.hints : []
      };
      existing.set(key, normalized);
    });

    state.wordBank = Array.from(existing.values());
  }

  async function loadExternalWordBank() {
    if (window.location.protocol === 'file:') return;
    try {
      const res = await fetch('data/word_bank.json', { cache: 'no-cache' });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) {
        mergeWordsIntoBank(data);
      }
    } catch (_) {
      // Embedded word bank is already active
    }
  }

  // ================= Web Speech API Pronunciation =================
  function selectPreferredVoice() {
    if (!('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) return;

    const usVoices = voices.filter((v) =>
      /^en[-_]US/i.test(v.lang)
    );
    const pool = usVoices.length > 0 ? usVoices : voices.filter((v) => /^en/i.test(v.lang));
    if (pool.length === 0) return;

    const preferredPatterns = [
      /Google US English/i,
      /Natural/i,
      /Samantha/i,
      /Ava/i,
      /Aria/i
    ];

    for (const pattern of preferredPatterns) {
      const match = pool.find((v) => pattern.test(v.name));
      if (match) {
        state.preferredVoice = match;
        return;
      }
    }

    state.preferredVoice = pool.find((v) => v.default) || pool[0];
  }

  function pronounceWord(wordText) {
    if (!wordText || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(wordText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1.0;

      if (!state.preferredVoice) {
        selectPreferredVoice();
      }
      if (state.preferredVoice) {
        utterance.voice = state.preferredVoice;
      }

      dom.hearWordBtn.classList.add('speaking');
      utterance.onend = () => dom.hearWordBtn.classList.remove('speaking');
      utterance.onerror = () => dom.hearWordBtn.classList.remove('speaking');

      window.speechSynthesis.speak(utterance);
    } catch (_) {
      dom.hearWordBtn.classList.remove('speaking');
    }
  }

  // ================= Longest Common Subsequence (LCS) Character Alignment =================
  /**
   * Computes character-level alignment between user input and target word using LCS.
   * Pairs unmatched segments between LCS anchor characters so substitutions align in place,
   * missing letters render as '_', and extra letters render as '·' without shifting matches.
   */
  function computeLcsAlignment(yoursRaw, correctRaw) {
    const u = (yoursRaw || '').trim().toLowerCase();
    const t = (correctRaw || '').trim().toLowerCase();
    const m = u.length;
    const n = t.length;

    // dp[i][j] = length of LCS of u[i..m-1] and t[j..n-1]
    const dp = Array.from({ length: m + 1 }, () => new Uint16Array(n + 1));
    for (let i = m - 1; i >= 0; i--) {
      for (let j = n - 1; j >= 0; j--) {
        if (u[i] === t[j]) {
          dp[i][j] = 1 + dp[i + 1][j + 1];
        } else {
          dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);
        }
      }
    }

    // Collect LCS anchor index pairs [uIdx, tIdx]
    const anchors = [];
    let i = 0;
    let j = 0;
    while (i < m && j < n) {
      if (u[i] === t[j] && dp[i][j] === 1 + dp[i + 1][j + 1]) {
        anchors.push([i, j]);
        i++;
        j++;
      } else if (dp[i + 1][j] >= dp[i][j + 1]) {
        i++;
      } else {
        j++;
      }
    }
    anchors.push([m, n]);

    const columns = [];
    let prevI = 0;
    let prevJ = 0;

    for (const [anchorI, anchorJ] of anchors) {
      const uGap = u.slice(prevI, anchorI);
      const tGap = t.slice(prevJ, anchorJ);
      const maxGap = Math.max(uGap.length, tGap.length);

      for (let k = 0; k < maxGap; k++) {
        const uChar = k < uGap.length ? uGap[k] : null;
        const tChar = k < tGap.length ? tGap[k] : null;

        if (uChar !== null && tChar !== null) {
          columns.push({
            yoursChar: uChar,
            yoursClass: 'sub',
            correctChar: tChar,
            correctClass: 'correction'
          });
        } else if (uChar === null && tChar !== null) {
          columns.push({
            yoursChar: '_',
            yoursClass: 'missing',
            correctChar: tChar,
            correctClass: 'correction'
          });
        } else if (uChar !== null && tChar === null) {
          columns.push({
            yoursChar: uChar,
            yoursClass: 'extra',
            correctChar: '·',
            correctClass: 'missing'
          });
        }
      }

      if (anchorI < m && anchorJ < n) {
        columns.push({
          yoursChar: u[anchorI],
          yoursClass: 'match',
          correctChar: t[anchorJ],
          correctClass: 'match'
        });
      }

      prevI = anchorI + 1;
      prevJ = anchorJ + 1;
    }

    return columns;
  }

  function renderLcsDiff(yoursRaw, correctRaw) {
    dom.diffYours.innerHTML = '';
    dom.diffCorrect.innerHTML = '';

    const columns = computeLcsAlignment(yoursRaw, correctRaw);
    columns.forEach((col) => {
      const yTile = document.createElement('span');
      yTile.className = `letter-tile ${col.yoursClass}`;
      yTile.textContent = col.yoursChar;
      dom.diffYours.appendChild(yTile);

      const cTile = document.createElement('span');
      cTile.className = `letter-tile ${col.correctClass}`;
      cTile.textContent = col.correctChar;
      dom.diffCorrect.appendChild(cTile);
    });

    dom.diffContainer.hidden = false;
  }

  // ================= Study Aids (?aids=...) =================
  function renderWordAids(wordObj, revealAnswer) {
    if (state.enabledAids.size === 0 || !wordObj) {
      dom.wordAids.hidden = true;
      dom.wordAids.innerHTML = '';
      return;
    }

    const lines = [];
    if (state.enabledAids.has('partofspeech') && wordObj.partOfSpeech) {
      lines.push(`<div class="aid-item"><strong>Part of speech:</strong> ${escapeHtml(wordObj.partOfSpeech)}</div>`);
    }
    if (state.enabledAids.has('phonetic') && wordObj.phonetic) {
      lines.push(`<div class="aid-item"><strong>Phonetic:</strong> ${escapeHtml(wordObj.phonetic)}</div>`);
    }
    if (state.enabledAids.has('definition') && wordObj.definition) {
      lines.push(`<div class="aid-item"><strong>Definition:</strong> ${escapeHtml(wordObj.definition)}</div>`);
    }
    if (state.enabledAids.has('sentence') && wordObj.exampleSentence) {
      const sentence = revealAnswer
        ? wordObj.exampleSentence
        : maskTargetWord(wordObj.exampleSentence, wordObj.word);
      lines.push(`<div class="aid-item"><strong>Sentence:</strong> ${escapeHtml(sentence)}</div>`);
    }
    if (state.enabledAids.has('hints') && Array.isArray(wordObj.hints) && wordObj.hints.length > 0) {
      lines.push(`<div class="aid-item"><strong>Hint:</strong> ${escapeHtml(wordObj.hints.join(' · '))}</div>`);
    }

    if (lines.length === 0) {
      dom.wordAids.hidden = true;
      dom.wordAids.innerHTML = '';
    } else {
      dom.wordAids.innerHTML = lines.join('');
      dom.wordAids.hidden = false;
    }
  }

  function maskTargetWord(sentence, word) {
    if (!sentence || !word) return sentence;
    const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return sentence.replace(new RegExp(escaped, 'gi'), '_____');
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // ================= Round & Word Selection =================
  function shuffleArray(items) {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  function pickRoundWordsForTier(tier, count) {
    const bank = getActiveWordBank();
    const tierPool = bank.filter((w) => w.difficulty === tier);
    const prof = getActiveMasteryProfile();
    const masteredSet = new Set(Array.isArray(prof.mastered) ? prof.mastered : []);
    const missedSet = new Set(Array.isArray(prof.missed) ? prof.missed : []);
    const usedSet = state.usedWordsByTier[tier] || new Set();

    // 1. Prioritize up to 3 previously missed words from this tier so the child masters them
    const dueMissed = tierPool.filter((w) => missedSet.has(w.word.toLowerCase()));
    const reviewPick = shuffleArray(dueMissed).slice(0, Math.min(3, count));
    const pickedWords = new Set(reviewPick.map((w) => w.word.toLowerCase()));

    // 2. Next, pick from unmastered & unseen words in this tier
    let unmastered = tierPool.filter(
      (w) => !masteredSet.has(w.word.toLowerCase()) && !pickedWords.has(w.word.toLowerCase())
    );
    let unseenUnmastered = unmastered.filter((w) => !usedSet.has(w.word));

    const remainingNeeded = count - reviewPick.length;
    let freshPool = unseenUnmastered.length >= remainingNeeded ? unseenUnmastered : unmastered;

    // 3. If the child has mastered almost the entire tier, top up with shuffled words from the tier
    if (freshPool.length < remainingNeeded) {
      usedSet.clear();
      const fallback = tierPool.filter((w) => !pickedWords.has(w.word.toLowerCase()));
      freshPool = [
        ...freshPool,
        ...shuffleArray(fallback.filter((w) => !freshPool.includes(w)))
      ];
    }

    const picked = [...reviewPick, ...shuffleArray(freshPool).slice(0, remainingNeeded)];
    picked.forEach((w) => usedSet.add(w.word));
    return picked;
  }

  function updateTopBar() {
    const totalInRound = state.roundWords.length || ROUND_LENGTH;
    const currentNum = Math.min(state.currentIndex + 1, totalInRound);
    const prof = getActiveMasteryProfile();
    const masteredSet = new Set(Array.isArray(prof.mastered) ? prof.mastered : []);
    const bank = getActiveWordBank();
    const totalMastered = bank.filter((w) => masteredSet.has(w.word.toLowerCase())).length;

    dom.statusReadout.textContent = `Score: ${state.score} · ★ ${totalMastered} Mastered · ${currentNum}/${totalInRound}`;

    if (dom.ageButtons) {
      dom.ageButtons.forEach((btn) => {
        btn.classList.toggle('active', btn.dataset.age === state.ageMode);
      });
    }

    dom.tierButtons.forEach((btn) => {
      const t = btn.dataset.tier;
      const isMatch = t === state.tier;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
      const tierWords = bank.filter((w) => w.difficulty === t);
      const tierMastered = tierWords.filter((w) => masteredSet.has(w.word.toLowerCase())).length;
      const baseLabel = TIER_LABELS[t] || t;
      btn.textContent = tierMastered > 0 ? `${baseLabel} (${tierMastered}/${tierWords.length})` : baseLabel;
    });
  }

  function startRound(customWordList) {
    state.roundWords = Array.isArray(customWordList) && customWordList.length > 0
      ? [...customWordList]
      : pickRoundWordsForTier(state.tier, ROUND_LENGTH);
    state.currentIndex = 0;
    state.roundScore = 0;
    state.missedInRound = [];
    state.submitted = false;

    dom.summaryStage.hidden = true;
    dom.practiceStage.hidden = false;

    presentCurrentWord();
  }

  function presentCurrentWord() {
    const currentWord = state.roundWords[state.currentIndex];
    if (!currentWord) {
      showRoundSummary();
      return;
    }

    state.submitted = false;
    dom.spellInput.disabled = false;
    dom.spellInput.value = '';
    dom.checkBtn.disabled = false;
    dom.feedbackArea.hidden = true;
    dom.diffContainer.hidden = true;
    if (dom.touchKb) {
      dom.touchKb.hidden = false;
    }

    updateTopBar();
    renderWordAids(currentWord, false);

    if (!isCoarsePointerDevice()) {
      dom.spellInput.focus();
    }
    pronounceWord(currentWord.word);
  }

  function handleSubmission() {
    if (state.submitted) return;
    const currentWord = state.roundWords[state.currentIndex];
    if (!currentWord) return;

    const rawAttempt = dom.spellInput.value.trim();
    if (!rawAttempt) {
      if (!isCoarsePointerDevice()) {
        dom.spellInput.focus();
      }
      return;
    }

    state.submitted = true;
    dom.spellInput.disabled = true;
    dom.checkBtn.disabled = true;
    if (dom.touchKb) {
      dom.touchKb.hidden = true;
    }

    const isCorrect = rawAttempt.toLowerCase() === currentWord.word.toLowerCase();
    dom.feedbackArea.hidden = false;
    dom.feedbackBanner.classList.toggle('is-correct', isCorrect);
    dom.feedbackBanner.classList.toggle('is-wrong', !isCorrect);

    renderWordAids(currentWord, true);

    if (isCorrect) {
      const basePts = currentWord.points || TIER_POINTS[state.tier] || 10;
      const streakBonus = Math.min(state.streak * 2, 10);
      const earned = basePts + streakBonus;

      state.streak += 1;
      state.score += earned;
      state.roundScore += earned;
      recordWordResult(currentWord.word, true);
      updateTopBar();

      dom.feedbackText.textContent =
        streakBonus > 0
          ? `✓ Correct! +${earned} pts (+${streakBonus} streak)`
          : `✓ Correct! +${basePts} pts`;
      dom.diffContainer.hidden = true;
    } else {
      state.streak = 0;
      recordWordResult(currentWord.word, false);
      updateTopBar();

      state.missedInRound.push({
        wordObj: currentWord,
        attempt: rawAttempt
      });

      dom.feedbackText.textContent = '✗ Not quite';
      renderLcsDiff(rawAttempt, currentWord.word);
    }

    dom.nextBtn.focus();
  }

  function advanceWord() {
    if (!state.submitted) return;
    if (state.currentIndex + 1 < state.roundWords.length) {
      state.currentIndex += 1;
      presentCurrentWord();
    } else {
      showRoundSummary();
    }
  }

  function showRoundSummary() {
    dom.practiceStage.hidden = true;
    dom.summaryStage.hidden = false;

    const totalWords = state.roundWords.length || ROUND_LENGTH;
    const correctCount = totalWords - state.missedInRound.length;
    const accuracyPct = Math.round((correctCount / totalWords) * 100);

    // Auto-advance tier if child achieved >= 80% accuracy on a full round and has mastered >= 60% of current tier
    const bank = getActiveWordBank();
    const prof = getActiveMasteryProfile();
    const masteredSet = new Set(Array.isArray(prof.mastered) ? prof.mastered : []);
    const tierWords = bank.filter((w) => w.difficulty === state.tier);
    const tierMastered = tierWords.filter((w) => masteredSet.has(w.word.toLowerCase())).length;
    const curTierIdx = TIER_ORDER.indexOf(state.tier);

    if (
      totalWords >= 8 &&
      accuracyPct >= 80 &&
      tierMastered >= Math.ceil(tierWords.length * 0.5) &&
      curTierIdx >= 0 &&
      curTierIdx < TIER_ORDER.length - 1
    ) {
      const nextTier = TIER_ORDER[curTierIdx + 1];
      state.tier = nextTier;
      savePersistedState();
      updateTopBar();
      if (dom.summaryTitle) {
        dom.summaryTitle.textContent = `🚀 Level Up! Next: ${TIER_LABELS[nextTier]} Words!`;
      }
    } else if (dom.summaryTitle) {
      dom.summaryTitle.textContent = accuracyPct >= 80 ? 'Awesome Round! 🎉' : 'Round Summary';
    }

    dom.summaryScore.textContent = `${state.score} (+${state.roundScore})`;
    dom.summaryCorrect.textContent = `${correctCount} / ${totalWords}`;
    dom.summaryAccuracy.textContent = `${accuracyPct}%`;

    dom.reviewList.innerHTML = '';
    if (state.missedInRound.length === 0) {
      dom.reviewEmpty.hidden = false;
      dom.practiceMissedBtn.disabled = true;
    } else {
      dom.reviewEmpty.hidden = true;
      dom.practiceMissedBtn.disabled = false;

      state.missedInRound.forEach(({ wordObj, attempt }) => {
        const li = document.createElement('li');
        li.className = 'review-item';
        li.tabIndex = 0;
        li.setAttribute('role', 'button');
        li.setAttribute('aria-label', `Hear ${wordObj.word}`);

        const wordSpan = document.createElement('span');
        wordSpan.className = 'review-word';
        wordSpan.textContent = `🔊 ${wordObj.word}`;

        const attemptSpan = document.createElement('span');
        attemptSpan.className = 'review-attempt';
        attemptSpan.textContent = `yours: ${attempt}`;

        li.appendChild(wordSpan);
        li.appendChild(attemptSpan);

        const triggerSpeak = () => pronounceWord(wordObj.word);
        li.addEventListener('click', triggerSpeak);
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            triggerSpeak();
          }
        });

        dom.reviewList.appendChild(li);
      });
    }

    dom.nextRoundBtn.focus();
  }

  // ================= Built-in 3-Row QWERTY Touch Keyboard =================
  function isCoarsePointerDevice() {
    return Boolean(
      ('ontouchstart' in window) ||
      (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
      (window.matchMedia && window.matchMedia('(pointer: coarse)').matches)
    );
  }

  function initTouchKeyboard() {
    if (!dom.touchKb) return;
    dom.touchKb.innerHTML = '';

    // Prevent mobile/tablet OS soft keyboard from popping up over the stage
    if (isCoarsePointerDevice() && dom.spellInput) {
      dom.spellInput.setAttribute('inputmode', 'none');
      dom.spellInput.setAttribute('readonly', 'readonly');
    }

    const rows = [
      ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
      ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
      ['BACKSPACE', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'ENTER']
    ];

    rows.forEach((rowKeys) => {
      const rowEl = document.createElement('div');
      rowEl.className = 'sb-kb-row';

      rowKeys.forEach((key) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sb-key';
        btn.dataset.key = key;

        if (key === 'BACKSPACE') {
          btn.classList.add('sb-key-wide');
          btn.textContent = '⌫ Del';
          btn.setAttribute('aria-label', 'Backspace');
        } else if (key === 'ENTER') {
          btn.classList.add('sb-key-wide', 'sb-key-enter');
          btn.textContent = '↵ Check';
          btn.setAttribute('aria-label', 'Submit spelling');
        } else {
          btn.textContent = key.toUpperCase();
        }

        let lastTap = 0;
        const handleTap = (e) => {
          e.preventDefault();
          const now = Date.now();
          if (now - lastTap < 60) return;
          lastTap = now;

          btn.classList.add('pressed');
          setTimeout(() => btn.classList.remove('pressed'), 100);

          if (key === 'BACKSPACE') {
            if (!state.submitted && !dom.spellInput.disabled) {
              dom.spellInput.value = dom.spellInput.value.slice(0, -1);
            }
          } else if (key === 'ENTER') {
            if (!state.submitted) {
              handleSubmission();
            } else {
              advanceWord();
            }
          } else if (!state.submitted && !dom.spellInput.disabled) {
            dom.spellInput.value += key;
          }
        };

        btn.addEventListener('touchstart', handleTap, { passive: false });
        btn.addEventListener('mousedown', handleTap);
        rowEl.appendChild(btn);
      });

      dom.touchKb.appendChild(rowEl);
    });
  }

  // ================= Event Listeners =================
  function bindEvents() {
    initTouchKeyboard();

    if (dom.ageButtons) {
      dom.ageButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const newAge = btn.dataset.age;
          if (!newAge || newAge === state.ageMode) return;
          state.ageMode = newAge;
          const prof = getActiveMasteryProfile();
          state.tier = (prof && TIER_POINTS[prof.tier]) ? prof.tier : 'easy';
          savePersistedState();
          startRound();
        });
      });
    }

    dom.tierButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const newTier = btn.dataset.tier;
        if (!newTier || !TIER_POINTS[newTier] || newTier === state.tier) return;
        state.tier = newTier;
        savePersistedState();
        startRound();
      });
    });

    dom.themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });

    dom.hearWordBtn.addEventListener('click', () => {
      const currentWord = state.roundWords[state.currentIndex];
      if (currentWord) {
        pronounceWord(currentWord.word);
      }
      if (!state.submitted) {
        dom.spellInput.focus();
      }
    });

    dom.spellForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!state.submitted) {
        handleSubmission();
      } else {
        advanceWord();
      }
    });

    dom.nextBtn.addEventListener('click', () => {
      advanceWord();
    });

    dom.practiceMissedBtn.addEventListener('click', () => {
      if (state.missedInRound.length === 0) return;
      const missedWords = state.missedInRound.map((m) => m.wordObj);
      startRound(missedWords);
    });

    dom.nextRoundBtn.addEventListener('click', () => {
      startRound();
    });

    window.addEventListener('keydown', (e) => {
      if (e.altKey && (e.key === 'p' || e.key === 'P')) {
        e.preventDefault();
        const currentWord = state.roundWords[state.currentIndex];
        if (currentWord && !dom.practiceStage.hidden) {
          pronounceWord(currentWord.word);
        }
        return;
      }

      if (
        e.key === 'Enter' &&
        state.submitted &&
        !dom.practiceStage.hidden &&
        document.activeElement !== dom.nextBtn
      ) {
        e.preventDefault();
        advanceWord();
        return;
      }

      // Support physical keyboard typing even when input is readonly or unfocused
      if (
        !state.submitted &&
        !dom.practiceStage.hidden &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey &&
        (document.activeElement !== dom.spellInput || dom.spellInput.hasAttribute('readonly'))
      ) {
        if (e.key === 'Backspace') {
          e.preventDefault();
          dom.spellInput.value = dom.spellInput.value.slice(0, -1);
        } else if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmission();
        } else if (/^[a-zA-Z]$/.test(e.key)) {
          e.preventDefault();
          dom.spellInput.value += e.key.toLowerCase();
        }
      }
    });

    if ('speechSynthesis' in window) {
      selectPreferredVoice();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = selectPreferredVoice;
      }
    }
  }

  // Expose LCS alignment helper for automated verification
  window.SpellingBeeApp = {
    computeLcsAlignment,
    getState: () => state
  };

  // ================= Initialization =================
  async function init() {
    parseUrlAids();
    loadPersistedState();
    bindEvents();
    startRound();
    await loadExternalWordBank();
    syncServerProgress();
    setInterval(() => syncServerProgress(), 60000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
