const {test,expect}=require("@playwright/test")

test('Client App',async ({page})=>{
    const email="imenbrikitest@gmail.com"
    const productName="ZARA COAT 3"
    const cardTitles=page.locator(".card-body b")
    const products=page.locator(".card-body")
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    await page.locator("#userEmail").fill(email)
    await page.locator("#userPassword").fill("testQA@123")
    await page.locator("[value='Login']").click()

    //get cards titile 
    //Method 1:  await page.waitForLoadState('networkidle') => may be flaky 
    //Method 2: wait for elt 
    await cardTitles.first().waitFor()
    const allTitles=await cardTitles.allTextContents()
    console.log(allTitles)  
    const count=await products.count()
    console.log(count)
    //search for a specific product
    for(let i=0;i<count;i++){
        if(await products.nth(i).locator("b").textContent()===productName){
            //add to the card
            await products.nth(i).locator("text= Add To Cart").click()
            break
        }

    }
    //verify product is adding in the card 
    await page.locator("[routerlink*='cart']").click()
    await page.locator("div li").first().waitFor()
    const bool=page.locator("h3:has-text('ZARA COAT 3')").isVisible() 
    await expect(bool).toBeTruthy()
    await page.locator("text=Checkout").click()
    await page.locator("[placeholder*='Country']").pressSequentially("tu",{delay:100})
    const dropdown=page.locator(".ta-results")
    await dropdown.waitFor()
    const OptionCount=await dropdown.locator("button").count()
    for(let i=0;i<OptionCount;i++){
        const text=await dropdown.locator("button").nth(i).textContent()
        if(text===" Tunisia"){
            await dropdown.locator("button").nth(i).click()
            break
        }
    }

    
    await expect(page.locator('.user__name [type="text"]').first()).toHaveText(email)

    //Fill information
    //Expiry Date 
    await page.locator("select").first().selectOption("02")
    await page.locator("select").last().selectOption("29")
    //CVV Code
    await page.locator("div .field .input.txt").nth(1).fill("578")
    //Name on Card
    await page.locator("div .field .input.txt").nth(2).fill("Imen")
    //Coupon
    await page.locator("[name='coupon']").fill("rahulshettyacademy")
    await page.locator(".btn-primary ").click()
    await expect(page.locator(".mt-1.ng-star-inserted")).toHaveText("* Coupon Applied")

    await page.locator(".action__submit").click()
    await expect(page.locator(".hero-primary")).toHaveText(" Thankyou for the order. ")
    const orderId=await page.locator(".em-spacer-1 .ng-star-inserted").textContent()
    console.log(orderId)

    //Go to order page 
    await page.locator("button[routerlink*='myorders']").click()
    await page.locator("tbody").waitFor()
    const rows=page.locator("tbody tr")
    for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (orderId.includes(rowOrderId)) {
        await rows.nth(i).locator("button").first().click()
        break
      }
   }
   const orderIdDetails = await page.locator(".col-text").textContent()
   expect(orderId.includes(orderIdDetails)).toBeTruthy()



})