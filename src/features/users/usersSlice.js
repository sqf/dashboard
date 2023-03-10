import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from "axios"

const initialState = {
    users: [],
    status: 'idle',
}

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await axios.get('https://my-json-server.typicode.com/karolkproexe/jsonplaceholderdb/data')

    return response.data
})

export const addNewUser = createAsyncThunk(
    'users/addNewUser',
    async (initialUser) => {
        const response = await axios.post('https://my-json-server.typicode.com/karolkproexe/jsonplaceholderdb/data', initialUser)

        return response.data
    }
)

export const editUser = createAsyncThunk(
    'users/editUser',
    async (initialUser) => {
        const response = await axios.patch(`https://my-json-server.typicode.com/karolkproexe/jsonplaceholderdb/data/${initialUser.id}`, initialUser)

        return response.data
    }
)

export const deleteUser = createAsyncThunk(
    'users/deleteUser',
    async (userId) => {
        await axios.delete(`https://my-json-server.typicode.com/karolkproexe/jsonplaceholderdb/data/${userId}`)

        return userId
    }
)


export const usersSlice = createSlice({
    name: 'users',
    initialState,
    // The `reducers` field lets us define reducers and generate associated actions
    reducers: {
        sortByUsernameAscending(state) {
            state.users = state.users.slice().sort(function (a, b) {
                if (a.username < b.username) {
                    return -1;
                }
                if (a.username > b.username) {
                    return 1;
                }
                return 0;
            })
        },
        sortByUsernameDescending(state) {
            state.users = state.users.slice().sort(function (a, b) {
                if (a.username > b.username) {
                    return -1;
                }
                if (a.username < b.username) {
                    return 1;
                }
                return 0;
            })
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchUsers.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.status = 'succeeded'
                state.users = state.users.concat(action.payload)
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewUser.fulfilled, (state, action) => {
                state.users.push(action.payload)
            })
            .addCase(editUser.fulfilled, (state, action) => {
                const { id, name, username, email, city } = action.payload
                const existingUser = state.users.find((user) => user.id === id)
                if (existingUser) {
                    existingUser.name = name
                    existingUser.username = username
                    existingUser.address.city = city
                    existingUser.email = email
                }
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(user => user.id !== action.payload)
            })
    },
})

export default usersSlice.reducer

export const { sortByUsernameAscending, sortByUsernameDescending } = usersSlice.actions

export const selectAllUsers = (state) => state.users.users

export const selectUserById = (state, userId) => {
    return state.users.users.find((user) => user.id === userId)
}

