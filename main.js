// ==UserScript==
// @name         Enhance Function in odoo for Tech - Dev
// @namespace    http://tampermonkey.net/
// @version      0.19.2
// @description  Add order number label
// @author       Danny, Toby, HL
// @match        https://*.odoo.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.min.js
// @resource     select2_css https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/css/select2.min.css
// @resource     select2_js https://cdnjs.cloudflare.com/ajax/libs/select2/4.0.13/js/select2.min.js
// ==/UserScript==

(function () {
    "use strict";

    const DISABLE_CLASS = "o_disable_button";

    // Include jsBarcode for barcode generation
    const script = document.createElement("script");
    script.src =
        "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js";
    script.onload = renderLabel;
    document.head.appendChild(script);

    const ReturnCondition = {
        "return new": "RN",
        "grade a": "RA",
        "grade b": "RB",
        "grade c": "RC",
        "grade f": "RF",
    };

    const names = [
        "Danny",
        "Kon",
        "John",
        "Leon",
        "Yitong",
        "Henry",
        "Toby",
        "Assistant",
    ];

    let canvas;

    function renderLabel(model, specs, upc) {
        const dpi = 600; // High resolution for clarity
        const width = Math.round((62 / 25.4) * dpi); // 62mm to pixels
        const height = Math.round((29 / 25.4) * dpi); // 29mm to pixels

        // Create the canvas
        canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style.border = "1px solid black"; // Optional for debugging

        // Get canvas context
        const ctx = canvas.getContext("2d");

        // Background color
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        // Text settings - smaller font size
        ctx.fillStyle = "#000000";
        ctx.font = `bold ${Math.round(16 * (dpi / 96))}px Arial`; // Smaller font size (16px)
        ctx.textAlign = "center";

        // Add the model (first line of text)
        ctx.fillText(model, width / 2, height * 0.3);

        // Add the specs (second line of text)
        ctx.fillText(specs, width / 2, height * 0.45);

        // Create a barcode below the text with longer width
        const barcodeCanvas = document.createElement("canvas");
        barcodeCanvas.width = width * 0.9; // 90% of label width for longer barcode
        barcodeCanvas.height = height * 0.2; // 20% of label height for the barcode

        JsBarcode(barcodeCanvas, upc, {
            format: "CODE39",
            width: 4, // Narrower bars for smaller size
            height: barcodeCanvas.height,
            displayValue: true,
            fontSize: Math.round(14 * (dpi / 96)), // Larger font size for barcode value
            fontWeight: "bold", // Make the barcode value bold
            margin: 0, // Remove unnecessary margins
        });

        // Adjust barcode position by shifting it higher
        const barcodeX = (width - barcodeCanvas.width) / 2; // Center the barcode horizontally
        const barcodeY = height * 0.5; // Position barcode closer to text
        ctx.drawImage(
            barcodeCanvas,
            barcodeX,
            barcodeY,
            barcodeCanvas.width,
            barcodeCanvas.height
        );
    }

    function renderOrderNumberLabel(orderNumber) {
        const dpi = 600; // High resolution for clarity
        const width = Math.round((62 / 25.4) * dpi); // 62mm to pixels
        const height = Math.round((29 / 25.4) * dpi); // 29mm to pixels

        // Create the canvas
        canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        canvas.style.border = "1px solid black"; // Optional for debugging

        // Get canvas context
        const ctx = canvas.getContext("2d");

        // Background color
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, width, height);

        // Text settings - smaller font size
        ctx.fillStyle = "#000000";
        ctx.font = `bold ${Math.round(20 * (dpi / 96))}px Arial`; // Smaller font size (16px)
        ctx.textAlign = "center";

        ctx.fillText(orderNumber, width / 2, height / 2);
    }

    const createFrame = (img) => {
        // Create an invisible iframe to hold the content for printing
        const iframe = document.createElement("iframe");
        iframe.style.position = "absolute"; // Make it invisible and out of view
        iframe.style.width = "0px";
        iframe.style.height = "0px";
        iframe.style.border = "none";
        document.body.appendChild(iframe);

        let imagesHTML = '';

        img.forEach(url => {
            imagesHTML += `<img src="${url}" alt="Label" />`;
        });

        // Write the content (image) directly into the iframe document with page size set
        iframe.contentWindow.document.open();
        iframe.contentWindow.document.write(`
                                <html>
                                    <head>
                                        <title>Print Label</title>
                                        <style>
                                            @page {
                                                size: 62mm 29mm; /* Set page size explicitly */
                                                margin: 0;       /* Remove margins for edge-to-edge printing */
                                            }
                                            body {
                                                margin: 0;
                                                padding: 0;
                                                display: flex;
                                                justify-content: center;
                                                align-items: center;
                                                height: 100vh;
                                                background: white;
                                            }
                                            #image-container {
                                                width: 100%;
                                                height: 100%;
                                                text-align: center;
                                            }
                                            #image-container img {
                                                width: 100%;
                                                height: auto;
                                                display: block;
                                                margin: 0 auto;
                                                object-fit: contain;
                                                image-rendering: -webkit-optimize-contrast;
                                                image-rendering: crisp-edges;
                                            }
                                        </style>
                                    </head>
                                    <body>
                                        <div id="image-container">
                                        ${imagesHTML}
                                        </div>
                                    </body>
                                </html>
                            `);
        iframe.contentWindow.document.close();

        // Wait for the image to load before triggering the print dialog
        iframe.contentWindow.document.querySelector("img").onload =
            function () {
            console.log("Image loaded, preparing print dialog...");

            // Trigger the print dialog and focus the iframe window
            iframe.contentWindow.focus();
            iframe.contentWindow.print();

            // Clean up the iframe after a short delay
            setTimeout(() => document.body.removeChild(iframe), 2000);
        };

        // Handle errors in loading the image
        iframe.contentWindow.document.querySelector("img").onerror =
            function () {
            console.error("Image failed to load.");
            document.body.removeChild(iframe); // Remove iframe if image fails to load
        };
    }

    // Function to disable all buttons except Inventory and Manufacturing
    const disableButtons = () => {
        const divs = document.querySelectorAll(".o_app");
        divs.forEach((div) => {
            const caption = div.querySelector(".o_caption");
            if (
                caption &&
                !caption.textContent.includes("Inventory") &&
                !caption.textContent.includes("Manufacturing") &&
                !caption.textContent.includes("Sales")
            ) {
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
            question.style.color = "#000";
            content.appendChild(question);

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
    };

    // Function to highlight the company name
    const highlightCompanyName = () => {
        const companyNameElement = document.querySelector(".oe_topbar_name");

        if (companyNameElement) {
            const companyName = companyNameElement.textContent.trim();

            const companyPattern = /([A-Za-z0-9\s]+Inc\.\s*CA)/i; // Regex to find any company with "Inc."

            // Find all matches in the page's text
            const matches = companyName.match(companyPattern);

            if (!matches) {
                companyNameElement.style.backgroundColor = "red";
                companyNameElement.style.color = "black";
                companyNameElement.style.fontWeight = "bold"; // Optional: makes the text bold
            } else {
                companyNameElement.style.backgroundColor = "";
                companyNameElement.style.color = "";
                companyNameElement.style.fontWeight = "";
            }
        }
    };

    // Function to disable the "Transfer" button
    const disableTransferButton = () => {
        const transferButton = Array.from(
            document.querySelectorAll(".o_statusbar_buttons button")
        ).find((button) => button.textContent.trim() === "Transfer");

        if (transferButton) {
            // Disable the "Transfer" button
            transferButton.disabled = true;
            transferButton.style.backgroundColor = "gray"; // Optional: Change style to show it's disabled
            transferButton.style.cursor = "not-allowed"; // Optional: Change cursor to indicate it's disabled
        }
    };

    // Function to disable the "Create Backorder" button
    const disablCreateBackorderButton = () => {
        const CreateBackorderButton = Array.from(
            document.querySelectorAll('[name="process"]')
        ).find((button) => button.textContent.trim() === "Create Backorder");

        if (CreateBackorderButton) {
            // Disable the "Transfer" button
            CreateBackorderButton.disabled = true;
            CreateBackorderButton.style.backgroundColor = "gray"; // Optional: Change style to show it's disabled
            CreateBackorderButton.style.cursor = "not-allowed"; // Optional: Change cursor to indicate it's disabled
        }
    };

    // Function to disable the "Put in Pack" button
    const disablPutInPackButton = () => {
        const CreatePutInPackButton = Array.from(
            document.querySelectorAll('[name="action_put_in_pack"]')
        ).find((button) => button.textContent.trim() === "Put in Pack");

        if (CreatePutInPackButton) {
            // Disable the "Transfer" button
            CreatePutInPackButton.disabled = true;
            CreatePutInPackButton.style.backgroundColor = "gray"; // Optional: Change style to show it's disabled
            CreatePutInPackButton.style.cursor = "not-allowed"; // Optional: Change cursor to indicate it's disabled
        }
    };

    // Function to highlight the Quantity label if quantity is greater than 1
    const highlightQuantity = () => {
        const quantityInput = document.querySelector("#product_qty");
        const quantityLabel = document.querySelector('label[for="product_qty"]');

        if (!quantityInput || !quantityLabel) {
            return; // Exit if the element is not found
        }

        const quantity = parseFloat(quantityInput.value);

        // Apply red background and black text color to the label if quantity is greater than 1
        if (quantity > 1.0) {
            quantityLabel.style.backgroundColor = "red";
            quantityLabel.style.color = "black";
            quantityLabel.style.fontWeight = "bold"; // Optional: makes the text bold
        } else {
            // Remove any previous styling if quantity is 1 or less
            quantityLabel.style.backgroundColor = "";
            quantityLabel.style.color = "";
            quantityLabel.style.fontWeight = "";
        }
    };

    // Function to wait for the quantity input and label to appear
    const waitForQuantityInput = () => {
        const observer = new MutationObserver((mutationsList, observer) => {
            const quantityInput = document.querySelector("#product_qty");
            const quantityLabel = document.querySelector('label[for="product_qty"]');

            if (quantityInput && quantityLabel) {
                highlightQuantity(); // Highlight as soon as they appear
                // Add an event listener for input changes
                quantityInput.addEventListener("input", highlightQuantity);
                observer.disconnect(); // Stop observing once it's found and processed
            }
        });

        // Observe the body of the document for any changes in child nodes
        observer.observe(document.body, {
            childList: true, // Watch for added or removed child nodes
            subtree: true, // Also observe descendants
        });
    };

    // New function to highlight the "From Location" label if certain keywords are found in the span
    const highlightFromLocation = () => {
        const spanElement = document.querySelector(
            '[name="to_product_short_name"] span'
        );

        if (spanElement) {
            const spanText = spanElement.textContent.trim().toLowerCase();
            // List of keywords to look for in the span text
            const keywords = [
                "return new",
                "grade a",
                "grade b",
                "grade c",
                "grade f",
            ];

            // Check if any of the keywords are found in the span text
            const isKeywordPresent = keywords.some((keyword) =>
                                                   spanText.includes(keyword)
                                                  );

            if (isKeywordPresent) {
                const fromLocationLabel = document.querySelector(
                    'label[for="from_location_id"]'
                );
                if (fromLocationLabel) {
                    fromLocationLabel.style.backgroundColor = "red";
                    fromLocationLabel.style.color = "black";
                    fromLocationLabel.style.fontWeight = "bold"; // Optional: makes the text bold
                }
            }
        }
    };

    const highlightqty = async () => {
        const rows = document.querySelectorAll(".o_data_row");

        let prebuildModels = [];
        await $.ajax({
            url: "https://raw.githubusercontent.com/Tech-doglas/OdooAvoidErrorForTech/refs/heads/main/Prebuild.txt",
            type: "GET",
            cache: false,
            success: function (response) {
                prebuildModels = response.split('\n').map(model => model.trim());
            },
            error: function (xhr) {
                alert(`Error: ${xhr.responseJSON.error}`);
            },
        });

        if (rows) {
            rows.forEach((row) => {
                // Get the quantity cell
                const qtyCell = row.querySelector('[name="product_qty"]');


                const NameCell = row.querySelector('[name="to_product_short_name"]');

                const FromCell = row.querySelector('[name="from_product_short_name"]');


                if (NameCell) {
                    if (
                        NameCell.textContent.includes("15S-FQ0008NIA") ||
                        NameCell.textContent.includes("250 G9") ||
                        NameCell.textContent.includes("83A100QURM")
                    ) {


                        NameCell.style.backgroundColor = "Yellow";
                        NameCell.style.color = "black";
                        NameCell.style.fontWeight = "bold"; // Optional: makes the text b
                    }

                }
                if (NameCell && FromCell) {
                    compareLastWords(NameCell.textContent, FromCell.textContent, FromCell.style);
                }
                //Pre-Build
                if (FromCell) {
                    if (
                        FromCell.textContent.includes(" ") && prebuildModels.includes(NameCell.textContent)
                    ) {

                        FromCell.innerHTML = "Pre-Build";
                        FromCell.style.backgroundColor = "Green";
                        FromCell.style.color = "White";
                        FromCell.style.fontWeight = "bold"; // Optional: makes the text b
                    }

                }

                if (qtyCell) {
                    // Check if the quantity is greater than 1
                    if (parseFloat(qtyCell.textContent) > 1.0) {
                        qtyCell.style.backgroundColor = "red";
                        qtyCell.style.color = "black";
                        qtyCell.style.fontWeight = "bold"; // Optional: makes the text bold
                    }
                }

            });
        }
    };
    //change Ram only
    function compareLastWords(str1, str2, style) {
        const arr1 = str1.split(" ");
        const arr2 = str2.split(" ");

        const lastWord1 = arr1[arr1.length - 1];
        const lastWord2 = arr2[arr2.length - 1];
        if (lastWord1 !== null && lastWord2 !== ''){
            if (lastWord1 === lastWord2) {
                style.backgroundColor = "pink";
                style.fontWeight = "bold";
                style.color = "black";
            }
        }
    }
    //change Ram only end

    function CreateButton(printButton) {
        // Find the container that holds the "Action" button
        const actionMenu = document.querySelector(".o_cp_action_menus");
        if (actionMenu) {
            // Prepend the Print Label button to the container, so it appears before the Action button
            actionMenu.insertBefore(printButton, actionMenu.firstChild); // This will put the button on the left
        }

    }

    const PrintLabelButton = () => {
        // Check if the button is already added to prevent duplicates
        if (!document.querySelector("#print-label-button")) {
            // Create the button
            const printButton = document.createElement("button");
            printButton.id = "print-label-button"; // Assign an ID for later reference
            printButton.textContent = "Print Label";

            // Style the button to make it look similar to the Action button
            printButton.style.fontSize = "14px"; // Match the font size of the Action button
            printButton.style.padding = "10px 15px"; // Adjust padding to match the Action button
            printButton.style.marginRight = "10px"; // Space between Print Label and Action button
            printButton.style.backgroundColor = "#007bff"; // Button background color (blue)
            printButton.style.color = "white";
            printButton.style.border = "1px solid #007bff"; // Border color similar to Action button
            printButton.style.borderRadius = "5px"; // Rounded corners
            printButton.style.cursor = "pointer";

            // Event listener for the button's click action
            printButton.addEventListener("click", printVerifyPopupWindow);
            CreateButton(printButton)
        }
    };

    const getPrintLabelData = () => {
        const spanElement = document.querySelector(
            '[name="to_product_short_name"] span'
        );
        const inputElement = document.querySelector("#to_product_id");
        const inputElement1 = document.querySelector("#order_number");

        let UPC, Model, ram, ssd, originModel, orderNumber;

        if (spanElement && inputElement && inputElement1) {
            const ShortName = spanElement.textContent.trim();
            const regex = /\[([A-Z]+[0-9]+[A-Z]*)\]/; // case-insensitive matching
            const match = inputElement.value.toUpperCase().match(regex);
            UPC = match ? match[1] : ""; // Ensure UPC is extracted correctly
            orderNumber = inputElement1.value.toUpperCase().trim();

            const ComputerMatch = ShortName.match(
                /^(.*?)\b(\d+GB \d+(?:TB|GB))\b(.*)$/
            );

            if (ComputerMatch) {
                Model = ComputerMatch[1]
                    .replace(/\bReturn\b/gi, "")
                    .trim();
                // Return Word is showing
                originModel = Model
                if (ComputerMatch[3]) {
                    const lowercaseModelname = ComputerMatch[3]
                    .trim()
                    .toLowerCase();

                    let abbreviation = ""; // Default fallback

                    Object.keys(ReturnCondition).forEach((key) => {
                        if (lowercaseModelname.includes(key)) {
                            abbreviation = ReturnCondition[key];
                        }
                    });

                    if (abbreviation) {
                        Model += ` ${abbreviation}`;
                    }
                }
                const temp_spec = ComputerMatch[2].trim().split(" ");
                ram = temp_spec[0];
                ssd = temp_spec[1];
            }
        }

        return {UPC, Model, ram, ssd, originModel, orderNumber};
    };

    const printVerifyPopupWindow = () => {
        if (!document.querySelector("#verify-popup")) {
            const popup = document.createElement("div");
            popup.id = "verify-popup";
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
            popup.addEventListener("click", () => {
                popup.style.display = "none";
            });

            const content = document.createElement("div");
            content.style.backgroundColor = "#fff";
            content.style.padding = "20px";
            content.style.borderRadius = "10px";
            content.style.textAlign = "center";
            content.addEventListener("click", (e) => {
                e.stopPropagation();
            });

            const title = document.createElement("h2");
            title.textContent = "Scan Laptop UPC to Print Label";
            title.style.color = "#000";
            content.appendChild(title);

            const upcInput = document.createElement("input");
            upcInput.id = "upc-input";
            upcInput.style.padding = "10px";
            upcInput.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.keyCode === 13) {
                    const {UPC, Model, ram, ssd, originModel, orderNumber} = getPrintLabelData();
                    console.log({UPC, Model, ram, ssd, originModel, orderNumber})
                    const targetUPC = e.target.value.trim().toUpperCase();
                    upcInput.value = "";
                    if (targetUPC == "420PASSMORE") {
                        popup.style.display = "none";
                        printLabel(UPC, Model, ram, ssd, originModel, orderNumber);
                    } else if (targetUPC == "NEW"){
                        window.open("https://192.168.50.240:8080/newLaptopUpc", "_blank");
                    }
                    else {
                        const formData = `model=${originModel}&upc=${targetUPC}`
                    $.ajax({
                        url: "https://192.168.50.240:8080/VerifyUPC",
                        type: "POST",
                        data: formData,
                        success: function (response) {
                            switch (response.code) {
                                case 200:
                                    popup.style.display = "none";
                                    printLabel(UPC, Model, ram, ssd, originModel, orderNumber);
                                    break;
                                case 404:
                                    window.open("https://192.168.50.240:8080/newLaptopUpc", "_blank")
                                default:
                                    alert(`Error: ${response.message}`);
                                    upcInput.focus();
                                    break;
                            }
                        },
                        error: function (xhr) {
                            alert(`Error: ${xhr.responseJSON.error}`);
                        },
                    });
                    }
                }
            });
            content.appendChild(upcInput);

            popup.appendChild(content);
            document.body.appendChild(popup);

            upcInput.focus();
        } else {
            const popup = document.querySelector("#verify-popup");
            popup.style.display = "flex";

            const upcInput = document.querySelector("#upc-input");
            upcInput.value = "";

            upcInput.focus();
        }
    };

    const printLabel = (UPC, Model, ram, ssd, originModel, orderNumber) => {
        console.log("Print Label button clicked");

        let img_array = []
        renderOrderNumberLabel(orderNumber);
        img_array.push(canvas.toDataURL("image/png"));
        renderLabel(Model, `${ram}+${ssd}`, UPC);
        img_array.push(canvas.toDataURL("image/png"));

        const formData = `text_files=${originModel}.txt&ssd=${ssd}&ram=${ram}`

        // Make the AJAX call first to get the image URLs
        $.ajax({
            url: "https://192.168.50.240:8080/generate-image", // For real
            //  url: "http://127.0.0.1:5000/generate-image", // For Testing
            type: "POST",
            data: formData,
            success: function (response) {
                let img_URL = [];
                response.image_urls.forEach((url) => {
                    console.log(url)
                    img_URL.push("https://192.168.50.240:8080/" + url) // For real
                    //  img_URL.push("http://127.0.0.1:5000/" + url) // For Testing
                });

                for (let index = 0; index < img_URL.length; index++) {
                    const img = new Image();
                    img.src = img_URL[index];
                    img_array.push(img.src)

                    img.onload = function () {
                        // Once the image is loaded, create the canvas and render the image
                        const canvas = document.createElement("canvas");
                        const ctx = canvas.getContext("2d");

                        // Set canvas size based on image
                        canvas.width = img.width;
                        canvas.height = img.height;

                        // Draw the image on the canvas
                        ctx.drawImage(img, 0, 0);

                        // Now proceed with the rest of the logic (like rendering the label)
                        // renderLabel(canvas);
                    };

                }
                createFrame(img_array)
            },
            error: function (xhr) {
                alert(`Error: ${xhr.responseJSON.error}`);
            },
        });

    };

    function LabelCreateButton() {
        if (!document.querySelector("#edit-label-button")) {
            const printButton = document.createElement("button");
            printButton.id = "edit-label-button"; // Assign an ID for later reference
            printButton.textContent = "Edit/Create Label";

            // Style the button to make it look similar to the Action button
            printButton.style.fontSize = "14px"; // Match the font size of the Action button
            printButton.style.padding = "10px 15px"; // Adjust padding to match the Action button
            printButton.style.marginRight = "10px"; // Space between Print Label and Action button
            printButton.style.backgroundColor = "#11ff00"; // Button background color (green)
            printButton.style.color = "black";
            printButton.style.border = "1px solid #11ff00"; // Border color similar to Action button
            printButton.style.borderRadius = "5px"; // Rounded corners
            printButton.style.cursor = "pointer";

            printButton.addEventListener("click", function() {
                window.open("https://192.168.50.240:8080/", "_blank"); //server side
                // window.open("http://localhost:5000", "_blank"); // Testing
            });

            CreateButton(printButton)
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
        PrintLabelButton();
        LabelCreateButton();
    };

    // Wait for the page to load initially and then run the functions
    window.addEventListener("load", function () {
        resetFunctionality(); // Call reset functionality each time page is loaded

        // Optionally, start observing for changes in the quantity field after it's loaded
        const quantityInput = document.querySelector("#product_qty");
        const quantityLabel = document.querySelector('label[for="product_qty"]');

        if (quantityInput && quantityLabel) {
            highlightQuantity(); // Initially highlight if already available
            quantityInput.addEventListener("input", highlightQuantity); // Event listener for future input changes
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
