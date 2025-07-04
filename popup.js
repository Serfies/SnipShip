/*  */document.addEventListener('DOMContentLoaded', () => {
    const webhookListSelectionDiv = document.getElementById('webhook-list-selection');
    const sendSelectedTextButton = document.getElementById('send-selected-text-button');
    const responseContentDiv = document.getElementById('response-content');
    const loadingSpinner = document.getElementById('loading-spinner');
    const skeletonLoader = document.getElementById('skeleton-loader');
    const copyResponseButton = document.getElementById('copy-response-button');
    const webhookForm = document.getElementById('webhook-form');
    const webhookIdInput = document.getElementById('webhook-id');
    const webhookNameInput = document.getElementById('webhook-name');
    const webhookUrlInput = document.getElementById('webhook-url');
    const webhookApiKeyInput = document.getElementById('webhook-api-key');
    const webhookInputFieldInput = document.getElementById('webhook-input-field-name');
    const webhookOutputFieldInput = document.getElementById('webhook-output-field-name');
    const webhookDescriptionInput = document.getElementById('webhook-description');
    const saveWebhookButton = document.getElementById('save-webhook-button');
    const cancelEditButton = document.getElementById('cancel-edit-button');
    const webhookListUl = document.getElementById('webhook-list');
    const helpButton = document.getElementById('help-button');
    const helpModal = document.getElementById('help-modal');
    const closeHelpModalButton = document.getElementById('close-help-modal');
 
    const addWebhookButton = document.getElementById('add-webhook-button');
    const editWebhookButton = document.getElementById('edit-webhook-button');
    const deleteWebhookButton = document.getElementById('delete-webhook-button');
    const manageWebhooksModal = document.getElementById('manage-webhooks-modal');
    const closeManageWebhooksModalButton = document.getElementById('close-manage-webhooks-modal');
 
    let selectedWebhookId = null; // To keep track of the currently selected webhook
 
    let webhooks = [];

    // Load webhooks from storage
    async function loadWebhooks() {
        const result = await chrome.storage.sync.get('webhooks');
        webhooks = result.webhooks || [];
        renderWebhooks();
    }

    // Render webhooks in the selection list and management list
    function renderWebhooks() {
        webhookListSelectionDiv.innerHTML = '';
        webhookListUl.innerHTML = '';

        if (webhooks.length === 0) {
            webhookListSelectionDiv.innerHTML = '<p>No webhooks configured. Please add one below.</p>';
            sendSelectedTextButton.disabled = true;
            selectedWebhookId = null;
        } else {
            sendSelectedTextButton.disabled = false;
            webhooks.forEach(webhook => {
                // Add to selection list
                const selectionItem = document.createElement('div');
                selectionItem.classList.add('webhook-item');
                if (webhook.id === selectedWebhookId) {
                    selectionItem.classList.add('selected');
                }
                selectionItem.dataset.id = webhook.id;
                selectionItem.innerHTML = `
                    <strong>${webhook.name}</strong>
                    <p>${webhook.description}</p>
                `;
                webhookListSelectionDiv.appendChild(selectionItem);
 
                // Add to management list (only display, no edit/delete buttons here)
                const listItem = document.createElement('li');
                listItem.dataset.id = webhook.id; // Add data-id for selection in management list
                listItem.innerHTML = `
                    <strong>${webhook.name}</strong> (${webhook.url})
                    <p>${webhook.description}</p>
                `;
                webhookListUl.appendChild(listItem);
            });
        }
    }
 
    // Function to open the webhook form modal for adding/editing
    function openWebhookFormModal(webhook = null) {
        webhookForm.reset();
        webhookIdInput.value = '';
        webhookApiKeyInput.value = '';
        webhookInputFieldInput.value = 'chatInput';
        webhookOutputFieldInput.value = 'output';
        saveWebhookButton.textContent = 'Save Webhook';
        cancelEditButton.style.display = 'none';
 
        if (webhook) {
            webhookIdInput.value = webhook.id;
            webhookNameInput.value = webhook.name;
            webhookUrlInput.value = webhook.url;
            webhookApiKeyInput.value = webhook.apiKey || '';
            webhookInputFieldInput.value = webhook.inputFieldName || 'chatInput';
            webhookOutputFieldInput.value = webhook.outputFieldName || 'output';
            webhookDescriptionInput.value = webhook.description;
            saveWebhookButton.textContent = 'Update Webhook';
            cancelEditButton.style.display = 'inline-block';
        }
        manageWebhooksModal.style.display = 'block';
    }

    // Save webhooks to storage
    async function saveWebhooks() {
        await chrome.storage.sync.set({ webhooks });
        renderWebhooks();
    }

    // Handle form submission for adding/editing webhooks
    webhookForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = webhookIdInput.value;
        const name = webhookNameInput.value;
        const url = webhookUrlInput.value;
        const apiKey = webhookApiKeyInput.value;
        const inputFieldName = webhookInputFieldInput.value;
        const outputFieldName = webhookOutputFieldInput.value;
        const description = webhookDescriptionInput.value;

        if (id) {
            // Edit existing webhook
            const index = webhooks.findIndex(w => w.id === id);
            if (index !== -1) {
                webhooks[index] = { id, name, url, apiKey, inputFieldName, outputFieldName, description };
            }
        } else {
            // Add new webhook
            webhooks.push({ id: crypto.randomUUID(), name, url, apiKey, inputFieldName, outputFieldName, description });
        }

        await saveWebhooks();
        manageWebhooksModal.style.display = 'none'; // Close modal after saving
    });
 
    // Cancel edit button in the form
    cancelEditButton.addEventListener('click', () => {
        manageWebhooksModal.style.display = 'none';
    });
 
    // Handle add webhook button click
    addWebhookButton.addEventListener('click', () => {
        openWebhookFormModal();
    });
 
    // Handle edit webhook button click
    editWebhookButton.addEventListener('click', () => {
        if (!selectedWebhookId) {
            responseContentDiv.textContent = 'Please select a webhook to edit.';
            return;
        }
        const webhookToEdit = webhooks.find(w => w.id === selectedWebhookId);
        if (webhookToEdit) {
            openWebhookFormModal(webhookToEdit);
        } else {
            responseContentDiv.textContent = 'Selected webhook not found for editing.';
        }
    });
 
    // Handle delete webhook button click
    deleteWebhookButton.addEventListener('click', async () => {
        if (!selectedWebhookId) {
            responseContentDiv.textContent = 'Please select a webhook to delete.';
            return;
        }
        if (confirm('Are you sure you want to delete the selected webhook?')) {
            webhooks = webhooks.filter(w => w.id !== selectedWebhookId);
            selectedWebhookId = null; // Deselect after deletion
            await saveWebhooks();
            responseContentDiv.textContent = 'Webhook deleted successfully.';
        }
    });

    // Function to show loading state (spinner and skeleton)
    function showLoadingState() {
        responseContentDiv.style.display = 'none';
        loadingSpinner.style.display = 'block';
        skeletonLoader.style.display = 'block';
    }

    // Function to hide loading state
    function hideLoadingState() {
        loadingSpinner.style.display = 'none';
        skeletonLoader.style.display = 'none';
        responseContentDiv.style.display = 'block';
    }

    // Function to send data to webhook
    async function sendDataToWebhook(payload, type) {
        if (!selectedWebhookId) {
            responseContentDiv.textContent = 'Please select a webhook from the list above.';
            return;
        }

        showLoadingState(); // Show loading state before sending request

        const selectedWebhook = webhooks.find(w => w.id === selectedWebhookId);
        if (!selectedWebhook) {
            webhookResponseDiv.textContent = 'Selected webhook not found.';
            return;
        }

        responseContentDiv.textContent = `Sending ${type}...`; // Update this to responseContentDiv

        try {
            const headers = {
                'Content-Type': 'application/json'
            };
            if (selectedWebhook.apiKey) {
                headers['X-API-Key'] = selectedWebhook.apiKey;
            }

            const response = await fetch(selectedWebhook.url, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const outputFieldName = selectedWebhook.outputFieldName || 'output';
            if (data && data[outputFieldName]) {
                responseContentDiv.innerHTML = marked.parse(data[outputFieldName]); // Update this to responseContentDiv
            } else {
                responseContentDiv.textContent = `No "${outputFieldName}" field found in webhook response.`; // Update this to responseContentDiv
                console.log('Full webhook response:', data);
            }
        } catch (error) {
            responseContentDiv.textContent = `Error: ${error.message}`; // Update this to responseContentDiv
            console.error(`Error sending ${type} to webhook:`, error);
        } finally {
            hideLoadingState(); // Hide loading state after response or error
        }
    }

    // Handle webhook selection from the list
    webhookListSelectionDiv.addEventListener('click', (event) => {
        const targetItem = event.target.closest('.webhook-item');
        if (targetItem) {
            // Remove 'selected' class from previously selected item in selection area
            const currentSelectedSelection = webhookListSelectionDiv.querySelector('.webhook-item.selected');
            if (currentSelectedSelection) {
                currentSelectedSelection.classList.remove('selected');
            }
            // Add 'selected' class to the clicked item in selection area
            targetItem.classList.add('selected');
            selectedWebhookId = targetItem.dataset.id;
            sendSelectedTextButton.disabled = false;
        }
    });
 
    // Handle webhook selection from the management list (for edit/delete)
    webhookListUl.addEventListener('click', (event) => {
        const targetItem = event.target.closest('li');
        if (targetItem) {
            // Remove 'selected' class from previously selected item in management list
            const currentSelectedManagement = webhookListUl.querySelector('li.selected');
            if (currentSelectedManagement) {
                currentSelectedManagement.classList.remove('selected');
            }
            // Add 'selected' class to the clicked item in management list
            targetItem.classList.add('selected');
            selectedWebhookId = targetItem.dataset.id;
        }
    });
 
    // Send selected text to selected webhook
    sendSelectedTextButton.addEventListener('click', async () => {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            if (!tab.id) {
                responseContentDiv.textContent = 'Cannot get selected text from this tab.'; // Update this to responseContentDiv
                return;
            }
 
            // Inject a script to get the selected text
            const results = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: () => window.getSelection().toString()
            });
 
            const selectedWebhook = webhooks.find(w => w.id === selectedWebhookId);
            if (!selectedWebhook) {
                responseContentDiv.textContent = 'Selected webhook not found.'; // Update this to responseContentDiv
                return;
            }
 
            const selectedText = results[0].result;
            const inputFieldName = selectedWebhook.inputFieldName || 'chatInput';
 
            if (selectedText) {
                const payload = {};
                payload[inputFieldName] = selectedText;
                await sendDataToWebhook(payload, 'selected text');
            } else {
                responseContentDiv.textContent = 'No text selected on the page.'; // Update this to responseContentDiv
            }
        } catch (error) {
            responseContentDiv.textContent = `Error getting selected text: ${error.message}`; // Update this to responseContentDiv
            console.error('Error getting selected text:', error);
        }
    });
 
    // Handle help button click to open modal
    helpButton.addEventListener('click', () => {
        helpModal.style.display = 'block';
    });

    // Handle copy response button click
    copyResponseButton.addEventListener('click', async () => {
        try {
            const textToCopy = responseContentDiv.textContent;
            await navigator.clipboard.writeText(textToCopy);
            // Optionally, provide visual feedback to the user
            copyResponseButton.textContent = 'Copied!';
            setTimeout(() => {
                copyResponseButton.innerHTML = '&#x2398;'; // Reset icon
            }, 1500);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            // Optionally, inform the user about the failure
            copyResponseButton.textContent = 'Failed!';
            setTimeout(() => {
                copyResponseButton.innerHTML = '&#x2398;'; // Reset icon
            }, 1500);
        }
    });
 
    // Handle close help modal button click
    closeHelpModalButton.addEventListener('click', () => {
        helpModal.style.display = 'none';
    });
 
    // Close help modal if user clicks outside of it
    window.addEventListener('click', (event) => {
        if (event.target === helpModal) {
            helpModal.style.display = 'none';
        } else if (event.target === manageWebhooksModal) { // Also close manage modal
            manageWebhooksModal.style.display = 'none';
        }
    });
 
    // Handle close manage webhooks modal button click
    closeManageWebhooksModalButton.addEventListener('click', () => {
        manageWebhooksModal.style.display = 'none';
    });
 
    // Initial load
    loadWebhooks();
});