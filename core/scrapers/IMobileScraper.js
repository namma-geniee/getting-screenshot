'use strict';

const AbstractScraper = require('./AbstractScraper');

const URL_DASHBOARD   = 'https://sppartner.i-mobile.co.jp/claim_history.aspx';
const SELECTOR_LOGOUT = 'a[href="/logout.aspx?logout=1"]';

class IMobileScraper extends AbstractScraper {
  async login () {
    const page                   = this.page;
    const { username, password } = this.scrapingTask.credentials;

    await page.goto(URL_DASHBOARD);

    // Enter username
    await page.focus('#ctl00_ContentPlaceHolder2_Login1_UserName');
    await page.type(username);
    // Enter password
    await page.focus('#ctl00_ContentPlaceHolder2_Login1_Password');
    await page.type(password);
    // Submit the form & wait til' the new page is fully loaded
    await page.click('#ctl00_ContentPlaceHolder2_Login1_LoginButton');
    await page.waitForNavigation();

    // Check if authenticated by checking
    // whether the logout link is present
    return await page.$(SELECTOR_LOGOUT) !== null
  }

  async getRevenue () {
    const { scheduleTime } = this.scrapingTask;
    const year             = scheduleTime.getFullYear();
    const month            = scheduleTime.getMonth() + 1;

    const revenue = await this.page.evaluate(
      function (year, month) {
        const needle = `${year}年${month}月`;

        const dateTimeTd = $(`td.Column_Date:contains(${needle})`);
        const row        = dateTimeTd.parent();
        const revenueTd  = row.find('td.Column_Budget');
        const revenue    = revenueTd.text();

        return revenue
      },
      year, month
    );

    return this.extractMoney(revenue)
  }
}

module.exports = IMobileScraper;
