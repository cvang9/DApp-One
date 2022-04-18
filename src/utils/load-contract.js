import contract from "@truffle/contract";

// Instance where we connect our react.js to our smart Contract
export const loadContract = async( name, provider ) => {
     const res = await fetch(`./contracts/${name}.json`);        //Fetch the Smart Contract
     const artifact = await res.json();                          //Fetch api from Smart Contract
     const _contract = contract(artifact);                       //created an instance
     _contract.setProvider(provider);                            
     const deployedContract = await _contract.deployed();       //Contract Deployed
     return deployedContract;
};
