import { ethers } from "hardhat";
const helpers = require("@nomicfoundation/hardhat-network-helpers");

async function main() {
    const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
    const USDC = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
    const USDT = "0xdAC17F958D2ee523a2206206994597C13D831ec7";

    const TOKEN_HOLDER = "0xf584F8728B874a6a5c7A8d4d387C9aae9172D621";
    const LIQUIDITY_HOLDER = "0xA32c0c266f704f1E6989e91CAE2eBCeCB4e69F22"

    await helpers.impersonateAccount(TOKEN_HOLDER);
    const impersonatedSigner = await ethers.getSigner(TOKEN_HOLDER);

    const amountADesired = ethers.parseUnits("200", 6);
    const amountBDesired = ethers.parseUnits("200", 6);
    const amountAMin = ethers.parseUnits("150", 6);
    const amountBMin = ethers.parseUnits("150", 6);

    const USDC_Contract = await ethers.getContractAt("IERC20", USDC, impersonatedSigner);
    const USDT_Contract = await ethers.getContractAt("IERC20", USDT, impersonatedSigner);
    
    const ROUTER = await ethers.getContractAt("IUniswapV2Router", ROUTER_ADDRESS, impersonatedSigner);

    
    await USDC_Contract.approve(ROUTER_ADDRESS, amountADesired);
    await USDT_Contract.approve(ROUTER_ADDRESS, amountBDesired);

    //Check allowance
    const usdcAllowance = await USDC_Contract.allowance(impersonatedSigner.address, ROUTER_ADDRESS);
    const usdtAllowance = await USDT_Contract.allowance(impersonatedSigner.address, ROUTER_ADDRESS);
    console.log("USDC Allowance:", Number(usdcAllowance));
    console.log("USDT Allowance:", Number(usdtAllowance));
    

    const usdcBal = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const usdtBal = await USDT_Contract.balanceOf(impersonatedSigner.address);
    const deadline = Math.floor(Date.now() / 1000) + (60 * 10);

    console.log("=========================================================");

    console.log("usdc balance before adding liquidity", Number(usdcBal));
    console.log("usdt balance before adding liquidity", Number(usdtBal));


    await ROUTER.addLiquidity(
        USDC,
        USDT,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        LIQUIDITY_HOLDER,
        deadline
    ) 

    const usdcBalAfter = await USDC_Contract.balanceOf(impersonatedSigner.address);
    const usdtBalAfter = await USDT_Contract.balanceOf(impersonatedSigner.address);

    console.log("=========================================================");

    console.log("usdc balance after adding liquidity", Number(usdcBalAfter));
    console.log("usdt balance after adding liquidity", Number(usdtBalAfter));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
