"use client";
import AdminNav from "@/app/components/AdminNav";
//import { useEffect, useState } from "react";

export default function Orders() {
    // const [users, setUsers] = useState([]);

    // useEffect(() => {
    //     fetch("http://localhost:5000/orders")
    //     .then(res => res.json())
    //     .then((data) => {
    //         console.log(data.users)
    //         setUsers(data.users)
    //     })

    // }, [])
    
    return (
        <div className="flex">
            <AdminNav />
            <div className="flex-1 p-6">
                <div className='flex flex-col gap-3'>
                    <h1>Orders</h1>
                </div>
            </div>
        </div>
    )
}