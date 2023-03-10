import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from "react-hook-form"
import { useNavigate } from "react-router-dom"

import { addNewUser, selectAllUsers } from './usersSlice'

export const AddUserForm = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const users = useSelector(selectAllUsers)
    const highestUserId = Math.max(...users.map(user => user.id))

    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const canSave = addRequestStatus === 'idle'

    const onSubmit = async (data) => {
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                const id = highestUserId + 1
                const user = { id: id, name: data.userName, email: data.userEmail }
                await dispatch(addNewUser(user)).unwrap()
            } catch (err) {
                console.error('Failed to save the user: ', err)
            } finally {
                setAddRequestStatus('idle')
                navigate('/')
            }
        }
    }

    const onCancelClicked = async () => {
        navigate('/')
    }

    return (
        <section>
            <h2>Add a New User</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="userName">Name:</label>
                <input
                    {...register("userName", {
                        required: true,
                        maxLength: 20,
                        pattern: /^[A-Za-z]+$/i
                    })}
                />
                {errors?.userName?.type === "required" && <p>This field is required</p>}
                {errors?.userName?.type === "maxLength" && (
                    <p>First name cannot exceed 20 characters</p>
                )}
                {errors?.userName?.type === "pattern" && (
                    <p>Alphabetical characters only</p>
                )}
                <label htmlFor="userEmail">Email:</label>
                <input
                    {...register("userEmail", {
                        required: true,
                        maxLength: 20,
                        pattern: /\S+@\S+\.\S+/
                    })}
                />
                {errors?.userEmail?.type === "required" && <p>This field is required</p>}
                {errors?.userEmail?.type === "maxLength" && (
                    <p>First name cannot exceed 20 characters</p>
                )}
                {errors?.userEmail?.type === "pattern" && (
                    <p>Entered value does not match email format</p>
                )}
                <input type="submit"/>

                <button type="button" onClick={onCancelClicked}>
                    Cancel
                </button>
            </form>
        </section>
    )
}
