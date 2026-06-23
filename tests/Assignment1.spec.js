const{test,expect}=require('@playwright/test')

//Assignment: Full Booking Flow with Event Creation

test('booking for event',async ({page})=>{
    //Step 1 — Login
    await page.goto('https://eventhub.rahulshettyacademy.com/login')
    await page.getByPlaceholder('you@email.com').fill('imen@gmail.com')
    await page.getByLabel('Password').fill('testQA@123')
    await page.locator('#login-btn').click()
    await expect(page.getByText('Browse Events →')).toBeVisible()

    //Step 2 — Create a new event
    await page.getByRole("button",{name:'Admin'})
    await page.locator("a[href*='/admin/events']").first().click()
    const eventTitle = `Test Event ${Date.now()}`
    await page.locator('#event-title-input').fill(eventTitle)
    await page.locator('#admin-event-form textarea').fill('Join us for an exciting technology-focused event featuring keynote speakers, networking opportunities, and discussions about emerging innovations. This event is created as part of an automated testing workflow')
    await page.getByLabel('City').fill('Tunisia')
    await page.getByLabel('Venue').fill('Hotel')
    await page.getByLabel('Event Date & Time').fill('2026-07-08T20:00')
    await page.getByLabel('Price ($)').fill('100')
    await page.getByLabel('Total Seats').fill('50')
    await page.locator('#add-event-btn').click()
    await expect(page.getByText('Event created!')).toBeVisible()

    //Step 3 — Find the event card and capture seats
    await page.locator("[data-testid='nav-events']").first().click()
    const cards=page.locator('[data-testid="event-card"]')
    await expect(cards.first()).toBeVisible()
    const myCard=cards.filter({hasText:eventTitle})
    await expect(myCard).toBeVisible({timeout:5000})
    const seatsBeforeBooking= Number((await myCard.locator('span.text-emerald-600').textContent()).split(" ")[0])
    console.log(seatsBeforeBooking)

    //Step 4 — Start booking
    await myCard.locator('[data-testid="book-now-btn"]').click()

    //Step 5 — Fill booking form
    await expect(page.locator('#ticket-count')).toHaveText('1')
    await page.getByLabel('Full Name').fill('Imen Briki')
    await page.locator('#customer-email').fill('imen@gmail.com')
    await page.getByPlaceholder('+91 98765 43210').fill('+919876543218')
    await page.locator('.confirm-booking-btn').click()

    //Step 6 — Verify booking confirmation
    const reference=page.locator('.booking-ref').first()
    await expect(reference).toBeVisible()
    const bookingRef=(await reference.innerText()).trim()

    //Step 7 — Verify in My Bookings
    await page.locator('a[href="/bookings"]').first().click()
    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/bookings')
    const bookingcards=page.locator('#booking-card')
    await expect(bookingcards.first()).toBeVisible()
    const mybookingcard=await bookingcards.filter({hasText:bookingRef})
    await expect(mybookingcard).toBeVisible()
    await expect(mybookingcard).toContainText(eventTitle)

    //Step 8 — Verify seat reduction
    await page.locator("[data-testid='nav-events']").first().click()
    await page.waitForLoadState('networkidle')
    const updatedcards=page.locator('[data-testid="event-card"]')
    await expect(updatedcards.first()).toBeVisible()
    const card=updatedcards.filter({hasText:eventTitle})
    await expect(card).toBeVisible({timeout:5000})
    const seatsAfterBooking= Number((await card.locator('span.text-emerald-600').textContent()).split(" ")[0])
    console.log(seatsAfterBooking)
    await expect(seatsAfterBooking).toBe(seatsBeforeBooking-1)
    


})  
