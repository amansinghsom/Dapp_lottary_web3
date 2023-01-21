import { useState, useEffect } from 'react'
import Model from './Componets/model';
import Web3 from 'web3';
import detectEthereumProvider from "@metamask/detect-provider";
import { loadContract } from './load-contract';
import "./App.css"


export default function App() {
  const [account, setAccount] = useState(null);
  const [Address, setAddress] = useState(null);
  const [AllPlayers, setAllplayers] = useState([]);
  const [model, setmodel] = useState(false);
  const [value, setvalue] = useState("");
  const [Balance, setBalance] = useState();

  const [web3Apis, setWeb3Api] = useState({
    web3: null,
    contract: null
  })
  const [reload, setreload] = useState(false);
  const setAccountChangedListenr = (provider) => {
    provider.on('accountsChanged', (accounts) => {
      // Handle the new accounts, or lack thereof.
      setAccount(accounts[0]);
      // "accounts" will always be an array, but it can be empty.
    });

  }
  //event listen when account changed
  useEffect(() => {
    (
      async () => {
        const provider = await detectEthereumProvider();
        if (provider) {
          provider.request({ method: "eth_requestAccounts" }); //wallet and transition request;
          setAccountChangedListenr(provider);
          const contract = await loadContract("Lottary", provider)
          setWeb3Api({
            web3: new Web3(provider),
            contract,
          })
          setreload(!reload)
        } else {
          alert("please install metamask")
        }
      }
    )()

  }, [])

  const sendEther = async () => {
    setmodel(false);
    setvalue("");
    try {
      const { contract, web3 } = web3Apis;
      // await contrac
      await contract.sendTransaction({
        from: account,
        value: web3.utils.toWei(value, "ether"),
      });
      setreload(!reload)
    } catch (err) {
      alert(err.message);
    }
  }

  useEffect(() => {
    const setFunc = async () => {
      const { web3, contract } = web3Apis;
      const account = await web3.eth.getAccounts();
      setAccount(account[0]);
      setAddress(contract.address);
      const Balance = await web3.eth.getBalance(contract.address);
      const p2 = await contract.allPlayers.call();
      setAllplayers(p2);
      setBalance(web3.utils.fromWei(Balance))
    }
    web3Apis.web3 && setFunc();
  }, [reload])

  const PickWinner = async () => {
    try {
      const { contract, web3 } = web3Apis;

      console.log("helloworld")
     
      await contract.pickWinner({
        from: account
      })
      const winner=  await contract.winner({
        from:account
      });
      alert(winner);
      setreload(!reload)
    } catch (err) {
      alert(err);
      console.log(err)

    }
  }


  return (
    <div className=''>

      <nav className='container'>
        <h1 className='text1'>Lottary 💰</h1>
        <h1 className='text2'> 🙋‍♂️Welcome:  {account}</h1>
      </nav>
      <div className='supercontainer'>
        <div className='container1 ' >
          <div className=''>
            <h1 className='text_set'>#Lottary 💰 </h1>
            <h1 className='text_set'>#Contract Balance 💸  : {Balance} Eth </h1>
            <h1 className='text_set'>#Contract Address: {Address}</h1>


            <div className='btn'>

              <button className=' ' onClick={() => {
                setmodel(true);
              }}> Enter Amount  </button>
              <button className='border-4 w-80 p-4 text-2xl border-[#f2505e] m-auto mt-3 font-bold rounded-xl ' onClick={PickWinner}> Pick Winner 🥇 </button>

            </div>
          </div>

        </div>

        <div className='container1'  >
          <div className='_set text_set'>
            <h1 className='text-lg font-bold text-[#f2505e]'>#User address  </h1>
            <h1 className='text-lg font-bold text-[#f2505e]'># Amount </h1>
          </div>
          <div className='flex_set'>


            {
              AllPlayers.length !== 0 ? <>
                {
                  AllPlayers.map((current) => {
                    return <div className='inner_flex_set' key={current}>
                      <h1 className=''># {current.userAdd} </h1>
                      <h1 className=''>{web3Apis.web3.utils.fromWei(current.amount, "ether")} Eth  </h1>


                    </div>
                  })
                }
              </> : <h4 className=''>No User Yet</h4>
            }
          </div>

        </div>
      </div>
      {model && <Model setmodel={setmodel} value={value} setvalue={setvalue} sendEther={sendEther} />}

    </div>
  )
}
