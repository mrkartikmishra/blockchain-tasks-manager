const hre = require("hardhat");

async function main() {
  const TaskManagerContract = await hre.ethers.getContractFactory("TaskManagerContract");
  const taskManagerContract = await TaskManagerContract.deploy();

  await taskManagerContract.deployed();

  console.log(
    `TaskManagerContract deployed to:: ${taskManagerContract.address}`
  );
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
