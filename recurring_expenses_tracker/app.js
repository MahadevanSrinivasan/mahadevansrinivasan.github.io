document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const configSection = document.getElementById('config-section');
    const statusSection = document.getElementById('status-section');
    const historySection = document.getElementById('history-section');
    const configForm = document.getElementById('config-form');
    const expenseNameInput = document.getElementById('expense-name');
    const classesPerPaymentInput = document.getElementById('classes-per-payment');
    const appScriptURLInput = document.getElementById('appScriptURLInput');

    const expenseStatusName = document.getElementById('expense-status-name');
    const expenseStatusDetails = document.getElementById('expense-status-details');
    const paymentOverdueIndicator = document.getElementById('payment-overdue-indicator');

    const manualLogModal = document.getElementById('manual-log-modal');
    const manualLogDateInput = document.getElementById('manual-log-date');
    const manualLogNoteInput = document.getElementById('manual-log-note');
    const saveManualLogButton = document.getElementById('save-manual-log-button');

    const paymentLogModal = document.getElementById('payment-log-modal');
    const paymentLogDateInput = document.getElementById('payment-log-date');
    const paymentLogNoteInput = document.getElementById('payment-log-note');
    const savePaymentLogButton = document.getElementById('save-payment-log-button');

    const historyTableBody = document.getElementById('history-table-body');
    const paginationNav = document.getElementById('pagination-nav');
    const prevPageButton = document.getElementById('prev-page');
    const nextPageButton = document.getElementById('next-page');
    const pageIndicator = document.getElementById('page-indicator');

    const toastFeedback = document.getElementById('toast-feedback');
    const toastMessage = document.getElementById('toast-message');
    const toastIcon = document.getElementById('toast-icon');

    // FAB elements
    const fabMainButton = document.getElementById('fab-main-button');
    const fabActions = document.getElementById('fab-actions');
    const logClassButton = document.getElementById('log-class-button');
    const logPaymentButton = document.getElementById('log-payment-button');
    const logManualClassButton = document.getElementById('log-manual-class-button');

    // --- Constants ---
    const ITEMS_PER_PAGE = 12;
    const CONFIG_KEY = 'expenseTrackerConfig';
    const HISTORY_KEY = 'expenseTrackerHistory';
    const STATE_KEY = 'expenseTrackerState';

    // --- State ---
    let config = null;
    let history = [];
    let state = { remainingClasses: 0, currentPage: 1 };
    let toastTimeout;
    let manualLogModalInstance = null;
    let paymentLogModalInstance = null;
    let confirmLogTodayModalInstance = null;

    // --- Initialization ---
    loadData();
    setupEventListeners();
    if (manualLogModal) { manualLogModalInstance = new Modal(manualLogModal); }
    if (paymentLogModal) { paymentLogModalInstance = new Modal(paymentLogModal); }
    const confirmLogTodayModal = document.getElementById('confirm-log-today-modal');
    if (confirmLogTodayModal) { confirmLogTodayModalInstance = new Modal(confirmLogTodayModal); }

    // --- Core Functions ---

    function loadData() {
        const storedConfig = localStorage.getItem(CONFIG_KEY);
        if (storedConfig) {
            config = JSON.parse(storedConfig);
            if (config.appScriptURL) {
                syncWithGoogleSheets();
            } else {
                const storedHistory = localStorage.getItem(HISTORY_KEY);
                const storedState = localStorage.getItem(STATE_KEY);
                if (storedHistory) {
                    history = JSON.parse(storedHistory).map(item => ({ ...item, date: new Date(item.date) }));
                }
                if (storedState) {
                    state = { ...state, ...JSON.parse(storedState) };
                }
                updateUI();
            }
        } else {
            updateUI();
        }
    }

    function saveData() {
        if (config) {
            localStorage.setItem(CONFIG_KEY, JSON.stringify(config));
        }
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history.map(item => ({ ...item, date: item.date.toISOString() }))));
        localStorage.setItem(STATE_KEY, JSON.stringify(state));
    }

    function clearData() {
        localStorage.removeItem(CONFIG_KEY);
        localStorage.removeItem(HISTORY_KEY);
        localStorage.removeItem(STATE_KEY);
        config = null;
        history = [];
        state = { remainingClasses: 0, currentPage: 1 };
        updateUI();
    }

    function handleConfigSubmit(event) {
        event.preventDefault();
        config = {
            name: expenseNameInput.value,
            classesPerPayment: parseInt(classesPerPaymentInput.value),
            appScriptURL: appScriptURLInput.value.trim()
        };
        history = [];
        state = { remainingClasses: config.classesPerPayment, currentPage: 1 };
        saveData();
        if (config.appScriptURL) {
            syncWithGoogleSheets();
        } else {
            updateUI();
        }
        showToast('Configuration saved!', 'success');
    }

    function logTodaysClass() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (history.some(h => new Date(h.date).toDateString() === today.toDateString())) {
            showToast('Class for today has already been logged.', 'warning');
            return;
        }

        confirmLogTodayModalInstance.show();

        document.getElementById('confirm-log-today-button').onclick = () => {
            const newEntry = {
                date: today,
                status: 'Happened',
                paymentMade: false,
                note: ''
            };

            history.push(newEntry);
            recalculateStateFromHistory();
            saveData();
            if (config.appScriptURL) {
                backupDataToGoogleSheets();
            }
            updateUI();
            confirmLogTodayModalInstance.hide();
            showToast('Logged today\'s class successfully.', 'success');
        };
    }

    function handleSaveManualLog() {
        const dateValue = manualLogDateInput.value;
        const note = manualLogNoteInput.value.trim();
        if (!dateValue) {
            showToast("Please select a date.", "warning");
            return;
        }

        let logDate;
        try {
            logDate = new Date(dateValue + 'T00:00:00');
            if (isNaN(logDate.getTime())) throw new Error('Invalid Date');
        } catch (e) {
            showToast("Invalid date format.", "error");
            return;
        }

        if (history.some(h => new Date(h.date).toDateString() === logDate.toDateString())) {
            showToast(`An entry already exists for ${logDate.toLocaleDateString()}.`, 'error');
            return;
        }

        history.push({
            date: logDate,
            status: 'Manual Log (Happened)',
            paymentMade: false,
            note: note
        });

        recalculateStateFromHistory();
        saveData();
        if (config.appScriptURL) {
            backupDataToGoogleSheets();
        }
        manualLogModalInstance.hide();
        updateUI();
        showToast('Manual class logged.', 'success');
    }

    function handleSavePayment() {
        const dateValue = paymentLogDateInput.value;
        const note = paymentLogNoteInput.value.trim();
        if (!dateValue) {
            showToast("Please select a date.", "warning");
            return;
        }

        let logDate;
        try {
            logDate = new Date(dateValue + 'T00:00:00');
            if (isNaN(logDate.getTime())) throw new Error('Invalid Date');
        } catch (e) {
            showToast("Invalid date format.", "error");
            return;
        }

        // Prevent duplicate payments on the same day
        if (history.some(h => new Date(h.date).toDateString() === logDate.toDateString() && h.paymentMade)) {
            showToast(`A payment has already been logged for ${logDate.toLocaleDateString()}.`, 'error');
            return;
        }

        history.push({
            date: logDate,
            status: 'Payment',
            paymentMade: true,
            note: note
        });

        recalculateStateFromHistory();
        saveData();
        if (config.appScriptURL) {
            backupDataToGoogleSheets();
        }
        paymentLogModalInstance.hide();
        updateUI();
        showToast('Payment logged successfully.', 'success');
    }

    function recalculateStateFromHistory() {
        if (!config) {
            state.remainingClasses = 0;
            return;
        }

        // Filter out only class entries for calculation
        const classEntries = history.filter(h => h.status === 'Happened' || h.status === 'Manual Log (Happened)');
        const paymentEntries = history.filter(h => h.paymentMade);

        if (paymentEntries.length === 0) {
            state.remainingClasses = config.classesPerPayment;
            return;
        }

        // Find the latest payment entry
        paymentEntries.sort((a, b) => new Date(a.date) - new Date(b.date));
        const lastPaymentEntry = paymentEntries[paymentEntries.length - 1];

        // Count classes since the last payment (inclusive of payment date if it was a class)
        const classesSinceLastPayment = classEntries.filter(h => 
            new Date(h.date) >= new Date(lastPaymentEntry.date)
        ).length;

        state.remainingClasses = config.classesPerPayment - classesSinceLastPayment;
    }

    // --- UI and Event Listeners ---

    function setupEventListeners() {
        configForm.addEventListener('submit', handleConfigSubmit);
        document.getElementById('reset-config-button').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset?')) clearData();
        });

        // FAB button listeners
        fabMainButton.addEventListener('click', () => {
            fabActions.classList.toggle('hidden');
        });
        logClassButton.addEventListener('click', () => {
            logTodaysClass();
            fabActions.classList.add('hidden'); // Hide FAB actions after click
        });
        logPaymentButton.addEventListener('click', () => {
            paymentLogModalInstance.show();
            fabActions.classList.add('hidden'); // Hide FAB actions after click
        });
        logManualClassButton.addEventListener('click', () => {
            manualLogModalInstance.show();
            fabActions.classList.add('hidden'); // Hide FAB actions after click
        });

        saveManualLogButton.addEventListener('click', handleSaveManualLog);
        savePaymentLogButton.addEventListener('click', handleSavePayment);
        prevPageButton.addEventListener('click', () => changePage(-1));
        nextPageButton.addEventListener('click', () => changePage(1));

        // TODO: Fix focus issue when modals are dismissed. The focus should be on the main content area.
        const cancelButtons = document.querySelectorAll('[data-modal-hide]');
        cancelButtons.forEach(button => {
            button.addEventListener('click', () => {
                setTimeout(() => {
                    document.querySelector('main').focus();
                }, 150); // Delay to allow modal to close
            });
        });
    }

    function updateUI() {
        if (config) {
            configSection.classList.add('hidden');
            statusSection.classList.remove('hidden');
            historySection.classList.remove('hidden');

            expenseStatusName.textContent = `Expense: ${config.name}`;
            expenseStatusDetails.textContent = ` (${state.remainingClasses} of ${config.classesPerPayment} classes remaining)`;

            if (state.remainingClasses <= 0) {
                paymentOverdueIndicator.classList.remove('hidden');
            } else {
                paymentOverdueIndicator.classList.add('hidden');
            }
            renderHistory();
        } else {
            configSection.classList.remove('hidden');
            statusSection.classList.add('hidden');
            historySection.classList.add('hidden');
        }
    }

    function renderHistory() {
        historyTableBody.innerHTML = '';
        if (history.length === 0) {
            historyTableBody.innerHTML = '<tr><td colspan="3" class="text-center">No history yet.</td></tr>';
            updatePaginationControls(0);
            return;
        }
        const sortedHistory = [...history].sort((a, b) => new Date(b.date) - new Date(a.date));
        const totalPages = Math.ceil(sortedHistory.length / ITEMS_PER_PAGE);
        state.currentPage = Math.max(1, Math.min(state.currentPage, totalPages));
        const pageItems = sortedHistory.slice((state.currentPage - 1) * ITEMS_PER_PAGE, state.currentPage * ITEMS_PER_PAGE);

        pageItems.forEach(item => {
            const row = document.createElement('tr');
            row.className = 'bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600';

            const dateCell = document.createElement('td');
            dateCell.className = 'px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white';
            dateCell.textContent = new Date(item.date).toLocaleDateString();

            const statusCell = document.createElement('td');
            statusCell.className = 'px-6 py-4';
            statusCell.textContent = `${item.status} ${item.note ? `(${item.note})` : ''}`;
            if (item.status === 'Happened' || item.status === 'Manual Log (Happened)') {
                statusCell.classList.add('text-green-600', 'dark:text-green-400');
            } else if (item.status === 'Payment') {
                statusCell.classList.add('text-blue-600', 'dark:text-blue-400');
            }

            const paymentCell = document.createElement('td');
            paymentCell.className = 'px-6 py-4';
            if (item.paymentMade) {
                paymentCell.textContent = 'Payment Made';
                paymentCell.classList.add('font-semibold', 'text-blue-600', 'dark:text-blue-400');
            } else {
                paymentCell.textContent = '--';
            }

            row.appendChild(dateCell);
            row.appendChild(statusCell);
            row.appendChild(paymentCell);
            historyTableBody.appendChild(row);
        });
        updatePaginationControls(totalPages);
    }

    function updatePaginationControls(totalPages) {
        pageIndicator.textContent = `Page ${state.currentPage} of ${totalPages || 1}`;
        prevPageButton.disabled = state.currentPage <= 1;
        nextPageButton.disabled = state.currentPage >= totalPages;
        paginationNav.style.display = totalPages > 1 ? 'flex' : 'none';
    }

    function changePage(delta) {
        const totalPages = Math.ceil(history.length / ITEMS_PER_PAGE);
        const newPage = state.currentPage + delta;
        if (newPage >= 1 && newPage <= totalPages) {
            state.currentPage = newPage;
            saveData();
            renderHistory();
        }
    }

    function showToast(message, type = 'info') {
        clearTimeout(toastTimeout);
        toastMessage.textContent = message;
        toastFeedback.className = 'fixed top-5 right-5 p-4 rounded-lg shadow-lg text-white';
        switch (type) {
            case 'success': toastFeedback.classList.add('bg-green-500'); break;
            case 'error': toastFeedback.classList.add('bg-red-500'); break;
            case 'warning': toastFeedback.classList.add('bg-yellow-500'); break;
            default: toastFeedback.classList.add('bg-blue-500'); break;
        }
        toastFeedback.classList.remove('hidden');
        toastTimeout = setTimeout(() => toastFeedback.classList.add('hidden'), 3000);
    }

    // --- Google Sheets Integration ---

    async function syncWithGoogleSheets() {
        if (!config || !config.appScriptURL) return;
        showToast('Syncing with Google Sheets...', 'info');
        try {
            const response = await fetch(config.appScriptURL, { method: 'GET', mode: 'cors' });
            if (!response.ok) throw new Error('Network response was not ok.');
            const result = await response.json();
            if (result.status !== 'success') throw new Error(result.message);

            if (result.data && result.data.length > 0) {
                history = result.data.map(item => ({
                    date: new Date(item.Date),
                    status: item.Status,
                    paymentMade: item['Payment Made'] === true || item['Payment Made'] === 'TRUE',
                    note: item.Note || ''
                }));
                recalculateStateFromHistory();
                showToast('Successfully synced from Google Sheets.', 'success');
            } else {
                showToast('Google Sheet is empty. Ready to log first class.', 'info');
            }
        } catch (error) {
            showToast(`Sync failed: ${error.message}`, 'error');
        }
        saveData();
        updateUI();
    }

    async function backupDataToGoogleSheets() {
        if (!config || !config.appScriptURL) return;
        try {
            const response = await fetch(config.appScriptURL, {
                method: 'POST',
                mode: 'cors',
                headers: { 'Content-Type': 'text/plain' },
                body: JSON.stringify(history)
            });
            if (!response.ok) throw new Error('Backup network response was not ok.');
            const result = await response.json();
            if (result.status !== 'success') throw new Error(result.message);
            showToast('Backup to Google Sheets successful.', 'success');
        } catch (error) {
            showToast(`Backup failed: ${error.message}`, 'error');
        }
    }
});