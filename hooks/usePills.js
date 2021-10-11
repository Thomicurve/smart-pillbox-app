import { useState, useEffect, useContext, useLayoutEffect, useRef } from "react";
import TokenContext from '../context/TokenContext';
import moment from "moment";
import axios from 'axios'

const apiLink = 'https://smart-pillbox-api.herokuapp.com';



const usePills = () => {
    const { token } = useContext(TokenContext);
    const [thisDay] = useState(moment().format('dddd'));
    const [thisHour] = useState(moment().format('LT'));
    const [reload, setReload] = useState(false);

    const [pillsAndRecords, setPillsAndRecords] = useState({pills: [], records: []});

    const days = {
        Monday: '1',
        Tuesday: '2',
        Wednesday: '3',
        Thursday: '4',
        Friday: '5',
        Saturday: '6',
        Sunday: '7'
    }

    const headerOptions = () => {
        return {
            headers: {
                "x-access-token": token
            }
        }
    }


    const GetPillsAndRecords = async () => {
        if (!token) return false;
        try {
            const pillsResult = await axios.get(`${apiLink}/pills`, headerOptions());
            const recordsResult = await axios.get(`${apiLink}/records`, headerOptions());
            const recordsFiltered = recordsResult.data.records.filter(({ pillDate }) => pillDate == moment().format('L'));
            setPillsAndRecords({pills: pillsResult.data.pills, records: recordsFiltered});
            
        } catch (err) {
            return err
        }
    }

    useEffect(() => {
        GetPillsAndRecords()
        GetTodayPills(reload);
    }, [token, reload])


    const getTodayRecords = (todayPills) => {
        let recordsRepeated = {};

        for (let pill in todayPills) {
            for (let record in pillsAndRecords.records) {
                // VER SI COINCIDE EL ID DE LAS PASTILLAS DE HOY CON ALGUN REGISTRO DE HOY
                if (todayPills[pill]._id == pillsAndRecords.records[record].pillID) {
                    const pillID = pillsAndRecords.records[record].pillID;
                    recordsRepeated[pillID] = {
                        amount: !recordsRepeated[pillID] ? 1 : recordsRepeated[pillID].amount + 1
                    }
                }
            }
        }
        return recordsRepeated;

    }

    const getHour = (pill) => {
        const hour = parseInt(pill.pillHour[0] + pill.pillHour[1]) - parseInt(thisHour[0] + thisHour[1]);
        let minutes;
        if(thisHour.length == 8) {
            minutes = parseInt(pill.pillHour[3] + pill.pillHour[4]) - parseInt(thisHour[3] + thisHour[4])
        }else {
            minutes = parseInt(pill.pillHour[3] + pill.pillHour[4]) - parseInt(thisHour[2] + thisHour[3]);
        }
        
        if (hour == 0 && minutes >= 0) return pill;
        else if (hour > 0) return pill;
        else if (thisHour.includes('AM') && hour < 0) return pill;
        else return null;
    }



    const GetTodayPills = (reloadFromHome) => {        
        if(pillsAndRecords.records.length == 0 && pillsAndRecords.pills.length == 0) setReload(!reload);
        // FILTROS PARA OBTENER PASTILLA DEL DIA DE HOY
        setReload(reloadFromHome);
        // 1ER FILTRO: PASTILLAS DE HOY
        const todayPills = pillsAndRecords.pills.filter(pill => pill.repeat.toString().split('').includes(days[thisDay]));

        // OBTENER LOS REGISTROS ASOCIADOS A ESA PASTILLA
        const recordsRepeated = getTodayRecords(todayPills);
        todayPills.forEach(({ _id }, index) => {
            todayPills[index] = { ...todayPills[index], takenToday: !recordsRepeated[_id] ? 0 : recordsRepeated[_id].amount };
        });

        // 2DO FILTRO: SEPARAR AM Y PM
        let pillsRemainingResult = todayPills.map(pill => {
            
            if (pill.pillHour.includes('AM') && thisHour.includes('AM')) {
                // 3ER FILTRO: CONOCER SI LA HORA DE LA PASTILLA SE PASÓ O AÚN FALTA
                return getHour(pill);
            } else if(pill.pillHour.includes('PM')){
                // console.log('YES')
                return getHour(pill);
            }
        })

        // 4TO FILTRO: FILTRAR LAS PASTILLAS QUE NO SON NULAS
        pillsRemainingResult = pillsRemainingResult.filter(pill => pill !== null);
        // 5TO FILTRO: ORDENAR LAS PASTILLAS QUE SIGUEN DE LA MAS CERCANA AL HORARIO ACTUAL A LA MAS LEJANA
        let nextPill = [];
        pillsRemainingResult.forEach(({ pillHour }) => nextPill.push(pillHour));
        nextPill = nextPill.sort().shift();
        
        //Obtener todos los datos de la pastilla filtrada
        let nextPillComplete = pillsRemainingResult.filter(({ pillHour }) => pillHour.includes(nextPill));
        nextPillComplete = nextPillComplete[0];

        return { pillsRemainingResult, nextPillComplete, todayPills };
    }


    return {
        GetTodayPills,
        GetPillsAndRecords,
        pills: pillsAndRecords.pills,
    };

}


export default usePills;
