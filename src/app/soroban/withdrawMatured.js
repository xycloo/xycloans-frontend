"use client"

import { Contract, Address } from '@stellar/stellar-sdk'
import { useRouter } from 'next/navigation'
import { publishTx } from './tx'


export default function WithdrawMatured(props) {

    const contractId = props.contractId
    const publicKey = props.publicKey
    const router = useRouter()

    async function handleWithdrawMatured() {
        const contractAddress = contractId
        const contract = new Contract(contractAddress)
        const contract_call = contract.call("withdraw_matured", new Address(publicKey).toScVal())

        const loadingMessage = "Withdrawing matured fee rewards"
        const message = "Withdrawn matured fee rewards"
        
        router.push(`?show=${loadingMessage}`)
    
        try {
            await publishTx(publicKey, contract_call);
            router.push(`?success=${message}`)
            router.refresh()
        } catch (e) {
            router.push(`?error=${e}`)
            router.refresh()
        }
    } return (
        <button onClick={handleWithdrawMatured} className="rounded-lg w-40 m-auto bg-gradient-to-r from-[#6366f1] to-[#9333ea] hover:bg-gradient-to-r hover:from-[#4f46e5] hover:to-[#7e22ce] transition duration-900 ease-in-out text-white font-normal mx-1 shadow-md">
        <span className="text-sm w-max mx-auto">
            Withdraw rewards
        </span>
    </button>)
}