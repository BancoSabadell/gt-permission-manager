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
    }, {
        index: 1,
        secretKey: '0x998c22e6ab1959d6ac7777f12d583cc27d6fb442c51770125ab9246cb549db81',
        balance: 200000000
    }, {
        index: 2,
        secretKey: '0x998c22e6ab1959d6ac7777f12d583cc27d6fb442c51770125ab9246cb549db82',
        balance: 200000000
    }, {
        index: 3,
        secretKey: '0x998c22e6ab1959d6ac7777f12d583cc27d6fb442c51770125ab9246cb549db83',
        balance: 200000000
    }]
});

const web3 = new Web3(provider);
chai.use(chaiAsPromised);
chai.should();
Promise.promisifyAll(web3.eth);
Promise.promisifyAll(web3.personal);

describe('PermissionManager contract', function () {
    let permissionManager;
    const admin = '0x5bd47e61fbbf9c8b70372b6f14b068fddbd834ac';
    const account2 = '0x25e940685e0999d4aa7bd629d739c6a04e625761';
    const identityManager = '0x6128333118cef876bd620da1efa464437470298d';

    before(function() {
        this.timeout(60000);
        return GtPermissionManager.deployContract(web3, admin, gas)
            .then(contract => permissionManager = contract);
    });

    describe('check roles as admin', () => {

        it('check role 0', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(0)), `rol should be 0`);
        });

        it('check number of roles', () => {
            return permissionManager.getNumRolesAsync()
                .should.eventually.satisfy(num => num.equals(new BigNumber(2)), `num should be 2`);
        });

        it('create role 2', () => {
            return permissionManager.createRolAsync({from: admin, gas: gas});
        });

        it('check number of roles', () => {
            return permissionManager.getNumRolesAsync()
                .should.eventually.satisfy(num => num.equals(new BigNumber(3)), `num should be 3`);
        });

        it('set role 2', () => {
            return permissionManager.setRolAsync(account2, 2, {from: admin, gas: gas});
        });

        it('check role 2', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(2)), `rol should be 2`);
        });

        it('create and set role 3', () => {
            return permissionManager.createAndSetRolAsync(account2, {from: admin, gas: gas});
        });

        it('check role 3', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(3)), `rol should be 3`);
        });

        it('remove role', () => {
            return permissionManager.removeRolAsync(account2, {from: admin, gas: gas});
        });

        it('check role', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(0)), `rol should be 0`);
        });
    });

    describe('check roles as identity manager', () => {

        it('set role 2', () => {
            return permissionManager.setRolAsync(identityManager, 2, {from: admin, gas: gas});
        });

        it('check role 2', () => {
            return permissionManager.getRolAsync(identityManager)
                .should.eventually.satisfy(role => role.equals(new BigNumber(2)), `rol should be 2`);
        });

        it('add identity manager permissions to role 2', () => {
            return permissionManager.addIdentityManagerAsync(2, {from: admin, gas: gas});
        });

        it('check role identity manager', () => {
            return permissionManager.getIdentityManagerAsync(2)
                .should.eventually.equals(true);
        });

        it('check number of roles', () => {
            return permissionManager.getNumRolesAsync()
                .should.eventually.satisfy(num => num.equals(new BigNumber(4)), `num should be 4`);
        });

        it('create role 4', () => {
            return permissionManager.createRolAsync({from: identityManager, gas: gas});
        });

        it('set role 4', () => {
            return permissionManager.setRolAsync(account2, 4, {from: identityManager, gas: gas});
        });

        it('check role 4', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(4)), `rol should be 4`);
        });

        it('create and set role 5', () => {
            return permissionManager.createAndSetRolAsync(account2, {from: identityManager, gas: gas});
        });

        it('check role 5', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(5)), `rol should be 2`);
        });

        it('check number of roles', () => {
            return permissionManager.getNumRolesAsync()
                .should.eventually.satisfy(num => num.equals(new BigNumber(6)), `num should be 6`);
        });

        it('remove role', () => {
            return permissionManager.removeRolAsync(account2, {from: identityManager, gas: gas});
        });

        it('check role', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(0)), `rol should be 0`);
        });
    });

    describe('check roles as non admin/identity manager', () => {

        it('check role 0', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(0)), `rol should be 0`);
        });

        it('check number of roles', () => {
            return permissionManager.getNumRolesAsync()
                .should.eventually.satisfy(num => num.equals(new BigNumber(6)), `num should be 6`);
        });

        it('create role', () => {
            const promise = permissionManager.createRolAsync({
                from: account2,
                gas: gas
            });

            return promise.should.eventually.be.rejected;
        });

        it('create and set role', () => {
            const promise = permissionManager.createAndSetRolAsync(account2, {
                from: account2,
                gas: gas
            });

            return promise.should.eventually.be.rejected;
        });

        it('check number of roles', () => {
            return permissionManager.getNumRolesAsync()
                .should.eventually.satisfy(num => num.equals(new BigNumber(6)), `num should be 6`);
        });

        it('set role 1 (admin)', () => {
            const promise = permissionManager.setRolAsync(account2, 1, {
                from: account2,
                gas: gas
            });

            return promise.should.eventually.be.rejected;
        });

        it('check role admin', () => {
            return permissionManager.getNetworkAdminAsync(account2)
                .should.eventually.equals(false);
        });

        it('add identity manager permissions to role 0', () => {
            const promise = permissionManager.addIdentityManagerAsync(0, {
                from: account2,
                gas: gas
            });

            return promise.should.eventually.be.rejected;
        });

        it('check role identity manager', () => {
            return permissionManager.getNetworkAdminAsync(account2)
                .should.eventually.equals(false);
        });
    });

    describe('check interactions as admin', () => {
        it('check role 0', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(0)), `rol should be 0`);
        });

        it('check role 1 (admin)', () => {
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

    describe('check interactions as identity manager', () => {
        it('check role 0', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(0)), `rol should be 0`);
        });

        it('check role 1 (admin)', () => {
            return permissionManager.getRolAsync(admin)
                .should.eventually.satisfy(role => role.equals(new BigNumber(1)), `rol should be 1`);
        });

        it('check relationship 0 from 0 to 1', () => {
            return permissionManager.getRelationshipAsync(account2, admin, 0)
                .should.eventually.equals(false);
        });

        it('create relationship 0 from 0 to 1', () => {
            return permissionManager.allowInteractionAsync(0, 1, 0, {from: identityManager, gas: gas});
        });

        it('check relationship 0 from 0 to 1', () => {
            return permissionManager.getRelationshipAsync(account2, admin, 0)
                .should.eventually.equals(true);
        });

        it('Remove relationship 0 from 0 to 1', () => {
            return permissionManager.disallowInteractionAsync(0, 1, 0, {from: identityManager, gas: gas});
        });

        it('check relationship 0 from 0 to 1', () => {
            return permissionManager.getRelationshipAsync(account2, admin, 0)
                .should.eventually.equals(false);
        });
    });

    describe('check interactions as non admin/identity manager', () => {
        it('check role 0', () => {
            return permissionManager.getRolAsync(account2)
                .should.eventually.satisfy(role => role.equals(new BigNumber(0)), `rol should be 0`);
        });

        it('check role 1 (admin)', () => {
            return permissionManager.getRolAsync(admin)
                .should.eventually.satisfy(role => role.equals(new BigNumber(1)), `rol should be 1`);
        });

        it('check relationship 0 from 0 to 1', () => {
            return permissionManager.getRelationshipAsync(account2, admin, 0)
                .should.eventually.equals(false);
        });

        it('create relationship 0 from 0 to 1', () => {
            const promise = permissionManager.allowInteractionAsync(0, 1, 0, {
                from: account2,
                gas: gas
            });

            return promise.should.eventually.be.rejected;
        });

        it('check relationship 0 from 0 to 1', () => {
            return permissionManager.getRelationshipAsync(account2, admin, 0)
                .should.eventually.equals(false);
        });

        it('create relationship 0 from 0 to 1 (from identity manager)', () => {
            return permissionManager.allowInteractionAsync(0, 1, 0, {from: identityManager, gas: gas});
        });

        it('check relationship 0 from 0 to 1', () => {
            return permissionManager.getRelationshipAsync(account2, admin, 0)
                .should.eventually.equals(true);
        });

        it('Remove relationship 0 from 0 to 1', () => {
            const promise = permissionManager.disallowInteractionAsync(0, 1, 0, {
                from: account2,
                gas: gas
            });

            return promise.should.eventually.be.rejected;
        });

        it('check relationship 0 from 0 to 1', () => {
            return permissionManager.getRelationshipAsync(account2, admin, 0)
                .should.eventually.equals(true);
        });

        it('Remove relationship 0 from 0 to 1 (from identity manager)', () => {
            return permissionManager.disallowInteractionAsync(0, 1, 0, {from: identityManager, gas: gas});
        });
    });

});
