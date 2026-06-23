const{test,expect}=require('@playwright/test')

test('Popup validations',async({page})=>{
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/')
    //Navigation
    // await page.goto('https://google.com')
    // await page.goBack()
    // await page.goForward()
    await expect(page.locator('#displayed-text')).toBeVisible()
    await page.locator('#hide-textbox').click()
    await expect(page.locator('#displayed-text')).toBeHidden()
    
    //Dialog 
    page.on('dialog',dialog=>dialog.accept()) //.dismiss()
    await page.locator('#confirmbtn').click()

    //Hover
    await page.locator('#mousehover').hover()

    //Frames
    const framePage=page.frameLocator("#courses-iframe")
    await framePage.locator('li a[href*="lifetime-access"]:visible').click()
    const textCheck=await framePage.locator(".text h2").textContent()
    console.log(textCheck.split(" ")[1])



})

test("Screenshot & Visual comparision",async({page})=>{
    await page.goto('https://rahulshettyacademy.com/AutomationPractice/')
    await expect(page.locator('#displayed-text')).toBeVisible()
    await page.locator('#displayed-text').screenshot({path:'partialScreenshot.png'}) //screenshot for element
    await page.locator('#hide-textbox').click()
    await page.screenshot({path:'screenshot.png'}) //Screenshot for all page
    await expect(page.locator('#displayed-text')).toBeHidden()
    


})

test('visual',async({page})=>{
    await page.goto("https://flightaware.com/")
    expect(await page.screenshot()).toMatchSnapshot('landing.png')
})

test.only('visual matching',async({page})=>{
    await page.goto("https://google.com/")
    expect(await page.screenshot()).toMatchSnapshot('landing.png')
})