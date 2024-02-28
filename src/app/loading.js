import Image from "next/image"
import loadingImage from "/public/loading-tablet.gif"

export default function Loading() {
    return (
      <div className="bg-gray-100 bg-opacity-50 overflow-y-auto h-screen w-full flex items-center justify-center">
        <div className="">
             <div className="h-full flex items-center justify-center">
              <Image
                src={loadingImage}
                alt="loading"
                width={250}
                className="mb-32"
              />
            </div>
          </div>
        </div>
    )
}