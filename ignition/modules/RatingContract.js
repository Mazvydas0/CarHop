const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("RatingContractModule", (m) => {
  const ratingContract = m.contract("RatingContract");
  return { ratingContract };
});
