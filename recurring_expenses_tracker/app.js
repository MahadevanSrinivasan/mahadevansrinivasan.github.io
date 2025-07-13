document.addEventListener('DOMContentLoaded', () => {
    // --- Google API Configuration ---
    let API_KEY = '';
    let CLIENT_ID = '';
    const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest", "https://sheets.googleapis.com/$discovery/rest?version=v4"];
    const SCOPES = 'https://www.googleapis.com/auth/drive.file';

    // --- DOM Elements ---
    const configSection = document.getElementById('config-section');
    const statusSection = document.getElementById('status-section');
    const historySection = document.getElementById('history-section');
    const configForm = document.getElementById('config-form');
    const expenseNameInput = document.getElementById('expense-name');
    const classesPerPaymentInput = document.getElementById('classes-per-payment');
    const appScriptURLInput = document.getElementById('appScriptURLInput');

    const googleAuthButton = document.getElementById('google-auth-button');
    const signOutButton = document.getElementById('sign-out-button');
    const dataSourceIndicator = document.getElementById('data-source-indicator');

    const googleCredsModal = document.getElementById('google-creds-modal');
    const googleApiKeyInput = document.getElementById('google-api-key');
    const googleClientIdInput = document.getElementById('google-client-id');
    const saveGoogleCredsButton = document.getElementById('save-google-creds-button');

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
    const SPREADSHEET_NAME = 'RecurringExpenseTrackerData';

    // --- State ---
    let config = null;
    let history = [];
    let state = { remainingClasses: 0, currentPage: 1, spreadsheetId: null, dataSource: 'localStorage' };
    let toastTimeout;
    let manualLogModalInstance = null;
    let paymentLogModalInstance = null;
    let googleCredsModalInstance = null;
    let gapiInited = false;
    let gisInited = false;
    let tokenClient;

    // --- Initialization ---
    window.onload = () => {
        gapi.load('client', () => gapiInited = true);
        gisInited = true;
        loadData();
    };

    async function initializeGapiClient() {
        await gapi.client.init({
            apiKey: API_KEY,
            discoveryDocs: DISCOVERY_DOCS,
        });
        tokenClient = google.accounts.oauth2.initTokenClient({
            client_id: CLIENT_ID,
            scope: SCOPES,
            callback: '', // defined later
        });
        const token = gapi.client.getToken();
        if (token) {
            state.dataSource = 'googleSheet';
        }
        loadData();
    }

    function loadData() {
        const storedConfig = localStorage.getItem(CONFIG_KEY);
        if (storedConfig) {
            config = JSON.parse(storedConfig);
            const storedState = localStorage.getItem(STATE_KEY);
            if (storedState) {
                state = { ...state, ...JSON.parse(storedState) };
            }

            if (state.dataSource === 'googleSheet' && gapi.client.getToken()) {
                findOrCreateSpreadsheet().then(loadSheetData);
            } else if (state.dataSource === 'appScript' && config.appScriptURL) {
                syncWithGoogleSheets();
            } else {
                const storedHistory = localStorage.getItem(HISTORY_KEY);
                if (storedHistory) {
                    history = JSON.parse(storedHistory).map(item => ({ ...item, date: new Date(item.date) }));
                }
                recalculateStateFromHistory();
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
        localStorage.setItem(STATE_KEY, JSON.stringify(state));

        if (state.dataSource === 'googleSheet' && state.spreadsheetId) {
            writeSheetData();
        } else if (state.dataSource === 'appScript' && config.appScriptURL) {
            backupDataToGoogleSheets();
        } else {
            localStorage.setItem(HISTORY_KEY, JSON.stringify(history.map(item => ({ ...item, date: item.date.toISOString() }))));
        }
    }

    function clearData() {
        localStorage.removeItem(CONFIG_KEY);
        localStorage.removeItem(HISTORY_KEY);
        localStorage.removeItem(STATE_KEY);
        config = null;
        history = [];
        state = { remainingClasses: 0, currentPage: 1, spreadsheetId: null, dataSource: 'localStorage' };
        updateUI();
    }

    function handleConfigSubmit(event) {
        event.preventDefault();
        config = {
            name: expenseNameInput.value,
            classesPerPayment: parseInt(classesPerPaymentInput.value),
            appScriptURL: appScriptURLInput.value.trim()
        };

        if (config.appScriptURL) {
            state.dataSource = 'appScript';
        } else {
            state.dataSource = gapi.client.getToken() ? 'googleSheet' : 'localStorage';
        }

        history = [];
        state.remainingClasses = config.classesPerPayment;
        state.currentPage = 1;
        
        saveData();

        if (state.dataSource === 'appScript') {
            syncWithGoogleSheets();
        } else {
            updateUI();
        }
        showToast('Configuration saved!', 'success');
    }

    function setupEventListeners() {
        configForm.addEventListener('submit', handleConfigSubmit);
        saveGoogleCredsButton.addEventListener('click', handleSaveGoogleCreds);
        signOutButton.addEventListener('click', handleSignoutClick);
        document.getElementById('reset-config-button').addEventListener('click', () => {
            if (confirm('Are you sure you want to reset?')) {
                if (gapi.client.getToken()) handleSignoutClick();
                clearData();
            }
        });

        fabMainButton.addEventListener('click', () => fabActions.classList.toggle('hidden'));
        logClassButton.addEventListener('click', () => { logTodaysClass(); fabActions.classList.add('hidden'); });
        logPaymentButton.addEventListener('click', () => { paymentLogModalInstance.show(); fabActions.classList.add('hidden'); });
        logManualClassButton.addEventListener('click', () => { manualLogModalInstance.show(); fabActions.classList.add('hidden'); });

        saveManualLogButton.addEventListener('click', handleSaveManualLog);
        savePaymentLogButton.addEventListener('click', handleSavePayment);
        prevPageButton.addEventListener('click', () => changePage(-1));
        nextPageButton.addEventListener('click', () => changePage(1));
    }

    function updateUI() {
        const isSignedIn = gapi.client.getToken() !== null;
        googleAuthButton.classList.toggle('hidden', isSignedIn || (config && config.appScriptURL));
        signOutButton.classList.toggle('hidden', !isSignedIn);

        if (config) {
            configSection.classList.add('hidden');
            statusSection.classList.remove('hidden');
            historySection.classList.remove('hidden');
            fabMainButton.classList.remove('hidden');

            expenseStatusName.textContent = `Expense: ${config.name}`;
            expenseStatusDetails.textContent = ` (${state.remainingClasses} of ${config.classesPerPayment} classes remaining)`;
            paymentOverdueIndicator.classList.toggle('hidden', state.remainingClasses > 0);
            
            let sourceText = 'Local Storage';
            if (state.dataSource === 'googleSheet') sourceText = 'Google Sheet (OAuth)';
            else if (state.dataSource === 'appScript') sourceText = 'Google Sheet (App Script)';
            dataSourceIndicator.textContent = `Data from: ${sourceText}`;

            renderHistory();
        } else {
            configSection.classList.remove('hidden');
            statusSection.classList.add('hidden');
            historySection.classList.add('hidden');
            fabMainButton.classList.add('hidden');
        }
    }

    // --- Google Sheets via OAuth ---

    function handleSaveGoogleCreds() {
        API_KEY = googleApiKeyInput.value.trim();
        CLIENT_ID = googleClientIdInput.value.trim();

        if (!API_KEY || !CLIENT_ID) {
            showToast('API Key and Client ID are required.', 'error');
            return;
        }
        googleCredsModalInstance.hide();
        initializeGapiClient().then(handleAuthClick);
    }

    function handleAuthClick() {
        tokenClient.callback = async (resp) => {
            if (resp.error !== undefined) {
                throw (resp);
            }
            state.dataSource = 'googleSheet';
            if(config) config.appScriptURL = ''; // Clear App Script URL if signing in
            saveData();
            await findOrCreateSpreadsheet().then(loadSheetData);
            updateUI();
        };

        if (gapi.client.getToken() === null) {
            tokenClient.requestAccessToken({ prompt: 'consent' });
        } else {
            tokenClient.requestAccessToken({ prompt: '' });
        }
    }

    function handleSignoutClick() {
        const token = gapi.client.getToken();
        if (token !== null) {
            google.accounts.oauth2.revoke(token.access_token, () => {
                gapi.client.setToken('');
                state.dataSource = 'localStorage';
                clearData();
                showToast('Signed out successfully.', 'info');
            });
        }
    }

    async function findOrCreateSpreadsheet() {
        // ... (implementation remains the same)
    }

    async function loadSheetData() {
        // ... (implementation remains the same)
    }

    async function writeSheetData() {
        // ... (implementation remains the same)
    }

    // ... (rest of the functions remain the same) ...

    // --- Initial Load ---
    setupEventListeners();
    if (manualLogModal) { manualLogModalInstance = new Modal(manualLogModal); }
    if (paymentLogModal) { paymentLogModalInstance = new Modal(paymentLogModal); }
    if (googleCredsModal) { googleCredsModalInstance = new Modal(googleCredsModal); }
});