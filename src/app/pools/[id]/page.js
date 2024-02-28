import { cookies } from 'next/headers'
import GreenPlaceholder from "/public/green-currency.png"
import Image from "next/image";
import { fetchPools } from "@/app/soroban/fetchData";
import { calculateCollected, calculateMatured, filterAndSortAccountSupplies, filterAndSortSupplies, getAssetLogo, getPoolName, getTotNormYield, getTotYield, sortByTimestamp } from '@/helpers/aggregation';
import { fromStringToKey, parseAddress } from '@/helpers/dataParsing';
import { stroopsToUnit } from '@/helpers/dataManipulation';
import UpdateRewards from '@/app/soroban/updateRewards';
import WithdrawMatured from '@/app/soroban/withdrawMatured';
import { DepositOrWithdraw } from '@/app/components/despositOrWithdrawForm';
import LoadingModal from '@/app/components/modals/loadingModal';
import SuccessModal from '@/app/components/modals/successModal';
import ErrorModal from '@/app/components/modals/errorModal';
import { PoolInfo } from './poolInfo';


export default async function PoolDetails({ params, searchParams }) {

    const cookiesStore = cookies()
    
    let publicKey
    if (cookiesStore.get("publicAddress")) {
        publicKey = cookiesStore.get("publicAddress").value
    }

    const data = await fetchPools()
    const ContractSupplyNodes = sortByTimestamp(data.allZephyrD6Eacc6B192F3Ae14116A75Fac2D1Db6S.nodes)
    const ContractAccountYieldNodes = sortByTimestamp(data.allZephyr9473E79262F2F063D45166Fe1D270D0Fs.nodes)
    const allAccountData = sortByTimestamp(data.allZephyr189C96D767479F9619F1C034467D7231S.nodes)
    const allEvents = sortByTimestamp(data.allZephyrC4B405471033E73Ec0083Ca915572228S.nodes)
    const yieldData = sortByTimestamp(data.allZephyr28439Ed255B6Ccbb589A4635958Eec88S.nodes)

    let floatTotCollected
    if (publicKey) { floatTotCollected = calculateCollected(publicKey, allEvents, params.id) }

    //general pool variables
    const contractsSupplies = filterAndSortSupplies(ContractSupplyNodes)
    const found = contractsSupplies.find(obj => {
        return fromStringToKey(obj.contract) === params.id
    })

    //specific account variables

    //YieldAccountData in in calculateMatured
    const YieldAccountData = ContractAccountYieldNodes.filter(obj => parseAddress(obj.address) === publicKey)
    const accountData = allAccountData.filter(obj => parseAddress(obj.address) === publicKey)
    const account_supplies = filterAndSortAccountSupplies(accountData)
    const accountBalanceForPool = account_supplies.find(obj => {
        return fromStringToKey(obj.contract) === params.id
    })
    const accountContractData = accountData.filter(obj => fromStringToKey(obj.contract) === params.id)
    const yieldContractAccountData = YieldAccountData.filter(obj => fromStringToKey(obj.contract) === params.id)

    let matured
    if (publicKey) { matured = await calculateMatured(publicKey, allEvents, params.id, ContractAccountYieldNodes) }

    //same as using the NormYield component (to eliminate)
    const totWeightedYield = await getTotNormYield(params.id, yieldData, 8)

    const show = searchParams?.show
    const success = searchParams?.success
    const error = searchParams?.error

    let is_error = false;
    let is_success = false;
    let is_show = false;

    if (show !== undefined) {
        is_show = true
    }

    if (success !== undefined) {
        is_success = true
    }

    if (error !== undefined) {
        is_error = true
    }

    /*
    let publisher = `This pool was not published to the list of verified pools, if you want to add it follow <a href="https://github.com/xycloo/xycloans">these steps</a>.`
    let pool_publisher = getPoolPublisher(params.id);
    if (pool_publisher !== "Unknown") {
        publisher = `Published by ${pool_publisher}.`; // publisher text needs to be trusted anyways
    }
    */

    return (
        <main>
            <div className="inline-block w-full py-5 mb-4 bg-[#12eab7] bg-opacity-40 bg-gradient-to-r from-[#6366f1] to-[#9333ea] bg-opacity-100 rounded-md shadow-sm">
                <div className="flex my-2 w-full">
                    <div className="py-3 w-2/3 md:w-1/2">
                        <div className="flex ml-4 sm:ml-8">
                            {getAssetLogo(params.id) &&
                                <Image
                                    src={getAssetLogo(params.id)}
                                    width="40"
                                    height="100"
                                    className="h-10 my-auto"
                                    alt="logo"
                                />}
                            {!getAssetLogo(params.id) &&
                                <Image
                                    src={GreenPlaceholder}
                                    width="40"
                                    height="100"
                                    className="h-10 my-auto"
                                    alt="logo"
                                />}
                            <div className="block my-auto">
                                <h2 className="text-gray-600 text-white font-bold text-3xl my-auto ml-2">{getPoolName(params.id)}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end items-center w-1/3 md:w-1/2">
                        <div className="text-center mr-4 sm:mr-10">
                            <p className="text-xs sm:text-sm text-gray-300">Total liquidity</p>
                            <p className="text-gray-900 text-white font-semibold text-base sm:text-lg">{stroopsToUnit(found.supply, 2)}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col lg:flex-row">
                <div className="lg:w-2/3 lg:mr-4 bg-white border border-gray-100 rounded-md">
                    {found &&
                        <div className="my-8 mx-auto px-8">
                            <PoolInfo poolId={fromStringToKey(found.contract)} supply={found.supply} supplyData={ContractSupplyNodes} yieldData={yieldData} weightedYield={totWeightedYield} accountContractData={accountContractData} yieldContractAccountData={yieldContractAccountData} />
                        </div>}
                </div>
                <div className="flex flex-col md:flex-row lg:flex-col lg:w-1/3">
                    {publicKey &&
                        <div className="sm:w-full md:w-1/2 lg:w-full md:mr-4 lg:mr-0 mt-4 lg:mt-0 bg-white border border-gray-100 rounded-md">
                            <div className="my-5 mx-auto px-8">
                                <p className="text-lg text-gray-700 font-semibold">Personal dashboard</p>
                                <div>
                                    {accountBalanceForPool && (
                                        <div className="flex flex-wrap justify-start mt-8">
                                            <div className="w-auto mr-5">
                                                <p className="text-sm text-gray-400 font-light">Balance</p>
                                                <p className="text-gray-700 font-medium">{stroopsToUnit(accountBalanceForPool.balance, 2)}</p>
                                            </div>
                                            <div className="w-auto mr-5">
                                                <p className="text-sm text-gray-400 font-light">Yield</p>
                                                <p className="text-gray-700 font-medium">
                                                    {/* <Yield contractId={params.id} yieldData={YieldAccountData} radix={16} /> */}
                                                    {stroopsToUnit(getTotYield(params.id, YieldAccountData, 16), 4)}
                                                </p>
                                            </div>
                                            <div className="w-auto">
                                                <p className="text-sm text-gray-400 font-light">Weighted<span className="invisible">_</span>Yield</p>
                                                <p className="text-gray-700 font-medium">
                                                    {/* <NormYield contractId={params.id} yieldData={YieldAccountData} radix={8} /> */}
                                                    {getTotNormYield(params.id, YieldAccountData, 8).toFixed(4)} %
                                                </p>
                                            </div>
                                            <hr className="w-full my-5" />
                                            <div className="w-24 my-3">
                                                <p className="text-sm text-gray-400 font-light">Matured</p>
                                                <p className="text-gray-700 font-medium">{matured.toFixed(4)}</p>
                                            </div>
                                            <div className="w-max my-auto">
                                                <UpdateRewards contractId={params.id} publicKey={publicKey} fromHome={false} />
                                            </div>
                                            <hr className="w-full my-5" />
                                            <div className="w-24 my-3">
                                                <p className="text-sm text-gray-400 font-light">Collected<span className="invisible">_</span></p>
                                                <p className="text-gray-700 font-medium">{floatTotCollected}</p>
                                            </div>
                                            <div className="w-max my-auto">
                                                <WithdrawMatured contractId={params.id} publicKey={publicKey} />
                                            </div>
                                        </div>
                                    )}
                                    {!accountBalanceForPool && (
                                        <div className="mt-6 mx-auto">
                                            <p className="text-sm text-gray-400 font-light">Balance</p>
                                            <p className="font-medium text-gray-700">0</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    }
                    {!publicKey &&
                        <div className="w-full mt-4 lg:mt-0 bg-white border border-gray-100 rounded-md">
                            <div className="mt-5 mb-7 mx-auto px-8">
                                <p className="text-lg text-gray-700 font-semibold">Personal dashboard</p>
                                <p className="mt-5 text-sm">Connect your wallet</p>
                            </div>
                        </div>}
                    {publicKey &&
                        <div className="sm:w-full md:w-1/2 lg:w-full mt-4 bg-white border border-gray-100 rounded-md">
                            <div className="mt-6 mb-7 mx-auto px-8">
                                <DepositOrWithdraw contractId={params.id} publicKey={publicKey} />
                            </div>
                        </div>}
                </div>
            </div>
            <>
                {is_show && <LoadingModal id={params.id} msg={show} />}
                {is_success && <SuccessModal id={params.id} msg={success} />}
                {is_error && <ErrorModal id={params.id} error={error} />}
            </>
        </main>
    )
}