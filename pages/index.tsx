import Head from "next/head";
import {useRouter} from "next/router";
import { useEffect, useRef } from "react";
import Navbar from "../components/Navbar";
import Thumbnail from "../components/Thumbnail";
import Footer from "../components/Footer";
import { useState } from "react";
import Data, { Proovestate } from "../models/data_doc";
import Topic from "../components/Topic";
import KomChat from "./services/chat";
import CheckIn from "../components/CheckIn";
import {
  fetchDataACT,
  query,
  queryByProject,
  generateFromOccupation,
} from "../data";

export default function Home() {
  const router = useRouter()
  const { id } = router.query
  const ref = useRef<HTMLDivElement>(null);
  const mask = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(2);
  const [isInPage, setInPage] = useState(id != undefined);

  const [actDoc, setActDoc] = useState([]);
  const [currentData, setCurrentData] = useState({ _source: { winner: [] } });
  const [winnerData, setWinnerData] = useState([]);
  const [preference, setPref] = useState({
    occupation: "student", // "police" "doctor"
    location: "กรุงเทพมหานคร",
  });

  const [voteState, setVoteState] = useState([]);
  const [search, setSearchKey] = useState("");

  useEffect(() => {
    if(search == ""){
    console.log("search");

    (async () => {
      const data = await fetchDataACT(query(preference));
      setActDoc(data);
    })();
  }else{
    console.log("search project");

    (async () => {
      const data = await fetchDataACT(queryByProject(search));
      setActDoc(data);
    })();
  }
  }, [preference,search]);
  
  const [data,setData] = useState([])
 useEffect( ()=>{
   setData(actDoc.map(({_source})=>{
    return {
      id: _source.projectId,
      detailMoney: _source.projectMoney,
      detailName: _source.projectName,
      prooveState: Proovestate.UNMARK,
      vote: voteState.find(v=>v.id==_source.projectId)?.status,
    }
  }))
},[voteState,actDoc])

  const onClickLeft = () => {
    if (page <= 1) {
      return;
    }
    setPage(page - 1);
  };

  const onClickRight = () => {
    if (page >= data.length - 3) {
      return;
    }
    setPage(page + 1);
  };

  const onEnterPage = () => {
    setInPage(!isInPage);
    setPage(1)
  };

  return (
    <>
      {!isInPage && (
        <div
          className="h-screen w-screen m-0 p-0 z-50 bg-black bg-opacity-70 absolute"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="flex justify-around text-center justify-items- w-full h-full">
            <div>

              <div className="h-auto w-auto">
              <CheckIn onChange={(occupation,location)=>{
setPref({
  occupation,
  location,

})
              }}/>
              <div className="bg-gray-300 bg-opacity-90 rounded-b-lg h-auto w-96">
              <div className="h-auto font-iconic p-3 bg-earth-green rounded-b-lg cursor-pointer"  onClick={onEnterPage}> 
              เพิ่มความโปร่งใส!
              </div>
              </div>
              </div>

            </div>
          </div>
        </div>
      )}
      <div className="h-screen overflow-scroll w-screen m-0 p-0">
        <Head>
          <title>C U TU!</title>
          <meta name="description" content="Generated by create next app" />
          <link rel="shortcut icon" href="/tab.png" />
        </Head>

        <div>
          <Navbar searcher={[search, setSearchKey]} />
        </div>
        
        {/* <div className="grid grid-cols-7 content mt-6 pt-24 mb-0 pb-0">
          <div className="col-start-3 col-span-5">
            <Topic />
          </div>
        </div> */}
<div className="absolute flex w-screen">
          <div className="mx-auto w-92 mt-32" style={{width:490}}>
            <Topic />
            <div className="w-full text-center mt-12">
              <h3 className="font-black text-lg font-iconic">
                โครงการรอบตัวคุณ
              </h3>
            </div>
        </div>
        </div>

        <div className="h-full font-sarabun pt-0 mt-12">
          <div className="content flex flex-col justify-center place-items-center w-full h-full overflow-hidden">
            <div className="w-full">
              <div className="flex flex-row justify-center place-items-center w-full h-full m-0 p-0">
                <div
                  className={page <= 1 ? "opacity-0" : ""}
                  onClick={onClickLeft}
                >
                  <ion-icon name="chevron-back-outline" size="large"></ion-icon>
                </div>
                <Thumbnail currentPage={page} data={data} />
                <div
                  className={page >= data.length - 3 ? "opacity-0" : ""}
                  onClick={onClickRight}
                >
                  <ion-icon
                    name="chevron-forward-outline"
                    size="large"
                  ></ion-icon>
                </div>
              </div>
            </div>
          </div>
          {isInPage && <KomChat />}
          <Footer occupation={preference.occupation} location={preference.location} voter={[voteState, setVoteState]} />
        </div>
      </div>
    </>
  );
}
