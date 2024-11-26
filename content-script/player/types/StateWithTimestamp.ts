import State from "./State";

interface StateWithTimestamp extends State {
    timestamp: number;
}

export default StateWithTimestamp;
