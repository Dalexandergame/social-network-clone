import { useState } from "react"

import Posts from "../../components/common/Posts"
import CreatePost from "./CreatePost"

const HomePage = () => {

    const [feedType, setFeedType] = useState('for-you'); // 'for-you' or 'following'

  return (
    <>
        <div className="flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen">
            {/* Header */}
            <div className="flex w-full border-b border-gray-700">
                <div
                    className={
                        "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                    }
                    onClick={() => setFeedType('for-you')}
                >
                    For you
                    {feedType === "forYou" && (
                        <div className="absolute bottom-0 h-1 w-10 bg-primary rounded-full"></div>
                    )}
                </div>
                <div
                    className={
                        "flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
                    }
                    onClick={() => setFeedType('following')}
                >
                    Following
                    {feedType === "following" && (
                        <div className="absolute bottom-0 h-1 w-10 bg-primary rounded-full"></div>
                    )}
                </div>
            </div>
            {/* Create Post */}
            <CreatePost />

            {/* Posts */}
            <Posts feedType={feedType}/>
        </div>
    </>
  )
}

export default HomePage