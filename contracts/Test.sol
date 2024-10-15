// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Test {
    event LogMessage(string message);

    constructor() {
        emit LogMessage("Test contract deployed");
    }

    function logMessage(string memory _message) public {
        emit LogMessage(_message);
    }

    function getMessageHash(string memory _message) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_message));
    }
}