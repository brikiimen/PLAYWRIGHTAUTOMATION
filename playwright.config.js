
import { defineConfig, devices } from '@playwright/test';




/**
 * @see https://playwright.dev/docs/test-configuration
 */
const config=({
  testDir:'./tests',
  timeout:4*10000,
  expect:{
    timeout:5000,
  },
  reporter:'html',
  use:{
    browserName :"chromium",
    headless :false,
    screenshot :'retain-on-failure',
    trace :'retain-on-failure'

  },
  
});

module.exports=config

