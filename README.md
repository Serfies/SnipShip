# SnipShip

SnipShip isn't just a Chrome extension; it's your personal data shuttle for the web. Select any text on a webpage, and with a single click, launch it into your n8n workflows. But that's just the beginning. SnipShip empowers you to manage multiple webhook services, ensuring your chosen snippets always land exactly where they need to be.

Fuel your AI-driven automations by seamlessly feeding them context from the web. And the best part? SnipShip brings the intelligence back, delivering output from your workflows directly to your browser. Transform how you interact with web content and supercharge your productivity.

## Features

*   **Text Selection & Sending:** Easily select text on any webpage and send it to a configured webhook.
*   **Multiple Webhook Management:** Add, edit, and delete multiple webhook configurations.
*   **n8n Integration:** Designed to seamlessly integrate with n8n workflows.
*   **AI Automation Fuel:** Provides context from the web to power your AI-driven automations.
*   **Workflow Output Display:** Receives and displays output from your n8n workflows directly in the extension popup.

## Installation

1.  **Clone the repository:**
    ```bash
    git clone [repository-url]
    ```
2.  **Open Chrome Extensions:**
    *   Open Chrome.
    *   Type `chrome://extensions` in the address bar and press Enter.
3.  **Enable Developer Mode:**
    *   Toggle on the "Developer mode" switch in the top right corner.
4.  **Load Unpacked:**
    *   Click the "Load unpacked" button.
    *   Navigate to the cloned `SnipShip` directory and select it.
5.  **Pin the Extension (Optional):**
    *   Click the puzzle piece icon (Extensions) in the Chrome toolbar.
    *   Click the pin icon next to "SnipShip" to make it easily accessible.

## Usage

1.  **Configure Webhooks:**
    *   Click the SnipShip extension icon in your Chrome toolbar.
    *   Click "Add Webhook" to set up your n8n webhook URL, API key (optional), and input/output field names.
    *   You can add multiple webhooks and select the active one from the dropdown.
2.  **Send Selected Text:**
    *   On any webpage, select the text you wish to send.
    *   Click the SnipShip extension icon.
    *   Click "Send Selected Text". The selected text will be sent to your currently selected webhook.
3.  **View Response:**
    *   The response from your n8n workflow will be displayed in the SnipShip popup.

## Development

### Project Structure

*   `popup.html`: The main HTML structure for the extension popup.
*   `popup.css`: Styles for the extension popup.
*   `popup.js`: JavaScript logic for handling webhook interactions, text selection, and UI updates.
*   `manifest.json`: The manifest file for the Chrome extension, defining its properties and permissions.
*   `icons/`: Contains extension icons of various sizes.
*   `LICENSE`: The license file for the project.

### Running Locally

After loading the extension as an unpacked extension (see Installation steps), you can make changes to the source code. To see your changes reflected:

1.  Go to `chrome://extensions`.
2.  Find the SnipShip extension.
3.  Click the refresh icon (circular arrow) on the extension card.

## License

```
MIT License

Copyright (c) 2025 Andre Serfontein

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
