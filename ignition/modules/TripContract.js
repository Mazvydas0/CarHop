const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TripContractModule", (m) => {
  // Deploy the Carpool contract
  const carpoolContract = m.contract("TripContract");

  return {
    carpoolContract,
  };
});
