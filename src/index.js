'use strict';

const Deployer = require('contract-deployer');
const fs = require('fs');
const path = require('path');

exports.contracts = {
    'PermissionManager.sol': fs.readFileSync(path.join(__dirname, '../contracts/PermissionManager.sol'), 'utf8')
};

exports.deployedContract = function (web3, admin, gas) {
    const deployer = new Deployer(web3, {sources: exports.contracts}, 0);
    return deployer.deploy('PermissionManager', [], { from: admin, gas: gas });
};


