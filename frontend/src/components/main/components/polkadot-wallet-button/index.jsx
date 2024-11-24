import React, { useEffect, useState } from "react";
import { ApiPromise, WsProvider } from "@polkadot/api";
import { web3Enable, web3Accounts } from "@polkadot/extension-dapp";
import polkadotImg from "../../../../assets/polkadot-new-dot-logo.svg";
import { Zoom } from "react-reveal";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { NotificationManager } from "react-notifications";
import loading from '../../../../assets/loading.gif'
// import loading1 from '../../../../assets/loading1.gif'
// import { useUserStats } from "../../../../hooks/useUserStats"
import { setPolkaAccount } from "../../../../redux/actions/polkaAction";
import { useDispatch, useSelector } from "react-redux";
import { loginWithWallet } from "../../../../redux/actions/usersAction";

function PolkadotWalletButton() {
  const [extensionAvailable, setExtensionAvailable] = useState();
  const [isWalletModal, setIsWalletModal] = useState(false);
  const [account, setAccount] = useState([]);
  const [address, setAddress] = useState();
  const [name, setName] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  const { isLogged } = useSelector((state) => state.users);

  const { name: polkaName, address: polkaAddress } = useSelector((state) => state.polka);
  // const [isAddressStatusLoading, setIsAddressStatusLoading] = useState();
  // const [isWalletStatusModal, setIsWalletStatusModal] = useState(false);
  // const [balance, setBalance] = useState("");
  // const [stakedAmount, setStakedAmount] = useState("");

  // const {
  //   walletAddress,
  //   searchFetching,
  //   userBalance,
  //   userStakedDollar,
  //   userBalanceDollar,
  //   onChainData,
  //   refetchSearch,
  //   setWalletAddress,
  // } = useUserStats()

  const connectWallet = async () => {
    setIsWalletModal(true);
    if (typeof window !== "undefined") {
      setExtensionAvailable(true);

      try {
        const extensions = await web3Enable("COMAI");
        if (extensions.length === 0) {
          console.log("Install Polkadot wallet extension");
          setExtensionAvailable(false);
          return;
        }
        setExtensionAvailable(true);
        const accounts = await web3Accounts();
        const provider = new WsProvider("wss://rpc.polkadot.io");
        // const provider = new WsProvider("wss://commune-api-node-1.communeai.net");
        const polkadotAPI = await ApiPromise.create({ provider })
        const address = accounts[0].address;
        
        await polkadotAPI.query.system.account(address);
        setIsLoading(false);
        setAccount(accounts);
      } catch (error) {
        NotificationManager.error('Error', 'Error')
      }
    } else {
      NotificationManager.error('Cannot connect wallet', 'Error')
    }
  };

  const handleModalCancel = () => {
    setIsWalletModal(false);
  }

  const handleAccount = (a) => {
    // setAddress(a.address);
    // setName(a.meta.name);    
    // setWalletAddress(a.address)
    dispatch(setPolkaAccount({address: a.address, name: a.meta.name}))
    if(!localStorage.getItem("token")) {
      dispatch(loginWithWallet({address: a.address}))
    }
    setIsWalletModal(false);
  }

  useEffect(() => {    
    // if(polkaName && polkaAddress) {
      setAddress(polkaAddress);
      setName(polkaName);
    // }
  }, [polkaName, polkaAddress])
  // const handleAddressStatus = () => {
  //   setIsWalletStatusModal(true);
  // }

  // const handleAddressStatusModalCancel = () => {
  //   setIsWalletStatusModal(false);
  // }

  // const handleCheckAddress = async () => {
  //   setIsAddressStatusLoading(true)
  //   const provider = new WsProvider("wss://commune-api-node-1.communeai.net");
  //   const polkadotAPI = await ApiPromise.create({ provider })
  //   const balance = await polkadotAPI.query.system.account(address);
  //   const stakingInfo = await polkadotAPI.query.staking.ledger(address);
  //   console.log(stakingInfo);
  //   // if (stakingInfo) {
  //   //   // Extract staked amount from staking information
  //   //   const amount = stakingInfo.stakingLedger.total.unwrap();
  //   //   console.log(amount);

  //   //   // Set staked amount state
  //   //   setStakedAmount(amount);
  //   // } else {
  //   //   console.log('Staking information not available for the address:', address);
  //   // }
  //   setIsAddressStatusLoading(false)
  //   const freeBalance = balance.data.free.toNumber();
  //   setBalance(freeBalance);
  //   setStakedAmount("0");

  // }

  return (
    <div>
      {extensionAvailable === false && isWalletModal === true && (
        <Zoom duration={500}>
          <div className="fixed top-[24%] left-[40%]">
            <div className="p-4 flex justify-center items-center flex-col gap-4 rounded-2xl bg-[#eee] dark:bg-[#1a1b1f] w-[368px]">
              <div
                className="top-[10px] ml-auto cursor-pointer z-[99]"
                onClick={handleModalCancel}
              >
                <XCircleIcon className="h-7 w-7 text-gray-800 dark:text-white" />
              </div>
              <p className="mt-[-20px] pr-[24px] dark:text-white font-bold">
                Please install the Polkadot.js extension to continue.
              </p>
              <a
                href="https://polkadot.js.org/extension/"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md flex justify-center items-center px-4 py-2 text-red-500 font-bold hover:text-white transition-all duration-300 underline"
              >
                Get Polkadot.js Extension
              </a>
            </div>
          </div>
        </Zoom>
      )}
      {extensionAvailable === true && account && isWalletModal === true && (
        <Zoom duration={500}>
          <div className="fixed top-[24%] left-[40%]">
            <div className="p-4 flex items-center flex-col gap-4 rounded-2xl bg-[#eee] dark:bg-[#151e2d] w-[368px] h-[468px]">
              <div className="w-full justify-center relative flex items-center">
                <p className="text-white text-[18px] font-extrabold">
                  Connect a Wallet
                </p>
                <div
                  className="absolute top-[0px] right-[0px] cursor-pointer z-[99]"
                  onClick={handleModalCancel}
                >
                  <XCircleIcon className="h-7 w-7 text-gray-800 dark:text-white" />
                </div>
              </div>
              {isLoading ? <div className=" flex flex-col gap-[30px] justify-center items-center">
                <span className="dark:text-white font-bold">Loading Accounts</span>
                <img className="w-[70px] mt-[-20px]" src={loading} alt="" />
              </div>
                :
                <div className="w-full flex flex-col items-center overflow-x-scroll scrollbar-hide gap-3 mb-3 mt-3">
                  {account.map((a, idx) => {
                    return (
                      <div key={idx} className="flex justify-center items-center gap-2 dark:bg-[rgb(42,42,42)] bg-[#fff] p-2 rounded-md w-full cursor-pointer" onClick={() => handleAccount(a)}>
                        <p className="text-red-500 w-[25%] overflow-hidden text-ellipsis">
                          {a.meta.name}
                        </p>
                        <p className="dark:text-white w-[75%] overflow-hidden text-ellipsis">
                          {a.address}
                        </p>
                      </div>
                    )
                  })}
                </div>
              }
            </div>
          </div>
        </Zoom>
      )}
      {/* {isWalletStatusModal &&
        <Zoom duration={500}>
          <div className=" w-full fixed top-[100px] left-[38%]">
            <div className="p-8 flex justify-center items-center flex-col gap-4 rounded-2xl bg-[#eee] dark:bg-[rgb(27,27,27)] w-[700px]">
              <div
                className=" top-[10px] ml-auto cursor-pointer z-[99]"
                onClick={handleAddressStatusModalCancel}
              >
                <XCircleIcon className="h-7 w-7 text-gray-800 dark:text-white" />
              </div>
              {false ? <div className=" flex flex-col gap-[30px] justify-center items-center">
                <span className=" dark:text-white">Checking Status</span>
                <img className="w-[70px] mt-[-20px]" src={loading} alt="" />
              </div>
                :
                <div className=" flex flex-col gap-[30px] justify-center items-center">
                  <div className=" flex flex-col justify-center items-center gap-4 px-6 mb-3 mt-4">
                    <span className=" dark:text-white text-[20px]">Balance: {balance} COMAI</span>
                    <span className=" dark:text-white text-[20px]">Staked: {
                      stakedAmount} COMAI</span>
                  </div>
                  <button
                    className="align-middle flex justify-center items-center gap-2 select-none font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-[12px] px-6 rounded-lg bg-gray-900 dark:bg-[rgb(36,36,36)] text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none"
                    type="button"
                    data-ripple-light="true"
                    style={{ fontFamily: "Smack" }}
                    onClick={handleCheckAddress}
                  >
                    Check Now {isAddressStatusLoading && <img className=" w-5" src={loading1} alt="" />}</button>
                </div>
              }
            </div>
          </div>
        </Zoom>
      } */}
      <div className=" flex justify-center items-center gap-2">
        {
          !address && !name && 
          <img
            onClick={() => connectWallet()}
            className="hover:w-[40px] transition-all w-[30px] cursor-pointer"
            src={polkadotImg}
            alt=""
          />
        }
        {address && name &&
          <div
            className="align-middle select-none font-sans font-bold cursor-pointer text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-[10px] px-3 rounded-lg bg-[#2f3540] text-[rgb(18,18,18)] dark:text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] flex items-center gap-2"
            style={{ fontFamily: 'Smack' }} onClick={() => connectWallet()}>
            <span className=" text-[15px] uppercase text-[rgb(18,18,18)] dark:text-red-500">
              {name
                ? name
                : ''}
            </span>
            <span className=" text-[15px] first-letter:uppercase lowercase text-[rgb(18,18,18)] dark:text-white">
              {address.slice(0, 4) + '...' + address.slice(address.length - 5, address.length - 1)}
            </span>
          </div>
        }
      </div>
    </div>
  );
}

export default PolkadotWalletButton;
