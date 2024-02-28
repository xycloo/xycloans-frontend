import { StrKey, xdr } from "@stellar/stellar-sdk";


export const toHex = (b64) => {
    const buffer = Buffer.from(b64, 'base64');
    return buffer.toString('hex')
}


const fromHexString = (hexString) => Uint8Array.from(hexString.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)));
export const fromStringToKey = (key) => (
    StrKey.encodeContract(fromHexString(`${toHex(key)}`))
)

export function hexToFloat64(data) {
    const hexString = toHex(data)
    const byteArray = new Uint8Array(hexString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
    const dataView = new DataView(byteArray.buffer);
    const floatValue = dataView.getFloat64(0, false);

    return floatValue;
}


export function parseAddress(address) {
    const parsedAddress = xdr.ScAddress.fromXDR(toHex(address), "hex");
    let strkey_addr;
    if (parsedAddress.switch().name === "scAddressTypeAccount") {
        strkey_addr = StrKey.encodeEd25519PublicKey(parsedAddress.accountId().value())
    } else {
        strkey_addr = StrKey.encodeContract(parsedAddress.contractId())
    }
    return (strkey_addr)
}


export function parseBase64Yield(_yield, radix) {
    let yieldValue;
    if (radix == 8) {
        yieldValue = hexToFloat64(_yield, radix);
    } else {
        yieldValue = parseInt(toHex(_yield), radix);
    }

    return (yieldValue)
}


export function parseTimestamp(timestamp) {
    const timestampHex = toHex(timestamp)
    const parsedTimestamp = parseInt(timestampHex, 16)
    const milliseconds = parsedTimestamp * 1000

    return milliseconds
}


export function timestampsToDates(timestamps, includePrior = true) {
    const dates = timestamps.map(timestamp => new Date(timestamp))
  
    if (includePrior) {
        const firstTimestamp = timestamps[0]
        const firstDate = new Date(firstTimestamp)
        const oneMinutePrior = new Date(firstDate.getTime() - 60000)
        dates.unshift(oneMinutePrior)
    }
  
    return dates;
}