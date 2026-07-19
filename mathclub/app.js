// app.js - Core logic for MathClub typing application

class MathClubApp {
    constructor() {
        this.activeView = "dashboard";

        // Game State variables
        this.gameState = {
            activeLevel: null,
            gameMode: "level", // "level", "time_attack", "survival"
            currentProblem: null,
            typedAnswer: "",
            score: 0,
            correctCount: 0,
            totalCount: 0,
            combo: 0,
            maxCombo: 0,
            lives: 3,
            timer: null,
            secondsLeft: 0,
            problemTimer: null,
            problemSecondsLeft: 0,
            startTime: 0,
            isActive: false
        };

        // UI Binding and setup
        this.initDOM();
        this.loadStats();
        this.bindEvents();
        this.initCanvas();
        this.renderLevelsMap();
        this.updateDashboardStats();
    }

    initDOM() {
        this.views = {
            dashboard: document.getElementById("view-dashboard"),
            play: document.getElementById("view-play"),
            stats: document.getElementById("view-stats"),
            custom: document.getElementById("view-custom")
        };

        this.navButtons = {
            dashboard: document.getElementById("nav-dashboard"),
            custom: document.getElementById("nav-custom"),
            stats: document.getElementById("nav-stats")
        };

        // Text & Displays
        this.dom = {
            userLevelPoints: document.getElementById("user-pts"),
            headerSoundIcon: document.getElementById("sound-icon"),
            levelsMap: document.getElementById("levels-map"),
            equationText: document.getElementById("equation-text"),
            typingInput: document.getElementById("typing-input"),
            comboBadge: document.getElementById("combo-badge"),
            comboMultiplier: document.getElementById("combo-multiplier"),

            // Header stats during game
            gameTitle: document.getElementById("game-title"),
            gameTime: document.getElementById("game-time"),
            gameScore: document.getElementById("game-score"),
            gamePPM: document.getElementById("game-ppm"),
            gameLivesContainer: document.getElementById("lives-container"),
            gameLivesSection: document.getElementById("game-lives-sec"),

            // Results Modal
            resultsModal: document.getElementById("results-modal"),
            modalTitle: document.getElementById("modal-title"),
            modalStars: document.getElementById("modal-stars"),
            modalPPM: document.getElementById("modal-ppm"),
            modalAccuracy: document.getElementById("modal-accuracy"),
            modalScore: document.getElementById("modal-score"),

            // Dashboard quick metrics
            dashPPM: document.getElementById("dash-ppm"),
            dashAccuracy: document.getElementById("dash-accuracy"),
            dashCompleted: document.getElementById("dash-completed"),

            // Custom game settings inputs
            customMixedOp: document.getElementById("custom-mixed"),
            customTimeSlider: document.getElementById("custom-time-slider"),
            customTimeVal: document.getElementById("custom-time-val"),
            customDiff: document.getElementById("custom-difficulty")
        };
    }

    bindEvents() {
        // Nav menu clicks
        Object.keys(this.navButtons).forEach(viewName => {
            this.navButtons[viewName].addEventListener("click", () => this.switchView(viewName));
        });

        // Quick Starts
        document.getElementById("btn-quick-start").addEventListener("click", () => {
            // Start Level 1
            this.startLevel(1);
        });
        document.getElementById("btn-create-custom").addEventListener("click", () => {
            this.switchView("custom");
        });

        // Custom Mode adjustments
        this.dom.customTimeSlider.addEventListener("input", (e) => {
            this.dom.customTimeVal.textContent = e.target.value + "s";
        });

        document.getElementById("btn-run-custom").addEventListener("click", () => {
            this.startCustomGame();
        });

        // Keyboard capturing
        document.addEventListener("keydown", (e) => this.handleKeyboardInput(e));
        document.addEventListener("keyup", (e) => this.handleKeyboardRelease(e));

        // Buttons in Play
        document.getElementById("btn-quit-game").addEventListener("click", () => this.quitGame());

        // Buttons in results modal
        document.getElementById("btn-close-modal").addEventListener("click", () => {
            this.dom.resultsModal.classList.remove("active");
            this.switchView("dashboard");
        });
        document.getElementById("btn-retry-level").addEventListener("click", () => {
            this.dom.resultsModal.classList.remove("active");
            if (this.gameState.activeLevel) {
                this.startLevel(this.gameState.activeLevel.id);
            } else {
                this.startCustomGame();
            }
        });

        // Sound Toggle
        document.getElementById("btn-toggle-sound").addEventListener("click", () => {
            const current = window.audioManager.isEnabled;
            window.audioManager.setSoundEnabled(!current);
            this.updateSoundToggleUI();
        });
        this.updateSoundToggleUI();

        // Custom Mode ops card selections
        document.querySelectorAll(".checkbox-card").forEach(card => {
            card.addEventListener("click", (e) => {
                const chk = card.querySelector("input[type='checkbox']");
                if (e.target !== chk) {
                    chk.checked = !chk.checked;
                }
                card.classList.toggle("selected", chk.checked);
            });
        });

        // Custom Mode Gamemode Selectors
        document.querySelectorAll(".gamemode-card").forEach(card => {
            card.addEventListener("click", () => {
                document.querySelectorAll(".gamemode-card").forEach(c => c.classList.remove("selected"));
                card.classList.add("selected");

                const mode = card.dataset.mode;
                const tracker = document.getElementById("custom-time-group");
                if (mode === "survival") {
                    tracker.style.opacity = "0.5";
                    tracker.style.pointerEvents = "none";
                } else {
                    tracker.style.opacity = "1";
                    tracker.style.pointerEvents = "auto";
                }
            });
        });
    }

    switchView(viewName) {
        if (this.gameState.isActive) {
            if (!confirm("Your active game is running. Are you sure you want to exit?")) {
                return;
            }
            this.quitGame();
        }

        this.activeView = viewName;

        // Update View Display
        Object.keys(this.views).forEach(name => {
            if (name === viewName) {
                this.views[name].classList.add("active");
            } else {
                this.views[name].classList.remove("active");
            }
        });

        // Update Active Nav Link
        Object.keys(this.navButtons).forEach(name => {
            if (name === viewName) {
                this.navButtons[name].classList.add("active");
            } else {
                this.navButtons[name].classList.remove("active");
            }
        });

        // Specific actions when loading views
        if (viewName === "dashboard") {
            this.renderLevelsMap();
            this.updateDashboardStats();
        } else if (viewName === "stats") {
            this.renderStatsView();
        }
    }

    updateSoundToggleUI() {
        const enabled = window.audioManager.isEnabled;
        if (enabled) {
            this.dom.headerSoundIcon.textContent = "🔊";
            this.dom.headerSoundIcon.parentElement.title = "Mute Sound";
        } else {
            this.dom.headerSoundIcon.textContent = "🔇";
            this.dom.headerSoundIcon.parentElement.title = "Unmute Sound";
        }
    }

    // --- Dynamic Levels System ---
    renderLevelsMap() {
        const completedLevels = JSON.parse(localStorage.getItem("mathclub_completed_levels") || "[]");
        const highscores = JSON.parse(localStorage.getItem("mathclub_highscores") || "{}");

        this.dom.levelsMap.innerHTML = "";

        window.LEVEL_DEFINITIONS.forEach((lvl, idx) => {
            const isCompleted = completedLevels.includes(lvl.id);
            // First level is always unlocked, other levels unlock after previous is completed
            const isUnlocked = idx === 0 || completedLevels.includes(window.LEVEL_DEFINITIONS[idx - 1].id);

            const card = document.createElement("div");
            card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`;

            if (isUnlocked) {
                card.addEventListener("click", () => {
                    this.startLevel(lvl.id);
                });
            }

            const starCount = isCompleted ? (highscores[lvl.id]?.stars || 3) : 0;
            const starsHTML = isCompleted
                ? Array(3).fill(0).map((_, i) => `<span class="star">${i < starCount ? '★' : '☆'}</span>`).join("")
                : "";

            const scoreText = isCompleted ? `HighScore: ${highscores[lvl.id]?.score || 0}` : "";

            card.innerHTML = `
                <div class="level-num">Level ${lvl.id}</div>
                <div class="level-name">${lvl.title}</div>
                <div class="level-desc">${lvl.description}</div>
                <div class="level-meta">
                    <span class="level-score">${scoreText}</span>
                    <span class="level-stars">${starsHTML}</span>
                </div>
            `;
            this.dom.levelsMap.appendChild(card);
        });

        // Compute overall user total points / level
        let totalPts = 0;
        Object.values(highscores).forEach(entry => {
            totalPts += (entry.score || 0);
        });
        this.dom.userLevelPoints.textContent = totalPts;
    }

    // --- Canvas Keystroke effect & particles ---
    initCanvas() {
        this.canvas = document.getElementById("fx-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.particles = [];

        const resizeCanvas = () => {
            const rect = this.canvas.parentElement.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Particle animator loop
        const animate = () => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.particles.forEach((p, idx) => {
                p.update(this.ctx);
                if (p.alpha <= 0) {
                    this.particles.splice(idx, 1);
                }
            });
            requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }

    createParticlesBurst(x, y) {
        const colors = ["#7c4dff", "#00e5ff", "#00e676", "#ffd600", "#ff1744"];
        for (let i = 0; i < 20; i++) {
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 6 + 4;
            const speedX = (Math.random() - 0.5) * 8;
            const speedY = (Math.random() - 0.5) * 8 - 2; // slight bias upwards
            const decay = Math.random() * 0.02 + 0.01;

            this.particles.push(new Particle(x, y, speedX, speedY, size, color, decay));
        }
    }

    // --- Main Game Loop implementation ---

    startLevel(levelId) {
        const def = window.LEVEL_DEFINITIONS.find(l => l.id === levelId);
        if (!def) return;

        this.gameState.activeLevel = def;
        this.gameState.gameMode = "level";
        this.gameState.secondsLeft = def.timer || 0;
        this.dom.gameTitle.textContent = def.title;

        this.setupPlayScreen();
    }

    startCustomGame() {
        // Collect checked ops
        const selectedOps = [];
        document.querySelectorAll(".operations-selector input:checked").forEach(chk => {
            selectedOps.push(chk.value);
        });

        if (selectedOps.length === 0) {
            alert("Please select at least one operation to practice!");
            return;
        }

        const mode = document.querySelector(".gamemode-card.selected").dataset.mode;
        const timeLimit = parseInt(this.dom.customTimeSlider.value);
        const difficulty = this.dom.customDiff.value; // "easy", "medium", "hard"

        // Build a dynamic local Level configuration
        let operationName = "add"; // fallback
        if (selectedOps.length > 1) {
            operationName = difficulty === "hard" ? "mixed_hard" : "mixed_medium";
        } else {
            // map single op
            const op = selectedOps[0];
            if (op === "add") operationName = difficulty === "hard" ? "add" : (difficulty === "medium" ? "add" : "add_simple_double");
            if (op === "sub") operationName = difficulty === "hard" ? "sub" : (difficulty === "medium" ? "sub" : "sub_simple_double");
            if (op === "mul") operationName = "multiply";
            if (op === "div") operationName = "divide";
        }

        // Custom details mapping
        const customDef = {
            id: null,
            title: `Custom Match: ${difficulty.toUpperCase()}`,
            operation: operationName,
            timer: mode === "survival" ? null : timeLimit,
            forcePositive: true,
            min: difficulty === "easy" ? 1 : (difficulty === "medium" ? 10 : 50),
            max: difficulty === "easy" ? 9 : (difficulty === "medium" ? 50 : 250),
            minLeft: difficulty === "easy" ? 1 : 5,
            maxLeft: difficulty === "easy" ? 5 : 12,
            minRight: difficulty === "easy" ? 1 : 5,
            maxRight: difficulty === "easy" ? 9 : 12
        };

        this.gameState.activeLevel = customDef;
        this.gameState.gameMode = mode;
        this.gameState.secondsLeft = customDef.timer || 0;
        this.dom.gameTitle.textContent = customDef.title;

        this.setupPlayScreen();
    }

    setupPlayScreen() {
        this.switchView("play");

        // Reset state values
        this.gameState.score = 0;
        this.gameState.correctCount = 0;
        this.gameState.totalCount = 0;
        this.gameState.combo = 0;
        this.gameState.maxCombo = 0;
        this.gameState.typedAnswer = "";
        this.gameState.lives = 3;
        this.gameState.isActive = true;
        this.gameState.startTime = Date.now();

        // Update displays
        this.dom.gameScore.textContent = "0";
        this.dom.gamePPM.textContent = "0";
        this.dom.typingInput.textContent = "";
        this.dom.typingInput.parentElement.classList.add("active");
        this.dom.comboBadge.style.display = "none";

        // Setup HUD modules according to Mode
        if (this.gameState.gameMode === "survival") {
            this.dom.gameTime.textContent = "--";
            this.dom.gameLivesSection.style.display = "flex";
            this.updateLivesContainer();
        } else {
            this.dom.gameLivesSection.style.display = "none";
            this.updateTimerDisplay();
        }

        this.startTimers();
        this.generateNextProblem();
    }

    startTimers() {
        if (this.gameState.timer) clearInterval(this.gameState.timer);
        if (this.gameState.problemTimer) clearInterval(this.gameState.problemTimer);

        // Core Game time counter
        if (this.gameState.secondsLeft > 0) {
            this.gameState.timer = setInterval(() => {
                this.gameState.secondsLeft--;
                this.updateTimerDisplay();
                if (this.gameState.secondsLeft <= 0) {
                    this.endGame(true);
                }
            }, 1000);
        }

        // Survival specific ticks (individual problem countdowns)
        if (this.gameState.gameMode === "survival") {
            this.startSurvivalProblemTimer();
        }
    }

    startSurvivalProblemTimer() {
        if (this.gameState.problemTimer) clearInterval(this.gameState.problemTimer);

        this.gameState.problemSecondsLeft = 10; // 10 seconds per math equations
        this.dom.gameTime.textContent = `${this.gameState.problemSecondsLeft}s`;

        // Highlight critical timer pulse if low
        this.dom.gameTime.classList.remove("color-error");

        this.gameState.problemTimer = setInterval(() => {
            this.gameState.problemSecondsLeft--;
            this.dom.gameTime.textContent = `${this.gameState.problemSecondsLeft}s`;

            if (this.gameState.problemSecondsLeft <= 3) {
                this.dom.gameTime.classList.add("color-error");
            }

            if (this.gameState.problemSecondsLeft <= 0) {
                clearInterval(this.gameState.problemTimer);
                window.audioManager.playIncorrect();
                this.gameState.lives--;
                this.updateLivesContainer();

                // Shake and generate next
                this.triggerShakeEffect();
                this.gameState.combo = 0;
                this.dom.comboBadge.style.display = "none";
                this.gameState.totalCount++;

                if (this.gameState.lives <= 0) {
                    this.endGame(false);
                } else {
                    this.generateNextProblem();
                }
            }
        }, 1000);
    }

    updateTimerDisplay() {
        if (this.gameState.secondsLeft <= 0) {
            this.dom.gameTime.textContent = "--";
            return;
        }
        const m = Math.floor(this.gameState.secondsLeft / 60);
        const s = this.gameState.secondsLeft % 60;
        this.dom.gameTime.textContent = `${m}:${s < 10 ? '0' : ''}${s}`;
    }

    updateLivesContainer() {
        const hearts = [];
        for (let i = 1; i <= 3; i++) {
            if (i <= this.gameState.lives) {
                hearts.push('<span class="heart-on">❤</span>');
            } else {
                hearts.push('<span class="heart-off">❤</span>');
            }
        }
        this.dom.gameLivesContainer.innerHTML = hearts.join("");
    }

    generateNextProblem() {
        this.gameState.typedAnswer = "";
        this.dom.typingInput.textContent = "";
        this.gameState.currentProblem = MathGenerator.generate(this.gameState.activeLevel);

        // Display equations text
        this.dom.equationText.innerHTML = `${this.gameState.currentProblem.left} <span style="color:var(--primary); font-family:var(--font-heading);">${this.gameState.currentProblem.operator}</span> ${this.gameState.currentProblem.right} =`;

        // If survival is on, restart the problem timer
        if (this.gameState.gameMode === "survival") {
            this.startSurvivalProblemTimer();
        }
    }

    handleKeyboardInput(e) {
        if (!this.gameState.isActive) return;

        const key = e.key;

        // Skip default page scrolls
        if (["Space", "ArrowUp", "ArrowDown", "Backspace"].includes(key) && e.target === document.body) {
            e.preventDefault();
        }

        // Highlight Virtual Keycap
        const keyCapId = `key-${key.toLowerCase()}`;
        const keycap = document.getElementById(keyCapId);
        if (keycap) {
            keycap.classList.add("active");
        }

        // Action handles
        if (key >= "0" && key <= "9") {
            window.audioManager.playTick();
            this.gameState.typedAnswer += key;
            this.dom.typingInput.textContent = this.gameState.typedAnswer;
        } else if (key === "-") {
            // Allow negative prefix for subtraction operations
            if (this.gameState.typedAnswer.length === 0) {
                window.audioManager.playTick();
                this.gameState.typedAnswer += key;
                this.dom.typingInput.textContent = this.gameState.typedAnswer;
            }
        } else if (key === "Backspace") {
            window.audioManager.playTick();
            this.gameState.typedAnswer = this.gameState.typedAnswer.slice(0, -1);
            this.dom.typingInput.textContent = this.gameState.typedAnswer;
        } else if (key === "Enter" || key === " ") {
            this.submitAnswer();
        }
    }

    handleKeyboardRelease(e) {
        const keyCapId = `key-${e.key.toLowerCase()}`;
        const keycap = document.getElementById(keyCapId);
        if (keycap) {
            keycap.classList.remove("active");
        }
    }

    submitAnswer() {
        if (this.gameState.typedAnswer.length === 0) return;

        const typed = parseInt(this.gameState.typedAnswer);
        const correctVal = this.gameState.currentProblem.answer;

        this.gameState.totalCount++;

        if (typed === correctVal) {
            // Correct Answer Chime
            this.gameState.correctCount++;

            // Particles and animation
            const carrierRect = this.dom.typingInput.parentElement.getBoundingClientRect();
            const canvasRect = this.canvas.getBoundingClientRect();
            const centerX = (carrierRect.left + carrierRect.width / 2) - canvasRect.left;
            const centerY = (carrierRect.top + carrierRect.height / 2) - canvasRect.top;
            this.createParticlesBurst(centerX, centerY);

            // Combo calculations
            this.gameState.combo++;
            if (this.gameState.combo > this.gameState.maxCombo) {
                this.gameState.maxCombo = this.gameState.combo;
            }

            if (this.gameState.combo >= 3) {
                this.showComboMultiplier();
                window.audioManager.playCombo(this.gameState.combo);
            } else {
                window.audioManager.playCorrect();
            }

            // Score Calculations matching difficulty
            const difficultyMultiplier = this.gameState.activeLevel.id ? (this.gameState.activeLevel.id * 10) : 25;
            const comboMultiplier = 1 + (Math.floor(this.gameState.combo / 5) * 0.5);
            this.gameState.score += Math.round(difficultyMultiplier * comboMultiplier);
            this.dom.gameScore.textContent = this.gameState.score;

            // Flash keypad success indication
            const caps = document.querySelectorAll(".key-cap");
            caps.forEach(cap => {
                if (cap.classList.contains("active")) {
                    cap.classList.add("active-success");
                    setTimeout(() => cap.classList.remove("active-success"), 150);
                }
            });

            this.updatePPMDisplay();
            this.generateNextProblem();
        } else {
            // Incorrect
            window.audioManager.playIncorrect();
            this.gameState.combo = 0;
            this.dom.comboBadge.style.display = "none";

            this.triggerShakeEffect();

            // Flash keypad error details
            const caps = document.querySelectorAll(".key-cap");
            caps.forEach(cap => {
                if (cap.classList.contains("active")) {
                    cap.classList.add("active-error");
                    setTimeout(() => cap.classList.remove("active-error"), 150);
                }
            });

            if (this.gameState.gameMode === "survival") {
                this.gameState.lives--;
                this.updateLivesContainer();
                if (this.gameState.lives <= 0) {
                    this.endGame(false);
                    return;
                }
            }

            // Clear input for retry
            this.gameState.typedAnswer = "";
            this.dom.typingInput.textContent = "";
            this.updatePPMDisplay();

            // In non-survival level mode, does it force they get it correct or slide to next?
            // In standard typing test, you backspace and correct it. In simple math, you correct it!
            // So we don't automatically generate the next problem on failure, let the user backspace and type it again.
            // Wait, but we already added 1 to totalCount. If we don't generate next problem, they will eventually submit it correctly,
            // which counts as correct count = 1, total count = 2 (1 mistake). That's perfect because accuracy will be 50%!
            // This is exactly how we want accuracy computed step-by-step!
        }
    }

    triggerShakeEffect() {
        const carrier = this.dom.typingInput.parentElement;
        carrier.classList.add("shake");
        setTimeout(() => {
            carrier.classList.remove("shake");
        }, 300);
    }

    showComboMultiplier() {
        this.dom.comboMultiplier.textContent = `x${this.gameState.combo}`;
        this.dom.comboBadge.style.display = "flex";
    }

    updatePPMDisplay() {
        const durationSec = (Date.now() - this.gameState.startTime) / 1000;
        if (durationSec <= 2) return;
        const ppm = Math.round((this.gameState.correctCount / durationSec) * 60);
        this.dom.gamePPM.textContent = ppm;
    }

    quitGame() {
        this.cleanupGameLoop();
        this.switchView("dashboard");
    }

    cleanupGameLoop() {
        this.gameState.isActive = false;
        if (this.gameState.timer) clearInterval(this.gameState.timer);
        if (this.gameState.problemTimer) clearInterval(this.gameState.problemTimer);
        this.dom.typingInput.parentElement.classList.remove("active");
    }

    endGame(timeCompleted = true) {
        this.cleanupGameLoop();

        // Calculate statistics
        const durationSec = (Date.now() - this.gameState.startTime) / 1000;
        const ppm = durationSec > 0 ? Math.round((this.gameState.correctCount / durationSec) * 60) : 0;
        const accuracy = this.gameState.totalCount > 0
            ? Math.round((this.gameState.correctCount / this.gameState.totalCount) * 100)
            : 0;

        // Sound Feedback
        const isSuccess = this.gameState.gameMode !== "survival" || this.gameState.correctCount > 10;
        if (isSuccess) {
            window.audioManager.playVictory();
        } else {
            window.audioManager.playGameOver();
        }

        // Stars mapping (For Level Progression)
        let stars = 0;
        if (this.gameState.gameMode === "level") {
            if (accuracy >= 95) stars = 3;
            else if (accuracy >= 80) stars = 2;
            else if (accuracy >= 50) stars = 1;
        }

        // Update levels history and progress
        if (this.gameState.gameMode === "level" && stars > 0) {
            const completedLevels = JSON.parse(localStorage.getItem("mathclub_completed_levels") || "[]");
            const levelId = this.gameState.activeLevel.id;

            if (!completedLevels.includes(levelId)) {
                completedLevels.push(levelId);
                localStorage.setItem("mathclub_completed_levels", JSON.stringify(completedLevels));
            }

            const highscores = JSON.parse(localStorage.getItem("mathclub_highscores") || "{}");
            const previousBest = highscores[levelId]?.score || 0;
            if (this.gameState.score > previousBest) {
                highscores[levelId] = {
                    score: this.gameState.score,
                    stars: Math.max(highscores[levelId]?.stars || 0, stars),
                    ppm,
                    accuracy
                };
                localStorage.setItem("mathclub_highscores", JSON.stringify(highscores));
            }
        }

        // Save entry globally in History logs
        this.saveHistoryEntry(ppm, accuracy);

        // Display results modal overlay
        this.dom.modalTitle.textContent = isSuccess ? "Level Cleared!" : "Game Over";

        // Stars display
        if (this.gameState.gameMode === "level") {
            this.dom.modalStars.innerHTML = Array(3).fill(0).map((_, i) => i < stars ? '★' : '☆').join("");
            this.dom.modalStars.style.display = "flex";
        } else {
            this.dom.modalStars.style.display = "none";
        }

        this.dom.modalPPM.textContent = ppm;
        this.dom.modalAccuracy.textContent = `${accuracy}%`;
        this.dom.modalScore.textContent = this.gameState.score;

        this.dom.resultsModal.classList.add("active");
    }

    // --- Statistics and Charting module ---

    loadStats() {
        this.history = JSON.parse(localStorage.getItem("mathclub_history") || "[]");
    }

    saveHistoryEntry(ppm, accuracy) {
        const entry = {
            date: new Date().toISOString(),
            level: this.gameState.activeLevel.title,
            mode: this.gameState.gameMode,
            score: this.gameState.score,
            ppm,
            accuracy,
            operation: this.gameState.activeLevel.operation || "custom"
        };

        this.history.push(entry);
        // keep last 50 matches
        if (this.history.length > 50) this.history.shift();

        localStorage.setItem("mathclub_history", JSON.stringify(this.history));
    }

    updateDashboardStats() {
        if (this.history.length === 0) {
            this.dom.dashPPM.textContent = "0";
            this.dom.dashAccuracy.textContent = "0%";
            this.dom.dashCompleted.textContent = "0";
            return;
        }

        // Average PPM and Accuracy
        let totalPPM = 0;
        let totalAcc = 0;
        this.history.forEach(x => {
            totalPPM += x.ppm;
            totalAcc += x.accuracy;
        });

        const avgPPM = Math.round(totalPPM / this.history.length);
        const avgAcc = Math.round(totalAcc / this.history.length);

        this.dom.dashPPM.textContent = avgPPM;
        this.dom.dashAccuracy.textContent = `${avgAcc}%`;

        const completedLevels = JSON.parse(localStorage.getItem("mathclub_completed_levels") || "[]");
        this.dom.dashCompleted.textContent = `${completedLevels.length}/12`;
    }

    renderStatsView() {
        const listBody = document.getElementById("stats-table-body");
        listBody.innerHTML = "";

        if (this.history.length === 0) {
            document.getElementById("stats-main-content").style.display = "none";
            document.getElementById("stats-empty").style.display = "block";
            return;
        }

        document.getElementById("stats-main-content").style.display = "grid";
        document.getElementById("stats-empty").style.display = "none";

        // Display Table History (last 10 items)
        const recent = [...this.history].reverse().slice(0, 10);
        recent.forEach(x => {
            const tr = document.createElement("tr");
            const dateStr = new Date(x.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
            tr.innerHTML = `
                <td>${dateStr}</td>
                <td>${x.level}</td>
                <td style="text-transform: capitalize;">${x.mode.replace("_", " ")}</td>
                <td><span style="color:var(--secondary); font-weight:600;">${x.score}</span></td>
                <td>${x.ppm} PPM</td>
                <td>${x.accuracy}%</td>
            `;
            listBody.appendChild(tr);
        });

        this.drawCharts();
    }

    drawCharts() {
        const last15 = this.history.slice(-15);

        // 1. Line Chart: Speed PPM Progress
        const speedSvg = document.getElementById("speed-chart");
        speedSvg.innerHTML = "";// Clear

        // 2. Bar Chart: Accuracy Per Operation Type
        const accuracySvg = document.getElementById("accuracy-chart");
        accuracySvg.innerHTML = "";

        const width = 450;
        const height = 240;
        const padding = 30;

        // Render Speed Line Chart
        if (last15.length > 0) {
            // Draw grid lines
            for (let i = 0; i <= 4; i++) {
                const y = padding + (i * (height - 2 * padding) / 4);
                const val = Math.round(100 - (i * 25)); // assume base 100 max ppm
                speedSvg.innerHTML += `
                    <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" class="grid-line" />
                    <text x="${padding - 5}" y="${y + 3}" class="axis-text" text-anchor="end">${val * 1.2}</text>
                `;
            }

            const maxVal = Math.max(...last15.map(x => x.ppm), 40) * 1.2;
            const points = last15.map((x, index) => {
                const step = last15.length > 1 ? (width - 2 * padding) / (last15.length - 1) : 0;
                const px = padding + (index * step);
                const py = height - padding - ((x.ppm / maxVal) * (height - 2 * padding));
                return { x: px, y: py, ppm: x.ppm, label: x.level };
            });

            // Draw line
            if (points.length > 1) {
                let pathD = `M ${points[0].x} ${points[0].y}`;
                for (let i = 1; i < points.length; i++) {
                    pathD += ` L ${points[i].x} ${points[i].y}`;
                }
                const pathEl = `<path d="${pathD}" class="line-chart-path" />`;
                speedSvg.innerHTML += pathEl;
            }

            // Draw Dots and bind simple tooltips
            points.forEach((pt, index) => {
                speedSvg.innerHTML += `
                    <circle cx="${pt.x}" cy="${pt.y}" r="5" class="chart-dot" data-val="${pt.ppm} PPM" data-lbl="${pt.label}"></circle>
                `;
            });
        }

        // Render Accuracy Bar Chart
        const opAccuracies = {};
        const opCounts = {};
        this.history.forEach(x => {
            let op = x.operation;
            if (op.includes("add")) op = "Addition";
            else if (op.includes("sub")) op = "Subtraction";
            else if (op.includes("multi") || op.includes("mul")) op = "Multiplication";
            else if (op.includes("divi") || op.includes("div")) op = "Division";
            else op = "Mixed";

            if (!opAccuracies[op]) {
                opAccuracies[op] = 0;
                opCounts[op] = 0;
            }
            opAccuracies[op] += x.accuracy;
            opCounts[op]++;
        });

        const opKeys = Object.keys(opAccuracies);
        if (opKeys.length > 0) {
            // Draw grid lines
            for (let i = 0; i <= 4; i++) {
                const y = padding + (i * (height - 2 * padding) / 4);
                const val = 100 - (i * 25);
                accuracySvg.innerHTML += `
                    <line x1="${padding}" y1="${y}" x2="${width - padding}" y2="${y}" class="grid-line" />
                    <text x="${padding - 5}" y="${y + 3}" class="axis-text" text-anchor="end">${val}%</text>
                `;
            }

            // Draw gradient definitions for bars
            accuracySvg.innerHTML += `
                <defs>
                    <linearGradient id="barGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stop-color="var(--secondary)" />
                        <stop offset="100%" stop-color="var(--primary)" />
                    </linearGradient>
                </defs>
            `;

            const barWidth = 40;
            const gap = (width - 2 * padding - (opKeys.length * barWidth)) / (opKeys.length + 1);

            opKeys.forEach((op, index) => {
                const avg = Math.round(opAccuracies[op] / opCounts[op]);
                const bx = padding + gap + (index * (barWidth + gap));
                const bHeight = (avg / 100) * (height - 2 * padding);
                const by = height - padding - bHeight;

                accuracySvg.innerHTML += `
                    <rect x="${bx}" y="${by}" width="${barWidth}" height="${bHeight}" rx="4" class="chart-bar" data-val="${avg}% Accuracy" data-lbl="${op}" />
                    <text x="${bx + barWidth / 2}" y="${height - padding + 15}" class="axis-text" text-anchor="middle">${op}</text>
                `;
            });
        }

        // Tooltip listeners setup
        this.setupChartTooltip(speedSvg);
        this.setupChartTooltip(accuracySvg);
    }

    setupChartTooltip(svg) {
        const tooltip = document.getElementById("chart-tooltip");
        const shapes = svg.querySelectorAll("circle, rect");

        shapes.forEach(elem => {
            elem.addEventListener("mousemove", (e) => {
                const val = elem.getAttribute("data-val");
                const lbl = elem.getAttribute("data-lbl");

                tooltip.style.display = "block";
                tooltip.innerHTML = `<strong>${lbl}</strong><br/>${val}`;

                // Position tooltip
                const parentRect = svg.parentElement.getBoundingClientRect();
                tooltip.style.left = `${(e.clientX - parentRect.left) + 15}px`;
                tooltip.style.top = `${(e.clientY - parentRect.top) - 40}px`;
            });

            elem.addEventListener("mouseleave", () => {
                tooltip.style.display = "none";
            });
        });
    }

    clearStats() {
        if (confirm("Are you sure you want to clear your entire history? This cannot be undone.")) {
            localStorage.removeItem("mathclub_history");
            localStorage.removeItem("mathclub_completed_levels");
            localStorage.removeItem("mathclub_highscores");
            this.history = [];
            this.switchView("dashboard");
        }
    }
}

// Particle Helper Class for keystroke splash and correct chimes bounce
class Particle {
    constructor(x, y, dx, dy, size, color, decay) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.size = size;
        this.color = color;
        this.alpha = 1.0;
        this.decay = decay;
    }

    update(ctx) {
        this.x += this.dx;
        this.y += this.dy;
        // Gravity
        this.dy += 0.15;
        this.alpha -= this.decay;

        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
}


// Start application on page load
window.addEventListener("DOMContentLoaded", () => {
    window.mathclub = new MathClubApp();

    // Clear history handler bind
    const clearBtn = document.getElementById("btn-clear-stats");
    if (clearBtn) {
        clearBtn.addEventListener("click", () => window.mathclub.clearStats());
    }
});
