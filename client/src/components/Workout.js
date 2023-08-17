import React from "react";

function Workout({ workout }) {
    return (
        <div id='workout-container'>
            <p id='workout-name'>{workout.exercise.name}</p>
            <div id='workout-info'>
                {(workout.sets !== 0 && workout.reps !== 0) && <p>{workout.sets} x {workout.reps}</p>}
                {workout.weight !== 0 && <p>{workout.weight} lbs</p>}
                {workout.duration !== 0 && <p>{workout.duration} sec</p>}
            </div>
        </div>
    );
}

export default Workout;
