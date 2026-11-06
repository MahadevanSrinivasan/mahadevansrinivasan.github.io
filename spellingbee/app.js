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
    customWords: 'spellingbee_custom_words'
  };

  const ROUND_LENGTH = 10;

  // ================= Application State =================
  const state = {
    wordBank: [...EMBEDDED_WORD_BANK],
    tier: 'easy',
    score: 0,
    streak: 0,
    roundScore: 0,
    roundWords: [],
    currentIndex: 0,
    submitted: false,
    missedInRound: [],
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
    summaryScore: document.getElementById('summary-score'),
    summaryCorrect: document.getElementById('summary-correct'),
    summaryAccuracy: document.getElementById('summary-accuracy'),
    reviewEmpty: document.getElementById('review-empty'),
    reviewList: document.getElementById('review-list'),
    practiceMissedBtn: document.getElementById('practice-missed-btn'),
    nextRoundBtn: document.getElementById('next-round-btn')
  };

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

      const savedTier = localStorage.getItem(STORAGE_KEYS.tier);
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

  function savePersistedState() {
    try {
      localStorage.setItem(STORAGE_KEYS.score, String(state.score));
      localStorage.setItem(STORAGE_KEYS.streak, String(state.streak));
      localStorage.setItem(STORAGE_KEYS.tier, state.tier);
    } catch (_) {
      // Ignore storage write errors
    }
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
    const tierPool = state.wordBank.filter((w) => w.difficulty === tier);
    const usedSet = state.usedWordsByTier[tier] || new Set();

    let unseen = tierPool.filter((w) => !usedSet.has(w.word));
    if (unseen.length < count) {
      usedSet.clear();
      unseen = [...tierPool];
    }

    const picked = shuffleArray(unseen).slice(0, Math.min(count, tierPool.length));
    picked.forEach((w) => usedSet.add(w.word));
    return picked;
  }

  function updateTopBar() {
    const totalInRound = state.roundWords.length || ROUND_LENGTH;
    const currentNum = Math.min(state.currentIndex + 1, totalInRound);
    dom.statusReadout.textContent = `Score: ${state.score} · ${currentNum}/${totalInRound}`;

    dom.tierButtons.forEach((btn) => {
      const isMatch = btn.dataset.tier === state.tier;
      btn.classList.toggle('active', isMatch);
      btn.setAttribute('aria-selected', isMatch ? 'true' : 'false');
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

    updateTopBar();
    renderWordAids(currentWord, false);

    dom.spellInput.focus();
    pronounceWord(currentWord.word);
  }

  function handleSubmission() {
    if (state.submitted) return;
    const currentWord = state.roundWords[state.currentIndex];
    if (!currentWord) return;

    const rawAttempt = dom.spellInput.value.trim();
    if (!rawAttempt) {
      dom.spellInput.focus();
      return;
    }

    state.submitted = true;
    dom.spellInput.disabled = true;
    dom.checkBtn.disabled = true;

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
      savePersistedState();
      updateTopBar();

      dom.feedbackText.textContent =
        streakBonus > 0
          ? `✓ Correct! +${earned} pts (+${streakBonus} streak)`
          : `✓ Correct! +${basePts} pts`;
      dom.diffContainer.hidden = true;
    } else {
      state.streak = 0;
      savePersistedState();

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

  // ================= Event Listeners =================
  function bindEvents() {
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
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
