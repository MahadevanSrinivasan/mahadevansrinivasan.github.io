// app.js - MathClub: Simplified Age-Based Mental Math Cards & Tips

const SPOKEN_NUMBER_WORDS = {
    zero: 0, one: 1, won: 1, two: 2, to: 2, too: 2, three: 3, four: 4, for: 4,
    five: 5, six: 6, seven: 7, eight: 8, ate: 8, nine: 9, ten: 10,
    eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15,
    sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19, twenty: 20,
    thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90
};

function parseSpokenNumber(transcript) {
    if (!transcript) return null;
    const cleaned = transcript.toLowerCase().trim();
    const digitMatch = cleaned.match(/-?\d+/);
    if (digitMatch) {
        return parseInt(digitMatch[0], 10);
    }
    const tokens = cleaned.replace(/[^a-z\s-]/g, "").split(/[\s-]+/).filter(Boolean);
    let total = 0;
    let matched = false;
    for (const tok of tokens) {
        if (Object.prototype.hasOwnProperty.call(SPOKEN_NUMBER_WORDS, tok)) {
            total += SPOKEN_NUMBER_WORDS[tok];
            matched = true;
        }
    }
    return matched ? total : null;
}

class MathClubApp {
    constructor() {
        this.activeView = "dashboard";
        this.activeAgeId = localStorage.getItem("mathclub_age_profile") || "age8_9";
        if (!window.AGE_PROFILES[this.activeAgeId]) {
            this.activeAgeId = "age8_9";
        }
        this.sessionMode = window.AGE_PROFILES[this.activeAgeId].defaultMode || "deck";
        this.tipIndex = 0;

        this.gameState = {
            activeDeck: null,
            currentProblem: null,
            typedAnswer: "",
            score: 0,
            rightCount: 0,
            wrongCount: 0,
            questionIndex: 1,
            deckSize: 12,
            combo: 0,
            maxCombo: 0,
            timer: null,
            secondsLeft: 0,
            isActive: false,
            isTransitioning: false
        };

        this.recognition = null;
        this.isListening = false;

        this.initDOM();
        this.loadStats();
        this.bindEvents();
        this.renderAgeProfile();
        this.updateDashboardStats();
    }

    isCoarsePointerDevice() {
        return Boolean(
            ("ontouchstart" in window) ||
            (navigator.maxTouchPoints && navigator.maxTouchPoints > 0) ||
            (window.matchMedia && window.matchMedia("(pointer: coarse)").matches)
        );
    }

    initDOM() {
        this.views = {
            dashboard: document.getElementById("view-dashboard"),
            play: document.getElementById("view-play"),
            tips: document.getElementById("view-tips")
        };

        this.dom = {
            brandHome: document.getElementById("brand-home"),
            navDashboard: document.getElementById("nav-dashboard"),
            navTips: document.getElementById("nav-tips"),
            ageBtn4: document.getElementById("age-btn-age4"),
            ageBtn89: document.getElementById("age-btn-age8_9"),
            ageMoreSelect: document.getElementById("age-more-select"),
            activeAgeSubtitle: document.getElementById("active-age-subtitle"),

            modeBtnDeck: document.getElementById("mode-btn-deck"),
            modeBtnTimed: document.getElementById("mode-btn-timed"),
            deckCountLabel: document.getElementById("deck-count-label"),

            primaryDecksList: document.getElementById("primary-decks-list"),
            moreDecksList: document.getElementById("more-decks-list"),
            btnToggleMoreCards: document.getElementById("btn-toggle-more-cards"),

            spotlightTipTitle: document.getElementById("spotlight-tip-title"),
            spotlightTipFormula: document.getElementById("spotlight-tip-formula"),
            spotlightTipBody: document.getElementById("spotlight-tip-body"),
            btnNextTip: document.getElementById("btn-next-tip"),
            btnPracticeTip: document.getElementById("btn-practice-tip"),
            btnSeeAllTips: document.getElementById("btn-see-all-tips"),
            btnBackToCards: document.getElementById("btn-back-to-cards"),
            tipsCardsGrid: document.getElementById("tips-cards-grid"),
            tipsViewTitle: document.getElementById("tips-view-title"),
            tipsViewSub: document.getElementById("tips-view-sub"),

            userLevelPoints: document.getElementById("user-pts"),
            headerSoundIcon: document.getElementById("sound-icon"),
            dashCompleted: document.getElementById("dash-completed"),
            dashAccuracy: document.getElementById("dash-accuracy"),
            dashPPM: document.getElementById("dash-ppm"),

            flashcardPaper: document.getElementById("flashcard-paper"),
            cardCheckOverlay: document.getElementById("card-check-overlay"),
            statRight: document.getElementById("stat-right"),
            statWrong: document.getElementById("stat-wrong"),
            gameScore: document.getElementById("game-score"),
            gameTitle: document.getElementById("game-title"),
            gameTime: document.getElementById("game-time"),
            visualHelperBox: document.getElementById("visual-helper-box"),
            stackTop: document.getElementById("stack-top"),
            stackOp: document.getElementById("stack-op"),
            stackBottom: document.getElementById("stack-bottom"),
            typingInput: document.getElementById("typing-input"),
            hiddenInput: document.getElementById("hidden-mobile-input"),
            cardHintBanner: document.getElementById("card-hint-banner"),
            btnVoiceListen: document.getElementById("btn-voice-listen"),
            voiceStatusText: document.getElementById("voice-status-text"),

            comboBadge: document.getElementById("combo-badge"),
            comboMultiplier: document.getElementById("combo-multiplier"),

            resultsModal: document.getElementById("results-modal"),
            modalTitle: document.getElementById("modal-title"),
            modalStars: document.getElementById("modal-stars"),
            modalPPM: document.getElementById("modal-ppm"),
            modalAccuracy: document.getElementById("modal-accuracy"),
            modalScore: document.getElementById("modal-score")
        };
    }

    bindEvents() {
        if (this.dom.brandHome) {
            this.dom.brandHome.addEventListener("click", () => this.switchView("dashboard"));
        }
        if (this.dom.navDashboard) {
            this.dom.navDashboard.addEventListener("click", () => this.switchView("dashboard"));
        }
        if (this.dom.navTips) {
            this.dom.navTips.addEventListener("click", () => this.switchView("tips"));
        }
        if (this.dom.btnSeeAllTips) {
            this.dom.btnSeeAllTips.addEventListener("click", () => this.switchView("tips"));
        }
        if (this.dom.btnBackToCards) {
            this.dom.btnBackToCards.addEventListener("click", () => this.switchView("dashboard"));
        }

        // Age Switcher (Age 4 & Age 8–9 primary pills + Other Ages dropdown)
        [this.dom.ageBtn4, this.dom.ageBtn89].forEach(btn => {
            if (!btn) return;
            btn.addEventListener("click", () => {
                this.setAgeProfile(btn.dataset.age);
            });
        });

        if (this.dom.ageMoreSelect) {
            this.dom.ageMoreSelect.addEventListener("change", (e) => {
                if (e.target.value) {
                    this.setAgeProfile(e.target.value);
                }
            });
        }

        // Session Mode Toggle (Deck vs Timed)
        [this.dom.modeBtnDeck, this.dom.modeBtnTimed].forEach(btn => {
            if (!btn) return;
            btn.addEventListener("click", () => {
                this.sessionMode = btn.dataset.mode;
                this.updateModeButtonsUI();
            });
        });

        // More Cards Drawer Toggle
        if (this.dom.btnToggleMoreCards) {
            this.dom.btnToggleMoreCards.addEventListener("click", () => {
                const isHidden = this.dom.moreDecksList.hidden;
                this.dom.moreDecksList.hidden = !isHidden;
                this.dom.btnToggleMoreCards.textContent = isHidden ? "▼ Hide Extra Cards ▼" : "▲ More Cards ▲";
            });
        }

        // Featured Tip Rotation & Practice
        if (this.dom.btnNextTip) {
            this.dom.btnNextTip.addEventListener("click", () => {
                const profile = this.getActiveProfile();
                const tips = profile.tips || [];
                if (tips.length > 0) {
                    this.tipIndex = (this.tipIndex + 1) % tips.length;
                    this.renderSpotlightTip();
                }
            });
        }

        if (this.dom.btnPracticeTip) {
            this.dom.btnPracticeTip.addEventListener("click", () => {
                const profile = this.getActiveProfile();
                const tip = (profile.tips || [])[this.tipIndex];
                if (tip && tip.practiceDeckId) {
                    this.startDeckById(tip.practiceDeckId);
                } else if (profile.primaryDecks.length > 0) {
                    this.startDeck(profile.primaryDecks[0]);
                }
            });
        }

        // Physical Keyboard Support
        document.addEventListener("keydown", (e) => this.handleKeyboardInput(e));
        document.addEventListener("keyup", (e) => this.handleKeyboardRelease(e));

        // Suppress Android OS soft keyboard on touch devices
        if (this.dom.hiddenInput) {
            this.dom.hiddenInput.setAttribute("inputmode", "none");
            this.dom.hiddenInput.setAttribute("readonly", "readonly");
        }

        // 3x4 On-Screen Calculator Pad
        document.querySelectorAll(".key-cap").forEach(cap => {
            let lastTap = 0;
            const handleTap = (e) => {
                e.preventDefault();
                if (!this.gameState.isActive || this.gameState.isTransitioning) return;
                const now = Date.now();
                if (now - lastTap < 55) return;
                lastTap = now;

                const key = cap.dataset.key;
                if (key === "Clear") {
                    window.audioManager.playTick();
                    this.gameState.typedAnswer = "";
                    this.updateTypedDisplay();
                } else if (key === "Enter") {
                    this.submitAnswer();
                } else if (key >= "0" && key <= "9") {
                    if (this.gameState.typedAnswer.length < 5) {
                        window.audioManager.playTick();
                        this.gameState.typedAnswer += key;
                        this.updateTypedDisplay();
                    }
                }

                cap.classList.add("active");
                setTimeout(() => cap.classList.remove("active"), 100);
            };
            cap.addEventListener("touchstart", handleTap, { passive: false });
            cap.addEventListener("mousedown", handleTap);
        });

        // Quit / Back to Cards
        const quitBtn = document.getElementById("btn-quit-game");
        if (quitBtn) {
            quitBtn.addEventListener("click", () => {
                this.stopGameTimers();
                this.stopVoiceListening();
                this.gameState.isActive = false;
                this.switchView("dashboard");
            });
        }

        // Tap the Deck Level Tag during play to manually cycle difficulty level (Lv 1 -> Lv 5)
        if (this.dom.gameTitle) {
            this.dom.gameTitle.style.cursor = "pointer";
            this.dom.gameTitle.title = "Tap to adjust difficulty level (Lv 1–5)";
            this.dom.gameTitle.addEventListener("click", () => {
                if (!this.gameState.isActive || !this.gameState.activeDeck) return;
                const deckId = this.gameState.activeDeck.id;
                const prog = this.getProfileProgress();
                const cur = this.getDeckTier(deckId);
                const next = (cur % 5) + 1;
                prog.deckTiers[deckId] = next;
                this.saveAdaptiveProgress();
                this.dom.gameTitle.textContent = `${this.gameState.activeDeck.title} (Lv ${next} ⬆)`;
                this.renderAgeProfile();
                this.generateNextCard();
            });
        }

        // Results Modal Actions
        document.getElementById("btn-close-modal").addEventListener("click", () => {
            this.dom.resultsModal.classList.remove("active");
            this.switchView("dashboard");
        });

        document.getElementById("btn-retry-level").addEventListener("click", () => {
            this.dom.resultsModal.classList.remove("active");
            if (this.gameState.activeDeck) {
                this.startDeck(this.gameState.activeDeck);
            }
        });

        // Sound Toggle
        document.getElementById("btn-toggle-sound").addEventListener("click", () => {
            const current = window.audioManager.isEnabled;
            window.audioManager.setSoundEnabled(!current);
            this.updateSoundToggleUI();
        });
        this.updateSoundToggleUI();

        // Voice Answer Button ("I'm listening...")
        if (this.dom.btnVoiceListen) {
            this.dom.btnVoiceListen.addEventListener("click", () => this.toggleVoiceListening());
        }
    }

    getActiveProfile() {
        return window.AGE_PROFILES[this.activeAgeId] || window.AGE_PROFILES.age8_9;
    }

    setAgeProfile(ageId) {
        if (!window.AGE_PROFILES[ageId]) return;
        this.activeAgeId = ageId;
        localStorage.setItem("mathclub_age_profile", ageId);
        const profile = this.getActiveProfile();
        this.sessionMode = profile.defaultMode || "deck";
        this.tipIndex = 0;

        if (this.gameState.isActive) {
            this.stopGameTimers();
            this.stopVoiceListening();
            this.gameState.isActive = false;
            this.switchView("dashboard");
        }
        this.renderAgeProfile();
    }

    updateModeButtonsUI() {
        if (this.dom.modeBtnDeck) {
            this.dom.modeBtnDeck.classList.toggle("active", this.sessionMode === "deck");
        }
        if (this.dom.modeBtnTimed) {
            this.dom.modeBtnTimed.classList.toggle("active", this.sessionMode === "timed");
        }
    }

    renderAgeProfile() {
        const profile = this.getActiveProfile();

        // Update Top Age Switcher Pills
        if (this.dom.ageBtn4) {
            this.dom.ageBtn4.classList.toggle("active", this.activeAgeId === "age4");
        }
        if (this.dom.ageBtn89) {
            this.dom.ageBtn89.classList.toggle("active", this.activeAgeId === "age8_9");
        }
        if (this.dom.ageMoreSelect) {
            if (this.activeAgeId === "age6_7" || this.activeAgeId === "age10_plus") {
                this.dom.ageMoreSelect.value = this.activeAgeId;
                this.dom.ageMoreSelect.classList.add("active");
            } else {
                this.dom.ageMoreSelect.value = "";
                this.dom.ageMoreSelect.classList.remove("active");
            }
        }

        if (this.dom.activeAgeSubtitle) {
            this.dom.activeAgeSubtitle.textContent = `${profile.label} • ${profile.subtitle}`;
        }
        if (this.dom.deckCountLabel) {
            this.dom.deckCountLabel.textContent = String(profile.deckSize || 12);
        }
        this.updateModeButtonsUI();

        // Render Primary Operation Buttons (Mental Math Cards style)
        if (this.dom.primaryDecksList) {
            this.dom.primaryDecksList.innerHTML = "";
            (profile.primaryDecks || []).forEach(deck => {
                this.dom.primaryDecksList.appendChild(this.createDeckButton(deck));
            });
        }

        // Render More Cards Drawer
        const moreDecks = profile.moreDecks || [];
        if (this.dom.moreDecksList && this.dom.btnToggleMoreCards) {
            this.dom.moreDecksList.innerHTML = "";
            this.dom.moreDecksList.hidden = true;
            if (moreDecks.length === 0) {
                this.dom.btnToggleMoreCards.hidden = true;
            } else {
                this.dom.btnToggleMoreCards.hidden = false;
                this.dom.btnToggleMoreCards.textContent = "▲ More Cards ▲";
                moreDecks.forEach(deck => {
                    this.dom.moreDecksList.appendChild(this.createDeckButton(deck));
                });
            }
        }

        this.renderSpotlightTip();
        this.renderAllTipsView();
    }

    createDeckButton(deck) {
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "deck-pill-btn";
        const tier = this.getDeckTier(deck.id);
        const wins = this.getDeckWins(deck.id);
        const tierBadge = window.MathGenerator.describeTier
            ? window.MathGenerator.describeTier(deck, tier)
            : `⭐ Lv ${tier}`;
        const subBadge = wins > 0 ? `${tierBadge} • ${wins} Done` : `${tierBadge} • ${deck.badge || ""}`;
        btn.innerHTML = `
            <span>${deck.title}</span>
            <span class="deck-pill-badge" title="Tap + or − during play or finish with 85%+ to level up!">${subBadge}</span>
        `;
        btn.addEventListener("click", () => this.startDeck(deck));
        return btn;
    }

    renderSpotlightTip() {
        const profile = this.getActiveProfile();
        const tips = profile.tips || [];
        if (tips.length === 0) return;
        const tip = tips[this.tipIndex % tips.length];
        if (this.dom.spotlightTipTitle) this.dom.spotlightTipTitle.textContent = tip.title;
        if (this.dom.spotlightTipFormula) this.dom.spotlightTipFormula.textContent = tip.formula;
        if (this.dom.spotlightTipBody) this.dom.spotlightTipBody.textContent = tip.body;
    }

    renderAllTipsView() {
        const profile = this.getActiveProfile();
        if (this.dom.tipsViewTitle) {
            this.dom.tipsViewTitle.textContent = `💡 ${profile.label} Mental Math Tips`;
        }
        if (this.dom.tipsViewSub) {
            this.dom.tipsViewSub.textContent = profile.subtitle;
        }
        if (!this.dom.tipsCardsGrid) return;
        this.dom.tipsCardsGrid.innerHTML = "";
        (profile.tips || []).forEach(tip => {
            const card = document.createElement("div");
            card.className = "tip-card-item";
            card.innerHTML = `
                <h3>${tip.title}</h3>
                <div class="tip-formula-box">${tip.formula}</div>
                <p>${tip.body}</p>
                <button type="button" class="btn-try-tip primary">▶ Practice This Trick</button>
            `;
            card.querySelector("button").addEventListener("click", () => {
                if (tip.practiceDeckId) {
                    this.startDeckById(tip.practiceDeckId);
                } else if (profile.primaryDecks.length > 0) {
                    this.startDeck(profile.primaryDecks[0]);
                }
            });
            this.dom.tipsCardsGrid.appendChild(card);
        });
    }

    startDeckById(deckId) {
        const profile = this.getActiveProfile();
        const allDecks = [...(profile.primaryDecks || []), ...(profile.moreDecks || [])];
        const found = allDecks.find(d => d.id === deckId) || allDecks[0];
        if (found) this.startDeck(found);
    }

    switchView(viewName) {
        this.activeView = viewName;
        Object.keys(this.views).forEach(k => {
            if (this.views[k]) {
                this.views[k].classList.toggle("active", k === viewName);
            }
        });
        if (this.dom.navDashboard) {
            this.dom.navDashboard.classList.toggle("active", viewName === "dashboard" || viewName === "play");
        }
        if (this.dom.navTips) {
            this.dom.navTips.classList.toggle("active", viewName === "tips");
        }
        if (viewName === "dashboard") {
            this.updateDashboardStats();
        }
    }

    updateSoundToggleUI() {
        const enabled = window.audioManager.isEnabled;
        if (this.dom.headerSoundIcon) {
            this.dom.headerSoundIcon.textContent = enabled ? "🔊" : "🔇";
        }
    }

    // ================= FLASHCARD GAME LOOP =================

    startDeck(deckDef) {
        const profile = this.getActiveProfile();
        this.gameState.activeDeck = deckDef;
        this.gameState.score = 0;
        this.gameState.rightCount = 0;
        this.gameState.wrongCount = 0;
        this.gameState.questionIndex = 1;
        this.gameState.deckSize = profile.deckSize || 12;
        this.gameState.combo = 0;
        this.gameState.maxCombo = 0;
        this.gameState.typedAnswer = "";
        this.gameState.isActive = true;
        this.gameState.isTransitioning = false;
        this.gameState.currentCardHadError = false;
        this.gameState.sessionSeenKeys = new Set();
        this.gameState.secondsLeft = this.sessionMode === "timed" ? (profile.timeLimit || 110) : 0;

        this.switchView("play");

        const curTier = this.getDeckTier(deckDef.id);
        this.dom.statRight.textContent = "0";
        this.dom.statWrong.textContent = "0";
        this.dom.gameScore.textContent = "0";
        this.dom.gameTitle.textContent = `${deckDef.title} (Lv ${curTier})`;
        this.dom.comboBadge.style.display = "none";
        this.dom.cardHintBanner.hidden = true;
        this.dom.flashcardPaper.classList.remove("card-correct", "card-wrong");

        this.stopGameTimers();
        if (this.sessionMode === "timed") {
            this.updateTimeOrDeckHud();
            this.gameState.timer = setInterval(() => {
                this.gameState.secondsLeft--;
                this.updateTimeOrDeckHud();
                if (this.gameState.secondsLeft <= 0) {
                    this.endSession();
                }
            }, 1000);
        } else {
            this.updateTimeOrDeckHud();
        }

        this.generateNextCard();
    }

    stopGameTimers() {
        if (this.gameState.timer) {
            clearInterval(this.gameState.timer);
            this.gameState.timer = null;
        }
    }

    updateTimeOrDeckHud() {
        if (this.sessionMode === "timed") {
            const sec = Math.max(0, this.gameState.secondsLeft);
            const m = Math.floor(sec / 60);
            const s = sec % 60;
            this.dom.gameTime.textContent = `TIME: ${m}:${s < 10 ? "0" : ""}${s}`;
        } else {
            this.dom.gameTime.textContent = `Q: ${this.gameState.questionIndex}/${this.gameState.deckSize}`;
        }
    }

    generateNextCard() {
        this.gameState.typedAnswer = "";
        this.gameState.isTransitioning = false;
        this.gameState.currentCardHadError = false;
        this.dom.flashcardPaper.classList.remove("card-correct", "card-wrong");
        this.dom.cardHintBanner.hidden = true;

        const deckId = this.gameState.activeDeck ? this.gameState.activeDeck.id : "default";
        const curTier = this.getDeckTier(deckId);
        const profileProg = this.getProfileProgress();
        const avoidKeys = new Set([
            ...(profileProg.recentSolved || []),
            ...(this.gameState.sessionSeenKeys || [])
        ]);
        const missedQueue = (profileProg.missedByDeck && profileProg.missedByDeck[deckId]) || [];

        const problem = window.MathGenerator.generate(this.gameState.activeDeck, {
            tier: curTier,
            avoidKeys,
            missedQueue
        });
        this.gameState.currentProblem = problem;
        const probKey = `${problem.left}${problem.operator}${problem.right}`;
        if (this.gameState.sessionSeenKeys) {
            this.gameState.sessionSeenKeys.add(probKey);
        }

        // Render stacked vertical equation
        if (problem.right === null) {
            // Counting mode for Age 4
            this.dom.stackTop.textContent = problem.visualHelper ? problem.visualHelper.emoji : "⭐";
            this.dom.stackOp.textContent = "";
            this.dom.stackBottom.textContent = "Count";
        } else {
            this.dom.stackTop.textContent = String(problem.left);
            this.dom.stackOp.textContent = problem.operator;
            this.dom.stackBottom.textContent = String(problem.right);
        }

        // Render Visual Emoji Helper for Age 4
        if (problem.visualHelper) {
            this.dom.visualHelperBox.hidden = false;
            const vh = problem.visualHelper;
            if (vh.type === "add") {
                this.dom.visualHelperBox.innerHTML = `<span>${vh.leftGroup}</span> <strong style="margin:0 6px;">+</strong> <span>${vh.rightGroup}</span>`;
            } else if (vh.type === "sub") {
                const kept = Array(vh.total - vh.taken).fill(vh.emoji).join(" ");
                const crossed = Array(vh.taken).fill(`<span class="crossed-emoji">${vh.emoji}</span>`).join(" ");
                this.dom.visualHelperBox.innerHTML = `${kept} ${crossed}`;
            } else if (vh.type === "count") {
                this.dom.visualHelperBox.innerHTML = `<span>${vh.leftGroup}</span>`;
            }
        } else {
            this.dom.visualHelperBox.hidden = true;
            this.dom.visualHelperBox.innerHTML = "";
        }

        this.updateTypedDisplay();
        this.updateTimeOrDeckHud();
    }

    updateTypedDisplay() {
        if (!this.gameState.typedAnswer) {
            this.dom.typingInput.textContent = "?";
            this.dom.typingInput.classList.add("placeholder");
        } else {
            this.dom.typingInput.textContent = this.gameState.typedAnswer;
            this.dom.typingInput.classList.remove("placeholder");
        }
    }

    submitAnswer() {
        if (!this.gameState.isActive || this.gameState.isTransitioning) return;
        if (this.gameState.typedAnswer === "") return;

        const userVal = parseInt(this.gameState.typedAnswer, 10);
        const correctVal = this.gameState.currentProblem.answer;

        if (userVal === correctVal) {
            this.gameState.isTransitioning = true;
            this.gameState.rightCount++;
            this.gameState.combo++;
            if (this.gameState.combo > this.gameState.maxCombo) {
                this.gameState.maxCombo = this.gameState.combo;
            }
            const pts = 10 + Math.min(this.gameState.combo, 5) * 2;
            this.gameState.score += pts;

            if (!this.gameState.currentCardHadError && this.gameState.activeDeck) {
                this.recordCardMastered(this.gameState.activeDeck.id, this.gameState.currentProblem);
            }

            this.dom.statRight.textContent = String(this.gameState.rightCount);
            this.dom.gameScore.textContent = String(this.gameState.score);
            this.dom.cardHintBanner.hidden = true;

            if (this.gameState.combo >= 2) {
                this.dom.comboBadge.style.display = "inline-flex";
                this.dom.comboMultiplier.textContent = `x${this.gameState.combo}`;
                window.audioManager.playCombo(Math.min(this.gameState.combo, 8));
            } else {
                window.audioManager.playCorrect();
            }

            // Flash Mint Card + Big Green Checkmark Overlay (like Mental Math Cards!)
            this.dom.flashcardPaper.classList.remove("card-wrong");
            this.dom.flashcardPaper.classList.add("card-correct");

            setTimeout(() => {
                if (!this.gameState.isActive) return;
                if (this.sessionMode === "deck") {
                    if (this.gameState.questionIndex >= this.gameState.deckSize) {
                        this.endSession();
                        return;
                    }
                    this.gameState.questionIndex++;
                }
                this.generateNextCard();
            }, 420);
        } else {
            // Wrong Answer: Shake + Show Friendly Mental Math Strategy Hint
            window.audioManager.playIncorrect();
            this.gameState.wrongCount++;
            this.gameState.combo = 0;
            this.gameState.currentCardHadError = true;
            if (this.gameState.activeDeck && this.gameState.currentProblem) {
                this.recordCardMissed(this.gameState.activeDeck.id, this.gameState.currentProblem);
            }
            this.dom.statWrong.textContent = String(this.gameState.wrongCount);
            this.dom.comboBadge.style.display = "none";

            this.dom.flashcardPaper.classList.remove("card-wrong");
            void this.dom.flashcardPaper.offsetWidth; // Reflow for shake animation
            this.dom.flashcardPaper.classList.add("card-wrong");

            if (this.gameState.currentProblem.hintText) {
                this.dom.cardHintBanner.textContent = `💡 ${this.gameState.currentProblem.hintText}`;
                this.dom.cardHintBanner.hidden = false;
            }

            this.gameState.typedAnswer = "";
            this.updateTypedDisplay();
        }
    }

    endSession() {
        this.gameState.isActive = false;
        this.stopGameTimers();
        this.stopVoiceListening();
        window.audioManager.playVictory();

        const total = this.gameState.rightCount + this.gameState.wrongCount;
        const acc = total > 0 ? Math.round((this.gameState.rightCount / total) * 100) : 100;

        let levelUpMsg = "";
        if (this.gameState.activeDeck) {
            const deckId = this.gameState.activeDeck.id;
            const prog = this.getProfileProgress();
            prog.deckWins[deckId] = (prog.deckWins[deckId] || 0) + (this.gameState.rightCount > 0 ? 1 : 0);
            const curTier = this.getDeckTier(deckId);
            if (this.gameState.rightCount >= 6 && acc >= 85 && curTier < 6) {
                const nextTier = curTier + 1;
                prog.deckTiers[deckId] = nextTier;
                levelUpMsg = `🚀 Level Up! Unlocked Level ${nextTier}!`;
            } else if (total >= 6 && acc < 55 && curTier > 1) {
                prog.deckTiers[deckId] = curTier - 1;
            }
            this.saveAdaptiveProgress();
            this.renderAgeProfile();
        }

        this.saveSessionStats(this.gameState.rightCount, acc, this.gameState.maxCombo, this.gameState.score);

        let stars = 3;
        if (acc < 85) stars = 2;
        if (acc < 65) stars = 1;

        this.dom.modalTitle.textContent = levelUpMsg || (this.gameState.rightCount > 0 ? "Awesome Job! 🎉" : "Session Complete!");
        this.dom.modalStars.textContent = Array(3).fill(0).map((_, i) => (i < stars ? "★" : "☆")).join(" ");
        this.dom.modalPPM.textContent = `${this.gameState.rightCount} / ${this.gameState.wrongCount}`;
        this.dom.modalAccuracy.textContent = `${acc}%`;
        this.dom.modalScore.textContent = String(this.gameState.score);
        this.dom.resultsModal.classList.add("active");
    }

    // ================= KEYBOARD & VOICE INPUT =================

    handleKeyboardInput(e) {
        if (!this.gameState.isActive || this.gameState.isTransitioning) return;
        const key = e.key;

        if (key >= "0" && key <= "9") {
            if (this.gameState.typedAnswer.length < 5) {
                window.audioManager.playTick();
                this.gameState.typedAnswer += key;
                this.updateTypedDisplay();
            }
            const cap = document.getElementById(`key-${key}`);
            if (cap) cap.classList.add("active");
        } else if (key === "Backspace" || key === "Delete" || key === "Escape") {
            e.preventDefault();
            window.audioManager.playTick();
            this.gameState.typedAnswer = this.gameState.typedAnswer.slice(0, -1);
            this.updateTypedDisplay();
            const cap = document.getElementById("key-backspace");
            if (cap) cap.classList.add("active");
        } else if (key === "Enter" || key === " ") {
            e.preventDefault();
            this.submitAnswer();
            const cap = document.getElementById("key-enter");
            if (cap) cap.classList.add("active");
        }
    }

    handleKeyboardRelease(e) {
        const key = e.key;
        if (key >= "0" && key <= "9") {
            const cap = document.getElementById(`key-${key}`);
            if (cap) cap.classList.remove("active");
        } else if (key === "Backspace" || key === "Delete" || key === "Escape") {
            const cap = document.getElementById("key-backspace");
            if (cap) cap.classList.remove("active");
        } else if (key === "Enter" || key === " ") {
            const cap = document.getElementById("key-enter");
            if (cap) cap.classList.remove("active");
        }
    }

    toggleVoiceListening() {
        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRec) {
            if (this.dom.voiceStatusText) {
                this.dom.voiceStatusText.textContent = "⌨️ Use Keypad on This Device";
            }
            return;
        }

        if (this.isListening) {
            this.stopVoiceListening();
            return;
        }

        try {
            this.recognition = new SpeechRec();
            this.recognition.lang = "en-US";
            this.recognition.continuous = true;
            this.recognition.interimResults = false;

            this.recognition.onstart = () => {
                this.isListening = true;
                this.dom.btnVoiceListen.classList.add("listening");
                this.dom.voiceStatusText.textContent = "🎙 I'm listening...";
            };

            this.recognition.onresult = (event) => {
                if (!this.gameState.isActive || this.gameState.isTransitioning) return;
                const last = event.results[event.results.length - 1];
                if (last && last[0]) {
                    const num = parseSpokenNumber(last[0].transcript);
                    if (num !== null && !Number.isNaN(num)) {
                        this.gameState.typedAnswer = String(num);
                        this.updateTypedDisplay();
                        this.submitAnswer();
                    }
                }
            };

            this.recognition.onend = () => {
                if (this.isListening && this.gameState.isActive) {
                    try { this.recognition.start(); } catch (e) {}
                } else {
                    this.stopVoiceListening();
                }
            };

            this.recognition.start();
        } catch (e) {
            this.stopVoiceListening();
        }
    }

    stopVoiceListening() {
        this.isListening = false;
        if (this.recognition) {
            try { this.recognition.stop(); } catch (e) {}
            this.recognition = null;
        }
        if (this.dom.btnVoiceListen) {
            this.dom.btnVoiceListen.classList.remove("listening");
        }
        if (this.dom.voiceStatusText) {
            this.dom.voiceStatusText.textContent = "🎤 Tap to Speak Answer";
        }
    }

    // ================= PERSISTENCE & STATS =================

    loadStats() {
        try {
            this.stats = JSON.parse(localStorage.getItem("mathclub_cards_stats") || "null") || {
                totalSolved: 0,
                totalSessions: 0,
                avgAccuracy: 100,
                bestStreak: 0,
                totalPoints: 0
            };
        } catch (e) {
            this.stats = { totalSolved: 0, totalSessions: 0, avgAccuracy: 100, bestStreak: 0, totalPoints: 0 };
        }
        try {
            this.adaptiveProgress = JSON.parse(localStorage.getItem("mathclub_adaptive_progress_v1") || "null") || {};
        } catch (e) {
            this.adaptiveProgress = {};
        }
    }

    getProfileProgress(ageId = this.activeAgeId) {
        if (!this.adaptiveProgress) this.adaptiveProgress = {};
        if (!this.adaptiveProgress[ageId]) {
            this.adaptiveProgress[ageId] = {
                deckTiers: {},
                deckWins: {},
                recentSolved: [],
                missedByDeck: {}
            };
        }
        return this.adaptiveProgress[ageId];
    }

    getDeckTier(deckId) {
        const prog = this.getProfileProgress();
        return Math.max(1, Number((prog.deckTiers && prog.deckTiers[deckId]) || 1));
    }

    getDeckWins(deckId) {
        const prog = this.getProfileProgress();
        return Math.max(0, Number((prog.deckWins && prog.deckWins[deckId]) || 0));
    }

    recordCardMastered(deckId, problem) {
        if (!problem) return;
        const prog = this.getProfileProgress();
        const key = `${problem.left}${problem.operator}${problem.right}`;
        if (!Array.isArray(prog.recentSolved)) prog.recentSolved = [];
        prog.recentSolved = prog.recentSolved.filter(k => k !== key);
        prog.recentSolved.push(key);
        if (prog.recentSolved.length > 45) {
            prog.recentSolved = prog.recentSolved.slice(-45);
        }
        if (prog.missedByDeck && Array.isArray(prog.missedByDeck[deckId])) {
            prog.missedByDeck[deckId] = prog.missedByDeck[deckId].filter(
                item => `${item.left}${item.operator}${item.right}` !== key
            );
        }
        this.saveAdaptiveProgress();
    }

    recordCardMissed(deckId, problem) {
        if (!problem) return;
        const prog = this.getProfileProgress();
        if (!prog.missedByDeck) prog.missedByDeck = {};
        if (!Array.isArray(prog.missedByDeck[deckId])) prog.missedByDeck[deckId] = [];
        const key = `${problem.left}${problem.operator}${problem.right}`;
        if (!prog.missedByDeck[deckId].some(item => `${item.left}${item.operator}${item.right}` === key)) {
            prog.missedByDeck[deckId].push({
                left: problem.left,
                right: problem.right,
                operator: problem.operator,
                answer: problem.answer,
                visualHelper: problem.visualHelper || null,
                hintText: problem.hintText || "",
                questionString: problem.questionString || ""
            });
            if (prog.missedByDeck[deckId].length > 8) {
                prog.missedByDeck[deckId].shift();
            }
        }
        this.saveAdaptiveProgress();
    }

    saveAdaptiveProgress() {
        try {
            localStorage.setItem("mathclub_adaptive_progress_v1", JSON.stringify(this.adaptiveProgress));
        } catch (e) {}
    }

    saveSessionStats(solvedCount, accuracy, maxCombo, points) {
        this.stats.totalSolved += solvedCount;
        this.stats.totalSessions += 1;
        this.stats.avgAccuracy = Math.round(
            ((this.stats.avgAccuracy * (this.stats.totalSessions - 1)) + accuracy) / this.stats.totalSessions
        );
        if (maxCombo > this.stats.bestStreak) {
            this.stats.bestStreak = maxCombo;
        }
        this.stats.totalPoints += points;
        try {
            localStorage.setItem("mathclub_cards_stats", JSON.stringify(this.stats));
        } catch (e) {}
        this.updateDashboardStats();
    }

    updateDashboardStats() {
        if (this.dom.userLevelPoints) {
            this.dom.userLevelPoints.textContent = String(this.stats.totalPoints || 0);
        }
        if (this.dom.dashCompleted) {
            this.dom.dashCompleted.textContent = String(this.stats.totalSolved || 0);
        }
        if (this.dom.dashAccuracy) {
            this.dom.dashAccuracy.textContent = `${this.stats.avgAccuracy ?? 100}%`;
        }
        if (this.dom.dashPPM) {
            this.dom.dashPPM.textContent = `${this.stats.bestStreak || 0} 🔥`;
        }
    }
}

document.addEventListener("DOMContentLoaded", () => {
    window.app = new MathClubApp();
});
