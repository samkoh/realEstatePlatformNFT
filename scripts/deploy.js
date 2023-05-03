// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const { ethers } = require('ethers');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether');
}

async function main() {
  // Setup accounts
  const [buyer, seller, inspector, lender] = await hre.ethers.getSigners();

  // Deploy Real Estate
  const RealEstate = await hre.ethers.getContractFactory('RealEstate');
  const realEstate = await RealEstate.deploy();
  await realEstate.deployed();

  console.log(`Deployed Real Estate Contract at: ${realEstate.address}`);
  console.log(`Minting 6 properties...\n`);

  for (let i = 0; i < 6; i++) {
    const transaction = await realEstate.connect(seller).mint(`https://ipfs.io/ipfs/bafybeifcdapvkdld4z34obfpfk7rvsio6mmv42bcpmdw2iudmij2erugkm/${i + 1}.json`);
    await transaction.wait();
  }

  // Deploy Escrow
  const Escrow = await hre.ethers.getContractFactory('Escrow');
  const escrow = await Escrow.deploy(
    realEstate.address,
    seller.address,
    inspector.address,
    lender.address
  )
  await escrow.deployed();

  console.log(`Deployed Escrow Contract at: ${escrow.address}`);
  console.log(`Listing 6 properties...\n`);

  let transaction;

  for (let i = 0; i < 6; i++) {
    // Approve properties...
    transaction = await realEstate.connect(seller).approve(escrow.address, i + 1);
    await transaction.wait();
  }

  // Listing properties...
  transaction = await escrow.connect(seller).list(1, buyer.address, tokens(0.0015), tokens(0.0005));
  await transaction.wait();

  transaction = await escrow.connect(seller).list(2, buyer.address, tokens(0.0035), tokens(0.0005));
  await transaction.wait();

  transaction = await escrow.connect(seller).list(3, buyer.address, tokens(0.0040), tokens(0.0005));
  await transaction.wait();

  transaction = await escrow.connect(seller).list(4, buyer.address, tokens(0.0010), tokens(0.0005));
  await transaction.wait();

  transaction = await escrow.connect(seller).list(5, buyer.address, tokens(0.0035), tokens(0.0005));
  await transaction.wait();

  transaction = await escrow.connect(seller).list(6, buyer.address, tokens(0.005), tokens(0.0005));
  await transaction.wait();

  console.log(`Finished.`);

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
