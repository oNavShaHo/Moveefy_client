import React, { useEffect, useState, useRef } from "react";
import style from "./chat.module.css";

interface IMsgDataTypes {
  roomId: String | number;
  user: String;
  msg: String;
  time: String;
}

const ChatPage = ({ socket, username, roomId }: any) => {
  const [currentMsg, setCurrentMsg] = useState("");
  const [video, setVideo] = useState(false);

  const getFormattedTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = (now.getSeconds()).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };
  const getTargetedTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = (now.getSeconds()+2).toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  };

  const handlePlay = async () => {
    const msgData: IMsgDataTypes = {
      roomId,
      user: username,
      msg: "play",
      time: getTargetedTime(),
    };

    await socket.emit("send_msg", msgData);

    // Wait for the correct time before playing
    await validateTime(msgData.time);

    if (videoRef.current && !isPlaying) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // Update the current time every second
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // Clear the interval when the component is unmounted
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures the effect runs only once after the initial render

  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour12: false });

  console.log(formattedTime);

  const validateTime = (targetTime:any) => {
    return new Promise((resolve:any) => {
      const checkTime = () => {
        const currentTime = getFormattedTime();
        if (currentTime === targetTime) {
          resolve(); // Resolve without passing a value
        } else {
          setTimeout(checkTime, 1000);
        }
      };
  
      checkTime();
    });
  };

  const handlePause = async () => {
    const msgData: IMsgDataTypes = {
      roomId,
      user: username,
      msg: "pause",
      time: getTargetedTime(),
    };

    await socket.emit("send_msg", msgData);

    // Wait for the correct time before pausing
    await validateTime(msgData.time);

    if (videoRef.current && isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    socket.on("receive_msg", async (data: IMsgDataTypes) => {
      if (data.msg === "play" && videoRef.current) {
        // Wait for the correct time before playing
        await validateTime(data.time);

        videoRef.current.play();
        setIsPlaying(true);
      } else if (data.msg === "pause" && videoRef.current) {
        // Wait for the correct time before pausing
        await validateTime(data.time);

        videoRef.current.pause();
        setIsPlaying(false);
      } else if (data.msg === "plus" && videoRef.current) {
        // Wait for the correct time before adjusting
        await validateTime(data.time);

        videoRef.current.currentTime += 10;
      } else if (data.msg === "minus" && videoRef.current) {
        // Wait for the correct time before adjusting
        await validateTime(data.time);

        videoRef.current.currentTime -= 10;
      }
    });
  }, [socket]);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = e.target.files?.[0];
    setSelectedVideo(file);
    setVideo(true);
    // Reset video player
    if (videoRef.current) {
      videoRef.current.load();
      setIsPlaying(false);
    }
  };

  const handleIncreaseTime = async () => {
    const msgData: IMsgDataTypes = {
      roomId,
      user: username,
      msg: "plus",
      time: getFormattedTime(),
    };

    await socket.emit("send_msg", msgData);

    // Wait for the correct time before adjusting
    await validateTime(msgData.time);

    if (videoRef.current) {
      videoRef.current.currentTime += 10;
    }
  };

  const handleDecreaseTime = async () => {
    const msgData: IMsgDataTypes = {
      roomId,
      user: username,
      msg: "minus",
      time: getFormattedTime(),
    };

    await socket.emit("send_msg", msgData);

    // Wait for the correct time before adjusting
    await validateTime(msgData.time);

    if (videoRef.current) {
      videoRef.current.currentTime -= 10;
    }
  };

  return (
    <div className={`${style.chat_div} bg-gradient-to-r from-[rgb(165,142,255)] to-[#FF7AC2] min-h-fit w-[80vw] flex justify-center items-center`}>
      <div className="max-w-screen mx-auto shadow-lg rounded-md max-h-[70vh] ">
        <div className="flex items-center justify-center aspect-w-16 aspect-h-9">
          {/* Use a wrapper div with aspect ratio to maintain the video's aspect ratio */}
          {selectedVideo && (
            <video ref={videoRef} className="object-cover w-[70%] h-[60%] absolute " controls>
              {selectedVideo && (
                <source
                  src={URL.createObjectURL(selectedVideo)}
                  className="w-[80vw] "
                  type="video/mp4"
                />
              )}

              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div className="mt-4" style={{ display: video ? "none" : "" }}>
          <input
            type="file"
            accept="video/*"
            onChange={handleVideoChange}
            className="py-2 px-4 border rounded-md"
          />
        </div>
        <div className="flex items-center justify-center mt-4 space-x-4 relative top-[14rem]">
          <button onClick={handlePlay} className="px-4 py-2 text-white bg-blue-500 rounded-md">
            Play
          </button>
          <button onClick={handlePause} className="px-4 py-2 text-white bg-blue-500 rounded-md">
            Pause
          </button>
          <button onClick={handleIncreaseTime} className="px-4 py-2 text-white bg-green-500 rounded-md">
            +10s
          </button>
          <button onClick={handleDecreaseTime} className="px-4 py-2 text-white bg-red-500 rounded-md">
            -10s
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
