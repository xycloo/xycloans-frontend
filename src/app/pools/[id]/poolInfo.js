'use client'

import { useState } from "react";
import Image from "next/image";
import MercuryLogo from "/public/mercury-logo-nobg.png"
import { getAssetId } from "@/helpers/aggregation";
import { SupplyChart } from "@/app/components/charts/supplyChart";
import { YieldChart } from "@/app/components/charts/yieldChart";
import { NormChart } from "@/app/components/charts/normChart";
import { AccountBalanceChart } from "@/app/components/charts/accountBalanceChart";
import { AccountYieldChart } from "@/app/components/charts/accountYieldChart";
import { NormAccountChart } from "@/app/components/charts/normAccountChart";
import { fromStringToKey } from "@/helpers/dataParsing";

export const PoolInfo = (props) => {
    const [showPoolData, setShowPoolData] = useState(true);
    const handleToggle = (data) => {
        if ((data === 'poolData' && showPoolData) || (data === 'userData' && !showPoolData)) {
            // If the clicked button corresponds to the currently displayed form, do nothing
            return;
        }

        setShowPoolData((prev) => !prev);
    };

    const supplyDataForContract = props.supplyData.filter(obj => {
        return fromStringToKey(obj.contract) === props.poolId
    })

    const yieldDataForContract = props.yieldData.filter(obj => {
        return fromStringToKey(obj.contract) === props.poolId
    })

    const totWeightedYield = props.weightedYield

    return (
        <div>
            <div className="flex justify-between items-center mt-4">
                <div className="flex">
                    <button
                        className={`${showPoolData
                                ? 'bg-[#12eab7] hover:bg-primary border border-[#12eab7] hover:border-primary transition duration-300 ease-in-out'
                                : 'bg-gray-100 hover:bg-gray-200 border border-gray-100 hover:border-gray-200 transition duration-300 ease-in-out'
                            } text-black font-medium rounded-l-lg py-2 px-auto flex justify-center shadow-sm w-28`}
                        onClick={() => handleToggle('poolData')}
                    >
                        Pool data
                    </button>
                    <button
                        className={`${!showPoolData
                                ? 'bg-[#12eab7] hover:bg-primary border border-[#12eab7] hover:border-primary transition duration-300 ease-in-out'
                                : 'bg-gray-100 hover:bg-gray-200 border border-gray-100 hover:border-gray-200 transition duration-300 ease-in-out'
                            } text-black font-medium rounded-r-lg py-2 px-auto flex justify-center shadow-sm w-28`}
                        onClick={() => handleToggle('userData')}
                    >
                        Your data
                    </button>
                </div>
                <div className="ml-auto invisible sm:visible flex">
                    <Image
                        src={MercuryLogo}
                        width="30"
                        className="w-[34px] h-[32px] my-auto mr-1"
                        alt="logo"
                    />
                    <div className="">
                        <p className="text-xs text-gray-400 font-light">Data powered by</p>
                        <a target="_blank" href="https://mercurydata.app/"><p className="text-sm text-[#ff8935] font-medium">Mercury</p></a>
                    </div>
                </div>
            </div>
            <div className="mt-6">
                {showPoolData && (
                    <div className="">
                        <div className="flex flex-wrap relative overflow-x-auto mt-12 mb-6">
                            <p className="w-32 mr-16 mb-5 text-sm font-semibold text-gray-700">Info</p>
                            <div className="">
                                <div className="w-auto">
                                    <p className="text-sm text-gray-400 font-light	">Pool Id</p>
                                    <p className="text-gray-600 font-medium text-sm">{props.poolId}</p>
                                </div>
                                <div className="flex">
                                    <div className="w-auto mt-5">
                                        <p className="text-sm text-gray-400 font-light">Asset</p>
                                        <p className="text-gray-600 font-medium">{getAssetId(props.poolId)}</p>
                                    </div>
                                    <div className="w-auto mt-5 ml-10">
                                        <p className="text-sm text-gray-400 font-light">Total weighted yield</p>
                                        <p className="text-gray-600 font-medium">{totWeightedYield.toFixed(4)} %</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr className="w-full" />
                        <div className="flex flex-wrap relative overflow-x-auto h-max">
                            <p className="pt-[72px] w-32 mr-10 text-sm font-semibold text-gray-700">Pool supply</p>
                            <div className="relative inline-block w-[30rem]">
                                <div className="w-full h-[16rem] mt-20 mb-[5.5rem] bg-gray-100 rounded-xl flex items-center justify-center"><div className="text-center p-3 text-sm"><p className="text-gray-500">Chart data is already here</p><p className="mt-2 text-gray-700 font-medium">loading plot...</p></div></div>
                                <div className="absolute top-0 left-0">
                                    <SupplyChart data={supplyDataForContract} />
                                </div>
                            </div>
                        </div>
                        <hr className="w-full" />
                        <div className="flex flex-wrap relative overflow-x-auto">
                            <p className="pt-[72px] w-32 mr-10 text-sm font-semibold text-gray-700">Pool yield</p>
                            <div className="relative inline-block w-[30rem]">
                                <div className="w-full h-[16rem] mt-20 mb-[5.5rem] bg-gray-100 rounded-xl flex items-center justify-center"><div className="text-center p-3 text-sm"><p className="text-gray-500">Chart data is already here</p><p className="mt-2 text-gray-700 font-medium">loading plot...</p></div></div>
                                <div className="absolute top-0 left-0">
                                    <YieldChart data={yieldDataForContract} />
                                </div>
                            </div>
                        </div>
                        <hr className="w-full" />
                        <div className="flex flex-wrap relative overflow-x-auto">
                            <p className="pt-[72px] w-32 mr-10 text-sm font-semibold text-gray-700">Normalized supply & yield</p>
                            <div className="relative inline-block w-[30rem]">
                                <div className="w-full h-[16rem] mt-20 mb-[5.5rem] bg-gray-100 rounded-xl flex items-center justify-center"><div className="text-center p-3 text-sm"><p className="text-gray-500">Chart data is already here</p><p className="mt-2 text-gray-700 font-medium">loading plot...</p></div></div>
                                <div className="absolute top-0 left-0">
                                    <NormChart supplyData={supplyDataForContract} yieldData={yieldDataForContract} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {!showPoolData && (
                    <div className="">
                        <div className="flex flex-wrap relative overflow-x-auto mt-12 mb-6">
                            <p className="w-32 mr-16 mb-5 text-sm font-semibold text-gray-700">Info</p>
                            <div className="">
                                <div className="w-auto">
                                    <p className="text-sm text-gray-400 font-light">Pool Id</p>
                                    <p className="text-gray-600 font-medium text-sm">{props.poolId}</p>
                                </div>
                                <div className="w-auto mt-5">
                                    <p className="text-sm text-gray-400 font-light">Asset</p>
                                    <p className="text-gray-600 font-medium">{getAssetId(props.poolId)}</p>
                                </div>
                            </div>
                        </div>
                        <hr className="w-full" />
                        <div className="flex flex-wrap relative overflow-x-auto">
                            <p className="pt-[72px] w-32 mr-10 text-sm font-semibold text-gray-700">Pool supply</p>
                            <div className="relative inline-block w-[30rem]">
                                <div className="w-full h-[16rem] mt-20 mb-[5.5rem] bg-gray-100 rounded-xl flex items-center justify-center"><div className="text-center p-3 text-sm"><p className="text-gray-500">Chart data is already here</p><p className="mt-2 text-gray-700 font-medium">loading plot...</p></div></div>
                                <div className="absolute top-0 left-0">
                                    <AccountBalanceChart data={props.accountContractData} />
                                </div>
                            </div>
                        </div>
                        <hr className="w-full" />
                        <div className="flex flex-wrap relative overflow-x-auto">
                            <p className="pt-[72px] w-32 mr-10 text-sm font-semibold text-gray-700">Pool yield</p>
                            <div className="relative inline-block w-[30rem]">
                                <div className="w-full h-[16rem] mt-20 mb-[5.5rem] bg-gray-100 rounded-xl flex items-center justify-center"><div className="text-center p-3 text-sm"><p className="text-gray-500">Chart data is already here</p><p className="mt-2 text-gray-700 font-medium">loading plot...</p></div></div>
                                <div className="absolute top-0 left-0">
                                    <AccountYieldChart data={props.yieldContractAccountData} />
                                </div>
                            </div>
                        </div>
                        <hr className="w-full" />
                        <div className="flex flex-wrap relative overflow-x-auto">
                            <p className="pt-[72px] w-32 mr-10 text-sm font-semibold text-gray-700">Normalized supply & yield</p>
                            <div className="relative inline-block w-[30rem]">
                                <div className="w-full h-[16rem] mt-20 mb-[5.5rem] bg-gray-100 rounded-xl flex items-center justify-center"><div className="text-center p-3 text-sm"><p className="text-gray-500">Chart data is already here</p><p className="mt-2 text-gray-700 font-medium">loading plot...</p></div></div>
                                <div className="absolute top-0 left-0">
                                    <NormAccountChart balanceData={props.accountContractData} yieldData={props.yieldContractAccountData} />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
