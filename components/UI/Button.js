// import { useState, useEffect, useCallback } from 'react';

import { forwardRef } from 'react';
import classNames from "classnames";

const ArticlesButton = forwardRef(function ArticlesButton(props, ref) {

    const {
        size,
        variant,
        style,
        // Can just use small instead of size="sm"
        small,
        large,
        onClick,
        className,
        disabled,
        active,
        type,
        ...rest
    } = props;

    return (
        <button
            ref={ref}
            {...rest}
            {
                ...(type && {type: 'submit'})
            }
            disabled={disabled}
            style={style}
            // data-react-component='true'
            className={
                classNames(
                    `btn ${variant ? `btn-${variant}` : 'btn-articles'}`,
                    {
                        [className]: className,
                        'btn-lg': large,
                        'btn-sm': small,
                        'active': active,
                        [`btn-${size}`]: size 
                    }
                )
            }
            onClick={onClick}
        >
            {props.children}
        </button>
    )
})

export default ArticlesButton