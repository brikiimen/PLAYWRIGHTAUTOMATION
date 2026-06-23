const {test,expect,request}=require('@playwright/test')
const {APIUtils}=require('./utils/APIUtils')

const loginPayload={userEmail: "imenbrikitest@gmail.com", userPassword: "testQA@123"}
const orderPayload={orders: [{country: "Tunisia", productOrderedId: "6960eac0c941646b7a8b3e68"}]}
const fakePayloadOrders={data:[],message:"No Orders"}
let response




test.beforeAll(async ()=>{
    //login with api 
    const apiContext=await request.newContext()
    const apiUtils=new APIUtils(apiContext,loginPayload)

    //Order with api
    response=await apiUtils.createOrder(orderPayload)
   

})


// Order page empty – using fake data

test('Place the order',async ({page})=>{

    //inject token into local storage 
    page.addInitScript(value=>{
        window.localStorage.setItem('token',value)
    },response.token)


    const productName="ZARA COAT 3"
    const cardTitles=page.locator(".card-body b")
    const products=page.locator(".card-body")
    await page.goto("https://rahulshettyacademy.com/client/")

    await page.route("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*",//regular expression to generalize and not put id (*)
        async route=>{
            //intercepting response - APi response->/fake response/browser->render data on frontend
            const response=await page.request.fetch(route.request())
            let body=JSON.stringify(fakePayloadOrders)
            route.fulfill(
                {
                    response,
                    body
                }
            )

        }
    )

    
    await page.locator("button[routerlink*='myorders']").click()
    await page.waitForResponse("https://rahulshettyacademy.com/api/ecom/order/get-orders-for-customer/*")
    console.log(await page.locator(".mt-4").textContent())



})