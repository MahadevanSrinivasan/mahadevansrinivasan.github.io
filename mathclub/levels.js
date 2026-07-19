// levels.js - MathClub Level Configuration & Math Generator

const LEVEL_DEFINITIONS = [
    {
        id: 1,
        title: "Single Digit Addition",
        description: "Add numbers from 1 to 9. Great for starting out!",
        operation: "add",
        min: 1,
        max: 9,
        timer: null // Infinite time
    },
    {
        id: 2,
        title: "Single Digit Subtraction",
        description: "Subtract small numbers. All positive results.",
        operation: "sub",
        min: 1,
        max: 9,
        forcePositive: true,
        timer: null
    },
    {
        id: 3,
        title: "Double Digit Addition (Simple)",
        description: "Standard addition without carried numbers.",
        operation: "add_simple_double",
        min: 10,
        max: 49,
        timer: 45
    },
    {
        id: 4,
        title: "Double Digit Subtraction (Simple)",
        description: "Standard subtraction without borrowing.",
        operation: "sub_simple_double",
        min: 10,
        max: 49,
        timer: 45
    },
    {
        id: 5,
        title: "Multiplication: Tables 1 to 5",
        description: "Master files for basic multiplication tables.",
        operation: "multiply",
        minLeft: 1,
        maxLeft: 5,
        minRight: 1,
        maxRight: 9,
        timer: 60
    },
    {
        id: 6,
        title: "Division: Tables 1 to 5",
        description: "Exact dividing exercises for basic multipliers.",
        operation: "divide",
        minLeft: 1,
        maxLeft: 5,
        minRight: 1,
        maxRight: 9,
        timer: 60
    },
    {
        id: 7,
        title: "Double Digit Addition (Full)",
        description: "Challenge yourself with carried addition.",
        operation: "add",
        min: 10,
        max: 99,
        timer: 60
    },
    {
        id: 8,
        title: "Double Digit Subtraction (Full)",
        description: "Try subtraction with borrowed digits.",
        operation: "sub",
        min: 10,
        max: 99,
        forcePositive: true,
        timer: 60
    },
    {
        id: 9,
        title: "Multiplication: Tables 6 to 12",
        description: "Stepping up multiplication skills.",
        operation: "multiply",
        minLeft: 6,
        maxLeft: 12,
        minRight: 1,
        maxRight: 12,
        timer: 75
    },
    {
        id: 10,
        title: "Division: Tables 6 to 12",
        description: "Divide double digits yielding quotients 1-12.",
        operation: "divide",
        minLeft: 6,
        maxLeft: 12,
        minRight: 1,
        maxRight: 12,
        timer: 75
    },
    {
        id: 11,
        title: "Mixed Standard Practice",
        description: "Random mix of operations with medium values.",
        operation: "mixed_medium",
        timer: 90
    },
    {
        id: 12,
        title: "Master Challenge",
        description: "Larger values, faster timers, and mixed operations!",
        operation: "mixed_hard",
        timer: 60
    }
];

class MathGenerator {
    static generate(levelDef) {
        let left = 0;
        let right = 0;
        let opSymbol = '';
        let answer = 0;

        let op = levelDef.operation;
        if (op === "mixed_medium" || op === "mixed_hard") {
            const ops = ["add", "sub", "multiply", "divide"];
            op = ops[Math.floor(Math.random() * ops.length)];
        }

        switch (op) {
            case "add": {
                const min = levelDef.min || 10;
                const max = levelDef.max || 99;
                left = this.randomRange(min, max);
                right = this.randomRange(min, max);
                opSymbol = "+";
                answer = left + right;
                break;
            }
            case "add_simple_double": {
                // Ensure no carrying. Digits at each place add up to <= 9
                // left units + right units <= 9. Left tens + right tens <= 9
                const min = levelDef.min || 10;
                const max = levelDef.max || 49;
                let l_tens = this.randomRange(1, 4);
                let l_ones = this.randomRange(0, 4);
                let r_tens = this.randomRange(1, 4);
                let r_ones = this.randomRange(0, 5 - l_ones); // Ensure ones sum to <= 9
                left = l_tens * 10 + l_ones;
                right = r_tens * 10 + r_ones;
                opSymbol = "+";
                answer = left + right;
                break;
            }
            case "sub": {
                const min = levelDef.min || 10;
                const max = levelDef.max || 99;
                left = this.randomRange(min, max);
                right = this.randomRange(min, max);
                if (levelDef.forcePositive && left < right) {
                    const temp = left;
                    left = right;
                    right = temp;
                }
                opSymbol = "-";
                answer = left - right;
                break;
            }
            case "sub_simple_double": {
                // Ensure no borrowing. Left digit >= right digit at each place
                let l_tens = this.randomRange(2, 5);
                let l_ones = this.randomRange(2, 9);
                let r_tens = this.randomRange(1, l_tens);
                let r_ones = this.randomRange(0, l_ones);
                left = l_tens * 10 + l_ones;
                right = r_tens * 10 + r_ones;
                opSymbol = "-";
                answer = left - right;
                break;
            }
            case "multiply": {
                const minL = levelDef.minLeft || 1;
                const maxL = levelDef.maxLeft || 12;
                const minR = levelDef.minRight || 1;
                const maxR = levelDef.maxRight || 12;
                left = this.randomRange(minL, maxL);
                right = this.randomRange(minR, maxR);
                opSymbol = "×";
                answer = left * right;
                break;
            }
            case "divide": {
                const minL = levelDef.minLeft || 1;
                const maxL = levelDef.maxLeft || 12;
                const minR = levelDef.minRight || 1;
                const maxR = levelDef.maxRight || 12;
                // Divisor (right)
                right = this.randomRange(minL, maxL);
                // Quotient (left)
                const quotient = this.randomRange(minR, maxR);
                // Dividend (left * right)
                left = right * quotient;
                opSymbol = "÷";
                answer = quotient; // We want dividend / divisor = answer
                const temp = left;
                left = temp; 
                // Wait: left / right = answer
                // Mathematically: left = dividend, right = divisor, answer = quotient
                break;
            }
        }

        // Apply Hard Level Scaling if hard mixed requested
        if (levelDef.operation === "mixed_hard") {
            // scale values slightly higher
            if (op === "add" || op === "sub") {
                left = this.randomRange(50, 499);
                right = this.randomRange(50, 499);
                if (op === "sub" && left < right) {
                    const temp = left; left = right; right = temp;
                }
                answer = op === "add" ? left + right : left - right;
            } else if (op === "multiply") {
                left = this.randomRange(5, 20);
                right = this.randomRange(5, 20);
                answer = left * right;
            } else if (op === "divide") {
                right = this.randomRange(5, 20);
                const quotient = this.randomRange(5, 25);
                left = right * quotient;
                answer = quotient;
            }
        }

        return {
            left,
            right,
            operator: opSymbol,
            answer,
            questionString: `${left} ${opSymbol} ${right} = `
        };
    }

    static randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}

// Export mapping or attach globally
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LEVEL_DEFINITIONS, MathGenerator };
} else {
    window.LEVEL_DEFINITIONS = LEVEL_DEFINITIONS;
    window.MathGenerator = MathGenerator;
}
