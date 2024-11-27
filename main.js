// ==UserScript==
// @name         Easy Use with Quantity Highlight and Button Disable
// @namespace    http://tampermonkey.net/
// @version      0.9
// @description  Highlight company names, disable Transfer button, highlight quantity label dynamically, and highlight From Location based on span content
// @author       Danny
// @match        https://digital-star-canada-eva-group.odoo.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Define the list of company names to highlight
    const highlightNames = [
        'Doglas Trading Inc',
        'Print Xcalibur Inc. US',
        'Supply the six Inc.',
        'MRL Incentives Inc.',
        'Solutionize Inc.'
    ];

    // List of company names that should NOT be highlighted
    const noHighlightNames = [
        'Print Xcalibur Inc. CA'
    ];

    // Function to highlight the company name
    function highlightCompanyName() {
        const companyNameElement = document.querySelector('.oe_topbar_name');

        if (companyNameElement) {
            const companyName = companyNameElement.textContent.trim();

            // Check if the company name is in the highlight list
            if (highlightNames.includes(companyName)) {
                // Apply red background and black text color to highlighted names
                companyNameElement.style.backgroundColor = 'red';
                companyNameElement.style.color = 'black';
                companyNameElement.style.fontWeight = 'bold';  // Optional: makes the text bold
            }
            // Check if the company name is in the no highlight list
            else if (noHighlightNames.includes(companyName)) {
                // Remove any previous highlighting (if any)
                companyNameElement.style.backgroundColor = '';
                companyNameElement.style.color = '';
                companyNameElement.style.fontWeight = '';
            }
        }
    }

    // Function to disable the "Transfer" button
    function disableTransferButton() {
        const transferButton = Array.from(document.querySelectorAll('.o_statusbar_buttons button'))
            .find(button => button.textContent.trim() === 'Transfer');

        if (transferButton) {
            // Disable the "Transfer" button
            transferButton.disabled = true;
            transferButton.style.backgroundColor = 'gray';  // Optional: Change style to show it's disabled
            transferButton.style.cursor = 'not-allowed';   // Optional: Change cursor to indicate it's disabled
        }
    }

    // Function to disable the "Create Backorder" button
    function disablCreateBackorderButton() {
        const CreateBackorderButton = Array.from(document.querySelectorAll('[name="process"]'))
            .find(button => button.textContent.trim() === 'Create Backorder');

        if (CreateBackorderButton) {
            // Disable the "Transfer" button
            CreateBackorderButton.disabled = true;
            CreateBackorderButton.style.backgroundColor = 'gray';  // Optional: Change style to show it's disabled
            CreateBackorderButton.style.cursor = 'not-allowed';   // Optional: Change cursor to indicate it's disabled
        }
    }

    // Function to disable the "Put in Pack" button
    function disablPutInPackButton() {
        const CreatePutInPackButton = Array.from(document.querySelectorAll('[name="action_put_in_pack"]'))
            .find(button => button.textContent.trim() === 'Put in Pack');
        console.log(CreatePutInPackButton)

        if (CreatePutInPackButton) {
            // Disable the "Transfer" button
            CreatePutInPackButton.disabled = true;
            CreatePutInPackButton.style.backgroundColor = 'gray';  // Optional: Change style to show it's disabled
            CreatePutInPackButton.style.cursor = 'not-allowed';   // Optional: Change cursor to indicate it's disabled
        }
    }

    // Function to highlight the Quantity label if quantity is greater than 1
    function highlightQuantity() {
        const quantityInput = document.querySelector('#product_qty');
        const quantityLabel = document.querySelector('label[for="product_qty"]');

        if (!quantityInput || !quantityLabel) {
            console.log('Quantity input or label not found!');
            return; // Exit if the element is not found
        }

        const quantity = parseFloat(quantityInput.value);
        console.log('Quantity:', quantity); // Debugging log

        // Apply red background and black text color to the label if quantity is greater than 1
        if (quantity > 1.00) {
            quantityLabel.style.backgroundColor = 'red';
            quantityLabel.style.color = 'black';
            quantityLabel.style.fontWeight = 'bold';  // Optional: makes the text bold
        } else {
            // Remove any previous styling if quantity is 1 or less
            quantityLabel.style.backgroundColor = '';
            quantityLabel.style.color = '';
            quantityLabel.style.fontWeight = '';
        }
    }

    // Function to wait for the quantity input and label to appear
    function waitForQuantityInput() {
        const observer = new MutationObserver((mutationsList, observer) => {
            const quantityInput = document.querySelector('#product_qty');
            const quantityLabel = document.querySelector('label[for="product_qty"]');

            if (quantityInput && quantityLabel) {
                console.log('Quantity input and label found!');
                highlightQuantity(); // Highlight as soon as they appear
                // Add an event listener for input changes
                quantityInput.addEventListener('input', highlightQuantity);
                observer.disconnect(); // Stop observing once it's found and processed
            }
        });

        // Observe the body of the document for any changes in child nodes
        observer.observe(document.body, {
            childList: true, // Watch for added or removed child nodes
            subtree: true     // Also observe descendants
        });
    }

    // New function to highlight the "From Location" label if certain keywords are found in the span
    function highlightFromLocation() {
        const spanElement = document.querySelector('[name="to_product_short_name"] span');

        if (spanElement) {
            const spanText = spanElement.textContent.trim().toLowerCase();
            // List of keywords to look for in the span text
            const keywords = ['return new', 'grade a', 'grade b', 'grade c', 'grade f'];

            // Check if any of the keywords are found in the span text
            const isKeywordPresent = keywords.some(keyword => spanText.includes(keyword));

            if (isKeywordPresent) {
                const fromLocationLabel = document.querySelector('label[for="from_location_id"]');
                if (fromLocationLabel) {
                    fromLocationLabel.style.backgroundColor = 'red';
                    fromLocationLabel.style.color = 'black';
                    fromLocationLabel.style.fontWeight = 'bold';  // Optional: makes the text bold
                }
            }
        }
    }

    function highlightqty() {
        const rows = document.querySelectorAll('.o_data_row');

        if (rows) {
            rows.forEach(row => {
                // Get the quantity cell
                const qtyCell = row.querySelector('[name="product_qty"]');

                console.log(qtyCell)

                // Check if the quantity is greater than 1
                if (parseFloat(qtyCell.textContent) > 1.00) {
                    qtyCell.style.backgroundColor = 'red';
                    qtyCell.style.color = 'black';
                    qtyCell.style.fontWeight = 'bold';  // Optional: makes the text bold
                }
            });
        }
    }


    // Function to reset the functionality
    function resetFunctionality() {
        highlightCompanyName();   // Highlight company name
        disableTransferButton();  // Disable the "Transfer" button
        disablCreateBackorderButton();
        disablPutInPackButton();
        waitForQuantityInput();   // Start waiting for the quantity input and label to appear
        highlightFromLocation();  // Check and highlight "From Location" if necessary
        highlightqty();
    }

    // Wait for the page to load initially and then run the functions
    window.addEventListener('load', function() {
        resetFunctionality();  // Call reset functionality each time page is loaded

        // Optionally, start observing for changes in the quantity field after it's loaded
        const quantityInput = document.querySelector('#product_qty');
        const quantityLabel = document.querySelector('label[for="product_qty"]');

        if (quantityInput && quantityLabel) {
            highlightQuantity();  // Initially highlight if already available
            quantityInput.addEventListener('input', highlightQuantity); // Event listener for future input changes
        }
    });

    // Optionally, observe for changes to re-trigger highlighting when product page is reloaded or visited again
    const observer = new MutationObserver(() => {
        resetFunctionality(); // Reset functionality to reapply all logic
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

})();