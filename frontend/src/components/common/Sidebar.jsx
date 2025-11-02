import XSvg from "../svgs/X"
import { MdHomeFilled } from "react-icons/md"
import { IoNotifications } from "react-icons/io5"
import { FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { BiLogOut } from "react-icons/bi"

const Sidebar = () => {

    const data = {
        fullName: "John Doe",
        username: "johndoe",
        profileImg: "/avatars/boy1.png"
    };

  return (
    <div className="md:flex-[2_2_0] w-18 max-w-52">
        <div className="sticky top-0 left-0 h-screen flex flex-col border-r border-gray-700 w-20 md:w-full">
            <Link to="/" className="flex justify-center md:justify-start">
                <XSvg className="px-2 w-12 h-12 rounded-full fill-white hover:bg-stone-900" />
            </Link>
            <ul className="flex flex-col mt-4 gap-3">
                <li className="flex justify-center md:justify-start">
                    <Link 
                        to="/" 
                        className="flex items-center gap-3 hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
                    >
                        <MdHomeFilled className="w-8 h-8" />
                        <span className="hidden md:block text-lg">Home</span>
                    </Link>
                </li>
                <li className="flex justify-center md:justify-start">
                    <Link 
                        to="/notifications" 
                        className="flex items-center gap-3 hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
                    >
                        <IoNotifications className="w-8 h-8" />
                        <span className="hidden md:block text-lg">Notifications</span>
                    </Link>
                </li>
                <li className="flex justify-center md:justify-start">
                    <Link 
                        to={`/profile/${data?.username}`}
                        className="flex items-center gap-3 hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
                    >
                        <FaUser className="w-8 h-8" />
                        <span className="hidden md:block text-lg">Profile</span>
                    </Link>
                </li>
            </ul>
            {data && (
                <Link
                    to={`/profile/${data?.username}`}
                    className="mt-auto flex items-start gap-2 hover:bg-[#181818] transition-all rounded-full duration-300 mb-10 py-2 px-4"
                >
                    <div className="avatar hidden md:inline-flex">
                        <div className="w-8 rounded-full">
                            <img src={data?.profileImg || "avatar-placeholder.png"} alt="profile" />
                        </div>
                    </div>
                    <div className="flex justify-between flex-1">
                        <div className="hidden md:block">
                            <p className="text-white font-bold text-sm w-20 truncate">{data?.fullName}</p>
                            <p className="text-slate-500 text-sm">@{data?.username}</p>
                        </div>
                        <BiLogOut className="w-6 h-6 cursor-pointer" />
                    </div>
                </Link>
            )}
        </div>
    </div>
  )
}

export default Sidebar