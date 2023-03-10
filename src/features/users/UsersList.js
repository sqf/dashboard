import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { selectAllUsers, fetchUsers, deleteUser, sortByUsernameAscending, sortByUsernameDescending } from './usersSlice'
import { Link } from "react-router-dom"

export function UsersList() {
    const dispatch = useDispatch()
    const users = useSelector(selectAllUsers)

    const userStatus = useSelector((state) => state.users.status)
    const error = useSelector((state) => state.users.error)

    function handleDeleteButton() {
        if (window.confirm(`Are you sure you want to delete user with ID ${this.userId}?`) === true) {
            dispatch(deleteUser(this.userId))
        }
    }

    useEffect(() => {
        if (userStatus === 'idle') {
            dispatch(fetchUsers())
        }
    }, [userStatus, dispatch])

    let content

    if (userStatus === 'loading') {
        content = <tr>
            <th>"Loading..."</th>
        </tr>
    } else if (userStatus === 'succeeded') {
        content = users.map((user, index) => (
            <tr key={index.toString()}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user?.username}</td>
                <td>{user.address?.city}</td>
                <td>{user.email}</td>
                <td><Link to={`/editUser/${user.id}`} className="button muted-button">
                    Edit User
                </Link></td>
                <td>
                    <button onClick={handleDeleteButton.bind({ userId: user.id })}>
                        Delete User
                    </button>
                </td>
            </tr>
        ))
    } else if (userStatus === 'failed') {
        content = <div>{error}</div>
    }

    return (
        <section className="users-list">
            <h2>Users</h2>
            {users.length ? '' : 'There are no users to display'}
            <button onClick={() => dispatch(sortByUsernameAscending())}>Sort ascending</button>
            <button onClick={() => dispatch(sortByUsernameDescending())}>Sort descending</button>

            <table>
                <tbody>
                {content}
                </tbody>
            </table>
        </section>
    )
}
