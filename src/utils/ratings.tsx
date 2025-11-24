import { ReactNode } from "react";

interface IProps{
    rating: number;
}

export default function Ratings({rating}: IProps){
    const stars: ReactNode[] = [];
    
    while (rating >= 1) {
        rating--;
        stars.push(<i key={rating} className="fa fa-star"></i>)
        if (rating <= 0.9){
            stars.push(<i key='half' className="fa fa-star-half"></i>)
        }
    }

    ;

    return (
        <span className="text-(--primary-blue)">
            {stars.map(i => i)}
        </span>
    )
}