"use client";
import { useRef, useState } from "react";

import Modal from "@/app/components/Modal";
import { jwtDecode } from "jwt-decode";

type Props = {
    show: boolean,
    onClose: () => void
}

type DecodedToken = {
    user: string,
    exp?: number
  }

export default function AddProductModal({show, onClose}: Props) {
    const p_name = useRef<HTMLInputElement>(null);
    const p_price = useRef<HTMLInputElement>(null);
    const quantity = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);

    const handleFIleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile)
        }
    }

    
    
    const createProduct = async () => {
        
        const productName =  p_name.current?.value ?? "";
        const productPrice = p_price.current?.value ?? "";
        const productQuantity = quantity.current?.value ?? "";

        const formData = new FormData;
        formData.append('product_name', productName)
        formData.append('product_price', productPrice)
        formData.append('product_quantity', productQuantity)
        if (file) { formData.append('file', file) }
        console.log(formData)
        if (!formData) {
            alert("An input is missing")
        }
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode<DecodedToken>(token);
            await fetch(`http://localhost:5000/${decodedToken.user}/product`, {
                method: "POST",
                body: formData,
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => res.json())
            .then(data => {
                console.log(data.message)
            })
        }

    }
    
    
	return (
		<div>
			<Modal show={show} onClose={onClose}>
			    <h3 className="absolute top-2 left-2 text-lg font-bold text-white">Add Product</h3>
                <div className="flex flex-col space-y-3 mt-4">
                    <input ref={p_name} type="text" placeholder="Product name" className="w-full rounded-md border-2 border-white text-white p-2 outline-2 focus:outline-gray-400"/>
                    <input ref={p_price} type="text" placeholder="Product price" className="w-full rounded-md border-2 border-white text-white p-2 outline-2 focus:outline-gray-400"/>
                    <input ref={quantity} type="text" placeholder="Quantity" className="w-full rounded-md border-2 border-white text-white p-2 outline-2 focus:outline-gray-400"/>
                    <div className="flex flex-col gap-4">
                        <input type="file" placeholder="Put your file" onChange={handleFIleChange} className="p-2 text-white cursor-pointer"/>
                        <button className="p-2 w-full text-white rounded-sm bg-linear-to-bl from-white to-black cursor-pointer border-2 border-white" onClick={createProduct}>Create Product</button>
                        {/* <CldUploadWidget uploadPreset="ml_default">
                            {({ open }) => {
                                return <button className="bg-black text-white p-2 w-full rounded-sm cursor-pointer" onClick={() => open()}>Upload an Image</button>;
                            }}
                        </CldUploadWidget> */}
                    </div>
                </div>
			</Modal>
		</div>
	);
}
