import React from 'react'

export default function RatingFilter({
    style = {},
    className = "",
    onChange = event => { },
    value = 0
}) {
    return (
        <div style={style} className={className}>
            Min Rating:
            <select
                className="rounded border mx-2 px-1"
                onChange={onChange}
                value={value}>
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
            </select>
        </div>
    )
}
