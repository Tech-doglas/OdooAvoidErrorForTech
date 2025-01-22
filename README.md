# Enhance Function in odoo for Tech

## Description

This UserScript is designed to enhance the user experience on Odoo pages by automatically performing the following actions:

- Highlighting company names on the page.
- Dynamically disabling certain buttons such as "Transfer", "Create Backorder", and "Put in Pack".
- Highlighting the quantity label when the quantity is greater than 1.
- Highlighting the "From Location" label based on specific keywords.
- Providing a pop-up window where users can select their name, which disables specific buttons upon selection.

## Features

- **Company Name Highlighting:** Highlights the company name in the top bar if it matches a specific format (e.g., contains "Inc.").
- **Button Disabling:** Disables various buttons such as "Transfer", "Create Backorder", and "Put in Pack" to prevent further actions when not needed.
- **Quantity Label Highlighting:** If the quantity is greater than 1, the label for the quantity input field will be highlighted with a red background and bold text.
- **From Location Highlighting:** If certain keywords (like "grade A", "grade B", etc.) are found in the "From Location" span, the associated label is highlighted.
- **User Identification:** A pop-up window allows users to select their name, which will then trigger certain actions like disabling buttons and applying specific changes.
  
## Installation

1. Install the [Tampermonkey extension](https://www.tampermonkey.net/) for your browser.
2. Create a new script in Tampermonkey and paste the entire code from this file into the script editor.
3. Save the script, and the script will automatically run on Odoo pages (`https://*.odoo.com/*`).

## How It Works

### Button Disabling:
- Upon selecting a name from the pop-up window, specific buttons (other than those for "Inventory" and "Manufacturing") will be disabled.
- The script checks if a name has been selected in `sessionStorage`. If true, it disables buttons on the page.

### Highlighting:
- **Company Name:** The script checks if the company name matches a specific format (such as containing "Inc.") and highlights it if necessary.
- **Quantity:** The quantity label is highlighted in red if the quantity is greater than 1. The script listens for changes in the quantity input and re-applies the highlight as needed.
- **From Location:** If the text in the "From Location" span contains certain keywords, the associated label will be highlighted.
  
### Observers:
- The script uses MutationObservers to track changes to the DOM and dynamically apply the necessary actions like disabling buttons and highlighting elements when the page content changes or loads.

## Script Behavior

- On page load, the script automatically triggers the actions like highlighting company names, disabling buttons, and checking quantities.
- The script also checks for changes on the page using `MutationObserver` to ensure that the necessary elements are processed correctly as the page is interacted with.

## Usage

1. Upon visiting an Odoo page, a pop-up will appear asking "Who Are You?" where users can select their name.
2. Once a name is selected, the buttons for the selected user are disabled, and the interface is updated accordingly.
3. The quantity label will dynamically change when the quantity is greater than 1, highlighting it with a red background and bold text.
4. The "From Location" label will also be highlighted based on the presence of specific keywords in the span.

## Compatibility

- This script is designed to run on Odoo's web pages (`https://*.odoo.com/*`) using the Tampermonkey extension.

## Notes

- **Pop-up Window:** The pop-up window provides a simple interface to select a user. It disappears once a user is selected.
- **Session Persistence:** The selected name is stored in `sessionStorage` to persist across page reloads.
- **Styling:** The script applies inline styles to the highlighted elements. You can modify the CSS as needed for different visual preferences.

## Author

- **Danny**

## License

- This script is free to use. Feel free to modify and adapt it for your needs.

## Changelog

- **0.12**: Initial version with all basic functionality working (highlighting, button disabling, user selection, etc.).

## To Do

| Task                                      | Description                                                                                | Status   |
|-------------------------------------------|---------------------------------------------------------------------------------------------|----------|
| **Add label printing on the product page**| Enable easy label printing for Assistant.                                                   | Ongoing 60%  |
| **Enhance the name selection function**   | Show the name selection popup only once, and disable apps after a name is chosen.           | Ongoing  |
| **odoo too porduct width**   |            | pending  |


