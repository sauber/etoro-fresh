import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

const timeFmt = new Intl.RelativeTimeFormat("en-US");

export default function InvestorList(props: { target: string }) {
  const target = new Date(props.target);
  const now = useSignal(new Date());
  const names = useSignal(["John"]);
  
  const loadCommunity = async () => {
    const url = "/api/investor/names/last";
    const fetchOptions = {
      headers: {
        accept: "application/json",
        //mode: 'no-cors'
      },
    };

    console.log('Start fetching names');
    const response = await fetch(url, fetchOptions);
    if ( response.ok ) {
      console.log('Parsing result');
      const data = await response.json();
      console.log('data loaded: ', data);
      names.value = data;
    } else {
      console.log('fetch error');
    }

  };
 
  function addName(name: string) {
    names.value = [ ...names.value, name];
  }
  
  //addName("D1");
  //addName("d2");
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (now.value > target) {
        clearInterval(timer);
      }
      now.value = new Date();
      //addName("d1");
      loadCommunity();
    }, 5000);
    return () => clearInterval(timer);
  }, [props.target]);

  const secondsLeft = Math.floor(
    (target.getTime() - now.value.getTime()) / 1000,
  );

  // If the target date has passed, we stop counting down.
  if (secondsLeft <= 0) {
    return <span>🎉</span>;
  }

  /*
  return (
    <div>
      <h2>List of investors</h2>
      <span>{timeFmt.format(secondsLeft, "seconds")}</span>
      { names.value.map((name: string) => 
        (<span>Name: {name}</span>)
      )}
    </div>
  );
  */

  return (
    <div>
      <h2>List of investors</h2>
      <span>{timeFmt.format(secondsLeft, "seconds")}</span>
      { names.value.map((name: string) => 
        (<span>Name: {name}</span>)
      )}
    </div>
  );
}
