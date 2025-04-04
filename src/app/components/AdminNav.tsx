import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';

export default function AdminNav() {
    return (
        <nav className="flex flex-col items-center gap-3 ml-0 shadow-md p-2 w-fit h-screen">
            <div className='flex items-center justify-center bg-black w-8 h-8 rounded-full'>
                <h3 className='text-white font-bold'>A</h3>
            </div>
            <HomeIcon />
            <ShoppingCartIcon />
            <CategoryRoundedIcon />
            <PeopleRoundedIcon />
        </nav>
    )
}