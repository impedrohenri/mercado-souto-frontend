import Header from "@/components/header/Header";
import BannersCarousel from "./_components/BannersCarousel";
import ProductSlider from "@/components/Sliders/ProductSlider";
import { URL_API } from "@/api/index.routes";
import axios from "axios";

export default async function Home() {

  const res = await axios.get(`${URL_API}/product`)
  
  const products= res.data

  return (
    <>
      <Header />
      <BannersCarousel />
      <div className="pb-10">
        <ProductSlider products={products}/>
      </div>
    </>
  );
}
