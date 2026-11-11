// levels.js - Age-Based Mental Math Cards & Tips Configuration

const AGE_PROFILES = {
    age4: {
        id: "age4",
        label: "👧 Age 4",
        subtitle: "Early Math & Counting",
        defaultMode: "deck", // 10-card untimed deck
        deckSize: 10,
        timeLimit: 90,
        showVisualHelpers: true,
        primaryDecks: [
            {
                id: "add_5",
                title: "Addition (+) to 5",
                badge: "🍎 Visual",
                operation: "add_visual",
                min: 1,
                max: 4,
                maxSum: 5,
                description: "Add friendly small numbers up to 5 with picture counters!"
            },
            {
                id: "add_10",
                title: "Addition (+) to 10",
                badge: "⭐ Visual",
                operation: "add_visual",
                min: 1,
                max: 5,
                maxSum: 10,
                description: "Count and add numbers up to 10!"
            },
            {
                id: "sub_5",
                title: "Subtraction (−) to 5",
                badge: "🎈 Take Away",
                operation: "sub_visual",
                min: 1,
                max: 5,
                description: "Start with up to 5 items and take some away!"
            },
            {
                id: "doubles_5",
                title: "Doubles (1+1 to 5+5)",
                badge: "👯 Twins",
                operation: "doubles_early",
                min: 1,
                max: 5,
                description: "Practice matching twin numbers like 2 + 2 and 3 + 3!"
            }
        ],
        moreDecks: [
            {
                id: "count_10",
                title: "Count Objects (1–9)",
                badge: "🍓 Count",
                operation: "count_objects",
                min: 1,
                max: 9,
                description: "Count the pictures on the card and tap the number!"
            },
            {
                id: "plus_one",
                title: "Plus One (+1 Jumps)",
                badge: "🐸 Next Number",
                operation: "plus_one",
                min: 1,
                max: 8,
                description: "Adding 1 is just jumping to the very next counting number!"
            }
        ],
        tips: [
            {
                title: "1. Count On from the Bigger Number",
                formula: "4 + 2  →  Say '4'... then 5, 6!",
                body: "Put the bigger number in your head first, then use your fingers or the pictures to count up!",
                practiceDeckId: "add_10"
            },
            {
                title: "2. Plus One is the Next Number",
                formula: "5 + 1 = 6  •  7 + 1 = 8",
                body: "Whenever you see + 1, you don't even have to count from 1—just say the very next number!",
                practiceDeckId: "plus_one"
            },
            {
                title: "3. Twin Doubles!",
                formula: "1+1=2 • 2+2=4 • 3+3=6 • 4+4=8 • 5+5=10",
                body: "Doubles are like matching shoes! Two hands with 3 fingers each make 6.",
                practiceDeckId: "doubles_5"
            },
            {
                title: "4. Take Away (Subtraction)",
                formula: "5 − 2 = 3",
                body: "Hold up 5 fingers, fold 2 down, and see how many are still standing!",
                practiceDeckId: "sub_5"
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

    static generate(deckDef) {
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
        }

        const emoji = this.pickEmoji();

        switch (op) {
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
                left = this.randomRange(11, 79);
                right = this.randomRange(11, 59);
                opSymbol = "+";
                answer = left + right;
                const rTens = Math.floor(right / 10) * 10;
                const rOnes = right % 10;
                hintText = `Tip: ${left} + ${rTens} = ${left + rTens}, then + ${rOnes} = ${answer}`;
                break;
            }

            case "sub_mental": {
                left = this.randomRange(25, 96);
                right = this.randomRange(11, left - 6);
                opSymbol = "−";
                answer = left - right;
                hintText = `Tip: Count up from ${right} to ${left} → ${answer}`;
                break;
            }

            case "mul_mental": {
                // 65% core times tables (2..12 × 2..12), 35% 2-digit × 1-digit mental cards (like 82 × 3)
                if (Math.random() < 0.65) {
                    left = this.randomRange(2, 12);
                    right = this.randomRange(2, 12);
                    opSymbol = "×";
                    answer = left * right;
                    hintText = `${left} groups of ${right} = ${answer}`;
                } else {
                    left = this.randomRange(12, 89);
                    right = this.randomRange(2, 6);
                    opSymbol = "×";
                    answer = left * right;
                    const lTens = Math.floor(left / 10) * 10;
                    const lOnes = left % 10;
                    hintText = `Split: (${lTens} × ${right} = ${lTens * right}) + (${lOnes} × ${right} = ${lOnes * right}) = ${answer}`;
                }
                break;
            }

            case "mul_2x1": {
                left = this.randomRange(12, 94);
                right = this.randomRange(2, 8);
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
                    left = this.randomRange(12, 72);
                    right = 11;
                    answer = left * 11;
                    hintText = `×11 Trick: ${left} × 10 + ${left} = ${answer}`;
                } else if (trickType === 1) {
                    // × 5 trick (even numbers make clean halves)
                    left = this.randomRange(6, 48) * 2;
                    right = 5;
                    answer = left * 5;
                    hintText = `×5 Trick: Half of ${left} is ${left / 2}, times 10 = ${answer}`;
                } else {
                    // × 9 trick
                    left = this.randomRange(4, 25);
                    right = 9;
                    answer = left * 9;
                    hintText = `×9 Trick: (${left} × 10 = ${left * 10}) − ${left} = ${answer}`;
                }
                break;
            }

            case "squares_5": {
                const pool = [4, 5, 6, 7, 8, 9, 10, 11, 12, 15, 20, 25, 35];
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
                right = this.randomRange(2, 12);
                const quotient = this.randomRange(2, 12);
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
