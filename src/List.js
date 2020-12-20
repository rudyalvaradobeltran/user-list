import React, { memo, useEffect } from 'react'
import Item from './Item';

//If your component renders the same result given the same props, you can wrap it in a call to React.memo 
//for a performance boost in some cases by memoizing the result.
//Not that useful for small components.
const List = memo(({ users, handleDelete }) => {
    return (
        <ul>
            { users.map(user => (
                <Item key={user.id} user={user} handleDelete={handleDelete} />
            ))}
        </ul>
    )
})

export default List;
