import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link,
} from 'react-router-dom'
import './App.css'
import { UsersList } from './features/users/UsersList'
import { AddUserForm } from "./features/users/AddUserForm"
import { EditUserForm } from "./features/users/EditUserForm"

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    <Route
                        exact
                        path="/"
                        element={
                            <React.Fragment>
                                <UsersList/>
                                <Link to={`/addUser`} className="button muted-button">
                                    Add User
                                </Link>
                            </React.Fragment>
                        }
                    />
                    <Route exact path="/addUser" element={<AddUserForm/>}/>
                    <Route exact path="/editUser/:userId" element={<EditUserForm/>}/>
                </Routes>
            </div>
        </Router>
    )
}

export default App
