import React, { useEffect, useState } from 'react'
// import { Fade } from 'react-reveal';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';
import { login, loginWithWallet } from "../../redux/actions/usersAction";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import PolkadotWalletButton from '../main/components/polkadot-wallet-button';
import metaIcon from '../../assets/metamask-icon.svg';
import gmailIcon from '../../assets/gmail.png';
import { useAccount } from 'wagmi'

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const account = useAccount()

    const { isLogged } = useSelector((state) => state.users)

    useEffect(() => {
        if (isLogged) {
            navigate('/bounties')
        }
    }, [isLogged])

    const OpenSignupPage = () => {

        navigate('/signup')
    }

    useEffect(() => {
        if(account.address && !localStorage.getItem("token")) {
            dispatch(loginWithWallet({ address: account.address }))
        }
    }, [account.address])
    const handleLogin = () => {
        if (email === '') {
            NotificationManager.error('Input email address', 'Error')
            return;
        }
        if (password === '') {
            NotificationManager.error('Input Password', 'Error')
            return;
        }
        dispatch(login({ email, password }));
    }

    const [user, setUser] = useState([]);

    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
    });

    useEffect(
        () => {            
            if (user && user.access_token) {
                axios
                    .get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${user.access_token}`, {
                        headers: {
                            Authorization: `Bearer ${user.access_token}`,
                            Accept: 'application/json'
                        }
                    })
                    .then((res) => {
                        const { email } = res?.data;
                        dispatch(login({ email: email, password: 'google' }));

                    })
                    .catch((err) => console.log(err));
            }
        }, [user]
    );

    return (
        <div className="w-full h-full">
            <div id="home" className="w-full z-[2] dark:bg-[#0c1320] transition-all h-screen">
                <div className="flex justify-center items-center h-full">
                    <div className="w-full mx-auto main-visual flex flex-wrap items-center justify-center h-full">
                        <div className="w-full flex flex-row items-center justify-between main-visual">
                            <div className="w-[100%] md:max-w-[50%] mt-[-100px]" style={{ fontFamily: 'Smack' }} >
                                <section className="bg-[#fff] dark:bg-[#0c1320]">
                                    <div className="flex flex-col mt-[100px] items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                                        <div className="w-full bg-[#fff] md:ml-[150px] ml-[0px] rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0 dark:bg-[#151e2d]">
                                            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                                                <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                                    Sign in to your account
                                                </h1>
                                                <div className="space-y-4 md:space-y-6" action="#">
                                                    <div>
                                                        <label for="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                                                        <input type="email"
                                                            onChange={(({ target }) => {
                                                                setEmail(target.value)
                                                            })}
                                                            name="email" id="email" className="bg-gray-50 border-[1px] border-[rgb(209,213,219)] outline-none text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-[#1e2738] dark:placeholder-gray-400 dark:text-[#fff] focus:ring-blue-500 focus:border-blue-500 dark:focus:border-[#4f4f4f] dark:border-[#303030] emailInput" placeholder="name@comdev.com" required="" />
                                                    </div>
                                                    <div>
                                                        <label for="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                                        <input type="password"
                                                            onChange={(({ target }) => {
                                                                setPassword(target.value)
                                                            })}
                                                            name="password" id="password" className="bg-gray-50 outline-none border-[1px] border-gray-300 text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-[#1e2738] dark:placeholder-gray-400 dark:text-white focus:ring-blue-500 focus:border-blue-500 dark:focus:border-[#4f4f4f] dark:border-[#303030]" required="" />
                                                    </div>
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-start">
                                                            <div className="flex items-center h-5">
                                                                <input id="remember" aria-describedby="remember" type="checkbox" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-[#256fc4] dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-[#256fc4] dark:ring-offset-gray-800" required="" />
                                                            </div>
                                                            <div className="ml-3 text-sm">
                                                                <label for="remember" className="text-gray-500 dark:text-gray-300">Remember me</label>
                                                            </div>
                                                        </div>
                                                        <span className="text-sm cursor-pointer font-medium text-[#256fc4] hover:underline dark:text-[#256fc4]">Forgot password?</span>
                                                    </div>
                                                    <div
                                                        style={{ display: "flex" }}
                                                        className="flex items-center justify-center ml-[1px] gap-[25px]"
                                                    >
                                                        <button onClick={() => googleLogin()}>
                                                            <img
                                                                src={gmailIcon}
                                                                alt="Gmail"
                                                                className="cursor-pointer w-[30px] hover:w-[40px] transition-all"
                                                            />
                                                        </button>
                                                        {/* <ConnectButton.Custom>
                                                            {({
                                                                account,
                                                                chain,
                                                                openAccountModal,
                                                                openChainModal,
                                                                openConnectModal,
                                                                authenticationStatus,
                                                                mounted,
                                                            }) => {
                                                                const ready = mounted && authenticationStatus !== 'loading';
                                                                const connected =
                                                                    ready &&
                                                                    account &&
                                                                    chain &&
                                                                    (!authenticationStatus ||
                                                                        authenticationStatus === 'authenticated');
                                                                return (
                                                                    <div
                                                                        {...(!ready && {
                                                                            'aria-hidden': true,
                                                                            'style': {
                                                                                opacity: 0,
                                                                                pointerEvents: 'none',
                                                                                userSelect: 'none',
                                                                            },
                                                                        })}
                                                                    >
                                                                        {(() => {
                                                                            if (!connected) {
                                                                                return (
                                                                                    <div className="flex gap-[10px] justify-center items-center">
                                                                                        <img onClick={openConnectModal} className="w-[30px] cursor-pointer hover:w-[40px] transition-all" src={metaIcon} alt="" />
                                                                                    </div>
                                                                                );
                                                                            }

                                                                            if (chain.unsupported) {
                                                                                return (
                                                                                    <button onClick={openChainModal} style={{ boxShadow: 'rgb(0 0 0 / 98%) 3px 3px 3px 3px' }}>
                                                                                        Wrong network
                                                                                    </button>
                                                                                );
                                                                            }
                                                                            return (
                                                                                <div className=" flex gap-[15px] justify-center items-center">
                                                                                    <div
                                                                                        className="align-middle select-none cursor-pointer font-sans font-bold text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-[10px] px-3 rounded-lg bg-[#2f3540] text-[rgb(18,18,18)] dark:text-white shadow-md shadow-gray-900/10 hover:shadow-lg hover:shadow-gray-900/20 active:opacity-[0.85] flex items-center gap-2"
                                                                                        onClick={openAccountModal} style={{ fontFamily: 'Smack' }}>
                                                                                        <span className=" text-[15px] first-letter:uppercase lowercase text-[rgb(18,18,18)] dark:text-white">
                                                                                            {account.displayName}
                                                                                        </span>
                                                                                    </div>
                                                                                </div>
                                                                            );
                                                                        })()}
                                                                    </div>
                                                                );
                                                            }}
                                                        </ConnectButton.Custom> */}
                                                        {/* <PolkadotWalletButton /> */}
                                                    </div>
                                                    <button onClick={handleLogin} className="w-full text-white bg-[#256fc4] hover:bg-[#4788d2] focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sign in</button>
                                                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                                        Don’t have an account yet? <span onClick={OpenSignupPage} className="font-medium cursor-pointer text-[#256fc4] hover:underline dark:text-[#256fc4]">Sign up</span>
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </div>
                            <div className='hidden md:flex md:flex-col items-center justify-end w-[50%] '>
                                {/* <Fade right cascade> */}
                                <img src="./images/commune.gif" className="mt-[0px] max-w-[720px] max-h-[680px] w-[50%]" alt="" />
                                {/* </Fade> */}
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default LoginPage
