"use client"

import { xdr, Contract, Address } from '@stellar/stellar-sdk'
import { useState } from "react";
import { useRouter } from 'next/navigation'
import PoolsImage from "/public/pools-image-xycloans.png"
import Image from "next/image"
import { publishTx } from './tx';
import { getAssetId } from '@/helpers/aggregation';


export default function Withdraw(props) {

    const [quantity, setQuantity] = useState('')
    const contractAddress = props.contractId
    const publicKey = props.publicKey;
    const router = useRouter()

    function checkDecimalsAndSetQuantity(input) {
        let value

        if (input.value.includes('.') && input.value.split('.')[1].length > 7) {
            value = parseFloat(input.value).toFixed(7)
        } else { value = input.value}

        setQuantity(value)
    }

    async function handleWithdraw(e) {

        e.preventDefault()

        const amount = xdr.ScVal.scvI128(new xdr.Int128Parts({
            lo: xdr.Uint64.fromString((Number(BigInt(quantity * 10000000) & BigInt(0xFFFFFFFFFFFFFFFFn))).toString()),
            hi: xdr.Int64.fromString((Number((BigInt(quantity * 10000000) >> BigInt(64)) & BigInt(0xFFFFFFFFFFFFFFFFn))).toString()),
        }));

        const contract = new Contract(contractAddress)
        const contract_call = contract.call("withdraw", new Address(publicKey).toScVal(), amount);
        
        const assetId = getAssetId(contractAddress)
        const dialogProps = `Withdrawn ${quantity} ${assetId} from pool: ${contractAddress}`; 
        const loadingDialogProps = `Withdrawing ${quantity} ${assetId} from pool: ${contractAddress}`

        
        router.push(`?show=${loadingDialogProps}`)

        try {
            await publishTx(publicKey, contract_call);
            router.push(`?success=${dialogProps}`)
            router.refresh()
        } catch (e) {
            router.push(`?error=${e}`)
            router.refresh()
        }
    }
    return (
        <div>
            <div className="flex justify-center mr-12">
                <Image
                    src={PoolsImage}
                    width="20"
                    height="100"
                    className="h-5"
                    alt="globe"
                />
                <p className="font-light text-xs my-auto ml-1">Express quantity in units, not stroops</p>
            </div>
        <form className="bg-white mx-auto py-0 !px-0 my-2" onSubmit={handleWithdraw}>
            <label className="flex justify-center">
                <input
                    className="bg-gray-50 border border-gray-200 focus:outline-none focus:border-yellow-100 text-gray-900 text-sm rounded-lg transition duration-300 block w-2/3 mx-1"
                    required
                    type="number"
                    placeholder="Quantity"
                    onChange={(e) => checkDecimalsAndSetQuantity(e.target)}
                    value={quantity}>
                </input>
                <button className="rounded-lg m-auto w-24 bg-gradient-to-r from-[#6366f1] to-[#9333ea] hover:bg-gradient-to-r hover:from-[#4f46e5] hover:to-[#7e22ce] transition duration-900 ease-in-out text-white mx-1 shadow-md">
                    <span className="text-sm">
                        Withdraw
                    </span>
                </button>
            </label>
        </form>
        </div>
    )
}