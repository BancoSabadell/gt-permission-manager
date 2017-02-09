'use strict';

const Deployer = require('contract-deployer');
const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');

exports.contracts = Object.freeze({
    'PermissionManager.sol': fs.readFileSync(path.join(__dirname, '../contracts/PermissionManager.sol'), 'utf8')
});

exports.deployContract = function (web3, admin, gas) {
    const deployer = new Deployer(web3, {sources: exports.contracts}, 0);
    return deployer.deploy('PermissionManager', [], { from: admin, gas: gas })
        .then(permissionManager => {
            checkContract(permissionManager);
            return permissionManager;
        });
};

exports.deployedContract = function (web3, admin, abi, address) {
    const permissionManager = web3.eth.contract(abi).at(address);
    Promise.promisifyAll(permissionManager);
    checkContract(permissionManager);
    return Promise.resolve(permissionManager);
};

function checkContract(permissionManager) {
    if (!permissionManager.abi) {
        throw new Error('abi must not be null');
    }

    if (!permissionManager.address) {
        throw new Error('address must not be null');
    }

    if (typeof permissionManager.isNetworkAdminAsync === "undefined") {
        throw new Error('contract has not been properly deployed');
    }
}