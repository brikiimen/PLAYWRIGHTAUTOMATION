//Assignment: Cross-User Booking Access Denied

const{test,expect,request}=require('@playwright/test')
const loginPayload={email: "imen@yahoo.com", password: "Imen@123"}

async function login(page){
    await page.goto('https://eventhub.rahulshettyacademy.com/login')
    await page.getByPlaceholder('you@email.com').fill('imen@gmail.com')
    await page.getByLabel('Password').fill('testQA@123')
    await page.locator('#login-btn').click()
    await expect(page.getByText('Browse Events →')).toBeVisible()
    
}

test('Cross-User Booking Access Denied',async({page})=>{
    //Step 1 — Login as Yahoo user via API 
    const apiContext=await request.newContext()
    const loginRes=await apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/auth/login",
        {
            data:loginPayload
        }
    )

    expect(await loginRes.ok()).toBeTruthy()
    const loginResJson=await loginRes.json()
    const token=await loginResJson.token
    console.log(token)

    //Step 2 — Fetch events via API to get a valid event ID
    const eventsRes=await apiContext.get("https://api.eventhub.rahulshettyacademy.com/api/events?limit=6",
        {
            headers:{
                'Authorization':`Bearer ${token}`,
                'Content-type':'application/json'
            }

        }
    )

    expect(await eventsRes.ok()).toBeTruthy()
    const eventsResJson=await eventsRes.json()
    const eventId=await eventsResJson.data[0].id
    console.log(eventId)

    //Step 3 — Create a booking via API as Yahoo user
    const bookingRes=await apiContext.post("https://api.eventhub.rahulshettyacademy.com/api/bookings",
        {
             headers:{
                'Authorization':`Bearer ${token}`,
                'Content-type':'application/json'
            },

            data:{
                eventId:eventId,
                customerName: "imen", 
                customerEmail: "imen@yahoo.com", 
                customerPhone: "+91964964964", 
                quantity: 1

            }

        }
    )

    expect(await bookingRes.ok()).toBeTruthy()
    const bookingResJson=await bookingRes.json()
    const yahooBookingId=bookingResJson.data.id
    console.log(yahooBookingId)

    //Step 4 — Login as Gmail user via browser UI
    await login(page)

    //Step 5 — Navigate to Yahoo's booking URL as Gmail user
    await page.goto("https://eventhub.rahulshettyacademy.com//bookings/${yahooBookingId}",{
        waitUntil: 'networkidle'
    })

    //Step 6 — Validate Access Denied
    const text=page.locator("div h2")
    await expect(text).toBeVisible()
    await expect(text).toContainText("Application error")
   




    
})