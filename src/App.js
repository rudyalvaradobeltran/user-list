import React, { useState, useEffect, useMemo, useCallback, useReducer } from 'react';
import List from './List';

function App() {
  const initialUsers = [
    { id: Date.now(), name: 'John' },
    { id: Date.now()+1, name: 'Jack' },
    { id: Date.now()+2, name: 'Jean' }
  ];

  const initialState = {
    count: initialUsers.length
  };

  const [users, setUsers] = useState(initialUsers);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  
  const appReducer = (state, action) => {
    switch(action.type){
      case 'COUNT_USERS': 
        return {
          count: action.payload
        }
    }
  }

  //useReducer is usually preferable to useState when you have complex state logic 
  //that involves multiple sub-values or when the next state depends on the previous one.
  const [state, dispatch] = useReducer(appReducer, initialState);

  const handleAdd = () => {
    if(text.length > 0){
      const newUser = { id: Date.now(), name: text };
      setUsers([...users, newUser]);
      dispatch({
        type: 'COUNT_USERS',
        payload: state.count + 1
      });
    }else{
      alert("Enter username");
    }
  };

  const handleSearch = () => {
    setSearch(text);
  };

  //Pass an inline callback and an array of dependencies. 
  //useCallback will return a memoized version of the callback that 
  //only changes if one of the dependencies has changed, in this case 'users'.
  const handleDelete = useCallback((userId) => {
    setUsers(users.filter(user => user.id !== userId));
    dispatch({
      type: 'COUNT_USERS',
      payload: state.count - 1
    });
  }, [users]);

  //Pass a “create” function and an array of dependencies. 
  //useMemo will only recompute the memoized value when one of the dependencies has changed. 
  const filteredUsers = useMemo(() => 
    users.filter(user => {
      return user.name.toLowerCase().includes(search.toLowerCase())
    })
  , [search, users]);


  //If I call a function that uses 'users' inside useEffect I must add users and the name
  //of the function as dependencies.
  //If I dont wrap my function in a useCallback hook I'll get the following message:
  //"The 'printUsers' function makes the dependencies of useEffect Hook (at line N) change on every render. 
  //Move it inside the useEffect callback. Alternatively, wrap the definition of 'printUsers' in its own useCallback()"
  //After wrapping it I add users as dependency in the useCallback hook
  const printUsers = useCallback(() => {
    console.log('Changed users', users);
  }, [users]);

  useEffect(()=>{
    printUsers();
  }, [users, printUsers]);

  return (
    <div className="App">
      <p>We have {state.count} users</p>
      <input type="text" name="" value={text} onChange={(e) => setText(e.target.value)} />
      <button type="button" onClick={handleSearch}>Search</button>
      <button type="button" onClick={handleAdd}>Add</button>
      <List users={filteredUsers} handleDelete={handleDelete} />
    </div>
  );
}

export default App;
