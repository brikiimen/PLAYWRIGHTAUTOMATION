//save session storage using Playwright and inject into new Browser context

const {test,expect}=require("@playwright/test")
let webContext
//Login UI ->json
test.beforeAll(async({browser})=>{
    const context=await browser.newContext()
    const page=await context.newPage()
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    await page.locator("#userEmail").fill("imenbrikitest@gmail.com")
    await page.locator("#userPassword").fill("testQA@123")
    await page.locator("[value='Login']").click()
    await page.waitForLoadState('networkidle')
    await context.storageState({path:'state.json'})
    webContext=await browser.newContext({storageState:'state.json'})


})

test('get product Titles',async()=>{
    const page=await webContext.newPage()
    const productName="ZARA COAT 3"
    const cardTitles=page.locator(".card-body b")
    const products=page.locator(".card-body")
    await page.goto("https://rahulshettyacademy.com/client/")
    await page.waitForLoadState('networkidle')
    const allTitles=await cardTitles.allTextContents()
    console.log(allTitles)
   

})

test('Client App',async ()=>{

    const page=await webContext.newPage()
    const productName="ZARA COAT 3"
    const cardTitles=page.locator(".card-body b")
    const products=page.locator(".card-body")
    await page.goto("https://rahulshettyacademy.com/client/")
    const count=await products.count()
    //add product 
    for(let i=0;i<count;i++){
        if(await products.nth(i).locator("b").textContent()===productName){
            //add to the card
            await products.nth(i).locator("text= Add To Cart").click()
            break
        }

    }

    //verify order adding in the cart
    //verify product is adding in the card 
    await page.locator("[routerlink*='cart']").click()
    await page.locator("div li").first().waitFor()
    const bool=page.locator("h3:has-text('ZARA COAT 3')").isVisible() 
    await expect(bool).toBeTruthy()
    
})