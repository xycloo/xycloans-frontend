import Image from "next/image";
import PoolsImage from "/public/globe-xycloans.png"
import Placeholder from "/public/currency-xycloans.png"
import * as React from 'react';
import { fetchPools } from "../soroban/fetchData";
import { filterAndSortSupplies, getAssetId, getAssetLogo, getPoolName, getTotNormYield, getTotYield, numberOfPools } from "@/helpers/aggregation";
import { fromStringToKey } from "@/helpers/dataParsing";
import { stroopsToUnit } from "@/helpers/dataManipulation";

export default async function Pools() {
    const data = await fetchPools()
    //get the data about the balance for each pool
    const supplyData = data.allZephyrD6Eacc6B192F3Ae14116A75Fac2D1Db6S.nodes
    //get the data about all the new yields for each borrow for each pool
    const yieldData = data.allZephyr28439Ed255B6Ccbb589A4635958Eec88S.nodes

    const contracts = filterAndSortSupplies(supplyData);

    return (
        <main>
            <div className="inline-block w-full py-5 mb-4 bg-[#12eab7] bg-opacity-40 bg-gradient-to-r from-[#6366f1] to-[#9333ea] bg-opacity-100 border rounded-md shadow-sm">
                <div className="flex my-2 w-full">
                <div className="py-3 w-2/3 md:w-1/2">
                    <div className="flex ml-4 sm:ml-8">
                        <Image
                            src={PoolsImage}
                            width="40"
                            height="100"
                            className="h-10 my-auto"
                            alt="globe"
                        />
                        <h2 className="text-gray-600 text-white font-bold text-3xl my-auto ml-2">Active Pools</h2>
                    </div>
                    </div>
                    <div className="flex justify-end items-center w-1/3 md:w-1/2">
                        <div className="text-center mr-4 sm:mr-10">
                            <p className="text-xs sm:text-sm text-gray-300">Number of pools</p>
                            <p className="text-white font-semibold text-base sm:text-lg">{numberOfPools(supplyData)}</p>
                        </div>
                    </div>
                </div>
            </div>
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
                                        Supply
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Tot Yield
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Tot Weighted Yield
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        <span className="sr-only">Details</span>
                                    </th>
                                </tr>
                            </thead>
                            {contracts.map((node) => (
                                <tbody>
                                    <tr className="bg-white border-b hover:bg-gray-50 text-gray-700 text-sm lg:text-base font-medium">
                                        <td className="px-6 py-4">
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
                                        </td>
                                        <th scope="row" className="px-6 py-4 font-medium text-gray-700 whitespace-nowrap">
                                            {/*fromStringToKey(toHex(node.contract)).substring(0, 10) + "..."*/}
                                            {getPoolName(fromStringToKey(node.contract))}
                                        </th>
                                        <td className="px-6 py-4">
                                            {stroopsToUnit(node.supply, 2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            {/*<Yield contractId={fromStringToKey(toHex(node.contract))} yieldData={yieldData} radix={8} /> */}
                                            {stroopsToUnit(getTotYield(fromStringToKey(node.contract), yieldData, 8), 4)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {/* <NormYield contractId={fromStringToKey(toHex(node.contract))} yieldData={yieldData} radix={8} /> */}
                                            {getTotNormYield(fromStringToKey(node.contract), yieldData, 8).toFixed(4)} %

                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a href={`/pools/${fromStringToKey(node.contract)}`} className="flex justify-end">
                                                <button className="bg-[#12eab7] hover:bg-primary border border-[#12eab7] hover:border-primary transition duration-300 ease-in-out text-gray-800 rounded-lg font-medium shadow-md">
                                                    Details
                                                </button>
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
                </div>
        </main>
    )
}

