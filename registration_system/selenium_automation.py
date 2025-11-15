# Selenium automation script for the Registration System
# Requires: pip install selenium webdriver-manager
import os, time, sys
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

def open_page(driver, path):
    if path.startswith("http"):
        url = path
    else:
        url = "file://" + os.path.abspath(path)
    driver.get(url)
    print("URL:", driver.current_url)
    print("Title:", driver.title)
    return driver

def take_screenshot(driver, name):
    out = os.path.join(os.getcwd(), name)
    driver.save_screenshot(out)
    print("Saved screenshot", out)
    return out

def flow_negative(driver, path):
    open_page(driver, path)
    # Fill form but skip last name
    driver.find_element(By.ID, "firstName").send_keys("TestFirst")
    # lastName skipped
    driver.find_element(By.ID, "email").send_keys("tester@example.com")
    driver.find_element(By.ID, "phone").send_keys("+11234567890")
    driver.find_element(By.CSS_SELECTOR, "input[name='gender'][value='Male']").click()
    driver.find_element(By.ID, "country").send_keys("United States")
    time.sleep(0.5)
    driver.find_element(By.ID, "state").send_keys("California")
    driver.find_element(By.ID, "city").send_keys("San Francisco")
    driver.find_element(By.ID, "terms").click()
    # try submit
    driver.find_element(By.ID, "submitBtn").click()
    time.sleep(0.7)
    # expect error for missing last name
    err = driver.find_element(By.ID, "err-lastName").text
    print("Last name error text:", err)
    take_screenshot(driver, "error-state.png")

def flow_positive(driver, path):
    open_page(driver, path)
    # fill all valid fields
    driver.find_element(By.ID, "firstName").send_keys("TestFirst")
    driver.find_element(By.ID, "lastName").send_keys("TestLast")
    driver.find_element(By.ID, "email").send_keys("tester@validmail.com")
    driver.find_element(By.ID, "phone").send_keys("+11234567890")
    driver.find_element(By.CSS_SELECTOR, "input[name='gender'][value='Male']").click()
    driver.find_element(By.ID, "country").send_keys("United States")
    time.sleep(0.5)
    driver.find_element(By.ID, "state").send_keys("California")
    driver.find_element(By.ID, "city").send_keys("San Francisco")
    driver.find_element(By.ID, "password").send_keys("StrongP@ssw0rd")
    driver.find_element(By.ID, "confirmPassword").send_keys("StrongP@ssw0rd")
    driver.find_element(By.ID, "terms").click()
    time.sleep(0.5)
    # submit
    driver.find_element(By.ID, "submitBtn").click()
    time.sleep(1)
    # check success
    top = driver.execute_script("return document.getElementById('top-messages').innerText;")
    print("Top message:", top)
    take_screenshot(driver, "success-state.png")

def flow_logic(driver, path):
    open_page(driver, path)
    # change country and see states update
    sel_country = driver.find_element(By.ID, "country")
    sel_country.send_keys("India")
    time.sleep(0.3)
    # verify states contain Maharashtra
    states = driver.find_element(By.ID, "state").get_attribute('innerText')
    print("States:", states)
    # password strength check
    pw = driver.find_element(By.ID, "password")
    pw.send_keys("weak")
    meter = driver.find_element(By.ID, "password-strength-meter").get_attribute('value')
    print("Password meter value (weak):", meter)
    pw.clear()
    pw.send_keys("StrongP@ss1")
    time.sleep(0.2)
    meter2 = driver.find_element(By.ID, "password-strength-meter").get_attribute('value')
    print("Password meter value (stronger):", meter2)
    # wrong confirm password
    driver.find_element(By.ID, "confirmPassword").send_keys("different")
    driver.find_element(By.ID, "submitBtn").click()
    time.sleep(0.6)
    err = driver.find_element(By.ID, "err-confirmPassword").text
    print("Confirm password error:", err)

if __name__ == '__main__':
    # path to index.html (adjust if you move files)
    html_path = os.path.join(os.path.dirname(__file__), 'index.html')
    options = webdriver.ChromeOptions()
    options.add_argument("--start-maximized")
    # options.add_argument("--headless=new")  # uncomment to run headless
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    try:
        flow_negative(driver, html_path)
        flow_positive(driver, html_path)
        flow_logic(driver, html_path)
    finally:
        driver.quit()
