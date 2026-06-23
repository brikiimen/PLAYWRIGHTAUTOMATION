const{test,expect}=require('@playwright/test')
const { assert } = require('node:console')

//Assignment: Refund Eligibility Check

async function loginAndGoToBooking({page}){
    await page.goto('https://eventhub.rahulshettyacademy.com/login')
    await page.getByPlaceholder('you@email.com').fill('imen@gmail.com')
    await page.getByLabel('Password').fill('testQA@123')
    await page.locator('#login-btn').click()
    await expect(page.getByText('Browse Events →')).toBeVisible()

}

test.only('Single ticket booking is eligible for refund',async ({page})=>{
    //Step 1 — Login
    await loginAndGoToBooking({page})

    //Step 2 — Book first event with 1 ticket (default)
    await page.locator("[data-testid='nav-events']").first().click()
    await page.locator('[data-testid="event-card"]').first().locator('[data-testid="book-now-btn"]').click()
    await page.getByLabel('Full Name').fill('Imen Briki')
    await page.locator('#customer-email').fill('imen@gmail.com')
    await page.getByPlaceholder('+91 98765 43210').fill('+919876543218')
    await page.locator('.confirm-booking-btn').click()

    //Step 3 — Navigate to booking detail
    await page.locator('a[data-testid="nav-bookings"]').click()
    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/bookings')
    await page.locator('[data-testid="booking-card"]').first().getByRole("button",{name:'View Details'}).click()
    await expect(page.getByText('Booking Information')).toBeVisible()

    //Step 4 — Validate booking ref
    const ref=await page.locator('span.bg-indigo-50').textContent()
    const eventTitle=await page.locator('h1').textContent()
    await expect(ref[0]).toBe(eventTitle[0])

    //Step 5 — Check refund eligibility
    await page.getByRole("button",{name:'Check eligibility for refund?'}).click()
    const spinner=page.locator("#refund-spinner")
    await expect(spinner).toBeVisible()
    await page.waitForTimeout(6000)
    expect(await spinner.isVisible()).toBeFalsy()

    //Step 6 — Validate result
    const result=page.locator('#refund-result')
    await expect(result).toBeVisible()
    await expect(result).toContainText('Eligible for refund')
    await expect(result).toContainText('Single-ticket bookings qualify for a full refund')




})


test.only('Group ticket booking is NOT eligible for refund',async ({page})=>{
    //Step 1 — Login
    await loginAndGoToBooking({page})

    //Step 2 — Book first event with 3 ticket 
    await page.locator("[data-testid='nav-events']").first().click()
    await page.locator('[data-testid="event-card"]').first().locator('[data-testid="book-now-btn"]').click()
    await page.getByLabel('Full Name').fill('Imen Briki')
    await page.locator('#customer-email').fill('imen@gmail.com')
    await page.getByPlaceholder('+91 98765 43210').fill('+919876543218')
    await page.locator('button:has-text("+")').click()
    await page.locator('button:has-text("+")').click()
    await page.locator('.confirm-booking-btn').click()

    //Step 3 — Navigate to booking detail
    await page.locator('a[data-testid="nav-bookings"]').click()
    await expect(page).toHaveURL('https://eventhub.rahulshettyacademy.com/bookings')
    await page.locator('[data-testid="booking-card"]').first().getByRole("button",{name:'View Details'}).click()
    await expect(page.getByText('Booking Information')).toBeVisible()

    //Step 4 — Validate booking ref
    const ref=await page.locator('span.bg-indigo-50').textContent()
    const eventTitle=await page.locator('h1').textContent()
    await expect(ref[0]).toBe(eventTitle[0])

    //Step 5 — Check refund eligibility
    await page.getByRole("button",{name:'Check eligibility for refund?'}).click()
    const spinner=page.locator("#refund-spinner")
    await expect(spinner).toBeVisible()
    await page.waitForTimeout(6000)
    expect(await spinner.isVisible()).toBeFalsy()

    //Step 6 — Validate result
    const result=page.locator('#refund-result')
    await expect(result).toBeVisible()
    await expect(result).toContainText('Not eligible for refund')
    await expect(result).toContainText('Group bookings (3 tickets) are non-refundable')





})