const Str = require('@supercharge/strings')
// const BigNumber = require('bignumber.js');

var TDErc20 = artifacts.require("ERC20TD.sol");
var ERC721TD = artifacts.require("ERC721TD.sol");
var evaluator = artifacts.require("Evaluator.sol");
var evaluator2 = artifacts.require("Evaluator2.sol");


module.exports = (deployer, network, accounts) => {
    deployer.then(async () => {
        await deployTDToken(deployer, network, accounts); 
        await deployEvaluator(deployer, network, accounts); 
        // await setPermissionsAndRandomValues(deployer, network, accounts);
		await Exercice(deployer, network, accounts);
        await deployRecap(deployer, network, accounts); 
    });
};

async function deployTDToken(deployer, network, accounts) {
	//TDToken = await TDErc20.new("TD-ERC721-101","TD-ERC721-101",web3.utils.toBN("0"))
	TDToken = await TDErc20.at("0x8B7441Cb0449c71B09B96199cCE660635dE49A1D")
}

async function deployEvaluator(deployer, network, accounts) {
	// Evaluator = await evaluator.new(TDToken.address)
	Evaluator = await evaluator.at("0xa0b9f62A0dC5cCc21cfB71BA70070C3E1C66510E") 
	// Evaluator2 = await evaluator2.new(TDToken.address)
	Evaluator2 = await evaluator.at("0x4f82f7A130821F61931C7675A40fab723b70d1B8")
}

async function setPermissionsAndRandomValues(deployer, network, accounts) {
	await TDToken.setTeacher(Evaluator.address, true)
	await TDToken.setTeacher(Evaluator2.address, true)
	randomNames = []
	randomLegs = []
	randomSex = []
	randomWings = []
	for (i = 0; i < 20; i++)
		{
		randomNames.push(Str.random(15))
		randomLegs.push(Math.floor(Math.random()*5))
		randomSex.push(Math.floor(Math.random()*2))
		randomWings.push(Math.floor(Math.random()*2))
		// randomTickers.push(web3.utils.utf8ToBytes(Str.random(5)))
		// randomTickers.push(Str.random(5))
		}

	console.log(randomNames)
	console.log(randomLegs)
	console.log(randomSex)
	console.log(randomWings)
	// console.log(web3.utils)
	// console.log(type(Str.random(5)0)
	await Evaluator.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
	await Evaluator2.setRandomValuesStore(randomNames, randomLegs, randomSex, randomWings);
}

async function deployRecap(deployer, network, accounts) {
	console.log("TDToken " + TDToken.address)
	console.log("Evaluator " + Evaluator.address)
	console.log("Evaluator2 " + Evaluator2.address)
}


async function Exercice(deployer, network, accounts) {

	//deploy ERC721
	MyERC721 = await ERC721TD.new("TLANI","TLA");
	//note
	getBalance = await TDToken.balanceOf(accounts[0]);
	
	//submit
	await Evaluator.submitExercice(MyERC721.address);
	
	//exercice 1
	await MyERC721.declareAnimal(0, 4, 2, "Lilyan");
	await MyERC721.transferFrom(accounts[0], Evaluator.address, 1);
	await Evaluator.ex1_testERC721();
	console.log("Balance after exo1 : " + getBalance.toString());
	
	//exercice 2a
	await Evaluator.ex2a_getAnimalToCreateAttributes();

	//exercice 2b
	const sexe = await Evaluator.readSex(accounts[0]);
	const jambes = await Evaluator.readLegs(accounts[0]);
	const ailes = await Evaluator.readWings(accounts[0]);
	const nom = await Evaluator.readName(accounts[0]);

	await MyERC721.declareAnimal(sexe, jambes, ailes, nom);
	await MyERC721.transferFrom(accounts[0], Evaluator.address, 2);
	await Evaluator.ex2b_testDeclaredAnimal(2);
	console.log("Balance after exo2 : " + getBalance.toString());

	//exercice 3
	await Evaluator.ex3_testRegisterBreeder();
	console.log("Balance after exo3 : " + getBalance.toString());

	//exercice 4
	await Evaluator.ex4_testDeclareAnimal();
	console.log("Balance after exo4 : " + getBalance.toString());

	//exercice 5
	await Evaluator.ex5_declareDeadAnimal();
	console.log("Balance after exo5 : " + getBalance.toString());
	
	//exercice 6a
	await Evaluator.ex6a_auctionAnimal_offer();

	/*
	//exercice 6b
	console.log("Balance after exo6a : " + getBalance.toString());
	await MyERC721.declareAnimal(0, 4, 2, "Lilyan");
	const num = await MyERC721.lastToken();
	await MyERC721.offerForSale(num, 1000)

	await Evaluator.ex6b_auctionAnimal_buy(num);
	console.log("Balance after exo6b : " + getBalance.toString());
	*/
	
}