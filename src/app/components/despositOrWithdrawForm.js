'use client'

import { useState } from "react";
import Deposit from "../soroban/deposit";
import Withdraw from "../soroban/withdraw";


export const DepositOrWithdraw = (props) => {
  const [showForm1, setShowForm1] = useState(true);

  const handleToggle = (form) => {
    if ((form === 'deposit' && showForm1) || (form === 'withdraw' && !showForm1)) {
      // If the clicked button corresponds to the currently displayed form, do nothing
      return;
    }

    setShowForm1((prev) => !prev);
  };

  return (
    <div>
      <div className="flex justify-center my-2 pb-4">
        <button
          className={`${
            showForm1
              ? 'bg-[#12eab7] hover:bg-primary border border-[#12eab7] hover:border-primary transition duration-300 ease-in-out'
              : 'bg-gray-100 hover:bg-gray-200 border border-gray-100 hover:border-gray-200 transition duration-300 ease-in-out'
          } text-black font-medium rounded-l-lg py-2 px-auto flex justify-center shadow-sm w-28`}
          onClick={() => handleToggle('deposit')}
        >
          Deposit
        </button>
        <button
          className={`${
            !showForm1
              ? 'bg-[#12eab7] hover:bg-primary border border-[#12eab7] hover:border-primary transition duration-300 ease-in-out'
              : 'bg-gray-100 hover:bg-gray-200 border border-gray-100 hover:border-gray-200 transition duration-300 ease-in-out'
          } text-black font-medium rounded-r-lg py-2 px-auto flex justify-center shadow-sm w-28`}
          onClick={() => handleToggle('withdraw')}
        >
          Withdraw
        </button>
      </div>

      <div className="mt-8 mb-10">
        {showForm1 && (
          <div>
          <Deposit contractId={props.contractId} publicKey={props.publicKey} />
          </div>
        )}

        {!showForm1 && (
          <Withdraw contractId={props.contractId} publicKey={props.publicKey} />
        )}
      </div>
    </div>
  );}
