import Image from "next/image";
import logo from "../../../public/assets/ml_logo.png";

export default function PublicHeader() {
  return (
    <div className="flex items-center px-20 bg-(--primary-yellow) h-14">
      <Image src={logo} alt="logo" height={40} />
    </div>
  );
}
