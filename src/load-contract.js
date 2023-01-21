import contract from "@truffle/contract";
/*
    use this code for Access for deploy and access functionality of smart contract 
*/

export const loadContract = async (name, provider) => {
  const res = await fetch(`/contracts/${name}.json`);
  const artifacts = await res.json();
  const _contract = contract(artifacts);
  _contract.setProvider(provider);

  const deployedContract = await _contract.deployed();
  console.log(deployedContract)
  return deployedContract;
};  