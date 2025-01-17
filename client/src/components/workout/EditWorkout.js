import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";
import { useGifsContext } from "../../context/GifsContext";
import { useEditWorkoutContext } from "../../context/EditWorkoutContext";
import LoginPrompt from "../LoginPrompt";

function EditWorkout() {
    const navigate = useNavigate();

    const { user, setUser } = useUserContext();
    const { gifs } = useGifsContext();
    const { setShowEditWorkouts, editWorkout, setEditWorkout } = useEditWorkoutContext();
    
    const [errors, setErrors] = useState([]);

    function updateEditWorkout(e) {
        setEditWorkout({ ...editWorkout, [e.target.name]: e.target.value });
    }

    function sumbitEditWorkout(e) {
        e.preventDefault();

        const workoutData = {
            workout: {
                exercise_id: editWorkout.exercise.id, 
                day: editWorkout.day,
                sets: editWorkout.sets,
                reps: editWorkout.reps,
                weight: editWorkout.weight,
                duration: editWorkout.duration
            }
        };

        fetch(`/workouts/${editWorkout.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(workoutData)
        })
        .then(res => {
            const responseBody = res.json();

            if (res.ok) {
                responseBody.then(updatedWorkout => {
                    const updatedWorkouts = user.workouts.map(workout => 
                        workout.id === updatedWorkout.id ? updatedWorkout : workout
                    );
                    const updatedExercises = updatedWorkouts.map(workout => 
                        workout.exercise    
                    );

                    setUser({
                        ...user, 
                        workouts: updatedWorkouts, 
                        exercises: updatedExercises
                    });
                    setShowEditWorkouts(false);
                    setEditWorkout({
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

    if (user) {
        return (
            <div className='update-workout'>
                <div className='form-box'>
                    <form className='form' onSubmit={sumbitEditWorkout}>
                        <div className='update-workout-info'>
                            <h1>Edit Workout</h1>
                            <label htmlFor='workout-sets'>Sets:</label>
                            <input 
                                id='workout-sets' 
                                name='sets'
                                value={editWorkout.sets}
                                onChange={updateEditWorkout}
                            />
                            <label htmlFor='workout-reps'>Reps:</label>
                            <input 
                                id='workout-reps' 
                                name='reps'
                                value={editWorkout.reps}
                                onChange={updateEditWorkout}
                            />
                            <label htmlFor='workout-weight'>Weight (lbs):</label>
                            <input 
                                id='workout-weight' 
                                name='weight'
                                value={editWorkout.weight}
                                onChange={updateEditWorkout}
                            />
                            <label htmlFor='workout-duration'>Duration (min):</label>
                            <input 
                                id='workout-duration' 
                                name='duration'
                                value={editWorkout.duration}
                                onChange={updateEditWorkout}
                            />
                            <button className='large-btn'>Edit workout</button>
                        </div>
                        <div className='update-workout-details'>
                            <select 
                                name='day' 
                                value={editWorkout.day}
                                onChange={updateEditWorkout}
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
                            <Link to='/exercises'>Select an exercise</Link>
                            <h3>{editWorkout.exercise.name}</h3>
                            {gifs[`${editWorkout.exercise.id}`] && (
                                <img
                                    src={gifs[`${editWorkout.exercise.id}`]} 
                                    alt={editWorkout.exercise.name} 
                                />
                            )}
                        </div>
                    </form>
                </div>
                <div className='error-msg'>
                    {errors.error && (errors.error.map((error, index) => 
                        <h3 key={index}>{error}</h3>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <LoginPrompt />
    );
}

export default EditWorkout;
