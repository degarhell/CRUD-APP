import React from "react";

function UserForm (props) {

    const initialState = {
        id:"",
        name:"",
        email:""
    }

    const [userData, setUserData] = React.useState(
        initialState
    ) 

    function handleChange(event){
        let currentUserData = event.target.value; 
        let currentUserTag = event.target.name;
        setUserData((prevUserData) => {
        return({...prevUserData, [currentUserTag]: currentUserData})
       }) 
    }
    
    function addUser(event) {
        props.onAdd(userData);
        setUserData(initialState);
        event.preventDefault();
    }


    return (
        <form> 
            <p>User Name</p>
            <input onChange={handleChange} name="name" type="text" placeholder="name" value={userData.name}/>
            <p>User Email</p>
            <input onChange={handleChange} name="email" type="text" placeholder="name@email.com" value={userData.email}/>
            <br />
            <input onClick={addUser} type="button" value="Submit" />
        </form>
    ) 
}

export default UserForm;