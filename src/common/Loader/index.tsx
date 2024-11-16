import {bg4} from "../utils/Styles.tsx";

const Loader = () => {
  return (
    <div className="flex h-screen items-center justify-center " style={{background: bg4}}>
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-[#e05844] border-t-transparent"></div>
    </div>
  );
};

export default Loader;
