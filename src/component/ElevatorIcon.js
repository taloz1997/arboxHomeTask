import './ElevatorIcon.css'
import icon from '../icons8-elevator.svg';




export default function Elevator(props) {

    return (
        <img className={props.color} src={icon} alt='elevator'/>
    );
}