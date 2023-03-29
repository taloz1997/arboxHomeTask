import './ElevatorButtons.css'


export default function ElevatorButton(props) {
 let color = '';
 switch (props.text) {
    case 'Arrived':
        color = 'arrivedColor';
        break;
    case 'Call':
        color = 'callColor';
        break;
    case 'Waiting':
        color = 'waitingColor';
        break;
  }

    return (
    <button
    className={color}
    key={'btn'+(props.floor+1)}
    onClick={() =>props.handleElevatorCall(props.floor)}>{props.text}
    </button>
    );
}