// ==UserScript==
// @name         Easy Use with Quantity Highlight and Button Disable
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  Highlight company names, disable Transfer button, highlight quantity label dynamically, and highlight From Location based on span content
// @author       Danny
// @match        https://*.odoo.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const DISABLE_CLASS = "o_disable_button";

    // Function to disable all buttons except Inventory and Manufacturing
    const disableButtons = () => {
        const divs = document.querySelectorAll(".o_app");
        divs.forEach((div) => {
            const caption = div.querySelector(".o_caption");
            if (caption && !caption.textContent.includes("Inventory") && !caption.textContent.includes("Manufacturing")) {
                div.style.pointerEvents = "none"; // Disable click events
                div.style.opacity = "0.5"; // Dim the button
                div.classList.add(DISABLE_CLASS); // Add a custom class for tracking
            }
        });
    };

    // Function to reset buttons to their original state
    const resetButtonsState = () => {
        const divs = document.querySelectorAll(".o_app");
        divs.forEach((div) => {
            if (div.classList.contains(DISABLE_CLASS)) {
                div.style.pointerEvents = "auto"; // Enable click events
                div.style.opacity = "1"; // Restore full visibility
                div.classList.remove(DISABLE_CLASS); // Remove the custom class
            }
        });
    };

    // Observe children of o_action_manager for changes
    const observeActionManager = () => {
        const actionManager = document.querySelector(".o_action_manager");
        if (actionManager) {
            const childObserver = new MutationObserver(() => {
                if (sessionStorage.getItem("nameSelected") === "true") {
                    disableButtons(); // Reapply disabling logic
                } else {
                    resetButtonsState(); // Reset buttons if no name is selected
                }
            });

            childObserver.observe(actionManager, {
                childList: true, // Observe direct children
                subtree: true, // Observe all descendants
            });
        }
    };

    //Function to popup a window name
    const popupWindow = () => {
                if (!document.querySelector("#custom-popup")) {
            const popup = document.createElement("div");
            popup.id = "custom-popup";
            popup.style.position = "fixed";
            popup.style.zIndex = "1000";
            popup.style.top = "0";
            popup.style.left = "0";
            popup.style.width = "100%";
            popup.style.height = "100%";
            popup.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
            popup.style.display = "flex";
            popup.style.justifyContent = "center";
            popup.style.alignItems = "center";

            const content = document.createElement("div");
            content.style.backgroundColor = "#fff";
            content.style.padding = "20px";
            content.style.borderRadius = "10px";
            content.style.textAlign = "center";

            const question = document.createElement("h2");
            question.textContent = "Who Are You?";
            content.appendChild(question);

            const names = ["Gorden", "Danny", "John", "Leon", "Yitong", "Assistant"];
            names.forEach((name) => {
                const button = document.createElement("button");
                button.textContent = name;

                button.style.fontSize = "24px";
                button.style.padding = "20px 30px";
                button.style.margin = "10px";
                button.style.border = "none";
                button.style.backgroundColor = "#007bff";
                button.style.color = "white";
                button.style.borderRadius = "5px";
                button.style.cursor = "pointer";

                button.addEventListener("click", () => {
                    const userNameSpans = document.querySelectorAll(".oe_topbar_name");
                    if (userNameSpans.length > 1) {
                        userNameSpans[1].textContent = name;
                    }

                    disableButtons();
                    popup.style.display = "none";
                    sessionStorage.setItem("nameSelected", "true"); // Persist the selected state
                });

                content.appendChild(button);
            });

            popup.appendChild(content);
            document.body.appendChild(popup);
        }
    }

    // Function to highlight the company name
    const highlightCompanyName = () => {
        const companyNameElement = document.querySelector('.oe_topbar_name');

        if (companyNameElement) {
            const companyName = companyNameElement.textContent.trim();

            const companyPattern = /([A-Za-z0-9\s]+Inc\.\s*CA)/i; // Regex to find any company with "Inc."

            // Find all matches in the page's text
            const matches = companyName.match(companyPattern);

            if (!matches) {
                companyNameElement.style.backgroundColor = 'red';
                companyNameElement.style.color = 'black';
                companyNameElement.style.fontWeight = 'bold'; // Optional: makes the text bold
            } else {
                companyNameElement.style.backgroundColor = '';
                companyNameElement.style.color = '';
                companyNameElement.style.fontWeight = '';
            }
        }
    }

    // Function to disable the "Transfer" button
    const disableTransferButton = () => {
        const transferButton = Array.from(document.querySelectorAll('.o_statusbar_buttons button'))
            .find(button => button.textContent.trim() === 'Transfer');

        if (transferButton) {
            // Disable the "Transfer" button
            transferButton.disabled = true;
            transferButton.style.backgroundColor = 'gray'; // Optional: Change style to show it's disabled
            transferButton.style.cursor = 'not-allowed'; // Optional: Change cursor to indicate it's disabled
        }
    }

    // Function to disable the "Create Backorder" button
    const disablCreateBackorderButton = () => {
        const CreateBackorderButton = Array.from(document.querySelectorAll('[name="process"]'))
            .find(button => button.textContent.trim() === 'Create Backorder');

        if (CreateBackorderButton) {
            // Disable the "Transfer" button
            CreateBackorderButton.disabled = true;
            CreateBackorderButton.style.backgroundColor = 'gray'; // Optional: Change style to show it's disabled
            CreateBackorderButton.style.cursor = 'not-allowed'; // Optional: Change cursor to indicate it's disabled
        }
    }

    // Function to disable the "Put in Pack" button
    const disablPutInPackButton = () => {
        const CreatePutInPackButton = Array.from(document.querySelectorAll('[name="action_put_in_pack"]'))
            .find(button => button.textContent.trim() === 'Put in Pack');

        if (CreatePutInPackButton) {
            // Disable the "Transfer" button
            CreatePutInPackButton.disabled = true;
            CreatePutInPackButton.style.backgroundColor = 'gray'; // Optional: Change style to show it's disabled
            CreatePutInPackButton.style.cursor = 'not-allowed'; // Optional: Change cursor to indicate it's disabled
        }
    }

    // Function to highlight the Quantity label if quantity is greater than 1
    const highlightQuantity = () => {
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
            quantityLabel.style.fontWeight = 'bold'; // Optional: makes the text bold
        } else {
            // Remove any previous styling if quantity is 1 or less
            quantityLabel.style.backgroundColor = '';
            quantityLabel.style.color = '';
            quantityLabel.style.fontWeight = '';
        }
    }

    // Function to wait for the quantity input and label to appear
    const waitForQuantityInput = () => {
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
            subtree: true // Also observe descendants
        });
    }

    // New function to highlight the "From Location" label if certain keywords are found in the span
    const highlightFromLocation = () => {
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
                    fromLocationLabel.style.fontWeight = 'bold'; // Optional: makes the text bold
                }
            }
        }
    }

    const highlightqty = () => {
        const rows = document.querySelectorAll('.o_data_row');

        if (rows) {
            rows.forEach(row => {
                // Get the quantity cell
                const qtyCell = row.querySelector('[name="product_qty"]');

                if (qtyCell) {
                    // Check if the quantity is greater than 1
                    if (parseFloat(qtyCell.textContent) > 1.00) {
                        qtyCell.style.backgroundColor = 'red';
                        qtyCell.style.color = 'black';
                        qtyCell.style.fontWeight = 'bold'; // Optional: makes the text bold
                    }
                }
            });
        }
    }

    // Function to reset the functionality
    const resetFunctionality = () => {
        highlightCompanyName(); // Highlight company name
        disableTransferButton(); // Disable the "Transfer" button
        disablCreateBackorderButton();
        disablPutInPackButton();
        waitForQuantityInput(); // Start waiting for the quantity input and label to appear
        highlightFromLocation(); // Check and highlight "From Location" if necessary
        highlightqty();
    }

    // Wait for the page to load initially and then run the functions
    window.addEventListener('load', function() {
        resetFunctionality(); // Call reset functionality each time page is loaded

        // Optionally, start observing for changes in the quantity field after it's loaded
        const quantityInput = document.querySelector('#product_qty');
        const quantityLabel = document.querySelector('label[for="product_qty"]');

        if (quantityInput && quantityLabel) {
            highlightQuantity(); // Initially highlight if already available
            quantityInput.addEventListener('input', highlightQuantity); // Event listener for future input changes
        }

    });

    // Optionally, observe for changes to re-trigger highlighting when product page is reloaded or visited again
    const observer = new MutationObserver(() => {
        resetFunctionality(); // Reset functionality to reapply all logic
        observeActionManager();
        popupWindow();
    });

    const init = () => {
        if (sessionStorage.getItem("nameSelected") === "true") {
            disableButtons();
        }
    };

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });

    window.addEventListener("load", init);

})();