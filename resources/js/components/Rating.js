import React, { useEffect, useState } from 'react';
import RatingStar from './rating-star.png';

export default function Rating({
    rating = 0,
    className = "",
    size = 24,
    editable = false,
    onClick = rating => { },
}) {

    rating = Math.ceil(rating);

    const [currentRating, setCurrentRating] = useState(rating);

    useEffect(() => {
        setCurrentRating(rating);
    }, [rating]);

    return (
        <span className={className}>
            {
                (new Array(5)).fill(1).map((v, i) => (
                    <img
                        src={RatingStar}
                        key={i}
                        onClick={
                            () => {
                                if (editable) {
                                    onClick(i + 1);
                                }
                            }
                        }
                        onMouseOver={
                            () => {
                                if (editable) {
                                    setCurrentRating(i + 1);
                                }
                            }
                        }
                        onMouseLeave={
                            () => {
                                if (editable) {
                                    setCurrentRating(rating);
                                }
                            }
                        }
                        style={
                            (i + 1) <= currentRating
                                ? { width: size + "px" }
                                : { filter: "grayscale(1)", width: size + "px" }
                        }
                        className="inline" />
                ))
            }
        </span>
    )
}
