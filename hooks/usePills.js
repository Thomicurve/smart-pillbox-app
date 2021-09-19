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

    const days = {
        Monday: '1',
        Tuesday: '2',
        Wednesday: '3',
        Thursday: '4',
        Friday: '5',
        Saturday: '6',
        Sunday: '7'
    }

    const GetPills = async () => {
        if(!token) return false;
        try {
            const { data } = await axios.get(`${apiLink}/pills`, {
                headers: {
                    "x-access-token": token
                }
            });
            setPills(data.pills);
        } catch (err) {
            return err
        }
    }

    useEffect(() => {
        GetPills()
    }, [token])



    const getHour = (pill) => {
        const hour = parseInt(pill.pillHour[0] + pill.pillHour[1]) - parseInt(thisHour[0] + thisHour[1]);
        const minutes = parseInt(pill.pillHour[3] + pill.pillHour[4]) - parseInt(thisHour[2] + thisHour[3]);

        if (hour == 0 && minutes >= 0) return pill;
        else if (hour > 0) return pill;
        else return null
    }

    const GetTodayPills = async () => {
        const todayPills = pills.filter(pill => pill.repeat.toString().split('').includes(days[thisDay]));

        let pillsRemainingResult = todayPills.map(pill => {
            if (pill.pillHour.includes('AM') && thisHour.includes('AM')) {
                return getHour(pill);
            } else {
                return getHour(pill);
            }
        })
        
        pillsRemainingResult = pillsRemainingResult.filter(pill => pill !== null);

        let nextPill = '';
        for(let i = 0; i < pillsRemainingResult.length; i++) {
            if(pillsRemainingResult[i + 1]){
                if(moment(pillsRemainingResult[i].pillHour, 'LT').format('X') < moment(pillsRemainingResult[i + 1].pillHour, 'LT').format('X')) {
                    nextPill = pillsRemainingResult[i].pillHour;
                } else {
                    nextPill = pillsRemainingResult[i + 1].pillHour;
                }
            }
        }

        return {pillsRemainingResult, nextPill};

    }



    return {
        GetTodayPills,
        GetPills,
        pills
    };

}

export default usePills;