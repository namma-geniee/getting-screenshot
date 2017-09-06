'use strict';

const moment           = require('moment');
const AdnetworkAccount = require('../models/AdnetworkAccount');
const ScrapingTask     = require('../models/ScrapingTask');

module.exports = async function () {
  const tasks = [];

  const scheduleTime  = moment().add(10, 'seconds').toDate();
  const adnetworkId   = 123;
  const adnetworkName = 'i-mobile';
  const credentials   = {
    username: 'media@geniee.co.jp',
    password: 'kasemituyo'
  };
  for (let i = 0; i < 32; ++i) {
    const accountId   = i;
    const accountName = `${adnetworkName}${accountId}`;
    const account     = new AdnetworkAccount(adnetworkId, adnetworkName, accountId, accountName, credentials);
    const task        = new ScrapingTask(scheduleTime, account);

    tasks.push(task)
  }

  return tasks
};
