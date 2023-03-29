import React, {useState, useEffect} from 'react';
import './Table.css';
import './ElevatorButtons';
import './ElevatorIcon';
import ElevatorButton from './ElevatorButtons';
import Elevator from './ElevatorIcon';


const arr = [];  //initial elevators arr
const defaultFloors = 0;
const defaultAvailability = true;
const defaultColor = "black";

for (let i = 0; i < 5; i++) {
    arr.push({
    floor: defaultFloors,
    free: defaultAvailability,
    color: defaultColor
  });
}

export default function Table() {
       
    const [elevatorCalls, updateElevatorCalls] = useState([]);
    const [mainQueue, updateMainQueue] = useState([]);
    const [buttons, updateButtons] = useState(Array(10).fill('Call'));
    const [elevators, updateElevators] = useState(arr);



    useEffect(() => {
        if (elevatorCalls.length>0 && elevators.filter(ele => ele.free).length>0) {
            let updateQueue = [...elevatorCalls];
            updateQueue.shift();
            updateElevatorCalls(updateQueue);
            handleElevatorCall(elevatorCalls[0]);
        } 
  }, [elevatorCalls, elevators]);

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  
  useEffect(() => {
    const processQueue = async () => {
      if (mainQueue.length === 0) return;
  
      const curr = mainQueue[0];
      let isLast = false;
  
      if (mainQueue.length === 1) {
        updateButtons(prev => prev.map((text,i) => i === curr.floor ? 'Arrived': text));
        isLast = true;
      }
  
      await sleep(200);
  
      updateElevators(prev => prev.map((ele,i) => {
        if (i === curr.num) {
          let updateEle = {...ele};
          updateEle.floor = curr.floor;
          updateEle.free = false;
          updateEle.color = isLast ? "Green" : "Red";
          return updateEle;
        } else {
          return ele;
        }
      }));
  
      updateMainQueue(prev => prev.slice(1));
    };
  
    processQueue();
  }, [mainQueue]);
  
  


      const handleElevatorCall = (floor) => {
        let elevatorIndex = null;
        let min = Infinity;
      
        for (let i = 0; i < elevators.length; i++) {
          if (elevators[i].free) {
            const d = Math.abs(floor - elevators[i].floor);
            if (d < min) {
                elevatorIndex = i;
                min = d;
            }
          }
        }
        if (elevatorIndex !== null) {
            for (let i = 0; i < buttons.length; i++) {
              if (i === floor) {
                buttons[i] = 'Waiting';
              }
            }
            updateButtons(buttons);
            const visitedfloors = Array(min).fill().map((_, index) => {
              if (elevators[elevatorIndex].floor < floor) {
                return elevators[elevatorIndex].floor + index + 1;
              } else {
                return elevators[elevatorIndex].floor - index - 1;
              }
            });
             const newQueue = visitedfloors.map(f => ({num: elevatorIndex, floor: f}));
             updateMainQueue(oldQueue => [...oldQueue, ...newQueue]);        }      
        if (mainQueue.length !== 0) {
            updateMainQueue([]);
        }
      
        updateElevators((prev) =>
          prev.map((e, i) =>
            i === elevatorIndex && e.color === 'Red'
              ? { ...e, floor, free: false, color: 'Green' }
              : e
          )
        );
      
        setTimeout(() => {
            updateElevators((prev) =>
            prev.map((e, i) =>
              i === elevatorIndex
                ? { ...e, free: true, color: 'black' }
                : e
            )
          );
          updateButtons((prev) =>
            prev.map((text, i) => (i === floor ? 'Call' : text))
          );
        }, 3000);
      };
      

      
      const floorLabel = (floor) => {
        return floor === 0 ? 'Ground Floor' : floor === 1 ? '1st' : floor + 'th';
      }
      

      function addCallToQueue(floor) {
        updateElevatorCalls(prevQueue => {
            const newQueue = [...prevQueue, floor];
            return newQueue;
        });
    }
  
      
      function ElevatorTable({ elevators, buttons, addCallToQueue }) {
        const rows = [];
      
        for (let row = 0; row < 10; row++) {
          const floor = 10 - row - 1;
      
          const elevatorsCells = [];
          for (let col = 0; col < elevators.length; col++) {
            const elevator = elevators[col];
            if (elevator.floor === floor) {
              elevatorsCells.push(
                <td className="cell" key={`${floor + 1}${col + 1}`}>
                  <Elevator color={elevator.color} />
                </td>
              );
            } else {
              elevatorsCells.push(<td className="cell" key={`${floor + 1}${col + 1}`} />);
            }
          }
      
          rows.push(
            <tr key={row}>
              <td className="transparentBackground floorLable" key={floor}>
                <label className="transparentBackground ">{floorLabel(floor)}</label>
              </td>
              {elevatorsCells}
              <td className="transparentBackground callButton">
                <ElevatorButton
                  key={floor}
                  floor={floor}
                  text={buttons[floor]}
                  handleElevatorCall={addCallToQueue}
                  elevators={elevators}
                />
              </td>
            </tr>
          );
        }
      
        return <elevatorTable><tbody>{rows}</tbody></elevatorTable>;
      }


      return (
        <table>
          <tbody>
            <ElevatorTable
              elevators={elevators}
              buttons={buttons}
              addCallToQueue={addCallToQueue}
            />
          </tbody>
        </table>
      );
      
   
}