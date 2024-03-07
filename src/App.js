import React, { useEffect } from 'react';
import './App.css';
import UserForm from './Components/UserForm.jsx';
import UserEditForm from './Components/UserEditForm.jsx';
import axios from "axios";


function App() {
  
  const [users, setUsers] = React.useState([])
  const [editing, setEditing] = React.useState(false);
  const [currentElement, setCurrentElement] = React.useState({element:''});

  useEffect(() => {
    fetchUsers()
  }, [])

  async function fetchUsers() {
    const results = await axios.get('http://localhost:8080/users');
    console.log(results.data);
    setUsers(results.data);
  }

  function handleEditButton(user) {
    setEditing(true);
    let element = users.findIndex((usersElement) => parseInt(usersElement.id) == parseInt(user.id));
    setCurrentElement({element: element})
  }


  async function submitEditUser(editedUser){
    const {id, name, email} = editedUser;
    await axios.put(`http://localhost:8080/user/${id}`, {
      id: id,
      name: name,
      email: email
    }).then (function(response) {
      console.log(response);
    }).catch (function(error) {
      console.log(error);
    })
    fetchUsers();
    setEditing(false);
    setCurrentElement({element:''});
  }

  async function handleDelete(deletedUser) {
    const {id} = deletedUser;
    await axios.delete(`http://localhost:8080/user/${id}`)
    fetchUsers();
  }

  async function add(newUser) {
    await axios.post('http://localhost:8080/users',{
      name: newUser.name,
      email: newUser.email
    }).then(function (response) {
      console.log(response);
    }).catch (function(error) {
      console.log(error);
    })
    fetchUsers();
  }
    
  return (
    <div className="App">
      <h1>CRUD App in React, Express and PostgreSQL </h1>
      <h4>Simple users crud application</h4>

      {!editing ? 
      <div>
        <UserForm onAdd={add}/>
      </div> :
      <div> 
        <UserEditForm onEdit={submitEditUser} id={users[currentElement.element].id} name={users[currentElement.element].name} email={users[currentElement.element].email}/> 
      </div>}

      <div>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              return(
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <button onClick={() => {handleEditButton(user)}}>Edit</button>
                  <button onClick={() => handleDelete(user)}>Delete</button>  
                </td>
              </tr>)
            })
            }
            
          </tbody>
        </table>
      </div>
    
    </div>
  );
}

export default App;
