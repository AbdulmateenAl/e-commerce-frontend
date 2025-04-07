"use client";
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";

import AdminNav from "@/app/components/AdminNav";

import { jwtDecode } from 'jwt-decode';
import { useState, useEffect } from 'react';

type DecodedToken = {
    user: string,
    exp?: number
}

type Product = {
    id: number,
    name: string,
    price: number
  }

export default function AdminPage() {
    const [user, setUser] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);

    const addProduct = async () => {
        const token = localStorage.getItem("token")
        if (token) {
            const decodedToken = jwtDecode(token)

            const new_product = {
                id: 20,
                name: "new product",
                price: 20
            }

            await fetch(`http://localhost:5000/${decodedToken.user}/product`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(new_product),
                })
                .then(res => res.json())
                .then((data) => {
                console.log(data);
                setProducts((prevState) =>
                [...prevState, new_product])
                })
        }
    }

    const editProduct = async (id: number) => {
        const updatedProduct = {
            name: "updated_product",
            price: 30
        }
		await fetch(`http://localhost:5000/product/${id}`, {
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(updatedProduct),
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
			})
			.catch((err) => console.error("Error updating order:", err));
	};

	const deleteProduct = async (id: number) => {
		await fetch(`http://localhost:5000/product/${id}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
		})
			.then((res) => res.json())
			.then((data) => {
				console.log(data);
				// Remove deleted order from state
				setProducts(products.filter((product: Product) => product.id !== id));
			})
			.catch((err) => console.error("Error deleting order:", err));
	};
    
    useEffect(() => {
        const token = localStorage.getItem("token")
    
        if (token) {
            const decodedToken = jwtDecode<DecodedToken>(token)
            setUser(decodedToken.user)
            
            fetch(`http://localhost:5000/${decodedToken.user}/products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then(res => res.json())
            .then((data) => {
                console.log(data.products)
                setProducts(data.products)
            })
        }
        
    }, [])
    
    return (
        <div className="flex">
        <AdminNav />
        <div className="flex-1 p-6">
            <div className='flex flex-col gap-3'>
                <div className="flex items-center justify-between">
                    <p>Dashboard</p>
                    <input type="text" placeholder="🔍Search..." className="border-2 border-gray-400 p-2 rounded-xl"/>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm">All</p>
                    <button className='bg-black text-white rounded-lg px-3 py-1 cursor-pointer' onClick={() => addProduct()}>
                        <AddCircleOutlineRoundedIcon className='' fontSize='small' />
                        Add Product
                    </button>
                </div>
                <div className='bg-gray-300 shadow-lg p-2 rounded-md'>
                    <h4 className='font-bold text-3xl'>Products</h4>
                    <p className='text-sm'>Manage your products and view their sales performance</p>
                    <table className='w-full border-b-2 border-gray-400 items-center'>
                        <thead className='border-b-2 border-gray-700 text-left'>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody className='text-left border-b-2 border-gray-500 w-full'>
                            {products.map((product: Product) => (
                                <tr key={product.id}>
                                    <td>{product.name}</td>
                                    <td>{product.price}</td>
                                    <td>{10}</td>
                                    <div>
                                        <EditRoundedIcon className='text-blue-600 cursor-pointer' onClick={() => editProduct(product.id)}/>
                                        <DeleteRoundedIcon className='text-red-600 cursor-pointer' onClick={() => deleteProduct(product.id)}/>
                                    </div>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
)
}