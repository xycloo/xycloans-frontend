"use client"

import { Contract, Address } from '@stellar/stellar-sdk'
import { useRouter } from 'next/navigation'
import { publishTx } from './tx'

export default function UpdateRewards(props) {

    const publicKey = props.publicKey
    const router = useRouter()

    async function handleUpdateRewards() {

        const contractAddress = props.contractId
        const contract = new Contract(contractAddress)
        const contractCall = contract.call("update_fee_rewards", new Address(publicKey).toScVal());
        
        const loadingMessage = "Updating matured fee rewards"
        const message = "Updated matured fee rewards"
        
        router.push(`?show=${loadingMessage}`)

        try {
            await publishTx(publicKey, contractCall);
            router.push(`?success=${message}`)
            router.refresh()
        } catch (e) {
            router.push(`?error=${e}`)
            router.refresh()
            }

    } return (
        <button onClick={handleUpdateRewards} className="rounded-lg w-40 m-auto bg-gradient-to-r from-[#6366f1] to-[#9333ea] hover:bg-gradient-to-r hover:from-[#4f46e5] hover:to-[#7e22ce] transition duration-900 ease-in-out text-white font-normal mx-1 shadow-md">
        <span className="text-sm w-max mx-auto">
            Update rewards
        </span>
    </button>)
}