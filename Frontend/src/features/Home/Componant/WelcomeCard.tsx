import { FaPlay } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useStore } from "../../../store/store";
import { useTranslation } from "react-i18next";
import TextType from "../Utils/TextType";

const WelcomeCard: React.FC = () => {
  const store = useStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="z-10 relative w-full h-auto bg-[#393E46]  rounded-3xl text-[#EEEEEE] overflow-hidden ">
      <div className=" flex flex-col gap-8 2xl:gap-5 xl:gap-4 lg:gap-4 md:gap-3 sm:gap-4 p-4">
        <div className="">
          <h1 className="font-russo text-2xl sm:text-4xl md:text-4xl  sm_md:bg-green-600 2xl:text-6xl text-white animate-pulse">
            <TextType
              text={t("welcome_back")}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={false}
              cursorCharacter="."
            />
            {/* {t("welcome_back")} */}
          </h1>
          <h2 className="font-russo text-1xl sm:text-4xl md:text-4xl  sm_md:bg-green-600 2xl:text-6xl text-white mt-1 animate-pulse">
            <TextType
              text={store.username.toUpperCase()}
              typingSpeed={75}
              pauseDuration={1500}
              showCursor={false}
              cursorCharacter="."
            />
            {/* {store.username.toUpperCase()} */}
          </h2>
        </div>
        <button
          className=" w-fit px-8 py-3 h-[50%] rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600  text-white font-bold flex items-center justify-center space-x-2"
          onClick={() => navigate(`/game`)}
        >
          <FaPlay className="text-lg" />
          <span>{t("play")}</span>
        </button>
      </div>
      <div className="absolute top-[50%] right-2 sm:hidden flex items-center justify-center w-20 h-20 rounded-full overflow-hidden shadow-lg ">
        <div className='w-16 h-16 rounded-2xl overflow-hidden border-3 border-slate-600 shadow-lg"'>
          <img
            src={store.image_url}
            alt="Player Avatar"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
 


      <div className="sm:absolute sm:transform sm:-translate-x-1/2 sm:-bottom-4 sm:left-1/2 h-[80%] sm:justify-center hidden sm:flex">
        <div className="relative w-full h-full">
          <svg viewBox="0 0 207 110" className="w-full h-full">
            <path
              d="M102.267 0.434814C132.402 0.434814 156.831 24.8643 156.831 54.9993C156.831 59.7291 156.229 64.3183 155.098 68.6946C155.021 69.5379 154.981 70.389 154.981 71.2463C154.982 92.1843 178.085 109.197 206.771 109.556V109.565H0.228516V109.484C27.7613 108.213 49.5513 91.5806 49.5518 71.2463C49.5518 70.389 49.511 69.5379 49.4346 68.6946C48.3034 64.3184 47.7021 59.729 47.7021 54.9993C47.7021 24.8643 72.1317 0.434882 102.267 0.434814Z"
              fill="#222831"
            />
          </svg>
          <img
            src={store.image_url}
            alt="Player Avatar"
            className="absolute rounded-full object-cover"
            style={{
              width: "48%",
              height: "82%",
              left: "26%",
              top: "9%",
              clipPath: "circle(45% at 50% 50%)",
            }}
          />
        </div>
      </div>

      <div className="sm:absolute sm:top-0 sm:right-0 sm:z-20 sm:h-full sm md:w-[30%] xl:w-[20%] sm:w-[40%] sm:justify-end hidden sm:flex ">
        <svg
          className="h-full w-full"
          viewBox="0 0 220 270"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          preserveAspectRatio="xMidYMid slice"
        >
          <path
            d="M177.359 256.436H128.197L169.058 42.436H218.22L177.359 256.436Z"
            fill="#222831"
          />
          <path
            d="M117.359 256.436H68.1973L109.058 42.436H158.22L117.359 256.436Z"
            fill="#222831"
          />
          <path
            d="M141.687 102.026C142.56 101.151 142.56 100.06 141.687 99.1893L129.03 86.5582L141.687 73.8811C142.56 73.0069 142.56 71.916 141.687 71.0449C140.814 70.1738 139.723 70.1757 138.85 71.05L126.193 83.7271L113.536 71.096C112.663 70.2249 111.572 70.2269 110.699 71.1012C110.263 71.5383 110.044 71.9751 110.044 72.6296C110.044 73.2841 110.263 73.7201 110.699 74.1556L123.356 86.7867L110.699 99.4638C110.263 99.9009 110.044 100.338 110.044 100.992C110.044 101.429 110.263 102.083 110.699 102.518C111.572 103.389 112.663 103.387 113.536 102.513L126.193 89.3996L138.85 102.031C139.723 102.902 141.032 102.899 141.687 102.026Z"
            fill="#0077FF"
          />
          <path
            d="M130.447 134.326C131.402 133.215 130.562 131.202 129.103 131.104L101.103 127.468C100.817 127.352 100.415 127.52 100.012 127.689C99.6099 127.858 99.4087 127.942 99.0902 128.312C98.6545 128.968 98.504 129.741 98.756 130.345L109.593 156.32C109.845 156.924 110.5 157.359 111.272 157.508C111.557 157.625 111.959 157.457 112.362 157.288C112.764 157.119 112.966 157.035 113.284 156.664L130.447 134.326ZM103.924 131.963L124.945 134.74L112.157 151.696L103.924 131.963Z"
            fill="#0077FF"
          />
          <path
            d="M182.001 163.335C178.556 155.08 169.143 151.22 160.892 154.68C152.641 158.141 148.772 167.57 152.216 175.826C155.661 184.081 165.074 187.94 173.325 184.48C181.576 181.02 185.361 171.389 182.001 163.335ZM156.04 174.222C153.436 167.98 156.451 161.038 162.488 158.506C168.727 155.89 175.657 158.898 178.177 164.939C180.781 171.18 177.767 178.123 171.729 180.655C165.49 183.271 158.56 180.263 156.04 174.222Z"
            fill="#0077FF"
          />
          <path
            d="M200.176 119.222L189.339 93.2472C188.919 92.2405 187.778 91.7726 186.772 92.1946L160.811 103.082C159.805 103.504 159.336 104.647 159.756 105.653L170.593 131.628C171.013 132.634 172.154 133.102 173.16 132.68L199.121 121.793C200.127 121.371 200.596 120.228 200.176 119.222ZM173.459 128.296L164.134 105.946L186.271 96.6629L195.597 119.013L173.459 128.296Z"
            fill="#0077FF"
          />
        </svg>
      </div>
    </div>
  );
};

export default WelcomeCard;
