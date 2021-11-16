import { useState, useEffect, useContext } from "react";
import TokenContext from '../context/TokenContext';
import moment from "moment";
import axios from 'axios'

const apiLink = 'https://smart-pillbox-api.herokuapp.com';


const usePills = () => {
    const { token } = useContext(TokenContext);
    const [thisDay] = useState(moment().format('dddd'));

    const [pillsAndRecords, setPillsAndRecords] = useState({ pills: [], records: [] });

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
            setPillsAndRecords({ pills: pillsResult.data.pills, records: recordsFiltered });
        } catch (err) {
            return err
        }
    }


    useEffect(() => {
        GetPillsAndRecords();
    }, [token])


    // OBTENER LOS REGISTROS DE HOY
    const getTodayRecords = (pill) => {
        let recordsRepeated = {};
        pillsAndRecords.records.forEach(record => {
            if(pill._id == record.pillID) {
                const pillID = record.pillID;
                recordsRepeated[pillID] = {
                    amount: record.amount
                }
            }
        })
        
        return recordsRepeated;

    }

    // SABER SI LA HORA DE LA PASTILLA SE PASÓ O SI TODAVÍA FALTA.
    const getHour = (pill) => {
        let hourChanged = pill.pillHour.split('').slice(0, 5).join('');

        if (hourChanged[0] == 0) hourChanged = hourChanged.slice(1, 5);
        hourChanged += `${pill.pillHour[6] + pill.pillHour[7]}`;

        let finalHourComplete = moment(hourChanged, 'h:mma');

        if (moment(finalHourComplete).format('LT') === moment().format('LT')) return pill;
        if (finalHourComplete.isAfter(moment()) == true) return pill;
        else return null
    }


    const GetTodayPills = async () => {
        // FILTROS PARA OBTENER PASTILLA DEL DIA DE HOY
        GetPillsAndRecords();

        // 1ER FILTRO: PASTILLAS DE HOY
        const todayPills = pillsAndRecords.pills.filter(pill => pill.repeat.toString().split('').includes(days[thisDay]));

        // OBTENER LOS REGISTROS ASOCIADOS A ESA PASTILLA
        const recordsRepeated = todayPills.map(pill => getTodayRecords(pill));
        todayPills.forEach(({ _id }, index) => {
            todayPills[index] = { ...todayPills[index], takenToday: !recordsRepeated[index][_id] ? 0 : recordsRepeated[index][_id].amount };
        });


        // 2DO FILTRO: OBTENER LAS PASTILLAS RESTNTES
        let pillsRemainingResult = todayPills.map(pill => {
            return getHour(pill);
        })


        // 4TO FILTRO: FILTRAR LAS PASTILLAS QUE NO SON NULAS
        pillsRemainingResult = pillsRemainingResult.filter(pill => (pill !== undefined && pill !== null));

        // 5TO FILTRO: ORDENAR LAS PASTILLAS QUE SIGUEN DE LA MAS CERCANA AL HORARIO ACTUAL A LA MAS LEJANA
        let nextPill = [];
        pillsRemainingResult.forEach(({ pillHour }) => {
            nextPill.push(pillHour);
        });

        const nextPillAM = [];
        nextPill.forEach(pill => {
            if (pill.includes('AM')) {
                nextPillAM.push(pill);
            }
        })

        if (nextPillAM.length != 0) nextPill = nextPillAM;

        //Obtener todos los datos de la pastilla filtrada
        let nextPillComplete = [];
        pillsRemainingResult.forEach((pillRemaining) => {
            nextPill.forEach((pill) => {
                if(pillRemaining.pillHour == pill){
                    return nextPillComplete.push(pillRemaining);
                }
            })
        })

        // Ordenar las pastillas de la mas cercana a la hora actual, a la mas tardía
        nextPillComplete.sort((a,b) => {
            if(a.pillHour < b.pillHour) return -1;
            if(a.pillHour > b.pillHour) return 1;
            return 0;
        })
        
        return { pillsRemainingResult, nextPillComplete, todayPills };
    }


    return {
        GetTodayPills,
        GetPillsAndRecords,
        pills: pillsAndRecords.pills,
    };

}


export default usePills;
