import { xdr, StrKey } from "@stellar/stellar-sdk";
import * as React from 'react';
import { fetchAllEvents } from "../soroban/fetchData";
import { fromStringToKey, parseBase64Yield, parseTimestamp } from "@/helpers/dataParsing";
import { getPoolName } from "@/helpers/aggregation";
import Image from "next/image";
import PoolsImage from "/public/globe-xycloans.png";


export default async function FlashLoanEcosystem() {
    
    function truncateMiddle(str, n) {
        const midIndex = Math.floor(str.length / 2);
        return str.slice(0, midIndex - Math.floor(n / 2)) + '...' + str.slice(midIndex + Math.ceil(n / 2));
    }
    
    function fromParts(hi, lo) {
        const result = (BigInt(hi) << BigInt(64)) + BigInt(lo);
        return result.toString();
    }
    
    let data = await fetchAllEvents();
    data = data.allZephyrC4B405471033E73Ec0083Ca915572228S;
    
    let allEcosystemEvents = data.nodes;

    for (let i = 0; i < allEcosystemEvents.length; i++) {
        allEcosystemEvents[i].sequence = parseBase64Yield(allEcosystemEvents[i].sequence, 16)
        allEcosystemEvents[i].timestamp = new Date(parseTimestamp(allEcosystemEvents[i].timestamp)).toLocaleString()
        allEcosystemEvents[i].contract = fromStringToKey(allEcosystemEvents[i].contract)
        allEcosystemEvents[i].topic1 = xdr.ScVal.fromXDR(allEcosystemEvents[i].topic1, "base64").sym().toString()
        
        const topic2 = xdr.ScVal.fromXDR(allEcosystemEvents[i].topic2, "base64");
        
        if (topic2.address().switch().name === "scAddressTypeAccount") {
            allEcosystemEvents[i].topic2 =  StrKey.encodeEd25519PublicKey(xdr.ScVal.fromXDR(allEcosystemEvents[i].topic2, "base64").address().accountId().value())
        } else {
            allEcosystemEvents[i].topic2 = StrKey.encodeContract(xdr.ScVal.fromXDR(allEcosystemEvents[i].topic2, "base64").address().contractId())
        }
        
        const parts = xdr.ScVal.fromXDR(allEcosystemEvents[i].data, "base64").i128();
        allEcosystemEvents[i].data = fromParts(parts.hi(), parts.lo());
    }
    
    allEcosystemEvents.reverse()

    return (
        <main>
            <div className="inline-block w-full py-5 mb-4 bg-[#12eab7] bg-opacity-40 bg-gradient-to-r from-[#6366f1] to-[#9333ea] bg-opacity-100 rounded-md shadow-sm">
                <div className="py-3 sm:py-5">
                <div className="flex ml-4 sm:ml-8">
                        <Image
                            src={PoolsImage}
                            width="40"
                            height="100"
                            className="h-10 my-auto"
                            alt="globe"
                        />
                        <h2 className="text-gray-600 text-white font-bold text-2xl sm:text-3xl my-auto ml-2">Flash Loans Ecosystem Explorer</h2>
                    </div>
                </div>
            </div>
            <div className="relative overflow-x-auto  ">
                        <table className="text-sm text-left rtl:text-right text-gray-500 w-full max-w-[90rem] m-auto">
                            <thead className="text-xs text-gray-500 bg-white border-b border-gray-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Pool
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Sequence
                                    </th>
                                    
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Time
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Action
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Topic 2
                                    </th>
                                    <th scope="col" className="px-6 py-3 font-light">
                                        Data (stroops)
                                    </th>
                                </tr>
                            </thead>
                            {allEcosystemEvents.map((node) => (
                                <tbody className="text-xs font-ligth">
                                    <tr className="bg-white border-b hover:bg-gray-50 text-xs text-gray-500">
                                        <th className="px-6 py-4">
                                            <a className="text-[#2ca56d]" href={`/pools/${node.contract}`}>{getPoolName(node.contract)}</a>
                                        </th>
                                        <td scope="row" className="px-6 py-4">
                                        {node.sequence}
                                        </td>
                                        <td className="px-6 py-4">
                                        {node.timestamp}
                                        </td>
                                        <td className="px-6 py-4">
                                        {node.topic1}
                                        </td>
                                        <td className="px-6 py-4">
                                            {truncateMiddle(node.topic2, 40)}
                                        </td>
                                        <td className="px-6 py-4 text-left">
                                            {node.data}
                                        </td>
                                        
                                    </tr>
                                </tbody>
                            ))}
                        </table>
                    </div>
        </main>
    )
}

export const dynamic = 'force-dynamic'