const {test,expect}=require("@playwright/test")
//same test doing with playwright selectors
test('Client App',async ({page})=>{
    const email="imenbrikitest@gmail.com"
   
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    await page.getByPlaceholder("email@example.com").fill(email)
    await page.getByPlaceholder("enter your passsword").fill("testQA@123")
    await page.getByRole("button",{name:'Login'}).click()

  
    await page.locator(".card-body b").first().waitFor()
    await page.locator(".card-body").filter({hasText:"ZARA COAT 3"}).getByRole("button",{name:'Add To Cart'}).click()
    await page.getByRole("listitem").getByRole("button",{name:'Cart'}).click()
    

   await page.locator("div li").first().waitFor()
   await expect(page.getByText("ZARA COAT 3")).toBeVisible()
   await page.getByRole("button",{name:"Checkout"}).click()


    await page.getByPlaceholder('Country').pressSequentially("tu",{delay:100})
    await page.getByRole("button",{name:'Tunisia'}).click()
    
  
    await page.getByText("PLACE ORDER").click()
 
    await expect(page.getByText("Thankyou for the order.")).toBeVisible()

})