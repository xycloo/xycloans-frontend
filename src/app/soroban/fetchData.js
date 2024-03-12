// Serverless proxy needed due to workers not working with custom https ports.
const XYCLOANS_API = "https://iykhu4jxrazssevy3fgekwvnji0ploie.lambda-url.eu-north-1.on.aws/";

export async function fetchPools() {
  
    //await new Promise(resolve => setTimeout(resolve, 10000))

    const res = await fetch(XYCLOANS_API, {
          cache: "no-cache",
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          target: "fulld",
          network: `${process.env.MERCURY_NETWORK}.mercurydata.app`
        })
      })
    
    const json_res = await res.json();
    const data = json_res;

    return (
      data
    )
  }
  
  export async function fetchAllEvents() {
    const res = await fetch(XYCLOANS_API, {
          cache: "no-cache",
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          target: "events",
          network: `${process.env.MERCURY_NETWORK}.mercurydata.app`
        })
      })
  
    const json_res = await res.json();
    const data = json_res;
  
    return (
      data
    )
  }