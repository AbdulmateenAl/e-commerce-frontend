import HomeIcon from '@mui/icons-material/Home';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import CategoryRoundedIcon from '@mui/icons-material/CategoryRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';

export default function AdminNav() {
    return (
        <nav className="flex flex-col gap-3 ml-0">
            <div className='bg-black'>
                <h3 className='text-white font-bold'>A</h3>
            </div>
            <HomeIcon />
            <ShoppingCartIcon />
            <CategoryRoundedIcon />
            <PeopleRoundedIcon />
        </nav>
    )
}