import { stroopsToUnit } from "./dataManipulation";
import { fromStringToKey, hexToFloat64, parseAddress, parseBase64Yield, parseTimestamp, toHex } from "./dataParsing";
import { StrKey, xdr } from "@stellar/stellar-sdk";
import List from "../../xycloans-list.json";


export function getTotYield(pool, yieldData, radix) {
    
    function calculateYieldSum(data) {
        // Initialize the sum
        let sum = 0;
      
        // Loop through each object in the array
        for (let i = 0; i < data.length; i++) {
          //this substitutes the above
          let yieldValue = parseBase64Yield(data[i].yield, radix)

          // Add the integer value to the sum
          sum += yieldValue;
        }
      
        // Return the total sum
        return sum;
      }  
    
    const yieldDataForContract = yieldData.filter(obj => {
        return fromStringToKey(obj.contract) === pool
    })

    const totYield = calculateYieldSum(yieldDataForContract)

    return (
        totYield
    )
}

//gets the tot norm yield for the specified pool for the the specified set of data (either for the whole pool or for a specific account)
export function getTotNormYield(pool, yieldData, radix) {
    function calculateYieldSum(data) {
        
        // Initialize the sum
        let sum = 0.0;
      
        // Loop through each object in the array
        for (let i = 0; i < data.length; i++) {
          // Decode the hexadecimal "yield" value to an integer
          const yieldValue = hexToFloat64(data[i].yieldnorm);

          // Add the integer value to the sum
          if (!isNaN(yieldValue)) {
            sum += yieldValue;
          }
        }
        // Return the total sum
        return sum;
      }  
    
    const yieldDataForContract = yieldData.filter(obj => {
        return fromStringToKey(obj.contract) === pool
    })
    
    const totNormYield = calculateYieldSum(yieldDataForContract)

    let printedNormYield
    if (isNaN(totNormYield)) {
        printedNormYield = 0
    } else {printedNormYield = totNormYield} 

    return (
        printedNormYield
    )
}


export function calculateCollected(publicKey, allEvents, id) {
    
    const topicScval = xdr.ScVal.scvSymbol("collect").toXDR('base64')
    const addressScval = xdr.ScVal.scvAddress(xdr.ScAddress.scAddressTypeAccount(xdr.PublicKey.publicKeyTypeEd25519(StrKey.decodeEd25519PublicKey(publicKey)))).toXDR("base64")

    let totalCollected = 0.0;
    for (let event of allEvents) {
        let contractStrkey = fromStringToKey(event.contract)
        if (contractStrkey === id && event.topic1 === topicScval && event.topic2 === addressScval) {
            const i128 = xdr.ScVal.fromXDR(event.data, "base64").i128()
            totalCollected += parseInt((BigInt(i128._attributes.hi._value.toString()) << BigInt(64)) + BigInt(i128._attributes.lo._value.toString()))
        }
    }
    const floatTotCollected = stroopsToUnit(totalCollected, 4)
    
    return (
        floatTotCollected
    )
}



export function calculateMatured(publicKey, allEvents, id, ContractAccountYieldNodes) {
    
    const floatTotCollected = calculateCollected(publicKey, allEvents, id)

    const YieldAccountData = ContractAccountYieldNodes.filter(obj => parseAddress(obj.address) === publicKey)
    const matured = stroopsToUnit(getTotYield(id, YieldAccountData, 16), 4) - floatTotCollected

    
    return (
        matured
    )
}


export function getTotAccountNormYield(yieldData, radix) {
    function calculateYieldSum(data) {
        
        let sum = 0.0;
      
        for (let i = 0; i < data.length; i++) {
          const yieldValue = hexToFloat64(data[i].yieldnorm);
  
          if (!isNaN(yieldValue)) {
            sum += yieldValue;
          }
        }

        return sum;
      }
    
    const totNormYield = calculateYieldSum(yieldData)
  
    return (
        totNormYield
    )
  }

export const getAssetId = (contract) => {
    const object = List.verified.find(o => o.contract === contract);

    if (object !== undefined) {
        return object.asset.code
    } else {
        const fromStrkey = List.verified.find(o => o.contract === contract);
        if (fromStrkey !== undefined) {
            return fromStrkey.asset.code
        } else {
            return "Unknown"
        }
    }
}


export const getAssetLogo = (contract) => {
    const object = List.verified.find(o => o.contract === contract);
    if (object !== undefined) {
       return object.asset.logo
    } else {
        const fromStrkey = List.verified.find(o => o.contract === contract);
        if (fromStrkey !== undefined) {
            return fromStrkey.asset.logo
        } else {
            return undefined
        }
    }
  }


  export const getPoolName = (contract) => {
    const object = List.verified.find(o => o.contract === contract);

    if (object !== undefined) {
        return object.name
    } else {
        const fromStrkey = List.verified.find(o => o.contract === contract);
        if (fromStrkey !== undefined) {
            return fromStrkey.name
        } else {
            return "Unknown"
        }
    }
    }


    export function filterAndSortAccountSupplies(supplies) {
        // Create an object to store unique contracts and their corresponding objects
        const contractMap = {};
    
        // Iterate through the supplies array
        supplies.forEach((item) => {
            const contract = item.contract;
            const timestampHex = toHex(item.timestamp); // Remove '\x'
            const timestamp = parseInt(timestampHex, 16);
    
            // Check if the contract is already in the map
            if (contractMap.hasOwnProperty(contract)) {
                // If the current object has a higher timestamp, update it
                if (timestamp > contractMap[contract].timestamp) {
                    contractMap[contract] = {
                        contract: item.contract,
                        timestamp: timestamp,
                        balance: parseInt(toHex(item.balance), 16)
                    };
                }
            } else {
                // If the contract is not in the map, add it
                contractMap[contract] = {
                    contract: item.contract,
                    timestamp: timestamp,
                    balance: parseInt(toHex(item.balance), 16)
                };
            }
        });
    
        // Convert the values of the contractMap back to an array
        const result = Object.values(contractMap);
    
        return result;
    }


export function numberOfPools(contractSupplies) {
    const supplies = filterAndSortSupplies(contractSupplies)
    const number = supplies.length

    return number
}


export function filterAndSortSupplies(supplies) {
    // Create an object to store unique contracts and their corresponding objects
    const contractMap = {};
  
    // Iterate through the supplies array
    supplies.forEach((item) => {
      const contract = item.contract;
      const timestampHex = toHex(item.timestamp); // Remove '\x'
      const timestamp = parseInt(timestampHex, 16);
  
      // Check if the contract is already in the map
      if (contractMap.hasOwnProperty(contract)) {
        // If the current object has a higher timestamp, update it
        if (timestamp > contractMap[contract].timestamp) {
          contractMap[contract] = {
            contract: item.contract,
            timestamp: timestamp,
            supply: parseInt(toHex(item.supply), 16)
          };
        }
      } else {
        // If the contract is not in the map, add it
        contractMap[contract] = {
            contract: item.contract,
          timestamp: timestamp,
          supply: parseInt(toHex(item.supply), 16)
        };
      }
    });
  
    // Convert the values of the contractMap back to an array
    const result = Object.values(contractMap);
  
    return result;
  }


export function sortByTimestamp(array) {
    return array.sort((a, b) => {
        return new Date(parseTimestamp(a.timestamp)) - new Date(parseTimestamp(b.timestamp));
    });
}