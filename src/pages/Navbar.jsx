import {useState} from 'react'
import {MenuIcon, XIcon} from '@heroicons/react/outline'
import { Link } from 'react-router-dom';

const Navbar = () => {
    const [nav, setNav] = useState(false)
    const handleClick = () => setNav(!nav)
    return (
        <div className='w-screen h-[80px] z-10 bg-neutral-background-light/95 backdrop-blur-md fixed drop-shadow-lg border-b border-neutral-border'>
            <div className='px-2 flex justify-between items-center w-full h-full'>
                <div className='flex items-center'>
                    <li className="text-3xl font-bold mr-4 sm:text-4xl">
                        <Link to="/">Fabriq.</Link>
                    </li>
                    <ul className='hidden md:flex'>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/wardrobe">Wardrobe</Link></li>
                        <li><Link to="/outfits">Outfits</Link></li>
                    </ul>
                </div>
                <div className = 'hidden md:flex pr-4'>
                    <Link to="/login" className = 'border-none bg-transparent text-neutral-text hover:text-primary mr-4 px-8 py-3 transition-colors'>
                        Sign In
                    </Link>
                    <Link to="/register" className = 'btn-primary px-8 py-3'>Sign Up</Link>
                </div>
                <div className='md:hidden' onClick={handleClick}>
                    {!nav ? <MenuIcon className='w-5' /> : <XIcon className='w-5' />}

                </div>
            </div>

            <ul className={!nav ? 'hidden' : 'absolute bg-neutral-background-light/98 backdrop-blur-md w-full px-8 border-b border-neutral-border'}>
                <li className='border-b-2 border-neutral-border w-full'>
                    <Link to="/" onClick={() => setNav(false)} className="text-neutral-text hover:text-primary transition-colors">Home</Link>
                </li>
                <li className='border-b-2 border-neutral-border w-full'>
                    <Link to="/wardrobe" onClick={() => setNav(false)} className="text-neutral-text hover:text-primary transition-colors">Wardrobe</Link>
                </li>
                <li className='border-b-2 border-neutral-border w-full'>
                    <Link to="/new-outfit" onClick={() => setNav(false)} className="text-neutral-text hover:text-primary transition-colors">New Outfit</Link>
                </li>
                <li className='border-b-2 border-neutral-border w-full'>
                    <Link to="/outfits" onClick={() => setNav(false)} className="text-neutral-text hover:text-primary transition-colors">Outfits</Link>
                </li>
                <div className='flex flex-col my-4'>
                    <Link to="/login" className="bg-transparent text-primary border-2 border-primary px-8 py-3 mb-4 rounded-xl hover:bg-primary/10 transition-all text-center font-semibold" onClick={() => setNav(false)}>
                        Sign In
                    </Link>

                    <Link to="/register" className="btn-primary px-8 py-3 text-center" onClick={() => setNav(false)}>
                        Sign Up
                    </Link>

                </div>
            </ul>

        </div>
    );
};
    
export default Navbar