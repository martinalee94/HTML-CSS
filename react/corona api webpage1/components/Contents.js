import React,{useState, useEffect} from 'react'
import {Bar, Doughnut, Line} from 'react-chartjs-2'
import axios from 'axios'

const Contents = () => {
    const [confirmedData, setConfirmed] = useState({});
    const [quarantinedData, setQuarantined] = useState({});
    const [comparedData, setCompared] = useState({});

    useEffect(()=>{
        const fetchEvents = async () =>{
            const res = await axios.get("https://api.covid19api.com/total/dayone/country/KR");
            makeData(res.data);
        }

        const makeData = (items)=>{
            const arr = items.reduce((acc,cur) => {
                const currentDate = new Date(cur.Date);
                const year = currentDate.getFullYear();
                const month = currentDate.getMonth();
                const date = currentDate.getDate();
                const confirmed = cur.Confirmed;
                const active = cur.Active;
                const death = cur.Deaths;
                const recovered  = cur.Recovered;
                

                const findItem =  acc.find(a=> a.year === year && a.month === month)

                if(!findItem){
                    acc.push({year, month, date, confirmed, active, death, recovered})
                }
                if(findItem && findItem.date <date){
                    findItem.active = active
                    findItem.death = death
                    findItem.date = date
                    findItem.year = year
                    findItem.month = month
                    findItem.recovered = recovered
                    findItem.confirmed = confirmed
                }
                return acc;
            },[])
            const labels = arr.map(a=>`${a.year} ${a.month+1}월`)
            setConfirmed({
                labels:labels,
                datasets:[
                    {
                        label:'국내 누적 확진자',
                        backgroundColor:'salmon',
                        fill:true,
                        data: arr.map(a=>a.confirmed)
                    }
                ]
            })
            setQuarantined({
                labels:labels,
                datasets:[
                    {
                        label:'월별 격리자',
                        borderColor:'blue',
                        fill: false,
                        data: arr.map(a=>a.active)
                    }
                ]
            })
            const last = arr[arr.length -1]
            setCompared({
                labels:['확진자','격리해제','사망'],
                datasets:[
                    {
                        label:'누적 확진, 해제, 사망 비율',
                        backgroundColor: ['#ff3d67','#059bff','#ffc233'],
                        borderColor: ['#ff3d67','#059bff','#ffc233'],
                        fill:false,
                        data: [last.confirmed, last.recovered, last.death]
                    }
                ]
            })
        }
        fetchEvents();
    },[])


    const option1 = {
        plugins:{
            title:{display:true, text:'누적 확진자 추이', fontSize:16},
            legend:{display:true, position:"bottom"}
        }
    };
    const option2 = {
        plugins:{
            title:{display:true, text:'월별 격리자 현황', fontSize:16},
            legend:{display:true, position:"bottom"}
        }
    };
    const option3 = {
        plugins:{
            title:{display:true, text:`누적 확진, 격리 해제, 사망 비율 (${new Date().getFullYear()}년 ${new Date().getMonth()+1}월)`, fontSize:16},
            legend:{display:true, position:"bottom"}
        }
    };

    return (
        <section>
          <h2>국내 코로나 현황</h2>  
          <div className="contents">
              <div>
                  <Bar data={confirmedData} options={option1} />
                  <Line data={quarantinedData} options={option2} />
                  <Doughnut data={comparedData} options={option3} />

              </div>

          </div>
        </section>
    )
}

export default Contents