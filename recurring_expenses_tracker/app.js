
// app.js

document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const configSection = document.getElementById('config-section');
    const statusSection = document.getElementById('status-section');
    const historySection = document.getElementById('history-section');
    const configForm = document.getElementById('config-form');
    const expenseNameInput = document.getElementById('expense-name');
    const paymentFrequencySelect = document.getElementById('payment-frequency');
    const classesPerPaymentInput = document.getElementById('classes-per-payment');
    const startDateInput = document.getElementById('start-date');
    const classTimeInput = document.getElementById('class-time');

    const expenseStatusName = document.getElementById('expense-status-name');
    const expenseStatusDetails = document.getElementById('expense-status-details');
    const paymentOverdueIndicator = document.getElementById('payment-overdue-indicator');
    const checkClassButton = document.getElementById('check-class-button');
    const resetConfigButton = document.getElementById('reset-config-button');

    const confirmationArea = document.getElementById('confirmation-area');
    const confirmationQuestion = document.getElementById('confirmation-question');
    const confirmYesButton = document.getElementById('confirm-yes-button');
    const confirmNoButton = document.getElementById('confirm-no-button');

    const paymentConfirmationArea = document.getElementById('payment-confirmation-area');
    const paymentConfirmationQuestion = document.getElementById('payment-confirmation-question');
    const confirmPaymentYesButton = document.getElementById('confirm-payment-yes-button');
    const confirmPaymentNoButton = document.getElementById('confirm-payment-no-button');

    const testModeControls = document.getElementById('test-mode-controls');
    const testModeToggle = document.getElementById('test-mode-toggle');
    const testModeInputs = document.getElementById('test-mode-inputs');
    const simulatedDateInput = document.getElementById('simulated-date');
    const simulatedTimeInput = document.getElementById('simulated-time');
    const setSimulatedTimeButton = document.getElementById('set-simulated-time-button');
    const testModeIndicator = document.getElementById('test-mode-indicator');

    const historyTableBody = document.getElementById('history-table-body');
    const paginationNav = document.getElementById('pagination-nav');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');

    const toastFeedback = document.getElementById('toast-feedback');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    // --- Constants ---
    const ITEMS_PER_PAGE = 12;
    const CONFIG_KEY = 'expenseTrackerConfig';
    const HISTORY_KEY = 'expenseTrackerHistory';
    const STATE_KEY = 'expenseTrackerState';

    // --- State ---
    let config = null;
    let history = [];
    let state = {
        remainingClasses: 0, currentPage: 1, nextClassCheckDate: null,
        pendingConfirmationDate: null, // For class attendance
        pendingPaymentConfirmationDate: null, // For payment confirmation (stores date payment is due)
        isTestMode: false, simulatedDateTime: null,
        nextClassIsPayment: false, // Flag to mark the next class as a payment day
    };

    // --- Variable Declarations ---
    let toastTimeout;

    // --- Initialization ---
    loadData();
    // Notifications Removed
    setupEventListeners();
    updateUI();

    // --- Functions ---

    function getCurrentTime() { /* No changes */ if (state.isTestMode && state.simulatedDateTime) { try { return new Date(state.simulatedDateTime); } catch (e) { console.error("Error parsing simulatedDateTime:", e); state.isTestMode = false; state.simulatedDateTime = null; saveState(); updateTestModeUI(); showToast("Error using simulated time.", "error"); return new Date(); } } return new Date(); }
    function loadData() { /* No changes needed */ const storedConfig = localStorage.getItem(CONFIG_KEY); const storedHistory = localStorage.getItem(HISTORY_KEY); const storedState = localStorage.getItem(STATE_KEY); if (storedConfig) { config = JSON.parse(storedConfig); if (config.daysOfWeek) delete config.daysOfWeek; if (!config.startDate) { config.startDate = new Date().toISOString().split('T')[0]; } } if (storedHistory) { history = JSON.parse(storedHistory).map(item => ({ ...item, date: new Date(item.date), paymentMade: item.paymentMade || false })); } if (storedState) { const parsedState = JSON.parse(storedState); state = { ...state, ...parsedState, nextClassCheckDate: parsedState.nextClassCheckDate ? new Date(parsedState.nextClassCheckDate) : null, pendingConfirmationDate: parsedState.pendingConfirmationDate ? new Date(parsedState.pendingConfirmationDate) : null, pendingPaymentConfirmationDate: parsedState.pendingPaymentConfirmationDate ? new Date(parsedState.pendingPaymentConfirmationDate) : null, simulatedDateTime: parsedState.simulatedDateTime || null, isTestMode: parsedState.isTestMode || false, nextClassIsPayment: parsedState.nextClassIsPayment || false }; delete state.paymentNotificationTriggerDateTime; } else if (config) { console.warn("State missing, re-initializing."); calculateNextClassCheckDate(); } }
    function saveData() { /* No changes needed */ if (config && config.daysOfWeek) { delete config.daysOfWeek; } localStorage.setItem(CONFIG_KEY, JSON.stringify(config)); localStorage.setItem(HISTORY_KEY, JSON.stringify(history.map(item => ({ ...item, date: item.date.toISOString() })))); saveState(); }
    function saveState() { /* No changes needed */ const stateToSave = { ...state, nextClassCheckDate: state.nextClassCheckDate?.toISOString() || null, pendingConfirmationDate: state.pendingConfirmationDate?.toISOString() || null, pendingPaymentConfirmationDate: state.pendingPaymentConfirmationDate?.toISOString() || null }; delete stateToSave.paymentNotificationTriggerDateTime; localStorage.setItem(STATE_KEY, JSON.stringify(stateToSave)); }
    function clearData() { /* No changes needed */ localStorage.removeItem(CONFIG_KEY); localStorage.removeItem(HISTORY_KEY); localStorage.removeItem(STATE_KEY); config = null; history = []; state = { remainingClasses: 0, currentPage: 1, nextClassCheckDate: null, pendingConfirmationDate: null, pendingPaymentConfirmationDate: null, isTestMode: false, simulatedDateTime: null, nextClassIsPayment: false }; confirmationArea.classList.add('hidden'); paymentConfirmationArea.classList.add('hidden'); updateTestModeUI(); }

    function updateUI() {
        updateTestModeUI();
        if (config) {
            configSection.classList.add('hidden'); statusSection.classList.remove('hidden'); historySection.classList.remove('hidden');
            let remainingText = `${state.remainingClasses}`;
            // Show overdue status if counter is zero or less AND payment isn't currently pending confirmation
            if (state.remainingClasses <= 0 && config.classesPerPayment > 0 && !state.pendingPaymentConfirmationDate) {
                remainingText += ` (Payment Due/Overdue)`;
                paymentOverdueIndicator.classList.remove('hidden');
            } else {
                paymentOverdueIndicator.classList.add('hidden');
            }
            expenseStatusName.textContent = `Expense: ${config.name}`;
            expenseStatusDetails.textContent = ` (${remainingText} of ${config.classesPerPayment} classes remaining in cycle)`;

            // --- Prompt Display Logic ---
            // Only show one prompt at a time. Payment takes precedence if explicitly pending.
            // Class prompt takes precedence if it's pending for today.
            let classPromptShown = false;
            let paymentPromptShown = false;

            if (state.pendingConfirmationDate && getCurrentTime().toDateString() === state.pendingConfirmationDate.toDateString()) {
                showInAppConfirmation(state.pendingConfirmationDate);
                classPromptShown = true;
            } else {
                confirmationArea.classList.add('hidden');
            }

            if (!classPromptShown && state.pendingPaymentConfirmationDate && getCurrentTime() >= state.pendingPaymentConfirmationDate) {
                showPaymentConfirmationPrompt(state.pendingPaymentConfirmationDate);
                paymentPromptShown = true;
            } else {
                paymentConfirmationArea.classList.add('hidden');
            }
            // Clear stale pending dates if prompts not shown
            if (!classPromptShown && state.pendingConfirmationDate) {
                console.warn("Clearing stale pending class confirmation (UI update)");
                state.pendingConfirmationDate = null; saveState();
            }
            if (!paymentPromptShown && state.pendingPaymentConfirmationDate && getCurrentTime() < state.pendingPaymentConfirmationDate) {
                // Don't clear future pending payment dates here, only handle if due
            }


            renderHistory();
        } else { configSection.classList.remove('hidden'); statusSection.classList.add('hidden'); historySection.classList.add('hidden'); confirmationArea.classList.add('hidden'); paymentConfirmationArea.classList.add('hidden'); }
    }

    function updateTestModeUI() { /* No changes needed */ testModeToggle.checked = state.isTestMode; if (state.isTestMode) { testModeInputs.classList.remove('hidden'); testModeIndicator.classList.remove('hidden'); testModeControls.classList.add('test-mode-active'); if (state.simulatedDateTime) { try { const d = new Date(state.simulatedDateTime); const year = d.getFullYear(); const month = (d.getMonth() + 1).toString().padStart(2, '0'); const day = d.getDate().toString().padStart(2, '0'); simulatedDateInput.value = `${year}-${month}-${day}`; const hours = d.getHours().toString().padStart(2, '0'); const minutes = d.getMinutes().toString().padStart(2, '0'); simulatedTimeInput.value = `${hours}:${minutes}`; } catch (e) { simulatedDateInput.value = ''; simulatedTimeInput.value = ''; } } else { const now = new Date(); const year = now.getFullYear(); const month = (now.getMonth() + 1).toString().padStart(2, '0'); const day = now.getDate().toString().padStart(2, '0'); simulatedDateInput.value = `${year}-${month}-${day}`; const hours = now.getHours().toString().padStart(2, '0'); const minutes = now.getMinutes().toString().padStart(2, '0'); simulatedTimeInput.value = `${hours}:${minutes}`; } } else { testModeInputs.classList.add('hidden'); testModeIndicator.classList.add('hidden'); testModeControls.classList.remove('test-mode-active'); } }
    // function requestNotificationPermission() REMOVED

    function setupEventListeners() {
        configForm.addEventListener('submit', handleConfigSubmit);
        resetConfigButton.addEventListener('click', handleResetConfig);
        checkClassButton.addEventListener('click', handleManualCheck);
        testModeToggle.addEventListener('change', () => { state.isTestMode = testModeToggle.checked; if (state.isTestMode && !state.simulatedDateTime) { handleSetSimulatedTime(); } saveState(); updateTestModeUI(); calculateNextClassCheckDate(); updateUI(); });
        setSimulatedTimeButton.addEventListener('click', handleSetSimulatedTime);
        confirmYesButton.addEventListener('click', () => { if (state.pendingConfirmationDate) { recordClassOutcome('Happened', state.pendingConfirmationDate); } });
        confirmNoButton.addEventListener('click', () => { if (state.pendingConfirmationDate) { recordClassOutcome('Cancelled', state.pendingConfirmationDate); } });
        confirmPaymentYesButton.addEventListener('click', handlePaymentConfirmationYes);
        confirmPaymentNoButton.addEventListener('click', handlePaymentConfirmationNo);
        prevPageButton.addEventListener('click', () => changePage(-1));
        nextPageButton.addEventListener('click', () => changePage(1));
    }

    function handleSetSimulatedTime() { /* No changes needed */ const dateStr = simulatedDateInput.value; const timeStr = simulatedTimeInput.value; if (dateStr && timeStr) { try { const combinedDateTime = new Date(`${dateStr}T${timeStr}:00`); if (isNaN(combinedDateTime.getTime())) { throw new Error("Invalid date/time value created."); } state.simulatedDateTime = combinedDateTime.toISOString(); saveState(); showToast(`Simulated time set to: ${combinedDateTime.toLocaleString()}`, 'success'); calculateNextClassCheckDate(); updateUI(); } catch (e) { console.error("Error setting simulated time:", e); showToast("Invalid date or time entered.", "error"); state.simulatedDateTime = null; saveState(); } } else { showToast("Please select both a date and time.", "warning"); } }
    function handleConfigSubmit(event) { /* No changes needed */ event.preventDefault(); const startDateValue = startDateInput.value; if (!startDateValue || !classTimeInput.value) { showToast("Please select Start Date and Class Time.", 'error'); return; } let userStartDate; let configStartDateString; try { if (startDateValue.includes('/')) { const parts = startDateValue.split('/'); if (parts.length === 3) { const month = parts[0].padStart(2, '0'); const day = parts[1].padStart(2, '0'); const year = parts[2]; if (year.length === 4 && !isNaN(parseInt(month)) && !isNaN(parseInt(day)) && !isNaN(parseInt(year))) { configStartDateString = `${year}-${month}-${day}`; userStartDate = new Date(configStartDateString + 'T00:00:00'); } } } if (!userStartDate || isNaN(userStartDate.getTime())) { if (startDateValue.includes('-')) { const parts = startDateValue.split('-'); if (parts.length === 3 && parts[0].length === 4) { configStartDateString = startDateValue; userStartDate = new Date(configStartDateString + 'T00:00:00'); } } } if (!userStartDate || isNaN(userStartDate.getTime())) { throw new Error("Could not parse datepicker value: " + startDateValue); } } catch (e) { console.error("Date parsing error:", e); showToast("Invalid Start Date format. Use MM/DD/YYYY or YYYY-MM-DD.", "error"); return; } config = { name: expenseNameInput.value, frequency: paymentFrequencySelect.value, classesPerPayment: parseInt(classesPerPaymentInput.value), startDate: configStartDateString, classTime: classTimeInput.value, }; history = []; const initialDate = userStartDate; const initialClassesTotal = config.classesPerPayment; history.push({ date: initialDate, status: 'Happened', paymentMade: true }); state.remainingClasses = initialClassesTotal > 0 ? initialClassesTotal - 1 : 0; state.nextClassIsPayment = false; state.currentPage = 1; state.pendingConfirmationDate = null; state.pendingPaymentConfirmationDate = null; console.log(`Config saved. Start Date: ${initialDate.toLocaleDateString()}. Initial class counted. Remaining: ${state.remainingClasses}`); calculateNextClassCheckDate(); saveData(); updateUI(); showToast('Configuration saved successfully!', 'success'); }
    function handleResetConfig() { /* No changes needed */ if (confirm('Are you sure you want to reset?')) { clearData(); updateUI(); showToast('Configuration reset.', 'info'); } }

    // --- History & Pagination ---

    function renderHistory() { /* No changes needed */ historyTableBody.innerHTML = ''; if (history.length === 0) { historyTableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No history yet.</td></tr>'; updatePaginationControls(0); return; } const sortedHistory = [...history].sort((a, b) => b.date - a.date); const totalItems = sortedHistory.length; const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE); if (state.currentPage < 1) state.currentPage = 1; if (state.currentPage > totalPages) state.currentPage = totalPages; const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE; const endIndex = startIndex + ITEMS_PER_PAGE; const pageItems = sortedHistory.slice(startIndex, endIndex); pageItems.forEach(item => { const row = document.createElement('tr'); row.className = 'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600'; const dateCell = document.createElement('td'); dateCell.className = 'px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'; dateCell.textContent = item.date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }); const statusCell = document.createElement('td'); statusCell.className = 'px-6 py-4'; statusCell.textContent = item.status; if (item.status === 'Happened') { statusCell.classList.add('text-green-600', 'dark:text-green-400'); } else if (item.status === 'Cancelled') { statusCell.classList.add('text-red-600', 'dark:text-red-400'); } else { statusCell.classList.add('text-gray-500', 'dark:text-gray-400'); } const paymentCell = document.createElement('td'); paymentCell.className = 'px-6 py-4'; if (item.paymentMade) { paymentCell.textContent = 'Payment Made'; paymentCell.classList.add('payment-indicator'); } else { paymentCell.textContent = '--'; paymentCell.classList.add('text-gray-400', 'dark:text-gray-500'); } row.appendChild(dateCell); row.appendChild(statusCell); row.appendChild(paymentCell); historyTableBody.appendChild(row); }); updatePaginationControls(totalPages); }
    function updatePaginationControls(totalPages) { /* No changes needed */ if (totalPages <= 0) totalPages = 1; pageIndicator.textContent = `Page ${state.currentPage} of ${totalPages}`; prevPageButton.disabled = state.currentPage <= 1; nextPageButton.disabled = state.currentPage >= totalPages; paginationNav.style.display = totalPages > 1 ? 'flex' : 'none'; }
    function changePage(delta) { /* No changes needed */ const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE); const newPage = state.currentPage + delta; if (newPage >= 1 && newPage <= totalPages) { state.currentPage = newPage; saveState(); renderHistory(); } }

    // --- Notification & Confirmation Logic ---

    function handleManualCheck() {
        if (!config) { showToast("Please configure the expense first.", "warning"); return; }
        const now = getCurrentTime();

        // --- Priority 1: Check for Pending Class Confirmation for today ---
        if (state.pendingConfirmationDate && now.toDateString() === state.pendingConfirmationDate.toDateString()) {
            console.log("Action Required: Class confirmation pending for today.");
            showInAppConfirmation(state.pendingConfirmationDate);
            return; // Must resolve class attendance first
        }
        // Clear stale pending class confirmation (if date mismatch)
        if (state.pendingConfirmationDate && now.toDateString() !== state.pendingConfirmationDate.toDateString()) {
            console.warn("Clearing stale pending class confirmation for date:", state.pendingConfirmationDate.toLocaleDateString());
            state.pendingConfirmationDate = null; confirmationArea.classList.add('hidden'); saveState();
        }

        // --- Priority 2: Check for Pending Payment Confirmation ---
        // If payment confirmation is explicitly pending for the *next* class date, show prompt.
        if (state.pendingPaymentConfirmationDate && now >= state.pendingPaymentConfirmationDate) {
            console.log("Action Required: Payment confirmation is pending for cycle starting:", state.pendingPaymentConfirmationDate.toLocaleDateString());
            showPaymentConfirmationPrompt(state.pendingPaymentConfirmationDate);
            return; // Must resolve payment first
        }


        // --- Priority 3: Check if a class is scheduled for today AND needs action ---
        if (!state.nextClassCheckDate) { calculateNextClassCheckDate(); }

        if (state.nextClassCheckDate && now.toDateString() === state.nextClassCheckDate.toDateString()) {
            const classDateForToday = state.nextClassCheckDate;
            console.log(`Checking for class on: ${classDateForToday.toLocaleDateString()}`);

            const alreadyHandled = history.some(h => h.date.toDateString() === classDateForToday.toDateString());
            if (alreadyHandled) { showToast(`Class on ${classDateForToday.toLocaleDateString()} already recorded.`, 'info'); calculateNextClassCheckDate(); return; }

            // If not handled, prompt for class attendance confirmation FIRST.
            console.log("Prompting for class attendance confirmation for today.");
            showInAppConfirmation(classDateForToday); // Sets state.pendingConfirmationDate

        } else {
            const nextDateStr = state.nextClassCheckDate ? state.nextClassCheckDate.toLocaleDateString() : 'Not calculated';
            showToast(`No class scheduled for "today" (${now.toLocaleDateString()}) requires confirmation. Next class: ${nextDateStr}`, 'info');
        }
    }


    function showInAppConfirmation(scheduledDate) {
        paymentConfirmationArea.classList.add('hidden'); // Hide payment prompt
        state.pendingConfirmationDate = scheduledDate; saveState();
        confirmationQuestion.textContent = `Did the class on ${scheduledDate.toLocaleDateString()} happen?`;
        confirmationArea.classList.remove('hidden');
        confirmationArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function showPaymentConfirmationPrompt(paymentDueDate) {
        confirmationArea.classList.add('hidden'); // Hide class prompt
        state.pendingPaymentConfirmationDate = paymentDueDate; saveState();
        // Ask about payment for the cycle STARTING on paymentDueDate
        paymentConfirmationQuestion.textContent = `Payment due for cycle starting ${paymentDueDate.toLocaleDateString()}. Was it made?`;
        paymentConfirmationArea.classList.remove('hidden');
        paymentConfirmationArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // function showInformationalNotification REMOVED

    function recordClassOutcome(status, classDate) {
        console.log(`Recording outcome via UI: ${status} for ${classDate.toLocaleString()}`);

        if (history.some(h => h.date.toDateString() === classDate.toDateString())) { console.warn(`Outcome for ${classDate.toLocaleDateString()} already recorded.`); showToast(`Outcome for ${classDate.toLocaleDateString()} already recorded.`, 'info'); state.pendingConfirmationDate = null; confirmationArea.classList.add('hidden'); saveState(); updateUI(); return; }

        // Determine if payment should be marked for THIS class (start of new cycle)
        let paymentMadeThisClass = false;
        if (status === 'Happened' && state.nextClassIsPayment) {
            paymentMadeThisClass = true;
            state.nextClassIsPayment = false; // Reset flag after using it
            console.log("Marking this class as paid (start of new cycle).");
        }

        // Add history entry
        history.push({ date: classDate, status: status, paymentMade: paymentMadeThisClass });

        if (status === 'Happened') {
            // Decrement count (will go negative if overdue and payment not made)
            state.remainingClasses--;
            showToast(`${config.name} class marked as 'Happened'. ${state.remainingClasses} remaining.`, 'success');

            // --- Check if payment is now due ---
            if (state.remainingClasses <= 0 && config.classesPerPayment > 0) {
                const nextClassDate = calculateNextClassCheckDate(true);
                if (nextClassDate) {
                    // Only set if not already pending for this date
                    if (!state.pendingPaymentConfirmationDate || state.pendingPaymentConfirmationDate.toDateString() !== nextClassDate.toDateString()) {
                        state.pendingPaymentConfirmationDate = nextClassDate;
                        console.log(`Payment cycle complete/overdue. Payment confirmation pending for ${nextClassDate.toLocaleDateString()}`);
                        showToast(`End of cycle. Payment confirmation needed before next class on ${nextClassDate.toLocaleDateString()}.`, 'info');
                    }
                } else {
                    console.error("Could not calculate next class date for payment confirmation.");
                    showToast("End of cycle, but couldn't determine next class date for payment check.", "warning");
                }
            }
        } else { // Cancelled
            showToast(`${config.name} class marked as 'Cancelled'.`, 'warning');
            // Do not decrement count or change payment state for cancellations
        }

        // --- Cleanup Class Confirmation & Recalculate ---
        state.pendingConfirmationDate = null; confirmationArea.classList.add('hidden');
        // Calculate next check date only if payment confirmation isn't pending
        if (!state.pendingPaymentConfirmationDate) {
            calculateNextClassCheckDate();
        }
        saveData(); updateUI();
    }


    // --- Payment Confirmation Handlers ---
    function handlePaymentConfirmationYes() {
        if (!state.pendingPaymentConfirmationDate) return;
        const paymentDueDate = state.pendingPaymentConfirmationDate; // The date the new cycle starts

        console.log(`Payment confirmed for cycle starting ${paymentDueDate.toLocaleDateString()}`);

        // Calculate new remaining classes, accounting for overdue ones
        const classesDuringOverdue = (state.remainingClasses < 0) ? Math.abs(state.remainingClasses) : 0;
        const newRemainingClasses = Math.max(0, config.classesPerPayment - classesDuringOverdue);
        console.log(`Overdue count was: ${state.remainingClasses}. Classes during overdue: ${classesDuringOverdue}. New cycle starts with: ${newRemainingClasses} remaining.`);
        state.remainingClasses = newRemainingClasses;

        // Set flag to mark the upcoming class (on paymentDueDate) as paid
        state.nextClassIsPayment = true;

        // Clear pending payment state
        state.pendingPaymentConfirmationDate = null;
        paymentConfirmationArea.classList.add('hidden');

        showToast("Payment confirmed. New cycle starting.", "success");

        // --- Trigger Class Confirmation for Today ---
        // Now that payment is resolved, immediately prompt for class confirmation for paymentDueDate (if it's today)
        const now = getCurrentTime();
        if (now.toDateString() === paymentDueDate.toDateString()) {
            // Check if already handled in history (unlikely here, but safe)
            const alreadyHandled = history.some(h => h.date.toDateString() === paymentDueDate.toDateString());
            if (!alreadyHandled) {
                console.log("Prompting for class confirmation after payment confirmed.");
                showInAppConfirmation(paymentDueDate);
            } else {
                console.log("Class for payment date already handled somehow.");
                calculateNextClassCheckDate(); // Calculate next if already handled
            }
        } else {
            // If payment date is not today, just calculate next check date
            calculateNextClassCheckDate();
        }


        saveData(); // Save state changes
        updateUI(); // Update UI immediately
    }

    function handlePaymentConfirmationNo() {
        if (!state.pendingPaymentConfirmationDate) return;
        const paymentDeferredDate = state.pendingPaymentConfirmationDate;
        console.log(`Payment deferred for cycle starting ${paymentDeferredDate.toLocaleDateString()}`);
        state.pendingPaymentConfirmationDate = null; // Clear pending state
        paymentConfirmationArea.classList.add('hidden');
        // Do NOT reset remainingClasses. It stays <= 0.
        showToast("Payment deferred. Counter remains at " + state.remainingClasses, "warning");

        // --- Trigger Class Confirmation for Today ---
        // Even though payment deferred, still need to confirm class for paymentDueDate (if it's today)
        const now = getCurrentTime();
        if (now.toDateString() === paymentDeferredDate.toDateString()) {
            const alreadyHandled = history.some(h => h.date.toDateString() === paymentDeferredDate.toDateString());
            if (!alreadyHandled) {
                console.log("Prompting for class confirmation after payment deferred.");
                showInAppConfirmation(paymentDeferredDate);
            } else {
                console.log("Class for deferred payment date already handled.");
                calculateNextClassCheckDate();
            }
        } else {
            calculateNextClassCheckDate();
        }


        saveState(); updateUI(); // Refresh UI (will show overdue)
    }

    // function showPaymentReminderNotification REMOVED

    // --- Date/Time Calculation Helpers ---

    function calculateNextClassCheckDate(returnOnly = false) { /* No changes needed */ if (!config || !config.startDate) { console.error("Cannot calculate next check date without config or startDate."); return null; } const lastRecordedDate = history.length > 0 ? new Date(Math.max(...history.map(h => h.date.getTime()))) : null; let searchStartDate; const today = getCurrentTime(); today.setHours(0, 0, 0, 0); const configStartDateDay = new Date(config.startDate + 'T00:00:00'); if (lastRecordedDate) { const lastRecordedDay = new Date(lastRecordedDate); lastRecordedDay.setHours(0, 0, 0, 0); searchStartDate = new Date(lastRecordedDay); searchStartDate.setDate(searchStartDate.getDate() + 1); } else { searchStartDate = configStartDateDay; if (searchStartDate < today) searchStartDate = today; } if (searchStartDate < today) searchStartDate = today; console.log(`Calculating next check date starting search from (${state.isTestMode ? 'Simulated' : 'Real'}):`, searchStartDate.toLocaleDateString()); const targetDayOfWeek = configStartDateDay.getDay(); let nextDate = findNextScheduledDate(searchStartDate, [targetDayOfWeek], config.frequency); if (nextDate) { const [hours, minutes] = config.classTime.split(':').map(Number); const nextCheckDateWithTime = new Date(nextDate); nextCheckDateWithTime.setHours(hours, minutes, 0, 0); if (!returnOnly) { state.nextClassCheckDate = nextCheckDateWithTime; console.log("Next class check date calculated:", state.nextClassCheckDate.toLocaleString()); saveState(); } return nextCheckDateWithTime; } else { console.error("Could not determine the next class date based on frequency/day."); if (!returnOnly) { state.nextClassCheckDate = null; saveState(); } return null; } }
    function findNextScheduledDate(startDate, targetDaysOfWeekArray, frequency) { /* No changes needed */ let potentialDate = new Date(startDate); potentialDate.setHours(0, 0, 0, 0); const configStartDate = new Date(config.startDate + 'T00:00:00'); const targetDayOfWeek = targetDaysOfWeekArray[0]; for (let i = 0; i < 365 * 2; i++) { const currentDay = potentialDate.getDay(); if (currentDay === targetDayOfWeek) { let freqMatch = false; switch (frequency) { case 'weekly': freqMatch = true; break; case 'bi-weekly': const diffTimeW = Math.abs(potentialDate - configStartDate); const diffDaysW = Math.round(diffTimeW / (1000 * 60 * 60 * 24)); const diffWeeksW = Math.floor(diffDaysW / 7); if (diffWeeksW % 2 === 0) freqMatch = true; break; case 'monthly-date': if (potentialDate.getDate() === configStartDate.getDate()) freqMatch = true; break; default: freqMatch = true; } if (freqMatch) { return new Date(potentialDate); } } potentialDate.setDate(potentialDate.getDate() + 1); } console.warn("No next scheduled date found within 2 years."); return null; }
    function formatTime(timeString) { /* No changes needed */ const [hours, minutes] = timeString.split(':'); const h = parseInt(hours); const m = minutes; const ampm = h >= 12 ? 'PM' : 'AM'; const hour12 = h % 12 || 12; return `${hour12}:${m} ${ampm}`; }
    function showToast(message, type = 'info') { /* No changes needed */ clearTimeout(toastTimeout); toastMessage.textContent = message; toastIcon.className = 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg'; let iconSvg = ''; switch (type) { case 'success': toastIcon.classList.add('text-green-500', 'bg-green-100', 'dark:bg-green-800', 'dark:text-green-200'); iconSvg = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/></svg>`; break; case 'error': toastIcon.classList.add('text-red-500', 'bg-red-100', 'dark:bg-red-800', 'dark:text-red-200'); iconSvg = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/></svg>`; break; case 'warning': toastIcon.classList.add('text-orange-500', 'bg-orange-100', 'dark:bg-orange-700', 'dark:text-orange-200'); iconSvg = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/></svg>`; break; default: toastIcon.classList.add('text-blue-500', 'bg-blue-100', 'dark:bg-blue-800', 'dark:text-blue-200'); iconSvg = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/></svg>`; break; } toastIcon.innerHTML = iconSvg + '<span class="sr-only">Icon</span>'; toastFeedback.classList.remove('hidden'); toastFeedback.classList.add('flex'); toastTimeout = setTimeout(() => { toastFeedback.classList.remove('flex'); toastFeedback.classList.add('hidden'); }, 5000); }

}); // End DOMContentLoaded