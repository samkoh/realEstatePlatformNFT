const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("RealEstate", function () {
    let realEstate;

    beforeEach(async function () {

        const RealEstate = await ethers.getContractFactory("RealEstate");
        realEstate = await RealEstate.deploy();
        await realEstate.deployed();
    });

    it("should mint a new NFT", async function () {
        let owner;
        [owner] = await ethers.getSigners();
        const tokenURI = "https://example.com/mytoken";
        const result = await realEstate.mint(tokenURI);
        const tokenId = result.value + 1;
        expect(await realEstate.ownerOf(tokenId)).to.equal(owner.address);
        expect(await realEstate.tokenURI(tokenId)).to.equal(tokenURI);
        expect(await realEstate.totalSupply()).to.equal(1);
    });

    it("should return the correct total supply", async function () {
        await realEstate.mint("https://example.com/token1");
        await realEstate.mint("https://example.com/token2");
        await realEstate.mint("https://example.com/token3");
        expect(await realEstate.totalSupply()).to.equal(3);
    });
});
