const{test,expect}=require('@playwright/test')


test('security test request intercept',async({page})=>{
    //Login
    const email="imenbrikitest@gmail.com"
    const productName="ZARA COAT 3"
    const cardTitles=page.locator(".card-body b")
    const products=page.locator(".card-body")
    await page.goto("https://rahulshettyacademy.com/client/#/auth/login")
    await page.locator("#userEmail").fill(email)
    await page.locator("#userPassword").fill("testQA@123")
    await page.locator("[value='Login']").click()
    await page.locator("button[routerlink*='myorders']").click()
    await page.locator("tbody").waitFor()


    //Change url 
    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=*",
        route=>route.continue({url:'https://rahulshettyacademy.com/api/ecom/order/get-orders-details?id=4464187489741878787'})
    )
    await page.locator("button:has-text('View')").first().click()
    //you should see no result for no existing order
    await  expect(page.locator("p").last()).toHaveText("You are not authorize to view this order")



})