import React from 'react'

const loaderStyle = (size, isFixed, isInline, color, background) => ({
    backgroundColor: background,
    ...(isFixed ? {
        position: "fixed",
        zIndex: 100,
        left: 0,
        right: 0,
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
    } : {
            display: isInline ? "inline-block" : "block",
            width: (size + 2) + "px",
            height: (size + 2) + "px",
        })
})

const spinnerStyle = (size, color) => ({
    content: " ",
    display: "block",
    borderRadius: "50%",
    width: size + "px",
    height: size + "px",
    margin: 0,
    boxSizing: "border-box",
    border: "2px solid #fff",
    borderColor: color + " transparent " + color + " transparent",
})

export default function Loader({ size = 48, isFixed = false, isInline = false, color = "orangered", background = "transparent" }) {
    return <div
        className="Loader"
        style={loaderStyle(size, isFixed, isInline, color, background)}>
        <div
            className="spinner"
            style={spinnerStyle(size, color)}></div>
    </div>
}