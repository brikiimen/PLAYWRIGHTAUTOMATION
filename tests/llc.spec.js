const {test,expect}=require("@playwright/test")

test('Playwright Special locators', async({page})=>{
    //How to use playwright locators
    await page.goto("https://rahulshettyacademy.com/angularpractice/")
    await page.getByLabel("Check me out if you Love IceCreams!").click()
    await page.getByLabel("Student").check()
    await page.getByLabel("Gender").selectOption("Female")
    await page.getByPlaceholder("Password").fill("test@123")
    await page.getByRole("button",{name:'Submit'})
    await page.getByText("Success! The Form has been submitted successfully!.")
    await page.getByRole("link",{name:"Shop"}).click()
    await page.locator("app-card").filter({hasText:'Nokia Edge'}).getByRole("button").click()

})

