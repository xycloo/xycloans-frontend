import { cookies } from "next/headers";
import UpdateRewards from "../soroban/updateRewards";
import Image from 'next/image'
import Explore from "/public/financial-growth-xycloans.png"
import Borrow from "/public/dividends-xycloans.png"
import GraphIcon from "/public/graph-icon.png"
import Supplies from "/public/green-supplies.png"
import Placeholder from "/public/currency-xycloans.png"
import { fetchPools } from "../soroban/fetchData";
import { stroopsToUnit } from "@/helpers/dataManipulation";
import { getTotYield, calculateMatured, getAssetId, getAssetLogo, getPoolName, getTotAccountNormYield, getTotNormYield, filterAndSortAccountSupplies } from "@/helpers/aggregation";
import LoadingModal from "../components/modals/loadingModal";
import SuccessModal from "../components/modals/successModal";
import ErrorModal from "../components/modals/errorModal";
import { fromStringToKey, parseAddress } from "@/helpers/dataParsing";
import { redirect } from 'next/navigation'


export default async function Home({ searchParams }) {

    const cookiesStore = cookies()

    let publicKey
    if (cookiesStore.get("publicAddress")) {
        publicKey = cookiesStore.get("publicAddress").value
    } else { redirect('/') }


    const data = await fetchPools()

    //the objects that represent the change in balance for every account for each pool every time the balance changes
    const allAccountData = data.allZephyr189C96D767479F9619F1C034467D7231S.nodes

    //all the objects that represent the yield for each account for each contract for each borrow
    const allYieldAccountData = data.allZephyr9473E79262F2F063D45166Fe1D270D0Fs.nodes

    //all events
    const allEvents = data.allZephyrC4B405471033E73Ec0083Ca915572228S.nodes

    //const cookies = cookies();
    //const publicAddress = cookies.get('publicAddress');

    //all the entries in the allAccountsData array that belong to the account that shared its public key (that is logged in)
    const accountData = allAccountData.filter(obj => parseAddress(obj.address) === publicKey)

    //the most recent object of the account data array (the one with the current balance)
    const lastObjectXPool = filterAndSortAccountSupplies(accountData)

    const YieldAccountData = allYieldAccountData.filter(obj => parseAddress(obj.address) === publicKey)

    let totAccountYield = undefined
    if (publicKey) { totAccountYield = getTotAccountNormYield(YieldAccountData) }

    const show = searchParams?.show
    const success = searchParams?.success
    const error = searchParams?.error

    let is_show = false
    let is_error = false;
    let is_success = false;

    if (show !== undefined) {
        is_show = true
    }

    if (success !== undefined) {
        is_success = true
    }

    if (error !== undefined) {
        is_error = true
    }

    return (
        <main>
            <div>
                <div className="inline-block w-full py-5 mb-4 bg-gradient-to-r from-[#6366f1] to-[#9333ea] bg-opacity-100 rounded-md shadow-sm">
                    <div className="flex my-2 w-full">
                        <div className="py-3 w-2/3 md:w-1/2">
                            <div className="flex ml-4 sm:ml-8">
                                <Image
                                    src={Supplies}
                                    width="40"
                                    height="100"
                                    className="h-10 my-auto"
                                    alt="globe"
                                />
                                <h2 className="text-white font-bold text-3xl my-auto ml-2">Your supplies</h2>
                            </div>
                        </div>
                        <div className="flex justify-end items-center w-1/3 md:w-1/2">
                            <div className="text-center mr-4 sm:mr-10">
                                <p className="text-xs sm:text-sm text-gray-300">Tot weighted yield</p>
                                <p className="text-white font-semibold text-base sm:text-lg">{totAccountYield.toFixed(4)} %</p>
                                {/*  //to calculate the tot balance of account  <AccountAggregatedMetrics data={lastObjectXPool} />*/}
                            </div>
                        </div>
                    </div>
                </div>
                {lastObjectXPool.length === 0 &&
                    <div className="flex flex-col lg:flex-row">
                        <div className="flex items-center justify-center lg:w-1/2 h-96 bg-white border border-gray-100 rounded-md lg:rounded-l-md mb-4 lg:mb-0">
                            <p>You have no positions</p>
                        </div>
                        <div className="lg:w-1/2 lg:ml-4 h-96">
                            <div className="h-[183.5px] bg-white border border-gray-100 rounded-md mb-4">
                                <div className="my-5 mx-auto px-8 flex flex-col">
                                    <p className="text-lg text-gray-700 font-medium mb-2 sm:mb-4">Liquidity providers</p>
                                    <div className="flex items-center justify-start pt-3">
                                        <Image
                                            src={Explore}
                                            width="40"
                                            height="100"
                                            className="h-16 w-16 bg-gray-100 border border-gray-100 rounded-xl p-2 shadow-md"
                                            alt="globe"
                                        />
                                        <div className="ml-3">
                                            <p className="text-gray-700 font-semibold">Explore markets</p>
                                            <p className="text-sm text-gray-500">Take a look at the <a href="/pools">existing pools</a>, or jump to the <a target="_blank" href="https://docs.xycloans.app/lenders/welcome-lender">liquidity providers</a> section to learn more.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="h-[183.5px] bg-white border border-gray-100 rounded-md">
                                <div className="my-5 mx-auto px-8 flex flex-col">
                                    <p className="text-lg text-gray-700 font-medium mb-2 sm:mb-4">Borrowers</p>
                                    <div className="flex items-center justify-start pt-3">
                                        <Image
                                            src={Borrow}
                                            width="40"
                                            height="100"
                                            className="h-16 w-16 bg-gray-100 border border-gray-100 rounded-xl p-2 shadow-md"
                                            alt="globe"
                                        />
                                        <div className="ml-3">
                                            <p className="text-gray-700 font-semibold">Use flash loans</p>
                                            <p className="text-sm text-gray-500">Go to the <a target="_blank" href="https://docs.xycloans.app/borrowers/borrowing-from-xycloans">borrowers</a> section to learn how to request and use flash loans.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>}
                {lastObjectXPool.length !== 0 &&
                    <div>
                        <div className="relative overflow-x-auto rounded-md">
                            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                                <thead className="text-xs text-gray-500 bg-white border-b border-gray-100">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 font-light">
                                            Asset
                                        </th>
                                        <th scope="col" className="px-6 py-3 font-light">
                                            Pool
                                        </th>
                                        <th scope="col" className="px-6 py-3 font-light">
                                            Position
                                        </th>
                                        <th scope="col" className="px-6 py-3 font-light">
                                            Tot Yield
                                        </th>
                                        <th scope="col" className="px-6 py-3 font-light">
                                            Total Weighted Yield
                                        </th>
                                        <th scope="col" className="px-6 py-3 font-light">
                                            Matured
                                        </th>
                                        <th scope="col" className="px-6 py-3 font-light">
                                            <span className="sr-only">Details</span>
                                        </th>
                                        <th scope="col" className="px-6 py-3 font-light flex justify-end">
                                            <span className="sr-only">Mature</span>
                                        </th>
                                    </tr>
                                </thead>
                                {lastObjectXPool.map((node) => (
                                    <tbody>
                                        <tr className="bg-white border-b hover:bg-gray-50 text-gray-700 text-sm lg:text-base font-medium">
                                            <th scope="row" className="px-6 py-4 text-gray-700 text-sm lg:text-base font-medium whitespace-nowrap">
                                                <div className="flex">
                                                    {getAssetLogo(fromStringToKey(node.contract)) &&
                                                        <Image
                                                            src={getAssetLogo(fromStringToKey(node.contract))}
                                                            width="30"
                                                            height="100"
                                                            className=""
                                                            alt="globe"
                                                        />}
                                                    {!getAssetLogo(fromStringToKey(node.contract)) &&
                                                        <Image
                                                            src={Placeholder}
                                                            width="30"
                                                            height="100"
                                                            className=""
                                                            alt="globe"
                                                        />}
                                                    <p className="my-auto ml-2">{getAssetId(fromStringToKey(node.contract))}</p>
                                                </div>
                                            </th>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {getPoolName(fromStringToKey(node.contract))}
                                            </td>
                                            <td className="px-6 py-4">
                                                {stroopsToUnit(node.balance, 2)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {/*<Yield contractId={fromStringToKey((node.contract))} yieldData={YieldAccountData} radix={16} />*/}
                                                {stroopsToUnit(getTotYield(fromStringToKey(node.contract), YieldAccountData, 16), 4)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {/*<NormYield contractId={fromStringToKey(toHex(node.contract))} yieldData={YieldAccountData} radix={8} /> */}
                                                {getTotNormYield(fromStringToKey(node.contract), YieldAccountData, 8).toFixed(4)} %
                                            </td>
                                            <td className="px-6 py-4">
                                                {calculateMatured(publicKey, allEvents, fromStringToKey(node.contract), allYieldAccountData).toFixed(4)}
                                            </td>
                                            <td className="px-6 py-4">
                                                {<a href={`/pools/${fromStringToKey(node.contract)}`} className="flex justify-end">
                                                    <button className="bg-[#12eab7] hover:bg-primary border border-[#12eab7] hover:border-primary transition duration-300 ease-in-out text-gray-800 rounded-lg font-medium shadow-md">
                                                        Details
                                                    </button>
                                                </a>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex justify-end">
                                                    <UpdateRewards contractId={fromStringToKey(node.contract)} publicKey={publicKey} fromHome={true} />
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                ))}
                            </table>
                        </div>
                        <div className="flex flex-col md:flex-row">
                            <div className="w-full h-full md:w-1/2 flex">
                                <div className="bg-white border border-gray-100 rounded-md my-4 md:mb-0 md:mr-2 md:h-[128px] lg:h-[148px] flex items-center py-5 md:py-0">
                                    <div className="mx-auto px-8 flex flex-col items-center">
                                        <div className="flex items-center justify-start">
                                            <Image
                                                src={Explore}
                                                width="40"
                                                height="100"
                                                className="h-12 lg:h-14 w-12 lg:w-14 bg-gray-100 border border-gray-100 rounded-xl p-2 shadow-md"
                                                alt="globe"
                                            />
                                            <div className="ml-3">
                                                <p className="text-gray-700 font-semibold text-sm lg:text-base">Explore markets</p>
                                                <p className="text-xs lg:text-sm text-gray-500">Take a look at the <a href="/pools">existing pools</a>, or jump to the <a target="_blank" href="https://docs.xycloans.app/lenders/welcome-lender">liquidity providers</a> section in our docs to learn more.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full h-full md:w-1/2 flex">
                                <div className="bg-white border border-gray-100 rounded-md md:my-4 md:mb-0 md:ml-2 md:h-[128px] lg:h-[148px] flex items-center py-5 md:py-0">
                                    <div className="mx-auto px-8 flex flex-col items-center">
                                        <div className="flex items-center justify-start">
                                            <Image
                                                src={GraphIcon}
                                                width="40"
                                                height="100"
                                                className="h-12 lg:h-14 w-12 lg:w-14 bg-gray-100 border border-gray-100 rounded-xl p-2 shadow-md"
                                                alt="globe"
                                            />
                                            <div className="ml-3">
                                                <p className="text-gray-700 font-semibold text-sm lg:text-base">Coming soon: Advanced analytics</p>
                                                <p className="text-xs lg:text-sm text-gray-500">All your account data in one place: advanced statistics powered by the <a target="_blank" href="https://mercurydata.app/">Mercury indexer</a> coming soon.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>}
            </div>
            <>
                {is_show && <LoadingModal msg={show} fromHome={true} />}
                {is_success && <SuccessModal msg={success} fromHome={true} />}
                {is_error && <ErrorModal error={error} fromHome={true} />}
            </>
        </main>
    )
}

export const runtime = 'edge' // 'nodejs' (default) | 'edge'
