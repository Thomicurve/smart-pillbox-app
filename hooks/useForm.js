import {useState} from 'react'
import moment from 'moment';

const useForm = ({setActivateTimePicker, setPillName, setAmount}) => {

    const [hour, setHour] = useState('10:00 PM');
    const [dateSelected, setDateSelected] = useState(new Date());
    const [pillDays, setPillDays] = useState([]);
    const [position, setPosition] = useState(null);

    const handleTimePicker = () => {
        setActivateTimePicker(true);
    }

    const handleHour = (event, selectedDate) => {
        setActivateTimePicker(false);
        if (!selectedDate) {
            setDateSelected(dateSelected);
            return setHour(hour);
        }
        else {
            setDateSelected(new Date(selectedDate));
            return setHour(moment(selectedDate).format('LT'));
        }
    }

    const changeDisabledButton = (day) => {
        if (pillDays.includes(day)) {
            const removedDay = pillDays.filter((dayItem) => dayItem !== day);
            setPillDays(removedDay);
        } else {
            setPillDays([...pillDays, day]);
        }
    }

    const handlePillName = (value) =>  setPillName(value);
    
    const handleAmount = (value) =>  setAmount(value);

    const handlePosition = (value) => {
        setPosition(value)
    }

    return {
        changeDisabledButton, 
        handleHour, 
        handleTimePicker, 
        handlePillName, 
        handleAmount, 
        hour, 
        pillDays, 
        dateSelected,
        handlePosition, 
        position};
}

export default useForm;