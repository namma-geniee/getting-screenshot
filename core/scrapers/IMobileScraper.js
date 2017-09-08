'use strict';

const AbstractScraper = require('./AbstractScraper');

// This login URL will redirect to history page after success
const URL_LOGIN       = 'https://sppartner.i-mobile.co.jp/login.aspx?ReturnUrl=%2fclaim_history.aspx';
const SELECTOR_LOGOUT = 'a[href="/logout.aspx?logout=1"]';

class IMobileScraper extends AbstractScraper {

  async login () {
    const { page, logger }       = this;
    const { username, password } = this.scrapingTask.credentials;

    logger.info('Navigating to login page', URL_LOGIN);
    await page.goto(URL_LOGIN);
    logger.info('Login page entered');

    // Enter username
    await page.focus('#ctl00_ContentPlaceHolder2_Login1_UserName');
    await page.type(username);
    logger.info(`Username entered "${username}"`);
    // Enter password
    await page.focus('#ctl00_ContentPlaceHolder2_Login1_Password');
    await page.type(password);
    logger.info(`Password entered "${password}"`);
    // Submit the form & wait til' the new page is fully loaded
    await page.click('#ctl00_ContentPlaceHolder2_Login1_LoginButton');
    logger.info('Submit button clicked & waiting for navigation');
    await page.waitForNavigation();

    // Check if authenticated by checking
    // whether the logout link is present
    return await page.$(SELECTOR_LOGOUT) !== null
  }

  async getRevenue () {
    const { logger }       = this;
    const { scheduleTime } = this.scrapingTask;
    const year             = scheduleTime.getFullYear();
    const month            = scheduleTime.getMonth() + 1;
    const needle           = `${year}年${month}月`;

    logger.info(`Searching for needle "${needle}"`);
    const revenue = await this.page.evaluate(
      function (needle) {
        const dateTimeTd = $(`td.Column_Date:contains(${needle})`);
        const row        = dateTimeTd.parent();
        const revenueTd  = row.find('td.Column_Budget');

        if (!revenueTd.length) {
          return undefined;
        }

        return revenueTd.text().trim();
      },
      needle
    );

    if (!revenue) throw new Error('Revenue not found');

    return this.extractMoney(revenue)
  }

}

module.exports = IMobileScraper;
