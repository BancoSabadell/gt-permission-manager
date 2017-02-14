# gt-permission-manager [![CircleCI](https://circleci.com/gh/BancoSabadell/gt-permission-manager.svg?style=shield)](https://circleci.com/gh/BancoSabadell/gt-permission-manager)

A contract to manage relationships and permissions of other contracts.

## Installation
```bash
npm install gt-permission-manager
```

## Usage

#### Roles
Any address can have a role associated. By default, there are only 2 roles. All addresses have the role 0, while the address that creates the contract has the role 1 (admin). The role 1 has special permissions (see below).

`createRol()`: Creates a new role. Returns the id of the role.

`createAndSetRol(address id)`: Creates a new role and assigns it to an address. Returns the id of the role.

`setRol(address id, uint role)`: Assigns an existing role to an address.

`removeRol(address id)`: Removes the role assigned to an address.

`getNumRoles()` (constant): Returns the number of roles defined in the contract.

`getRol(address id)`: Returns the id of the role assigned to an address.

#### Relationships
A relationship between two roles defines which actions can perform. Specific interactions can be defined between two roles.

`allowInteraction(uint role1, uint role2, uint interaction)`: Defines a relationship from role1 to role2. Allowing them to perform an specific interaction.

`disallowInteraction(uint role1, uint role2, uint interaction)`: Removes an interaction from role1 to role2

`getRelationship(address id1, address id2, uint rel)` (constant): Returns true if the interaction "rel" is allowed from id1 to id2.

#### Special roles
There are three special roles already defined:
* Admin: An admin can perform any action in the contract. By default, the role 1 has admin permissions.
* Identity Manager: An identity manager can create an remove roles and relationships.
* Reputation Provider: A reputation provider is defined as a trusted oracle to assign reputation to addresses.

`addNetworkAdmin(uint rol)`: Gives admin permissions to a role.

`addIdentityManager(uint rol)`: Gives identity manager permissions to a role.

`addReputationProvider(uint rol)`: Gives reputation provider permissions to a role.

`removeNetworkAdmin(uint rol)`: Removes admin permissions of a role.

`removeIdentityManager(uint rol)`: Removes identity manager permissions of a role.

`removeReputationProvider(uint rol)`: Removes reputation provider permissions of a role.

`getNetworkAdmin(uint rol)` (constant): Returns true is the rol has admin permissions.

`getIdentityManager(uint rol)` (constant): Returns true is the rol has identity manager permissions.

`getReputationProvider(uint rol)` (constant): Returns true is the rol has reputation provider permissions.
