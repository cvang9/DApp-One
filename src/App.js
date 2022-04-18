
import './App.css';
import Web3 from 'web3';
import { useState, useEffect } from "react";
import detectEthereumProvider from "@metamask/detect-provider"; 
import {loadContract} from "./utils/load-contract";

function App() {
  //for Connecting to metamask( useEffect 1)
  const[ Web3Api , setWeb3Api] = useState({
    provider:null,
    web3: null,
    // After The contract is loaded
    contract:null
  });

//for Fetching the account( useEffect 2)
  const[account,setAccount] = useState(null);

//for fethching the account balance
const[balance,setBalance] = useState(null);

// Dynamically Change in Balance ensures no reload when we do txns
const[reload,shouldReload] = useState(false);
// Fxn of reload 
const reloadEffect = ()=>shouldReload(!reload);


  // useEffect1: This useEffect is just to connect with metamask
  useEffect(() => {
    const loadProvider = async() => {
    const provider = await detectEthereumProvider();
    // Calling the fxn which return deployed contract from utils file
    const contract = await loadContract("Funder",provider);
    if(provider){
      provider.request({method:"eth_requestAccounts"});
      setWeb3Api({
        web3: new Web3(provider),
        provider,
        // After the contract is called
        contract,
      });
    }
    else{
      console.error('Please install metamask!');
    }
    }
    loadProvider();
  },[]);

  // useEffect2: This useEffect is to just fetch the account which is connected
  useEffect(()=>{
    const getAccounts = async()=>{
      const accounts = await Web3Api.web3.eth.getAccounts();
      setAccount(accounts[0]);
    }
    Web3Api.web3 && getAccounts();
  },[Web3Api.web3]);

  // useEffect3: This useEffect is to just fetch the account balance
  useEffect(()=>{
   const loadBalance = async() => {
      const {contract,web3} = Web3Api;
      const balance = await web3.eth.getBalance(contract.address);
      setBalance(web3.utils.fromWei(balance,"ether"));
   };
   Web3Api.contract &&  loadBalance();
  },[Web3Api,reload]);                              //[Web3Api,reload] this simply means if there is change happen between them then call useEffect 


  // Calling the transfer Function From our Smart Contract
  const transferFunds = async() => {
    const {web3,contract} = Web3Api;
    await contract.transfer({
      from:account,
      value: web3.utils.toWei("10","ether"),
    });
    reloadEffect();
  }
 // Calling the withdraw Function From our Smart Contract
  const withdrawFunds = async() => {
    const {contract,web3} = Web3Api;
    const withdrawAmount = web3.utils.toWei("2","ether");
     await contract.withdraw(withdrawAmount,{
      from: account
    });
    reloadEffect();
  }



// The Web3 Api is now generated through which we can do all interaction with blockchain 
// console.log(Web3Api.web3);

  return (
    <>
      <div class="card text-center">
        <div class="card-header">Goku</div>
        <div class="card-body">
          <h5 class="card-title">Balance: {balance} ETH </h5>
          <p class="card-text"> Account : {account? account : "Not connected"}
           
          </p>
          <button
            type="button"
            class="btn btn-success"
            onClick={async () => {
              const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
              });
              console.log(accounts);
            }}
          >
            Connect to metamask
          </button>
          &nbsp;
          <button type="button" class="btn btn-success " onClick={(transferFunds)}>
            Transfer
          </button>
          &nbsp;
          <button type="button" class="btn btn-primary " onClick={(withdrawFunds)}>
            Withdraw
          </button>
        </div>
        <div class="card-footer text-muted">Shivang was here</div>
      </div>
    </>
  );
}

export default App;

// for metamask connection
// npm install @metamask/detect-provider 
// -shivang Was here