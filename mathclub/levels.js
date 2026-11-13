// levels.js - Age-Based Mental Math Cards & Tips Configuration

const AGE_PROFILES = {
    age4: {
        id: "age4",
        label: "👧 Age 4–5",
        subtitle: "Kindergarten Mental Math (Up to 20)",
        defaultMode: "deck", // 10-card deck (or 1:50 timed)
        deckSize: 10,
        timeLimit: 110,
        showVisualHelpers: false,
        primaryDecks: [
            {
                id: "add_12",
                title: "Addition (+) up to 15",
                badge: "Count On & Make 10",
                operation: "add_4_5",
                min: 2,
                max: 9,
                maxSum: 15,
                description: "Mental addition up to 15 (like 6 + 4, 7 + 5, 8 + 4) without picture giveaways!"
            },
            {
                id: "sub_10",
                title: "Subtraction (−) from 12",
                badge: "Take Away & Count Up",
                operation: "sub_4_5",
                min: 5,
                max: 12,
                description: "Subtract numbers up to 12 (like 10 − 4, 9 − 3, 12 − 5)."
            },
            {
                id: "doubles_10",
                title: "Doubles & Near-Doubles",
                badge: "Up to 10 + 10",
                operation: "doubles_4_5",
                min: 3,
                max: 10,
                description: "Twin doubles up to 10 + 10 plus neighbor facts like 5 + 6 and 6 + 7!"
            },
            {
                id: "teens_20",
                title: "Teen Numbers (10 + N & Teens)",
                badge: "Up to 20",
                operation: "teens_4_5",
                description: "Master 10 + 6 = 16, 12 + 4 = 16, and 15 − 3 = 12!"
            }
        ],
        moreDecks: [
            {
                id: "mixed_4_5",
                title: "⚡ Mixed (+) and (−) Challenge",
                badge: "Watch the Sign!",
                operation: "mixed_4_5",
                description: "Addition and subtraction up to 15 shuffled together!"
            },
            {
                id: "add_2d_easy",
                title: "Big Kid 2-Digit (+) No Carry",
                badge: "20 + 14",
                operation: "add_2d_intro",
                description: "Friendly 2-digit numbers like 10 + 20, 12 + 13, and 21 + 14!"
            },
            {
                id: "skip_2_5_10",
                title: "Intro Multiply (×2 and ×10)",
                badge: "Doubles & Tens",
                operation: "mul_2_10_intro",
                description: "Early multiplication using doubles (×2) and tens (×10)!"
            }
        ],
        tips: [
            {
                title: "1. Count On from the Bigger Number",
                formula: "3 + 8  →  Start at 8... then 9, 10, 11!",
                body: "Always grab the BIGGER number first (even if it's on the bottom!) and count up by the smaller number.",
                practiceDeckId: "add_12"
            },
            {
                title: "2. Friends of 10 & Bridge 10",
                formula: "8 + 5  →  8 + 2 = 10  →  10 + 3 = 13",
                body: "Know your 10-partners by heart (9+1, 8+2, 7+3, 6+4, 5+5) to jump straight over 10!",
                practiceDeckId: "add_12"
            },
            {
                title: "3. Doubles + 1 (Near-Doubles)",
                formula: "5 + 6  →  (5 + 5 = 10) + 1  =  11",
                body: "When two numbers are neighbors on the number line, double the smaller one and add 1 more!",
                practiceDeckId: "doubles_10"
            },
            {
                title: "4. Teen Number Magic (10 + 7 = 17)",
                formula: "10 + 7 = 17  •  13 + 4  →  3 + 4 = 7  →  17",
                body: "Adding a single digit to 10 just replaces the 0! For 13 + 4, add the ones (3 + 4 = 7) and keep the 10 → 17.",
                practiceDeckId: "teens_20"
            }
        ]
    },

    age8_9: {
        id: "age8_9",
        label: "👦 Age 8–9",
        subtitle: "Mental Math Cards & Tricks",
        defaultMode: "deck", // "deck" (12 cards) or "timed" (1:50 / 110s)
        deckSize: 12,
        timeLimit: 110, // 1:50 just like Mental Math Cards!
        showVisualHelpers: false,
        primaryDecks: [
            {
                id: "add",
                title: "Addition (+)",
                badge: "2-Digit Mental",
                operation: "add_mental",
                min: 12,
                max: 79,
                description: "Mental 2-digit addition cards like 31 + 27 and 48 + 35."
            },
            {
                id: "sub",
                title: "Subtraction (−)",
                badge: "2-Digit Mental",
                operation: "sub_mental",
                min: 14,
                max: 95,
                description: "Mental 2-digit subtraction cards like 91 − 27 and 64 − 28."
            },
            {
                id: "mul",
                title: "Multiplication (×)",
                badge: "Tables & 2×1",
                operation: "mul_mental",
                description: "Times tables (2×–12×) plus mental 2-digit × 1-digit cards like 82 × 3."
            },
            {
                id: "div",
                title: "Division (÷)",
                badge: "Exact Facts",
                operation: "div_mental",
                description: "Clean whole-number division facts & quotients."
            }
        ],
        moreDecks: [
            {
                id: "mul_2x1",
                title: "2-Digit × 1-Digit (82 × 3)",
                badge: "Split Trick",
                operation: "mul_2x1",
                description: "Multiply tens first, then ones: 82 × 3 = 240 + 6 = 246!"
            },
            {
                id: "mul_tricks",
                title: "×11, ×5 & ×9 Shortcuts",
                badge: "Speed Tricks",
                operation: "mul_tricks",
                description: "Master rapid mental shortcuts for ×11, ×5, and ×9."
            },
            {
                id: "squares_5",
                title: "Squares & Ending in 5",
                badge: "25 × 25",
                operation: "squares_5",
                description: "Square numbers like 6×6, 12×12, 15×15, 25×25, and 35×35."
            },
            {
                id: "mixed_all",
                title: "⚡ All 4 Operations Mixed",
                badge: "Challenge",
                operation: "mixed_8_9",
                description: "Addition, Subtraction, Multiplication & Division shuffled together!"
            }
        ],
        tips: [
            {
                title: "1. Left-to-Right Split (82 × 3)",
                formula: "82 × 3  →  (80 × 3) + (2 × 3)  =  240 + 6  =  246",
                body: "In your head, always multiply from LEFT to RIGHT! Do the tens first (80 × 3 = 240), then add the ones (2 × 3 = 6).",
                practiceDeckId: "mul_2x1"
            },
            {
                title: "2. Add Left-to-Right (31 + 27)",
                formula: "31 + 27  →  31 + 20 = 51  →  51 + 7 = 58",
                body: "Add the tens column first (31 + 20 = 51), then hop up by the ones (+ 7 = 58). No carrying needed!",
                practiceDeckId: "add"
            },
            {
                title: "3. Multiply by 11 Trick (34 × 11)",
                formula: "34 × 11  →  3 _ 4  →  3 (3+4) 4  =  374",
                body: "Split the two digits apart and put their sum right in the middle! (If the sum is 10 or more, carry 1 to the left digit.)",
                practiceDeckId: "mul_tricks"
            },
            {
                title: "4. Multiply by 5 (Cut in Half × 10)",
                formula: "46 × 5  →  Half of 46 is 23  →  230",
                body: "Since 5 is half of 10, just take half of the number and tack on a 0! (For odd numbers like 14 × 5 → 70.)",
                practiceDeckId: "mul_tricks"
            },
            {
                title: "5. Subtract by Adding Up (72 − 48)",
                formula: "48 → 50 (+2)  and  50 → 72 (+22)  →  2 + 22 = 24",
                body: "Instead of borrowing, count UP from the bottom number to the next friendly 10, then jump to the top number!",
                practiceDeckId: "sub"
            },
            {
                title: "6. Square Numbers Ending in 5 (25 × 25)",
                formula: "25 × 25  →  (2 × 3) | 25  =  625",
                body: "Take the tens digit (2), multiply it by the next higher number (2 × 3 = 6), and stick 25 on the end → 625!",
                practiceDeckId: "squares_5"
            }
        ]
    },

    age6_7: {
        id: "age6_7",
        label: "Age 6–7",
        subtitle: "1st–2nd Grade Facts",
        defaultMode: "deck",
        deckSize: 12,
        timeLimit: 110,
        showVisualHelpers: false,
        primaryDecks: [
            {
                id: "add_20",
                title: "Addition (+) to 20",
                badge: "Make 10",
                operation: "add_range",
                min: 2,
                max: 12,
                description: "Single-digit and teen addition facts up to 20."
            },
            {
                id: "sub_20",
                title: "Subtraction (−) from 20",
                badge: "Facts",
                operation: "sub_range",
                min: 2,
                max: 18,
                description: "Clean subtraction facts within 20."
            },
            {
                id: "add_simple_2d",
                title: "2-Digit Addition (No Carry)",
                badge: "Tens & Ones",
                operation: "add_simple_double",
                description: "Friendly 2-digit cards like 21 + 14 and 32 + 25."
            },
            {
                id: "mul_intro",
                title: "Intro Multiplication (×2, ×5, ×10)",
                badge: "Skip Count",
                operation: "mul_2_5_10",
                description: "Learn multiplication through 2s, 5s, and 10s skip-counting!"
            }
        ],
        moreDecks: [],
        tips: [
            {
                title: "1. Make a Friendly 10 First (8 + 5)",
                formula: "8 + 5  →  8 + 2 = 10  →  10 + 3 = 13",
                body: "Borrow 2 from the 5 to turn 8 into 10, then add what's left!",
                practiceDeckId: "add_20"
            },
            {
                title: "2. Skip Counting for ×2, ×5, ×10",
                formula: "5 × 4  =  5, 10, 15, 20!",
                body: "Multiplying by 2 is just doubling, and multiplying by 10 just puts a 0 at the end!",
                practiceDeckId: "mul_intro"
            }
        ]
    },

    age10_plus: {
        id: "age10_plus",
        label: "Age 10+",
        subtitle: "Advanced Speed Mental Math",
        defaultMode: "timed",
        deckSize: 15,
        timeLimit: 110,
        showVisualHelpers: false,
        primaryDecks: [
            {
                id: "add_hard",
                title: "Addition (+) 2 & 3-Digit",
                badge: "Advanced",
                operation: "add_range",
                min: 25,
                max: 250,
                description: "Rapid mental addition with 2-digit and 3-digit numbers."
            },
            {
                id: "sub_hard",
                title: "Subtraction (−) 2 & 3-Digit",
                badge: "Advanced",
                operation: "sub_range",
                min: 25,
                max: 250,
                description: "Mental subtraction by complements and adding up."
            },
            {
                id: "mul_hard",
                title: "Multiplication (×) 2-Digit",
                badge: "82 × 6 / 14 × 12",
                operation: "mul_advanced",
                description: "2-digit × 1-digit and teen multiplication up to 19 × 19."
            },
            {
                id: "div_hard",
                title: "Division (÷) Extended",
                badge: "Quotients to 25",
                operation: "div_advanced",
                description: "Fast mental division with larger dividends."
            }
        ],
        moreDecks: [],
        tips: [
            {
                title: "1. Teen Multiplication (14 × 16)",
                formula: "(14 + 6) × 10 + (4 × 6) = 200 + 24 = 224",
                body: "Add the second number's ones digit to the first number (14+6=20), multiply by 10 (200), then add the product of the ones digits (4×6=24)!",
                practiceDeckId: "mul_hard"
            }
        ]
    }
};

// Backwards-compatible flat list for any legacy callers
const LEVEL_DEFINITIONS = AGE_PROFILES.age8_9.primaryDecks;

const VISUAL_EMOJIS = ["🍎", "⭐", "🎈", "🍓", "🍊", "🐶", "🦋"];

class MathGenerator {
    static randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static pickEmoji() {
        return VISUAL_EMOJIS[Math.floor(Math.random() * VISUAL_EMOJIS.length)];
    }

    static describeTier(deckDef, tier = 1) {
        const t = Math.max(1, Number(tier) || 1);
        const stars = t === 1 ? "⭐" : (t === 2 ? "⭐⭐" : (t === 3 ? "⭐⭐⭐" : "🏆"));
        return `${stars} Lv ${t}`;
    }

    static generate(deckDef, options = {}) {
        const tier = Math.max(1, Number(options.tier) || 1);
        const avoidKeys = options.avoidKeys instanceof Set
            ? options.avoidKeys
            : new Set(Array.isArray(options.avoidKeys) ? options.avoidKeys : []);
        const missedQueue = Array.isArray(options.missedQueue) ? options.missedQueue : [];

        // If there is a previously missed problem for this deck/operation, weave it back in ~35% of the time
        if (missedQueue.length > 0 && Math.random() < 0.35) {
            const reviewItem = missedQueue[0];
            if (reviewItem && typeof reviewItem.answer === "number") {
                return Object.assign({}, reviewItem, { isReview: true });
            }
        }

        let chosen = null;
        for (let attempt = 0; attempt < 28; attempt++) {
            const candidate = this._generateSingle(deckDef, tier);
            const key = `${candidate.left}${candidate.operator}${candidate.right}`;
            chosen = candidate;
            if (!avoidKeys.has(key)) {
                break;
            }
        }
        return chosen;
    }

    static _generateSingle(deckDef, tier = 1) {
        let left = 0;
        let right = 0;
        let opSymbol = "+";
        let answer = 0;
        let visualHelper = null;
        let hintText = "";

        let op = (deckDef && deckDef.operation) ? deckDef.operation : "add_mental";
        if (op === "mixed_8_9") {
            const ops = ["add_mental", "sub_mental", "mul_mental", "div_mental"];
            op = ops[Math.floor(Math.random() * ops.length)];
        } else if (op === "mixed_4_5") {
            const ops45 = ["add_4_5", "sub_4_5", "doubles_4_5", "teens_4_5"];
            op = ops45[Math.floor(Math.random() * ops45.length)];
        }

        const emoji = this.pickEmoji();

        switch (op) {
            case "add_4_5": {
                // Adaptive addition for Age 4–5: scales from sums up to 14 (Lv 1) -> 18 (Lv 2) -> 24 (Lv 3) -> 35+ (Lv 4+)
                if (tier === 1) {
                    left = this.randomRange(3, 9);
                    const maxRight = Math.min(8, 14 - left);
                    right = this.randomRange(3, Math.max(3, maxRight));
                } else if (tier === 2) {
                    left = this.randomRange(5, 11);
                    right = this.randomRange(4, 9);
                } else if (tier === 3) {
                    left = this.randomRange(8, 16);
                    right = this.randomRange(4, 9);
                } else {
                    const maxL = Math.min(45, 15 + tier * 6);
                    left = this.randomRange(11, maxL);
                    right = this.randomRange(5, Math.min(24, 6 + tier * 3));
                }
                if (Math.random() < 0.35) {
                    const tmp = left;
                    left = right;
                    right = tmp;
                }
                opSymbol = "+";
                answer = left + right;
                const big = Math.max(left, right);
                const small = Math.min(left, right);
                if (big < 10 && answer > 10 && big >= 6) {
                    const toTen = 10 - big;
                    const rem = small - toTen;
                    hintText = `Make 10: ${big} + ${toTen} = 10, then + ${rem} more = ${answer}!`;
                } else if (small <= 5) {
                    const steps = Array.from({ length: small }, (_, i) => big + i + 1).join(", ");
                    hintText = `Start at ${big} and count up ${small}: ${steps}!`;
                } else {
                    hintText = `Break it up: ${big} + ${small} = ${answer}!`;
                }
                break;
            }

            case "sub_4_5": {
                // Adaptive subtraction for Age 4–5: Lv 1 (7..12) -> Lv 2 (10..16) -> Lv 3 (13..20) -> Lv 4+ (16..35)
                const minTop = tier === 1 ? 7 : (tier === 2 ? 10 : (tier === 3 ? 13 : 16));
                const maxTop = tier === 1 ? 12 : (tier === 2 ? 16 : (tier === 3 ? 20 : Math.min(40, 16 + tier * 5)));
                left = this.randomRange(minTop, maxTop);
                const maxSub = Math.min(left - 2, tier === 1 ? 6 : (tier === 2 ? 8 : 12));
                right = this.randomRange(2, Math.max(2, maxSub));
                opSymbol = "−";
                answer = left - right;
                if (right <= 4) {
                    const steps = Array.from({ length: right }, (_, i) => left - i - 1).join(", ");
                    hintText = `Start at ${left} and count back ${right}: ${steps}!`;
                } else {
                    hintText = `Count UP from ${right} to ${left} → ${answer}!`;
                }
                break;
            }

            case "doubles_4_5": {
                // Scales from 3..10 (Lv 1) -> 5..13 (Lv 2) -> 7..16 + tens (Lv 3) -> 11..25 (Lv 4+)
                const minD = tier === 1 ? 3 : (tier === 2 ? 5 : (tier === 3 ? 7 : 9));
                const maxD = tier === 1 ? 10 : (tier === 2 ? 13 : (tier === 3 ? 16 : 22));
                if (Math.random() < 0.58) {
                    const d = this.randomRange(minD, maxD);
                    left = d;
                    right = d;
                    opSymbol = "+";
                    answer = d + d;
                    hintText = `Twin Double: ${d} + ${d} = ${answer}!`;
                } else {
                    const b = this.randomRange(minD, maxD - 1);
                    if (Math.random() < 0.5) {
                        left = b;
                        right = b + 1;
                    } else {
                        left = b + 1;
                        right = b;
                    }
                    opSymbol = "+";
                    answer = left + right;
                    hintText = `Near-Double: ${b} + ${b} is ${b * 2}, plus 1 more = ${answer}!`;
                }
                break;
            }

            case "teens_4_5": {
                // Scales from 10+N & teen+ones (Lv 1) -> bridging 20 (Lv 2) -> 20s & 30s (Lv 3+)
                const roll = Math.random();
                if (tier === 1 && roll < 0.4) {
                    left = 10;
                    right = this.randomRange(3, 9);
                    if (Math.random() < 0.3) {
                        left = right;
                        right = 10;
                    }
                    opSymbol = "+";
                    answer = left + right;
                    hintText = `10 and ${Math.min(left, right)} more makes ${answer}!`;
                } else if (roll < 0.75) {
                    const minBase = tier === 1 ? 11 : (tier === 2 ? 13 : 16);
                    const maxBase = tier === 1 ? 16 : (tier === 2 ? 22 : 29);
                    left = this.randomRange(minBase, maxBase);
                    right = this.randomRange(2, tier === 1 ? (19 - left) : 9);
                    opSymbol = "+";
                    answer = left + right;
                    const ones = left % 10;
                    hintText = `Start at ${left} and add ${right} → ${answer}!`;
                } else {
                    const minBase = tier === 1 ? 13 : (tier === 2 ? 15 : 19);
                    const maxBase = tier === 1 ? 19 : (tier === 2 ? 24 : 32);
                    left = this.randomRange(minBase, maxBase);
                    const ones = Math.max(2, left % 10);
                    right = this.randomRange(2, tier === 1 ? ones : 8);
                    opSymbol = "−";
                    answer = left - right;
                    hintText = `${left} take away ${right} = ${answer}!`;
                }
                break;
            }

            case "add_2d_intro": {
                const maxLTens = Math.min(6, 2 + tier);
                const maxRTens = Math.min(5, 1 + tier);
                const lTens = this.randomRange(1, maxLTens);
                const lOnes = this.randomRange(0, 5);
                const rTens = this.randomRange(1, maxRTens);
                const rOnes = this.randomRange(0, tier >= 3 ? 6 : (9 - lOnes));
                left = lTens * 10 + lOnes;
                right = rTens * 10 + rOnes;
                opSymbol = "+";
                answer = left + right;
                hintText = `Tens (${lTens * 10}+${rTens * 10}=${(lTens + rTens) * 10}) + Ones (${lOnes}+${rOnes}=${lOnes + rOnes}) = ${answer}!`;
                break;
            }

            case "mul_2_10_intro": {
                const mults = tier >= 2 ? [2, 5, 10] : [2, 10];
                right = mults[Math.floor(Math.random() * mults.length)];
                left = this.randomRange(2, 8 + tier * 2);
                opSymbol = "×";
                answer = left * right;
                hintText = right === 2
                    ? `×2 means double ${left}: ${left} + ${left} = ${answer}!`
                    : (right === 10
                        ? `×10 means ${left} tens → put a 0 after ${left} = ${answer}!`
                        : `Skip count by 5s ${left} times = ${answer}!`);
                break;
            }
            case "add_visual": {
                const maxSum = deckDef.maxSum || 5;
                left = this.randomRange(1, maxSum - 1);
                right = this.randomRange(1, maxSum - left);
                opSymbol = "+";
                answer = left + right;
                visualHelper = {
                    type: "add",
                    emoji,
                    leftGroup: Array(left).fill(emoji).join(" "),
                    rightGroup: Array(right).fill(emoji).join(" ")
                };
                hintText = `Count all the ${emoji}: ${left} and ${right} more make ${answer}!`;
                break;
            }

            case "sub_visual": {
                const maxVal = deckDef.max || 5;
                left = this.randomRange(2, maxVal);
                right = this.randomRange(1, left - 1);
                opSymbol = "−";
                answer = left - right;
                visualHelper = {
                    type: "sub",
                    emoji,
                    total: left,
                    taken: right
                };
                hintText = `Start with ${left} ${emoji}, take away ${right}, and ${answer} are left!`;
                break;
            }

            case "doubles_early": {
                left = this.randomRange(deckDef.min || 1, deckDef.max || 5);
                right = left;
                opSymbol = "+";
                answer = left + right;
                visualHelper = {
                    type: "add",
                    emoji,
                    leftGroup: Array(left).fill(emoji).join(" "),
                    rightGroup: Array(right).fill(emoji).join(" ")
                };
                hintText = `Double ${left} is ${answer}!`;
                break;
            }

            case "plus_one": {
                left = this.randomRange(deckDef.min || 1, deckDef.max || 8);
                right = 1;
                opSymbol = "+";
                answer = left + 1;
                visualHelper = {
                    type: "add",
                    emoji,
                    leftGroup: Array(left).fill(emoji).join(" "),
                    rightGroup: emoji
                };
                hintText = `One more than ${left} is ${answer}!`;
                break;
            }

            case "count_objects": {
                left = this.randomRange(deckDef.min || 1, deckDef.max || 9);
                right = null;
                opSymbol = "";
                answer = left;
                visualHelper = {
                    type: "count",
                    emoji,
                    leftGroup: Array(left).fill(emoji).join(" ")
                };
                hintText = `There are ${answer} ${emoji}!`;
                break;
            }

            case "add_mental": {
                const minL = tier === 1 ? 12 : (tier === 2 ? 24 : (tier === 3 ? 45 : 85));
                const maxL = tier === 1 ? 58 : (tier === 2 ? 84 : (tier === 3 ? 145 : 280));
                const minR = tier === 1 ? 11 : (tier === 2 ? 18 : (tier === 3 ? 28 : 45));
                const maxR = tier === 1 ? 45 : (tier === 2 ? 68 : (tier === 3 ? 98 : 190));
                left = this.randomRange(minL, maxL);
                right = this.randomRange(minR, maxR);
                opSymbol = "+";
                answer = left + right;
                const rTens = Math.floor(right / 10) * 10;
                const rOnes = right % 10;
                hintText = `Tip: ${left} + ${rTens} = ${left + rTens}, then + ${rOnes} = ${answer}`;
                break;
            }

            case "sub_mental": {
                const minL = tier === 1 ? 26 : (tier === 2 ? 42 : (tier === 3 ? 68 : 110));
                const maxL = tier === 1 ? 68 : (tier === 2 ? 96 : (tier === 3 ? 145 : 260));
                left = this.randomRange(minL, maxL);
                const maxSub = Math.min(left - 7, tier === 1 ? 38 : (tier === 2 ? 65 : 98));
                right = this.randomRange(11, Math.max(12, maxSub));
                opSymbol = "−";
                answer = left - right;
                hintText = `Tip: Count up from ${right} to ${left} → ${answer}`;
                break;
            }

            case "mul_mental": {
                const tableChance = tier === 1 ? 0.7 : (tier === 2 ? 0.55 : 0.35);
                if (Math.random() < tableChance) {
                    const minF = tier === 1 ? 2 : (tier === 2 ? 4 : 6);
                    const maxF = tier === 1 ? 10 : (tier === 2 ? 12 : 15);
                    left = this.randomRange(minF, maxF);
                    right = this.randomRange(minF, maxF);
                    opSymbol = "×";
                    answer = left * right;
                    hintText = `${left} groups of ${right} = ${answer}`;
                } else {
                    const max2D = tier === 1 ? 48 : (tier === 2 ? 79 : 96);
                    const max1D = tier === 1 ? 4 : (tier === 2 ? 6 : 9);
                    left = this.randomRange(12, max2D);
                    right = this.randomRange(2, max1D);
                    opSymbol = "×";
                    answer = left * right;
                    const lTens = Math.floor(left / 10) * 10;
                    const lOnes = left % 10;
                    hintText = `Split: (${lTens} × ${right} = ${lTens * right}) + (${lOnes} × ${right} = ${lOnes * right}) = ${answer}`;
                }
                break;
            }

            case "mul_2x1": {
                const max2D = tier === 1 ? 54 : (tier === 2 ? 84 : 98);
                const max1D = tier === 1 ? 5 : (tier === 2 ? 7 : 9);
                left = this.randomRange(12, max2D);
                right = this.randomRange(2, max1D);
                opSymbol = "×";
                answer = left * right;
                const lTens = Math.floor(left / 10) * 10;
                const lOnes = left % 10;
                hintText = `Split: (${lTens} × ${right} = ${lTens * right}) + (${lOnes} × ${right} = ${lOnes * right}) = ${answer}`;
                break;
            }

            case "mul_tricks": {
                const trickType = Math.floor(Math.random() * 3);
                opSymbol = "×";
                if (trickType === 0) {
                    // × 11 trick
                    left = this.randomRange(12, tier >= 2 ? 85 : 54);
                    right = 11;
                    answer = left * 11;
                    hintText = `×11 Trick: ${left} × 10 + ${left} = ${answer}`;
                } else if (trickType === 1) {
                    // × 5 trick (even numbers make clean halves)
                    left = this.randomRange(6, tier >= 2 ? 64 : 36) * 2;
                    right = 5;
                    answer = left * 5;
                    hintText = `×5 Trick: Half of ${left} is ${left / 2}, times 10 = ${answer}`;
                } else {
                    // × 9 trick
                    left = this.randomRange(4, tier >= 2 ? 32 : 18);
                    right = 9;
                    answer = left * 9;
                    hintText = `×9 Trick: (${left} × 10 = ${left * 10}) − ${left} = ${answer}`;
                }
                break;
            }

            case "squares_5": {
                const pool = tier === 1
                    ? [4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 25]
                    : [6, 7, 8, 9, 11, 12, 13, 14, 15, 20, 25, 35, 45];
                left = pool[Math.floor(Math.random() * pool.length)];
                right = left;
                opSymbol = "×";
                answer = left * right;
                if (left % 10 === 5 && left >= 15) {
                    const t = Math.floor(left / 10);
                    hintText = `Ends in 5 Trick: (${t} × ${t + 1} = ${t * (t + 1)}) with 25 on the end = ${answer}`;
                } else {
                    hintText = `Square fact: ${left} × ${right} = ${answer}`;
                }
                break;
            }

            case "div_mental": {
                const maxDiv = tier === 1 ? 9 : (tier === 2 ? 12 : 15);
                const maxQuot = tier === 1 ? 10 : (tier === 2 ? 13 : 19);
                right = this.randomRange(2, maxDiv);
                const quotient = this.randomRange(3, maxQuot);
                left = right * quotient;
                opSymbol = "÷";
                answer = quotient;
                hintText = `Think: ${right} × ? = ${left}  →  ${right} × ${answer} = ${left}`;
                break;
            }

            case "add_simple_double": {
                const lTens = this.randomRange(1, 4);
                const lOnes = this.randomRange(0, 4);
                const rTens = this.randomRange(1, 4);
                const rOnes = this.randomRange(0, 5 - lOnes);
                left = lTens * 10 + lOnes;
                right = rTens * 10 + rOnes;
                opSymbol = "+";
                answer = left + right;
                hintText = `Add tens (${lTens * 10}+${rTens * 10}=${(lTens + rTens) * 10}) and ones (${lOnes}+${rOnes}=${lOnes + rOnes}) = ${answer}`;
                break;
            }

            case "mul_2_5_10": {
                const multipliers = [2, 5, 10];
                right = multipliers[Math.floor(Math.random() * multipliers.length)];
                left = this.randomRange(1, 10);
                opSymbol = "×";
                answer = left * right;
                hintText = `Skip count by ${right}s ${left} times → ${answer}`;
                break;
            }

            case "mul_advanced": {
                if (Math.random() < 0.6) {
                    left = this.randomRange(12, 98);
                    right = this.randomRange(3, 9);
                } else {
                    left = this.randomRange(11, 19);
                    right = this.randomRange(11, 19);
                }
                opSymbol = "×";
                answer = left * right;
                hintText = `${left} × ${right} = ${answer}`;
                break;
            }

            case "div_advanced": {
                right = this.randomRange(3, 15);
                const q = this.randomRange(4, 24);
                left = right * q;
                opSymbol = "÷";
                answer = q;
                hintText = `${right} × ${answer} = ${left}`;
                break;
            }

            case "sub_range": {
                const min = deckDef.min || 2;
                const max = deckDef.max || 20;
                left = this.randomRange(min + 2, max);
                right = this.randomRange(min, left - 1);
                opSymbol = "−";
                answer = left - right;
                hintText = `${left} − ${right} = ${answer}`;
                break;
            }

            case "add_range":
            default: {
                const min = (deckDef && deckDef.min) || 2;
                const max = (deckDef && deckDef.max) || 20;
                left = this.randomRange(min, max);
                right = this.randomRange(min, max);
                opSymbol = "+";
                answer = left + right;
                hintText = `${left} + ${right} = ${answer}`;
                break;
            }
        }

        return {
            left,
            right,
            operator: opSymbol,
            answer,
            visualHelper,
            hintText,
            questionString: right !== null ? `${left} ${opSymbol} ${right} = ` : `Count = `
        };
    }
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { AGE_PROFILES, LEVEL_DEFINITIONS, MathGenerator };
} else {
    window.AGE_PROFILES = AGE_PROFILES;
    window.LEVEL_DEFINITIONS = LEVEL_DEFINITIONS;
    window.MathGenerator = MathGenerator;
}
