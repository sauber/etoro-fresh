//import { Handlers, PageProps } from "$fresh/server.ts";
import ListItem from "../../islands/investor/InvestorItem.tsx";
import { useEffect, useState } from "preact/hooks";


export default function InvestorList() {
  const [investorNames, setInvestorName] = useState([]);

  const loadCommunity = async () => {
    const url = "/api/investor/names/last";
    const fetchOptions = {
      headers: {
        accept: "application/json",
        //mode: 'no-cors'
      },
    };

    //console.log("Start fetching names");
    const response = await fetch(url, fetchOptions);
    if (response.ok) {
      //console.log("Parsing result");
      const data = await response.json();
      //console.log("data loaded: ", data);
      return data;
      //names.value = data;
    } else {
      console.log("fetch error");
      console.log(response);
      return [];
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await loadCommunity();
      setInvestorName(data);
    };
    fetchData();
  }, []);

  return (
    <div>
      <h2>List of investors</h2>
      <ul>
        {investorNames.map((name: string) => <li><ListItem UserName={name} /></li>)}
      </ul>
    </div>
  );
}
