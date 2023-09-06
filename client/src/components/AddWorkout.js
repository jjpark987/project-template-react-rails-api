import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useAddWorkoutContext } from "../context/AddWorkoutContext";

function AddWorkout() {
    const navigate = useNavigate();

    const { user, setUser } = useUserContext();
    const { addWorkout, setAddWorkout } = useAddWorkoutContext();

    const [errors, setErrors] = useState([]);

    function updateAddWorkout(e) {
        setAddWorkout({ ...addWorkout, [e.target.name]: e.target.value });
    }

    function submitWorkout(e) {
        e.preventDefault();

        const workoutData = {
            workout: {
                exercise_id: addWorkout.exercise.id, 
                day: addWorkout.day,
                sets: addWorkout.sets,
                reps: addWorkout.reps,
                weight: addWorkout.weight,
                duration: addWorkout.duration
            }
        };

        fetch('/workouts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(workoutData)
        })
        .then(res => {
            const responseBody = res.json();

            if (res.ok) {
                responseBody.then(updatedWorkout => {
                    const updatedWorkouts = [ ...user.workouts, updatedWorkout ];
                    const updatedExercises = [ ...user.exercises ];

                    if (!updatedExercises.find(exercise => exercise.id === updatedWorkout.exercise.id)) {
                        updatedExercises.push(updatedWorkout.exercise);
                    }

                    setUser({
                        ...user, 
                        workouts: updatedWorkouts, 
                        exercises: updatedExercises
                    });
                    setAddWorkout({
                        exercise: {},
                        day: '',
                        sets: 0,
                        reps: 0,
                        weight: 0,
                        duration: 0
                    });
                    navigate('/workouts');
                });
            } else {
                responseBody.then(data => setErrors(data));
            }
        })
        .catch(error => console.error(error));
    }

    return (
        <div>
            <form onSubmit={submitWorkout}>
                <select 
                    name='day' 
                    value={addWorkout.day}
                    onChange={updateAddWorkout}
                >
                    <option value=''>Select a day</option>
                    <option value='sunday'>Sunday</option>
                    <option value='monday'>Monday</option>
                    <option value='tuesday'>Tuesday</option>
                    <option value='wednesday'>Wednesday</option>
                    <option value='thursday'>Thursday</option>
                    <option value='friday'>Friday</option>
                    <option value='saturday'>Saturday</option>
                </select>
                <Link className='select-exercise' to='/exercises'>Select an exercise</Link>
                <h1>{addWorkout.exercise.name}</h1>
                <label htmlFor='workout-sets'>Sets:</label>
                <input 
                    id='workout-sets' 
                    name='sets'
                    value={addWorkout.sets}
                    onChange={updateAddWorkout}
                />
                <label htmlFor='workout-reps'>Reps:</label>
                <input 
                    id='workout-reps' 
                    name='reps'
                    value={addWorkout.reps}
                    onChange={updateAddWorkout}    
                />
                <label htmlFor='workout-weight'>Weight (lbs):</label>
                <input 
                    id='workout-weight' 
                    name='weight'
                    value={addWorkout.weight}
                    onChange={updateAddWorkout}
                />
                <label htmlFor='workout-duration'>Duration (min):</label>
                <input 
                    id='workout-duration' 
                    name='duration'
                    value={addWorkout.duration}
                    onChange={updateAddWorkout}
                />
                <button className='large-btn'>Add workout</button>
                <div className='error-msg'>
                    {errors.error && (errors.error.map((error, index) => 
                        <h3 key={index}>{error}</h3>
                    ))}
                </div>
            </form>
        </div>
    );
}

export default AddWorkout;
