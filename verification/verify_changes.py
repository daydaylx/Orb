from playwright.sync_api import sync_playwright

def verify_app(page):
    page.goto("http://localhost:5173")
    page.wait_for_selector("canvas", timeout=10000)

    # Check if header is present
    page.wait_for_selector("h1:has-text('Orb Studio')")

    # Check Import panel
    page.click("button:has-text('Import')")
    page.wait_for_selector("h3:has-text('Import Config')")

    # Check Undo/Redo buttons
    page.wait_for_selector("button[title*='Undo']")
    page.wait_for_selector("button[title*='Redo']")

    # Take screenshot
    page.screenshot(path="verification/verification.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()
        try:
            verify_app(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()
