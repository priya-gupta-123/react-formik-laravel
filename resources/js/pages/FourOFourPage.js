import React from 'react'
import { Link } from 'react-router-dom'
import { HOMEPAGE_ROUTE } from './HomePage'

export default function FourOFourPage() {
    return (
        <div className="flex justify-center items-center FourOFourPage">
            <div className="text-center">
                <p className="my-3">You seem to be lost... Aren't we all?</p>
                <Link className="rounded px-2 py-1 text-white bg-orange-500 my-2 uppercase" to={HOMEPAGE_ROUTE}>Home</Link>
            </div>
        </div>
    )
}
