'use strict';

const TestRPC = require('ethereumjs-testrpc');
const Web3 = require('web3');
const Promise = require('bluebird');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const GtPermissionManager = require('../src/index');
const gas = 3000000;
const BigNumber = require('bignumber.js');

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

describe('PermissionManager contract', function () {
    let permissionManager = null;
    const admin = '0x5bd47e61fbbf9c8b70372b6f14b068fddbd834ac';
    const account2 = '0x25e940685e0999d4aa7bd629d739c6a04e625761';
    //const merchant = '0x6128333118cef876bd620da1efa464437470298d';
    //const spender = '0x93e17017217881d157a47c6ed6d7ae4c8d7ed2bf';

    before(function() {
        this.timeout(60000);
        return GtPermissionManager.deployedContract(web3, admin, gas)
            .then(contract => permissionManager = contract);
    });

    describe('check roles as admin', () => {

        it('check rol 0', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(0)), `rol should be 0`);
        });

        it('create role 2', () => {
            return permissionManager.createRolAsync({from: admin, gas: gas});
        });

        it('set rol 2', () => {
            return permissionManager.setRolAsync(account2, 2, {from: admin, gas: gas});
        });

        it('check rol 2', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(2)), `rol should be 2`);
        });

        it('create and set rol 3', () => {
            return permissionManager.createAndSetRolAsync(account2, {from: admin, gas: gas});
        });

        it('check rol 3', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(3)), `rol should be 3`);
        });

        it('remove rol', () => {
            return permissionManager.removeRolAsync(account2, {from: admin, gas: gas});
        });

        it('check rol', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(0)), `rol should be 0`);
        });
    });

    describe('check interactions as admin', () => {
        it('check rol 0', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(0)), `rol should be 0`);
        });

        it('check rol 1 (admin)', () => {
            return permissionManager.getRolAsync(admin)
                .should.eventually.satisfy(role => role.equals(new BigNumber(1)), `rol should be 1`);
        });

        it('check relationship 0 from 0 to 1', () => {
            return permissionManager.getRelationshipAsync(account2, admin, 0)
                .should.eventually.equals(false);
        });

        it('create relationship 0 from 0 to 1', () => {
            return permissionManager.allowInteractionAsync(0, 1, 0, {from: admin, gas: gas});
        });

        it('check relationship 0 from 0 to 1', () => {
            return permissionManager.getRelationshipAsync(account2, admin, 0)
                .should.eventually.equals(true);
        });

        it('Remove relationship 0 from 0 to 1', () => {
            return permissionManager.disallowInteractionAsync(0, 1, 0, {from: admin, gas: gas});
        });

        it('check relationship 0 from 0 to 1', () => {
            return permissionManager.getRelationshipAsync(account2, admin, 0)
                .should.eventually.equals(false);
        });
    });

});
