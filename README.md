Intelligent Registration System - README

Contents
--------
- index.html
- styles.css
- script.js
- selenium_automation.py
- requirements.txt
- sample screenshots: error-state.png, success-state.png

How to open the web page
------------------------
1. Unzip the project folder.
2. Open index.html in your browser (double-click or open as file:// path).

Client-side features implemented
-------------------------------
- Responsive UI with modern card layout.
- Required fields: First Name, Last Name, Email, Phone, Gender, Terms.
- Inline and top error messages.
- Email validation with disposable domain blocking.
- Phone validation: must be in E.164 format (starts with + and digits) and matches selected country code when country chosen.
- Dynamic Country → State → City dropdowns (data for India, United States, Canada).
- Password strength meter (Weak / Medium / Strong).
- Submit button disabled until validations pass.
- On successful submission: success alert and form reset.

Automation testing (Selenium)
-----------------------------
Prerequisites:
- Python 3.8+
- Chrome browser installed (or edit script to use other driver)
- pip install -r requirements.txt

Run the automation script:
- From the project root run:
    python selenium_automation.py

What the script does:
- Flow A (Negative): fills form but skips Last Name, asserts inline error, captures error-state.png
- Flow B (Positive): fills all required fields, submits, asserts success message, captures success-state.png
- Flow C (Form Logic): tests dynamic country/state/city updates, password strength, wrong confirm password

Notes and limitations
---------------------
- The Selenium script uses webdriver-manager to download ChromeDriver automatically.
- If you prefer Cypress or Playwright, you can port the interactions; the site exposes helper functions under window.__testHelpers for easier automation.
- Video recording is not included; you can record your screen using any screen recorder while running the automation locally.

If you want I can also provide a Cypress version of the automation or a Playwright script.
