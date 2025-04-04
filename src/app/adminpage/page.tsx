import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';

import AdminNav from "@/app/components/AdminNav";

export default function AdminPage() {
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
                        <button className='bg-black text-white rounded-lg px-3 py-1 cursor-pointer'>
                            <AddCircleOutlineRoundedIcon className='' fontSize='small'/>
                            Add Product
                        </button>
                    </div>
                    <div className='bg-gray-300 shadow-lg p-2 rounded-md'>
                        <h4 className='font-bold text-3xl'>Products</h4>
                        <p className='text-sm'>Manage your products and view their sales performance</p>
                        <table className='w-full border-b-2 border-gray-400'>
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                </tr>
                            </thead>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}