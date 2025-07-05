
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

    // Skip Date elements
    const skipDateInput = document.getElementById('skip-date-input');
    const addSkipDateButton = document.getElementById('add-skip-date-button');
    const skippedDatesList = document.getElementById('skipped-dates-list');

    // Manual Log elements
    const logManualClassButton = document.getElementById('log-manual-class-button');
    const manualLogModal = document.getElementById('manual-log-modal');
    const manualLogDateInput = document.getElementById('manual-log-date');
    // const manualLogStatusSelect = document.getElementById('manual-log-status'); // Removed status select
    const manualLogNoteInput = document.getElementById('manual-log-note');
    const saveManualLogButton = document.getElementById('save-manual-log-button');


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
    let config = null; // includes skippedDates: string[]
    let history = []; // includes note?: string
    let state = {
        remainingClasses: 0, currentPage: 1, nextClassCheckDate: null,
        pendingConfirmationDate: null, pendingPaymentConfirmationDate: null,
        isTestMode: false, simulatedDateTime: null, nextClassIsPayment: false,
    };

    // --- Variable Declarations ---
    let toastTimeout;
    let manualLogModalInstance = null;


    // --- Initialization ---
    loadData();
    syncWithGoogleSheets(); // This will run if config has URL, otherwise does nothing.
    setupEventListeners();
    updateUI();
    if (manualLogModal) { manualLogModalInstance = new Modal(manualLogModal); }


    // --- Functions ---

    async function syncWithGoogleSheets() {
        if (!config || !config.appScriptURL) {
            console.log("Sync skipped: App Script URL not configured.");
            updateUI(); // Still update UI in case of local-only mode
            return;
        }

        showToast("Syncing with Google Sheets...", "info");

        try {
            // Use a GET request to fetch the current state from the spreadsheet.
            const response = await fetch(config.appScriptURL, { method: 'GET', mode: 'cors' });

            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }

            const result = await response.json();

            if (result.status !== 'success') {
                throw new Error(`Google Apps Script returned an error: ${result.message}`);
            }

            if (result.data && result.data.length > 0) {
                // --- SPREADSHEET HAS DATA --- 
                console.log("Spreadsheet has data. Loading from cloud.");

                // Load history from the spreadsheet
                history = result.data.map(item => ({
                    date: new Date(item.Date), // Ensure correct mapping from sheet headers
                    status: item.Status,
                    paymentMade: item['Payment Made'] === true || item['Payment Made'] === 'TRUE',
                    note: item.Note || ''
                }));

                // Recalculate the current state based on the authoritative history
                recalculateStateFromHistory();

                saveData(); // Save the synced data to localStorage
                showToast("Successfully synced from Google Sheets.", "success");

            } else {
                // --- SPREADSHEET IS EMPTY --- 
                console.log("Spreadsheet is empty. Initializing with first entry.");

                // This is the only place where we create the initial history entry.
                const initialDate = new Date(config.startDate + 'T00:00:00');
                history = [{
                    date: initialDate,
                    status: 'Happened',
                    paymentMade: true, // The first entry is always a payment
                    note: 'Initial payment'
                }];

                state.remainingClasses = config.classesPerPayment > 0 ? config.classesPerPayment - 1 : 0;
                state.nextClassIsPayment = false;

                saveData(); // Save the new initial state locally

                // Now, push this initial state to the cloud.
                await backupDataToGoogleSheets();
                showToast("Initialized new sheet successfully.", "success");
            }

        } catch (error) {
            console.error('An error occurred during the sync process:', error);
            showToast(`Sync failed: ${error.message}`, 'error');
        }

        // Always update the UI and calculate the next check date after any sync attempt
        calculateNextClassCheckDate();
        updateUI();
    }

    // New helper function to derive state from history
    function recalculateStateFromHistory() {
        if (!config || history.length === 0) {
            state.remainingClasses = 0;
            return;
        }

        // Sort history to be sure: oldest to newest
        history.sort((a, b) => a.date - b.date);

        const lastPaymentEntry = history.slice().reverse().find(h => h.paymentMade);

        if (!lastPaymentEntry) {
            // This case shouldn't happen if history is initialized correctly
            state.remainingClasses = config.classesPerPayment;
            console.error("Could not find a payment entry in history.");
            return;
        }

        const classesSincePayment = history.filter(h => 
            h.date >= lastPaymentEntry.date && 
            (h.status === 'Happened' || h.status === 'Manual Log (Happened)')
        ).length;

        state.remainingClasses = config.classesPerPayment - classesSincePayment;
        console.log(`Recalculated state: ${state.remainingClasses} classes remaining.`);
    }

    function getCurrentTime() { /* No changes */ if (state.isTestMode && state.simulatedDateTime) { try { return new Date(state.simulatedDateTime); } catch (e) { console.error("Error parsing simulatedDateTime:", e); state.isTestMode = false; state.simulatedDateTime = null; saveState(); updateTestModeUI(); showToast("Error using simulated time.", "error"); return new Date(); } } return new Date(); }
""

    function loadData() {
        const storedConfig = localStorage.getItem(CONFIG_KEY);
        const storedHistory = localStorage.getItem(HISTORY_KEY);
        const storedState = localStorage.getItem(STATE_KEY);

        if (storedConfig) {
            config = JSON.parse(storedConfig);
            // Basic config validation and cleanup
            if (config.daysOfWeek) delete config.daysOfWeek;
            if (!config.skippedDates) config.skippedDates = [];

            // If a script URL exists, we prioritize syncing from the cloud.
            if (config.appScriptURL) {
                // We call syncWithGoogleSheets and let it handle populating history and state.
                // We don't load local history/state here to prevent conflicts.
                return; // The sync function will call updateUI() when it's done.
            } else {
                // No cloud sync, so load from local storage as fallback.
                if (storedHistory) {
                    history = JSON.parse(storedHistory).map(item => ({ ...item, date: new Date(item.date), paymentMade: item.paymentMade || false, note: item.note || '' }));
                }
                if (storedState) {
                    const parsedState = JSON.parse(storedState);
                    state = { ...state, ...parsedState, nextClassCheckDate: parsedState.nextClassCheckDate ? new Date(parsedState.nextClassCheckDate) : null, pendingConfirmationDate: parsedState.pendingConfirmationDate ? new Date(parsedState.pendingConfirmationDate) : null, pendingPaymentConfirmationDate: parsedState.pendingPaymentConfirmationDate ? new Date(parsedState.pendingPaymentConfirmationDate) : null, simulatedDateTime: parsedState.simulatedDateTime || null, isTestMode: parsedState.isTestMode || false, nextClassIsPayment: parsedState.nextClassIsPayment || false };
                } else if (config) {
                    console.warn("State missing, re-initializing from history.");
                    recalculateStateFromHistory();
                }
            }
        }
        // If no config, the app will just show the config screen.
        // No need for an else block.
    }

    async function backupDataToGoogleSheets() {
        const appScriptURL = config.appScriptURL; // Use URL from config
        if (!appScriptURL) {
            console.log('App Script URL not configured. Skipping backup.');
            return;
        }

        // Prepare data for sending - ensuring dates are strings
        const dataToSend = history.map(item => ({
            date: item.date.toISOString(),
            status: item.status,
            paymentMade: item.paymentMade,
            note: item.note || '' // Ensure note is not null/undefined
        }));

        try {
            // Using 'text/plain' for Content-Type can help avoid CORS preflight issues with Google Apps Script.
            // The Apps Script will receive the JSON string as plain text and needs to parse it.
            const response = await fetch(appScriptURL, {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'text/plain',
                },
                body: JSON.stringify(dataToSend),
                redirect: 'follow'
            });

            if (response.ok) {
                // It's good practice to check the content type of the response
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const result = await response.json();
                    console.log('Backup successful!', result);
                } else {
                    const textResult = await response.text();
                    console.log('Backup successful with non-JSON response:', textResult);
                }
            } else {
                // Log more details on failure
                console.error('Backup failed. Status:', response.status, response.statusText);
                const errorText = await response.text();
                console.error('Error response body:', errorText);
                showToast(`Backup failed: ${response.statusText}`, 'error');
            }
        } catch (error) {
            console.error('An error occurred during the backup fetch call:', error);
            showToast('Backup failed due to a network or CORS error.', 'error');
        }
    }
    function saveData() { /* Added skippedDates check */ if (config && config.daysOfWeek) { delete config.daysOfWeek; } if (config && !config.skippedDates) { config.skippedDates = []; } if (!config) { config = {}; } // Initialize config if null
        const appScriptURLInput = document.getElementById('appScriptURLInput'); // Get and save App Script URL
        if (appScriptURLInput && appScriptURLInput.value.trim()) { config.appScriptURL = appScriptURLInput.value.trim(); }
        localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history.map(item => ({ ...item, date: item.date.toISOString() }))));
        saveState();
    }
    function saveState() { /* No changes needed */ const stateToSave = { ...state, nextClassCheckDate: state.nextClassCheckDate?.toISOString() || null, pendingConfirmationDate: state.pendingConfirmationDate?.toISOString() || null, pendingPaymentConfirmationDate: state.pendingPaymentConfirmationDate?.toISOString() || null }; delete stateToSave.paymentNotificationTriggerDateTime; localStorage.setItem(STATE_KEY, JSON.stringify(stateToSave)); }
    function clearData() { /* No changes needed */ localStorage.removeItem(CONFIG_KEY); localStorage.removeItem(HISTORY_KEY); localStorage.removeItem(STATE_KEY); config = null; history = []; state = { remainingClasses: 0, currentPage: 1, nextClassCheckDate: null, pendingConfirmationDate: null, pendingPaymentConfirmationDate: null, isTestMode: false, simulatedDateTime: null, nextClassIsPayment: false }; confirmationArea.classList.add('hidden'); paymentConfirmationArea.classList.add('hidden'); updateTestModeUI(); }

    function updateUI() {
        updateTestModeUI();
        if (config) {
            configSection.classList.add('hidden'); statusSection.classList.remove('hidden'); historySection.classList.remove('hidden');
            let remainingText = `${state.remainingClasses}`;
            if (state.remainingClasses <= 0 && config.classesPerPayment > 0 && !state.pendingPaymentConfirmationDate) { remainingText += ` (Payment Due/Overdue)`; paymentOverdueIndicator.classList.remove('hidden'); }
            else { paymentOverdueIndicator.classList.add('hidden'); }
            expenseStatusName.textContent = `Expense: ${config.name}`; expenseStatusDetails.textContent = ` (${remainingText} of ${config.classesPerPayment} classes remaining in cycle)`;

            let classPromptShown = false; let paymentPromptShown = false;
            if (state.pendingConfirmationDate && getCurrentTime().toDateString() === state.pendingConfirmationDate.toDateString()) { showInAppConfirmation(state.pendingConfirmationDate); classPromptShown = true; } else { confirmationArea.classList.add('hidden'); }
            if (!classPromptShown && state.pendingPaymentConfirmationDate && getCurrentTime() >= state.pendingPaymentConfirmationDate) { showPaymentConfirmationPrompt(state.pendingPaymentConfirmationDate); paymentPromptShown = true; } else { paymentConfirmationArea.classList.add('hidden'); }
            if (!classPromptShown && state.pendingConfirmationDate) { console.warn("Clearing stale pending class confirmation (UI update)"); state.pendingConfirmationDate = null; saveState(); }
            if (!paymentPromptShown && state.pendingPaymentConfirmationDate && getCurrentTime() < state.pendingPaymentConfirmationDate) { /* Keep future pending payment */ }

            renderHistory();
            renderSkippedDates(); // Render skipped dates list
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
        // Skip Date Listener
        addSkipDateButton.addEventListener('click', handleAddSkipDate);
        // Manual Log Listener
        saveManualLogButton.addEventListener('click', handleSaveManualLog);
    }

    function handleSetSimulatedTime() { /* No changes needed */ const dateStr = simulatedDateInput.value; const timeStr = simulatedTimeInput.value; if (dateStr && timeStr) { try { const combinedDateTime = new Date(`${dateStr}T${timeStr}:00`); if (isNaN(combinedDateTime.getTime())) { throw new Error("Invalid date/time value created."); } state.simulatedDateTime = combinedDateTime.toISOString(); saveState(); showToast(`Simulated time set to: ${combinedDateTime.toLocaleString()}`, 'success'); calculateNextClassCheckDate(); updateUI(); } catch (e) { console.error("Error setting simulated time:", e); showToast("Invalid date or time entered.", "error"); state.simulatedDateTime = null; saveState(); } } else { showToast("Please select both a date and time.", "warning"); } }
    function handleConfigSubmit(event) {
        event.preventDefault();
        const startDateValue = startDateInput.value;
        if (!startDateValue || !classTimeInput.value) {
            showToast("Please select Start Date and Class Time.", 'error');
            return;
        }

        let userStartDate;
        let configStartDateString;
        try {
            let dateStr = startDateValue.trim();

            // Handle MM/DD/YYYY format by converting to YYYY-MM-DD
            if (/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.test(dateStr)) {
                const parts = dateStr.split('/');
                dateStr = `${parts[2]}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
            }

            // Now, we should have a YYYY-MM-DD string, which is reliably parsed.
            // Appending T00:00:00 ensures it's parsed in the user's local timezone.
            userStartDate = new Date(dateStr + 'T00:00:00');

            if (isNaN(userStartDate.getTime())) {
                throw new Error('Date is invalid after parsing attempts.');
            }
            
            configStartDateString = userStartDate.toISOString().split('T')[0];

        } catch (e) {
            console.error("Date parsing error:", e);
            showToast("Invalid Start Date format. Please use MM/DD/YYYY or YYYY-MM-DD.", "error");
            return;
        }

        // Save the essential configuration.
        config = {
            name: expenseNameInput.value,
            frequency: paymentFrequencySelect.value,
            classesPerPayment: parseInt(classesPerPaymentInput.value),
            startDate: configStartDateString,
            classTime: classTimeInput.value,
            skippedDates: config?.skippedDates || [], // Preserve skipped dates if editing
            appScriptURL: document.getElementById('appScriptURLInput').value.trim()
        };

        // Clear previous state and history before syncing
        history = [];
        state = { ...state, remainingClasses: 0, nextClassCheckDate: null, pendingConfirmationDate: null, pendingPaymentConfirmationDate: null };

        saveData(); // Save the new configuration to localStorage

        showToast('Configuration saved. Attempting to sync with Google Sheets...', 'info');

        // The sync function will now be responsible for populating history and state
        syncWithGoogleSheets();
    }
    function handleResetConfig() { /* No changes needed */ if (confirm('Are you sure you want to reset?')) { clearData(); updateUI(); showToast('Configuration reset.', 'info'); } }

    // --- History & Pagination ---

    function renderHistory() {
        historyTableBody.innerHTML = '';
        if (history.length === 0) { historyTableBody.innerHTML = '<tr><td colspan="3" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">No history yet.</td></tr>'; updatePaginationControls(0); return; }
        const sortedHistory = [...history].sort((a, b) => b.date - a.date);
        const totalItems = sortedHistory.length; const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
        if (state.currentPage < 1) state.currentPage = 1; if (state.currentPage > totalPages) state.currentPage = totalPages;
        const startIndex = (state.currentPage - 1) * ITEMS_PER_PAGE; const endIndex = startIndex + ITEMS_PER_PAGE;
        const pageItems = sortedHistory.slice(startIndex, endIndex);
        pageItems.forEach(item => {
            const row = document.createElement('tr'); row.className = 'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600';
            const dateCell = document.createElement('td'); dateCell.className = 'px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white'; dateCell.textContent = item.date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
            const statusCell = document.createElement('td'); statusCell.className = 'px-6 py-4';
            // Display note if present, handle different statuses
            let statusText = item.status;
            if (item.status === 'Manual Log (Happened)') {
                statusText = 'Manual Log'; // Cleaner display text
                statusCell.classList.add('manual-log-status'); // Add specific style if desired
            } else if (item.status === 'Happened') { statusCell.classList.add('text-green-600', 'dark:text-green-400'); }
            else if (item.status === 'Cancelled') { statusCell.classList.add('text-red-600', 'dark:text-red-400'); }
            else { statusCell.classList.add('text-gray-500', 'dark:text-gray-400'); }
            statusCell.textContent = statusText + (item.note ? ` (${item.note})` : '');

            const paymentCell = document.createElement('td'); paymentCell.className = 'px-6 py-4';
            if (item.paymentMade) { paymentCell.textContent = 'Payment Made'; paymentCell.classList.add('payment-indicator'); }
            else { paymentCell.textContent = '--'; paymentCell.classList.add('text-gray-400', 'dark:text-gray-500'); }
            row.appendChild(dateCell); row.appendChild(statusCell); row.appendChild(paymentCell); historyTableBody.appendChild(row);
        });
        updatePaginationControls(totalPages);
    }
    function updatePaginationControls(totalPages) { /* No changes needed */ if (totalPages <= 0) totalPages = 1; pageIndicator.textContent = `Page ${state.currentPage} of ${totalPages}`; prevPageButton.disabled = state.currentPage <= 1; nextPageButton.disabled = state.currentPage >= totalPages; paginationNav.style.display = totalPages > 1 ? 'flex' : 'none'; }
    function changePage(delta) { /* No changes needed */ const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE); const newPage = state.currentPage + delta; if (newPage >= 1 && newPage <= totalPages) { state.currentPage = newPage; saveState(); renderHistory(); } }

    // --- Skip Date Functions ---
    function renderSkippedDates() {
        if (!config || !config.skippedDates) { skippedDatesList.innerHTML = '<li class="italic text-gray-500 dark:text-gray-400">No dates skipped yet.</li>'; return; }
        skippedDatesList.innerHTML = '';
        if (config.skippedDates.length === 0) { skippedDatesList.innerHTML = '<li class="italic text-gray-500 dark:text-gray-400">No dates skipped yet.</li>'; }
        else { const sortedDates = [...config.skippedDates].sort(); sortedDates.forEach(dateStr => { const li = document.createElement('li'); li.textContent = dateStr; const removeBtn = document.createElement('span'); removeBtn.innerHTML = '&times;'; removeBtn.className = 'remove-skip-btn'; removeBtn.title = 'Remove skipped date'; removeBtn.onclick = () => handleRemoveSkipDate(dateStr); li.appendChild(removeBtn); skippedDatesList.appendChild(li); }); }
    }
    function handleAddSkipDate() {
        const dateValue = skipDateInput.value; if (!dateValue) { showToast("Please select a date to skip.", "warning"); return; }
        let dateStrToSkip;
        try { if (dateValue.includes('/')) { const parts = dateValue.split('/'); if (parts.length === 3) { const month = parts[0].padStart(2, '0'); const day = parts[1].padStart(2, '0'); const year = parts[2]; if (year.length === 4 && !isNaN(parseInt(month)) && !isNaN(parseInt(day)) && !isNaN(parseInt(year))) { dateStrToSkip = `${year}-${month}-${day}`; } } } if (!dateStrToSkip || isNaN(new Date(dateStrToSkip + 'T00:00:00').getTime())) { if (dateValue.includes('-')) { const parts = dateValue.split('-'); if (parts.length === 3 && parts[0].length === 4) { dateStrToSkip = dateValue; } } } if (!dateStrToSkip || isNaN(new Date(dateStrToSkip + 'T00:00:00').getTime())) { throw new Error("Could not parse datepicker value: " + dateValue); } }
        catch (e) { console.error("Skip date parsing error:", e); showToast("Invalid skip date format.", "error"); return; }
        if (!config.skippedDates) { config.skippedDates = []; }
        if (!config.skippedDates.includes(dateStrToSkip)) { config.skippedDates.push(dateStrToSkip); saveData(); renderSkippedDates(); calculateNextClassCheckDate(); updateUI(); showToast(`Date ${dateStrToSkip} added to skip list.`, 'success'); skipDateInput.value = ''; const datepickerInstance = FlowbiteInstances.getInstance('Datepicker', 'skip-date-input'); if (datepickerInstance) { datepickerInstance.setDate(null); } }
        else { showToast(`Date ${dateStrToSkip} is already in the skip list.`, 'info'); }
    }
    function handleRemoveSkipDate(dateStr) { if (config && config.skippedDates) { config.skippedDates = config.skippedDates.filter(d => d !== dateStr); saveData(); renderSkippedDates(); calculateNextClassCheckDate(); updateUI(); showToast(`Date ${dateStr} removed from skip list.`, 'info'); } }

    // --- Manual Log Functions ---
    function handleSaveManualLog() {
        const dateValue = manualLogDateInput.value;
        // const status = manualLogStatusSelect.value; // Status is always 'Manual Log (Happened)' now
        const note = manualLogNoteInput.value.trim();
        if (!dateValue) { showToast("Please select a date.", "warning"); return; }
        let logDate; let logDateStr;
        try { if (dateValue.includes('/')) { const parts = dateValue.split('/'); if (parts.length === 3) { const month = parts[0].padStart(2, '0'); const day = parts[1].padStart(2, '0'); const year = parts[2]; if (year.length === 4 && !isNaN(parseInt(month)) && !isNaN(parseInt(day)) && !isNaN(parseInt(year))) { logDateStr = `${year}-${month}-${day}`; logDate = new Date(logDateStr + 'T00:00:00'); } } } if (!logDate || isNaN(logDate.getTime())) { if (dateValue.includes('-')) { const parts = dateValue.split('-'); if (parts.length === 3 && parts[0].length === 4) { logDateStr = dateValue; logDate = new Date(logDateStr + 'T00:00:00'); } } } if (!logDate || isNaN(logDate.getTime())) { throw new Error("Could not parse datepicker value: " + dateValue); } }
        catch (e) { console.error("Manual log date parsing error:", e); showToast("Invalid date format.", "error"); return; }

        // Call function to handle logging and counter decrement
        logManualClassHappened(logDate, note);

        // Clear modal inputs and close modal
        manualLogDateInput.value = '';
        // manualLogStatusSelect.value = 'Make-up';
        manualLogNoteInput.value = '';
        if (manualLogModalInstance) { manualLogModalInstance.hide(); }
    }

    // New function specifically for logging manual 'Happened' classes
    function logManualClassHappened(manualDate, note = '') {
        console.log(`Logging manual class for ${manualDate.toLocaleDateString()}`);

        if (history.some(h => h.date.toDateString() === manualDate.toDateString())) {
            showToast(`An entry already exists for ${manualDate.toLocaleDateString()}. Cannot add duplicate manual log.`, 'error');
            return;
        }

        // Determine if payment should be marked (if this is the start of a new cycle)
        let paymentMadeThisClass = false;
        if (state.nextClassIsPayment) {
            paymentMadeThisClass = true;
            state.nextClassIsPayment = false; // Reset flag
            console.log("Marking this manual class as paid (start of new cycle).");
        }

        // Add history entry
        history.push({
            date: manualDate,
            status: 'Manual Log (Happened)', // Specific status
            paymentMade: paymentMadeThisClass,
            note: note
        });

        // Decrement remaining classes
        state.remainingClasses--;
        showToast(`Manual class logged. ${state.remainingClasses} remaining.`, 'success');

        // Check if payment is now due
        if (state.remainingClasses <= 0 && config.classesPerPayment > 0) {
            const nextClassDate = calculateNextClassCheckDate(true);
            if (nextClassDate) {
                if (!state.pendingPaymentConfirmationDate || state.pendingPaymentConfirmationDate.toDateString() !== nextClassDate.toDateString()) {
                    state.pendingPaymentConfirmationDate = nextClassDate;
                    console.log(`Payment cycle complete/overdue after manual log. Payment confirmation pending for ${nextClassDate.toLocaleDateString()}`);
                    showToast(`End of cycle after manual log. Payment confirmation needed before next class on ${nextClassDate.toLocaleDateString()}.`, 'info');
                }
            } else {
                console.error("Could not calculate next class date for payment confirmation after manual log.");
                showToast("End of cycle after manual log, but couldn't determine next class date.", "warning");
            }
        }

        // Recalculate next scheduled class date (manual log doesn't change this directly, but payment status might)
        if (!state.pendingPaymentConfirmationDate) {
            calculateNextClassCheckDate();
        }
        saveData();
        updateUI();
    }


    // --- Confirmation Logic ---

    function handleManualCheck() {
        if (!config) { showToast("Please configure the expense first.", "warning"); return; }
        const now = getCurrentTime();

        // --- Priority 1: Check for Pending Class Confirmation for today ---
        if (state.pendingConfirmationDate && now.toDateString() === state.pendingConfirmationDate.toDateString()) { console.log("Action Required: Class confirmation pending for today."); showInAppConfirmation(state.pendingConfirmationDate); return; }
        if (state.pendingConfirmationDate && now.toDateString() !== state.pendingConfirmationDate.toDateString()) { console.warn("Clearing stale pending class confirmation for date:", state.pendingConfirmationDate.toLocaleDateString()); state.pendingConfirmationDate = null; confirmationArea.classList.add('hidden'); saveState(); }

        // --- Priority 2: Check for Pending Payment Confirmation ---
        if (state.pendingPaymentConfirmationDate && now >= state.pendingPaymentConfirmationDate) { console.log("Action Required: Payment confirmation is pending for cycle starting:", state.pendingPaymentConfirmationDate.toLocaleDateString()); showPaymentConfirmationPrompt(state.pendingPaymentConfirmationDate); return; }

        // --- Priority 3: Check if a class is scheduled for today AND needs action ---
        if (!state.nextClassCheckDate) { calculateNextClassCheckDate(); }

        if (state.nextClassCheckDate && now.toDateString() === state.nextClassCheckDate.toDateString()) {
            const classDateForToday = state.nextClassCheckDate;
            console.log(`Checking for class on: ${classDateForToday.toLocaleDateString()}`);

            // Check if skipped
            const dateStr = classDateForToday.toISOString().split('T')[0];
            if (config.skippedDates && config.skippedDates.includes(dateStr)) { showToast(`Class on ${classDateForToday.toLocaleDateString()} is skipped.`, 'info'); calculateNextClassCheckDate(); saveData(); updateUI(); return; }

            const alreadyHandled = history.some(h => h.date.toDateString() === classDateForToday.toDateString());
            if (alreadyHandled) { showToast(`Class on ${classDateForToday.toLocaleDateString()} already recorded.`, 'info'); calculateNextClassCheckDate(); return; }

            // --- Check if Payment is Due FIRST on this class day ---
            if (state.remainingClasses <= 0 && config.classesPerPayment > 0) {
                console.log("Payment is due/overdue. Prompting for payment confirmation for today:", classDateForToday.toLocaleDateString());
                state.pendingPaymentConfirmationDate = classDateForToday; // Set payment pending for today
                saveState();
                showPaymentConfirmationPrompt(classDateForToday); // Show payment prompt
                return; // Stop here, resolve payment first
            }

            // If payment is not overdue, prompt for class attendance confirmation.
            console.log("Prompting for class attendance confirmation for today.");
            showInAppConfirmation(classDateForToday); // Sets state.pendingConfirmationDate

        } else {
            const nextDateStr = state.nextClassCheckDate ? state.nextClassCheckDate.toLocaleDateString() : 'Not calculated';
            showToast(`No class scheduled for "today" (${now.toLocaleDateString()}) requires confirmation. Next class: ${nextDateStr}`, 'info');
        }
    }


    function showInAppConfirmation(scheduledDate) { /* No changes needed */ paymentConfirmationArea.classList.add('hidden'); state.pendingConfirmationDate = scheduledDate; saveState(); confirmationQuestion.textContent = `Did the class on ${scheduledDate.toLocaleDateString()} happen?`; confirmationArea.classList.remove('hidden'); confirmationArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    function showPaymentConfirmationPrompt(paymentDueDate) { /* No changes needed */ confirmationArea.classList.add('hidden'); state.pendingPaymentConfirmationDate = paymentDueDate; saveState(); paymentConfirmationQuestion.textContent = `Payment due for cycle starting ${paymentDueDate.toLocaleDateString()}. Was it made?`; paymentConfirmationArea.classList.remove('hidden'); paymentConfirmationArea.scrollIntoView({ behavior: 'smooth', block: 'nearest' }); }
    // function showInformationalNotification REMOVED

    function recordClassOutcome(status, classDate) {
        console.log(`Recording outcome via UI: ${status} for ${classDate.toLocaleString()}`);

        if (history.some(h => h.date.toDateString() === classDate.toDateString())) { console.warn(`Outcome for ${classDate.toLocaleDateString()} already recorded.`); showToast(`Outcome for ${classDate.toLocaleDateString()} already recorded.`, 'info'); state.pendingConfirmationDate = null; confirmationArea.classList.add('hidden'); saveState(); updateUI(); return; }

        let paymentMadeThisClass = false;
        if (status === 'Happened' && state.nextClassIsPayment) { paymentMadeThisClass = true; state.nextClassIsPayment = false; console.log("Marking this class as paid (start of new cycle)."); }

        history.push({ date: classDate, status: status, paymentMade: paymentMadeThisClass });

        if (status === 'Happened') {
            state.remainingClasses--;
            showToast(`${config.name} class marked as 'Happened'. ${state.remainingClasses} remaining.`, 'success');

            if (state.remainingClasses <= 0 && config.classesPerPayment > 0) {
                const nextClassDate = calculateNextClassCheckDate(true);
                if (nextClassDate) { if (!state.pendingPaymentConfirmationDate || state.pendingPaymentConfirmationDate.toDateString() !== nextClassDate.toDateString()) { state.pendingPaymentConfirmationDate = nextClassDate; console.log(`Payment cycle complete/overdue. Payment confirmation pending for ${nextClassDate.toLocaleDateString()}`); showToast(`End of cycle. Payment confirmation needed before next class on ${nextClassDate.toLocaleDateString()}.`, 'info'); } }
                else { console.error("Could not calculate next class date for payment confirmation."); showToast("End of cycle, but couldn't determine next class date for payment check.", "warning"); }
            }
        } else { showToast(`${config.name} class marked as 'Cancelled'.`, 'warning'); }

        state.pendingConfirmationDate = null; confirmationArea.classList.add('hidden');
        if (!state.pendingPaymentConfirmationDate) { calculateNextClassCheckDate(); }
        saveData(); updateUI();
    }


    // --- Payment Confirmation Handlers ---
    function handlePaymentConfirmationYes() {
        if (!state.pendingPaymentConfirmationDate) return;
        const paymentDueDate = state.pendingPaymentConfirmationDate;
        console.log(`Payment confirmed for cycle starting ${paymentDueDate.toLocaleDateString()}`);
        const classesDuringOverdue = (state.remainingClasses < 0) ? Math.abs(state.remainingClasses) : 0;
        const newRemainingClasses = Math.max(0, config.classesPerPayment - classesDuringOverdue);
        console.log(`Overdue count was: ${state.remainingClasses}. Classes during overdue: ${classesDuringOverdue}. New cycle starts with: ${newRemainingClasses} remaining.`);
        state.remainingClasses = newRemainingClasses;
        state.nextClassIsPayment = true; // Flag the class on paymentDueDate as paid
        state.pendingPaymentConfirmationDate = null; paymentConfirmationArea.classList.add('hidden');
        showToast("Payment confirmed. New cycle starting.", "success");

        // Trigger Class Confirmation for Today if applicable
        const now = getCurrentTime();
        if (now.toDateString() === paymentDueDate.toDateString()) {
            const alreadyHandled = history.some(h => h.date.toDateString() === paymentDueDate.toDateString());
            if (!alreadyHandled) { console.log("Prompting for class confirmation after payment confirmed."); showInAppConfirmation(paymentDueDate); }
            else { console.log("Class for payment date already handled somehow."); calculateNextClassCheckDate(); }
        } else { calculateNextClassCheckDate(); }
        saveData(); updateUI();
    }

    function handlePaymentConfirmationNo() {
        if (!state.pendingPaymentConfirmationDate) return;
        const paymentDeferredDate = state.pendingPaymentConfirmationDate;
        console.log(`Payment deferred for cycle starting ${paymentDeferredDate.toLocaleDateString()}`);
        state.pendingPaymentConfirmationDate = null; paymentConfirmationArea.classList.add('hidden');
        showToast("Payment deferred. Counter remains at " + state.remainingClasses, "warning");

        // Trigger Class Confirmation for Today if applicable
        const now = getCurrentTime();
        if (now.toDateString() === paymentDeferredDate.toDateString()) {
            const alreadyHandled = history.some(h => h.date.toDateString() === paymentDeferredDate.toDateString());
            if (!alreadyHandled) { console.log("Prompting for class confirmation after payment deferred."); showInAppConfirmation(paymentDeferredDate); }
            else { console.log("Class for deferred payment date already handled."); calculateNextClassCheckDate(); }
        } else { calculateNextClassCheckDate(); }
        saveState(); updateUI();
    }

    // function showPaymentReminderNotification REMOVED

    // --- Date/Time Calculation Helpers ---

    function calculateNextClassCheckDate(returnOnly = false) {
        if (!config || !config.startDate) { console.error("Cannot calculate next check date without config or startDate."); return null; }
        const lastRecordedDate = history.length > 0 ? new Date(Math.max(...history.map(h => h.date.getTime()))) : null;
        let searchStartDate;
        const today = getCurrentTime(); today.setHours(0, 0, 0, 0);
        const configStartDateDay = new Date(config.startDate + 'T00:00:00');

        if (lastRecordedDate) { const lastRecordedDay = new Date(lastRecordedDate); lastRecordedDay.setHours(0, 0, 0, 0); searchStartDate = new Date(lastRecordedDay); searchStartDate.setDate(searchStartDate.getDate() + 1); }
        else { searchStartDate = configStartDateDay; if (searchStartDate < today) searchStartDate = today; }
        if (searchStartDate < today) searchStartDate = today;

        console.log(`Calculating next check date starting search from (${state.isTestMode ? 'Simulated' : 'Real'}):`, searchStartDate.toLocaleDateString());
        const targetDayOfWeek = configStartDateDay.getDay();
        let nextDate = findNextScheduledDate(searchStartDate, [targetDayOfWeek], config.frequency); // Use helper

        if (nextDate) {
            const [hours, minutes] = config.classTime.split(':').map(Number);
            const nextCheckDateWithTime = new Date(nextDate); nextCheckDateWithTime.setHours(hours, minutes, 0, 0);
            if (!returnOnly) { state.nextClassCheckDate = nextCheckDateWithTime; console.log("Next class check date calculated:", state.nextClassCheckDate.toLocaleString()); saveState(); }
            return nextCheckDateWithTime;
        } else {
            console.error("Could not determine the next class date based on frequency/day.");
            if (!returnOnly) { state.nextClassCheckDate = null; saveState(); }
            return null;
        }
    }

    function findNextScheduledDate(startDate, targetDaysOfWeekArray, frequency) {
        let potentialDate = new Date(startDate); potentialDate.setHours(0, 0, 0, 0);
        const configStartDate = new Date(config.startDate + 'T00:00:00');
        const targetDayOfWeek = targetDaysOfWeekArray[0];

        for (let i = 0; i < 365 * 2; i++) { // Increased limit
            const currentDay = potentialDate.getDay();
            const potentialDateString = potentialDate.toISOString().split('T')[0]; // YYYY-MM-DD

            // --- Check if skipped ---
            if (config.skippedDates && config.skippedDates.includes(potentialDateString)) {
                console.log(`Skipping date ${potentialDateString} (in skipped list).`);
                potentialDate.setDate(potentialDate.getDate() + 1); // Move to next day
                continue; // Skip the rest of the checks for this day
            }

            if (currentDay === targetDayOfWeek) {
                let freqMatch = false;
                switch (frequency) {
                    case 'weekly': freqMatch = true; break;
                    case 'bi-weekly': const diffTimeW = Math.abs(potentialDate - configStartDate); const diffDaysW = Math.round(diffTimeW / (1000 * 60 * 60 * 24)); const diffWeeksW = Math.floor(diffDaysW / 7); if (diffWeeksW % 2 === 0) freqMatch = true; break;
                    case 'monthly-date': if (potentialDate.getDate() === configStartDate.getDate()) freqMatch = true; break;
                    default: freqMatch = true;
                }
                if (freqMatch) {
                    // Don't check history here, just return the next calendar date
                    return new Date(potentialDate);
                }
            }
            potentialDate.setDate(potentialDate.getDate() + 1);
        }
        console.warn("No next scheduled date found within 2 years."); return null;
    }


    function formatTime(timeString) { /* No changes needed */ const [hours, minutes] = timeString.split(':'); const h = parseInt(hours); const m = minutes; const ampm = h >= 12 ? 'PM' : 'AM'; const hour12 = h % 12 || 12; return `${hour12}:${m} ${ampm}`; }
    function showToast(message, type = 'info') { /* No changes needed */ clearTimeout(toastTimeout); toastMessage.textContent = message; toastIcon.className = 'inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg'; let iconSvg = ''; switch (type) { case 'success': toastIcon.classList.add('text-green-500', 'bg-green-100', 'dark:bg-green-800', 'dark:text-green-200'); iconSvg = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/></svg>`; break; case 'error': toastIcon.classList.add('text-red-500', 'bg-red-100', 'dark:bg-red-800', 'dark:text-red-200'); iconSvg = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z"/></svg>`; break; case 'warning': toastIcon.classList.add('text-orange-500', 'bg-orange-100', 'dark:bg-orange-700', 'dark:text-orange-200'); iconSvg = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z"/></svg>`; break; default: toastIcon.classList.add('text-blue-500', 'bg-blue-100', 'dark:bg-blue-800', 'dark:text-blue-200'); iconSvg = `<svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z"/></svg>`; break; } toastIcon.innerHTML = iconSvg + '<span class="sr-only">Icon</span>'; toastFeedback.classList.remove('hidden'); toastFeedback.classList.add('flex'); toastTimeout = setTimeout(() => { toastFeedback.classList.remove('flex'); toastFeedback.classList.add('hidden'); }, 5000); }

}); // End DOMContentLoaded