'use strict';

const AdnetworkAccount = require('../models/AdnetworkAccount');

module.exports = async function (accountId) {
  const adnetworkId   = 123;
  const adnetworkName = 'i-mobile';
  const accountName   = `${adnetworkName}${accountId}`;
  const credentials   = {
    username: 'media@geniee.co.jp',
    password: 'kasemituyo'
  };

  return new AdnetworkAccount(adnetworkId, adnetworkName, accountId, accountName, credentials);
};
