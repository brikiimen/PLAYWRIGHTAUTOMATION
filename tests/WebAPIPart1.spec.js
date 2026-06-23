const {test,expect,request}=require('@playwright/test')
const {APIUtils}=require('./utils/APIUtils')

const loginPayload={userEmail: "imenbrikitest@gmail.com", userPassword: "testQA@123"}
const orderPayload={orders: [{country: "Tunisia", productOrderedId: "6960eac0c941646b7a8b3e68"}]}

let response



test.beforeAll(async ()=>{
    //login with api 
    const apiContext=await request.newContext()
    const apiUtils=new APIUtils(apiContext,loginPayload)

    //Order with api
    response=await apiUtils.createOrder(orderPayload)
   

})



test('Place the order',async ({page})=>{

    //inject token into local storage 
    page.addInitScript(value=>{
        window.localStorage.setItem('token',value)
    },response.token)


    //Start from client page 
    const productName="ZARA COAT 3"
    const cardTitles=page.locator(".card-body b")
    const products=page.locator(".card-body")
    await page.goto("https://rahulshettyacademy.com/client/")

    //Create order is success
    await page.locator("button[routerlink*='myorders']").click()
    await page.locator("tbody").waitFor()
    const rows=page.locator("tbody tr")
    for (let i = 0; i < await rows.count(); ++i) {
      const rowOrderId = await rows.nth(i).locator("th").textContent();
      if (response.orderId.includes(rowOrderId)) {
        await rows.nth(i).locator("button").first().click()
        break
      }
   }
   const orderIdDetails = await page.locator(".col-text").textContent()
   expect(response.orderId.includes(orderIdDetails)).toBeTruthy()



})