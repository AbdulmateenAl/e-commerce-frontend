"use client";
import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import SearchIcon from "@mui/icons-material/Search";
import AdminNav from "@/app/components/AdminNav";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import AddProductModal from "./AddProductModal";
import Image from "next/image";

type DecodedToken = {
    user: string;
    exp?: number;
};

type Product = {
    id: number;
    name: string;
    price: number;
    quantity: number;
    imageUrl?: string;
};

export default function Products() {
    const [user, setUser] = useState<string | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    const showModal = (product: Product | null = null) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const deleteProduct = async (id: number) => {
        if (!confirm("Are you sure you want to delete this product?")) return;
        console.log(selectedProduct);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/product/${id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const data = await response.json();

            if (response.ok) {
                setProducts(products.filter((product: Product) => product.id !== id));
            } else {
                alert(data.message || "Error deleting product");
            }
        } catch (err) {
            console.error("Error deleting product:", err);
            alert("Error deleting product. Please try again.");
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            const decodedToken = jwtDecode<DecodedToken>(token);

            if (decodedToken.exp && decodedToken.exp < Math.floor(Date.now() / 1000)) {
                localStorage.removeItem("token");
                window.location.href = "/login";
                return;
            }

            setUser(decodedToken.user);

            fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${decodedToken.user}/products`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => {
                    setProducts(data.products);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error("Error fetching products:", error);
                    setLoading(false);
                });
        } else {
            window.location.href = "/login";
        }
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNav>
                <div className="container mx-auto px-4 py-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
                            <p className="text-gray-600 mt-1">Manage your product inventory</p>
                        </div>
                        <button
                            onClick={() => showModal()}
                            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            <AddCircleOutlineRoundedIcon />
                            Add Product
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative mb-6">
                        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>

                    {/* Products Table */}
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Product
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Price
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Quantity
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                                Loading products...
                                            </td>
                                        </tr>
                                    ) : filteredProducts.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-4 text-center text-gray-500">
                                                No products found
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredProducts.map((product) => (
                                            <tr key={product.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        {product.imageUrl && (
                                                            <div className="flex-shrink-0 h-10 w-10 mr-3">
                                                                <Image
                                                                    src={product.imageUrl}
                                                                    alt={product.name}
                                                                    width={40}
                                                                    height={40}
                                                                    className="rounded-lg object-cover"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="text-sm font-medium text-gray-900">
                                                            {product.name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    ${product.price.toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-900">
                                                    {product.quantity}
                                                </td>
                                                <td className="px-6 py-4 text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => showModal(product)}
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        <EditRoundedIcon />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteProduct(product.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        <DeleteRoundedIcon />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </AdminNav>

            {isModalOpen && (
                <AddProductModal
                    show={isModalOpen}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
