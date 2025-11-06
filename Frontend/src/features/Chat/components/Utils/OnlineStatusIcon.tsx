

const OnlineStatusIcon: React.FC<{ isOnline: boolean; size?: number }> = ({isOnline, size = 12,}) => {
  return (
    <div className="relative">
      <div
        className={`w-${size / 4} h-${size / 4} rounded-full ${
          isOnline ? "bg-green-500" : "bg-red-500"
        } border-2 border-[#222831]`}
        style={{ width: size, height: size }}
      />
    </div>
  );
};

export default OnlineStatusIcon;
