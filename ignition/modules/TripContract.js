const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TripContractModule", (m) => {
  const ratingContractAddress = process.env.NEXT_PUBLIC_RATING_CONTRACT_ADDRESS;

  const tripContract = m.contract("TripContract", [ratingContractAddress]);

  return { tripContract };
});
