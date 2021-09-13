import moment from "moment";
import { useState, useEffect } from "react";

const useFormatDatePills = () => {
    const [thisDay, setThisDay] = useState(moment().format('dddd'));
    const days = {
        Monday: '1',
        Tuesday: '2',
        Wednesday: '3',
        Thursday: '4',
        Friday: '5',
        Saturday: '6',
        Sunday: '7'
    }

    const getToday = (pills) => {
        const result = pills.filter(pill => pill.repeat.toString().split('').includes(days[thisDay]));
        console.log('result', result);
        return result
    }

    return {
        getToday
    }
}

export default useFormatDatePills;