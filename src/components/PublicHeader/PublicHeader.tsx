import Image from "next/image";
import logo from "../../../public/static/images/logo/ml_logo.svg";
import Link from "next/link";

export default function PublicHeader() {
  return (
    <div className="flex items-center px-20 bg-(--primary-yellow) h-14">
      <Link href='/'><Image src={logo} alt="logo" height={40} /></Link>
    </div>
  );
}
