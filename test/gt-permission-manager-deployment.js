'use strict';

const TestRPC = require('ethereumjs-testrpc');
const Web3 = require('web3');
const Promise = require('bluebird');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const GtPermissionManager = require('../src/index');
const gas = 3000000;

const provider = TestRPC.provider({
    accounts: [{
        index: 0,
        secretKey: '0x998c22e6ab1959d6ac7777f12d583cc27d6fb442c51770125ab9246cb549db80',
        balance: 200000000
    }]
});

const web3 = new Web3(provider);
chai.use(chaiAsPromised);
chai.should();
Promise.promisifyAll(web3.eth);
Promise.promisifyAll(web3.personal);

describe('PermissionManager deployment', function () {
    let permissionManager;
    const admin = '0x5bd47e61fbbf9c8b70372b6f14b068fddbd834ac';

    describe('deploy', () => {
        it('should be fulfilled', () => {
            return GtPermissionManager.deployContract(web3, admin, gas)
                .then((contract) => permissionManager = contract);
        }).timeout(60000);
    });

    describe('deployed', () => {
        it('should be fulfilled', () => {
            return GtPermissionManager.deployedContract(web3, admin, permissionManager.abi,
                permissionManager.address);
        });
    });

});
