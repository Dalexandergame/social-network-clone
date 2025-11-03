import XSvg from "../svgs/X"
import { MdHomeFilled } from "react-icons/md"
import { IoNotifications } from "react-icons/io5"
import { FaUser } from "react-icons/fa"
import { Link } from "react-router-dom"
import { BiLogOut } from "react-icons/bi"
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"

const Sidebar = () => {
    const queryClient = useQueryClient()

    const { mutate: logoutFn, error } = useMutation({
        mutationFn: async() => {
            try {
                const res = await fetch('/api/auth/logout', {
                    method: 'POST',
                })

                const data = await res.json()
                if(!res.ok) throw new Error(data.error || 'Something went wrong')

            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        onSuccess: () => {
            toast.success('Logged out successfully!')
            queryClient.invalidateQueries({queryKey: ['currentUser']})
        },
        onError: () => {
            toast.error(error.message)
        }
    })

    // const data = {
    //     fullName: "John Doe",
    //     username: "johndoe",
    //     profileImg: "/avatars/boy1.png"
    // };
    const { data: authData } = useQuery({
        queryKey: ['currentUser']
    })

  return (
    <div className="md:flex-[2_2_0] w-52 max-w-52">
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
                        to={`/profile/${authData?.username}`}
                        className="flex items-center gap-3 hover:bg-stone-900 transition-all rounded-full duration-300 py-2 pl-2 pr-4 max-w-fit cursor-pointer"
                    >
                        <FaUser className="w-8 h-8" />
                        <span className="hidden md:block text-lg">Profile</span>
                    </Link>
                </li>
            </ul>
            {authData && (
                <Link
                    to={`/profile/${authData?.username}`}
                    className="mt-auto flex items-start gap-2 hover:bg-[#181818] transition-all rounded-full duration-300 mb-10 py-2 px-4"
                >
                    <div className="avatar hidden md:inline-flex">
                        <div className="w-8 rounded-full">
                            <img src={authData?.profileImg || "avatar-placeholder.png"} alt="profile" />
                        </div>
                    </div>
                    <div className="flex justify-between flex-1">
                        <div className="hidden md:block">
                            <p className="text-white font-bold text-sm w-20 truncate">{authData?.fullName}</p>
                            <p className="text-slate-500 text-sm">@{authData?.username}</p>
                        </div>
                        <BiLogOut className="w-6 h-6 cursor-pointer"
                            onClick={(e) => {
                                e.preventDefault()
                                logoutFn();
                            }}
                        />
                    </div>
                </Link>
            )}
        </div>
    </div>
  )
}

export default Sidebar