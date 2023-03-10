import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"

import { editUser, selectUserById } from './usersSlice'

export const EditUserForm = () => {
    const { userId } = useParams()
    const { register, handleSubmit, setValue, formState: { errors } } = useForm()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state) => selectUserById(state, parseInt(userId)))

    useEffect(() => {
        setValue('id', user?.id)
        setValue('name', user?.name)
        setValue('username', user?.username)
        setValue('city', user?.address?.city)
        setValue('email', user?.email)
    }, [user])

    const [addRequestStatus, setAddRequestStatus] = useState('idle')

    const canSave = addRequestStatus === 'idle'

    const onSubmit = async (data) => {
        if (canSave) {
            try {
                setAddRequestStatus('pending')
                const user = {
                    id: userId,
                    name: data.name,
                    username: data.username,
                    city: data.city,
                    email: data.email
                }
                await dispatch(editUser(user)).unwrap()
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
            <h2>Edit User</h2>
            ID: {userId}
            <form onSubmit={handleSubmit(onSubmit)}>
                <label htmlFor="name">Name:</label>
                <input
                    {...register("name", {
                        required: true,
                    })}
                />
                {errors?.name?.type === "required" && <p>This field is required</p>}

                <label htmlFor="username">User Name:</label>
                <input
                    {...register("username", {})}
                />

                <label htmlFor="city">City:</label>
                <input
                    {...register("city", {})}
                />

                <label htmlFor="email">Email:</label>
                <input
                    {...register("email", {
                        required: true,
                        pattern: /\S+@\S+\.\S+/
                    })}
                />
                {errors?.email?.type === "required" && <p>This field is required</p>}
                {errors?.email?.type === "pattern" && (
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
