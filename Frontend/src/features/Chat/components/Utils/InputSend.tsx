import{ MdEmojiEmotions } from "react-icons/md";
import { VscSend } from "react-icons/vsc";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTranslation } from "react-i18next";


interface InputSendProps {
  input: string;
  setInput: (value: string) => void;
  isBlocked: boolean;
  onSend: () => void;
  showEmojiPicker: boolean;
  setShowEmojiPicker: React.Dispatch<React.SetStateAction<boolean>>;
}

const InputSend: React.FC<InputSendProps> = ({
  input,
  setInput,
  isBlocked,
  onSend,
  showEmojiPicker,
  setShowEmojiPicker,
}) => {
  const maxLength: number = 300;
  let passLimit: boolean= false;

  const addToInput = (emoji: { native: string }) => {
    setInput(input + emoji.native);
  };

  const  handleLimt = (e: any) => {
    const inputvalue: string =  e.target.value

    if (inputvalue.length <= maxLength){
      setInput(inputvalue);
    }
  }

  const {t} = useTranslation();
  return (
    <div className="relative mt-4 opacity-80">
      <input
        type="text"
        placeholder={t("type_a_message")}
        value={input}
        // onChange={(e) => setInput(e.target.value)}
        onChange={handleLimt}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !isBlocked) onSend();
        }}
        className="w-full bg-[#393E46] h-14 max-lg:h-12 text-white placeholder-gray-500 rounded-full py-3 px-5 pr-12 outline-none focus:ring-2 focus:ring-[#0077FF] transition"
        disabled={isBlocked}
      />
      {showEmojiPicker && (
        <div className="absolute bottom-16 left-0 z-50">
          <Picker data={data} onEmojiSelect={addToInput} />
        </div>
      )}

      <MdEmojiEmotions
        className="absolute top-1/2 -translate-y-1/2 right-16 text-gray-400 w-6 h-6  rounded-full cursor-pointer hover:text-[#0077FF] duration-500 "
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        />
      <button
        onClick={onSend}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full  hover:bg-[#0077FF] duration-500"
        >
        <VscSend className="text-white w-5 h-5" />
      </button>

    </div>
  );
};

export default InputSend;


