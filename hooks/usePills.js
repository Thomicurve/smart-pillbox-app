import { useState, useEffect, useContext } from "react";
import TokenContext from '../context/TokenContext';
import moment from "moment";
import axios from 'axios'

const apiLink = 'https://smart-pillbox-api.herokuapp.com';

const usePills = () => {
    const { token } = useContext(TokenContext);
    const [thisDay] = useState(moment().format('dddd'));
    const [thisHour] = useState(moment().format('LT'));
    const [pills, setPills] = useState([]);
    const [records, setRecords] = useState([]);

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
        if(!token) return false;
        try {
            const pillsResult = await axios.get(`${apiLink}/pills`, headerOptions());
            const recordsResult = await axios.get(`${apiLink}/todayrecords`, headerOptions());
            setPills(pillsResult.data.pills);
            setRecords(recordsResult.data.records);
        } catch (err) {
            return err
        }
    }


    useEffect(() => {
        GetPillsAndRecords()
    }, [token])



    const getHour = (pill) => {
        const hour = parseInt(pill.pillHour[0] + pill.pillHour[1]) - parseInt(thisHour[0] + thisHour[1]);
        const minutes = parseInt(pill.pillHour[3] + pill.pillHour[4]) - parseInt(thisHour[2] + thisHour[3]);

        if (hour == 0 && minutes >= 0) return pill;
        else if (hour > 0) return pill;
        else return null
    }

    const GetTodayPills = () => {
        // FILTROS PARA OBTENER PASTILLA DEL DIA DE HOY

        // 1ER FILTRO: PASTILLAS DE HOY
        const todayPills = pills.filter(pill => pill.repeat.toString().split('').includes(days[thisDay]));

        // 2DO FILTRO: SEPARAR AM Y PM
        let pillsRemainingResult = todayPills.map(pill => {
            if (pill.pillHour.includes('AM') && thisHour.includes('AM')) {
                // 3ER FILTRO: CONOCER SI LA HORA DE LA PASTILLA SE PASÓ O AÚN FALTA
                return getHour(pill);
            } else {
                return getHour(pill);
            }
        })

        // 4TO FILTRO: FILTRAR LAS PASTILLAS QUE NO SON NULAS
        pillsRemainingResult = pillsRemainingResult.filter(pill => pill !== null);

        // 5TO FILTRO: ORDENAR LAS PASTILLAS QUE SIGUEN DE LA MAS CERCANA AL HORARIO ACTUAL A LA MAS LEJANA
        let nextPill = [];
        pillsRemainingResult.forEach(({ pillHour }) => nextPill.push(pillHour));
        nextPill = nextPill.sort().shift();

        let nextPillComplete = pillsRemainingResult.filter(({pillHour}) => pillHour.includes(nextPill));
        nextPillComplete = nextPillComplete[0];

        return { pillsRemainingResult, nextPillComplete, todayPills };

    }


    return {
        GetTodayPills,
        GetPillsAndRecords,
        pills
    };

}

export default usePills;
