const {test, expect}=require('@playwright/test');
const { request } = require('node:http');


test('Browser Context Playwright test ',async ({browser})=>
{ 
   const context= await browser.newContext()
   const page = await context.newPage()

   //Intercepting network
   page.route('**/*.css',
      route=>route.abort() //stop css calls 
   )

   page.route('**/*.{jpg,png,jpeg}',
      route=>route.abort() //no img
   )

   //login
   const userName=page.locator('#username')
   const password=page.locator("[type='password']")
   const signin=page.locator('#signInBtn')
   const cardTitles=page.locator(".card-body a")

   //print all network calls
   page.on('request',request=>console.log(request.url()))
   page.on('response',response=>console.log(response.url(),response.status()))

   await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
   console.log(await page.title())
   //css selector
   await userName.fill("rahul2shettyacademy ")
   await password.fill("Learning@830$3mK2")
   await signin.click()
   //wait until this locator shown up page 
   console.log(await page.locator("[style*='block']").textContent())
   await expect(page.locator("[style*='block']")).toContainText('Incorrect')
   //clear the existing content - fill 
   await userName.fill("")
   await userName.fill("rahulshettyacademy")
   await signin.click()
   //title of product 
   console.log(await cardTitles.first().textContent())
   console.log(await cardTitles.nth(1).textContent())
   const allTitles=await cardTitles.allTextContents()
   console.log(allTitles)


});

test('Page Playwright test',async ({page})=>
{
   await page.goto("https://google.com")
   //get title - assertion
   console.log(await page.title())
   await expect(page).toHaveTitle("Google")




});


test('UI Controls',async ({page})=>{
   await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
   const userName=page.locator('#username')
   const password=page.locator("[type='password']")
   const signin=page.locator('#signInBtn')
   const documentLink=page.locator("[href*='documents-request']")
   //static dropdown
   const dropdown= page.locator('select.form-control')
   await dropdown.selectOption("teach")
   //radio button
   await page.locator(".radiotextsty").last().click()
   //Web based pop up 
   await page.locator("#okayBtn").click()
   //assertion
   console.log(await page.locator(".radiotextsty").last().isChecked())
   await expect(page.locator(".radiotextsty").last()).toBeChecked()
   //Checkboxe
   await page.locator('#terms').click()
   await expect(page.locator('#terms')).toBeChecked()
   await page.locator('#terms').uncheck()
   expect(await page.locator('#terms').isChecked()).toBeFalsy()
   //check the attribute value of the link 
   await expect(documentLink).toHaveAttribute("class","blinkingText")

})

test('Child windows hadl',async ({browser})=>{
   const context= await browser.newContext()
   const page=await context.newPage()
   await page.goto("https://rahulshettyacademy.com/loginpagePractise/")
   const documentLink=page.locator("[href*='documents-request']")

   const [newPage]=await Promise.all([
      context.waitForEvent('page'), //listen for any new page 
      documentLink.click()
   ]) //new page is opened 

   const text=await newPage.locator(".red").textContent()
   const arrayText=text.split("@")
   const domain=arrayText[1].split(" ")[0]
   await page.locator('#username').fill(domain)
   console.log(await page.locator('#username').inputValue())
   
})


