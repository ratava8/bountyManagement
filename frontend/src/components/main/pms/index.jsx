import React, { useState, useEffect } from 'react'
import { UserView } from '../user/view'
import axios from 'axios';

function Pms() {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUserData = async () => {
        const { data: { users } } = await axios.get(process.env.REACT_APP_API_BASE_URL + "/users/pms")
        setIsLoading(false);
        setData(users);
    }
    useEffect(() => {
        fetchUserData();
    }, [])
    return (
        <div className=' w-full h-full flex flex-col gap-[30px] justify-center items-center mt-[50px] mb-[50px]'>
            <UserView userData={data} isLoading={isLoading} />
        </div>
    )
}

export default Pms