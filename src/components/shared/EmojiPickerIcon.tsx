type EmojiIconProps = {
    filled: boolean;
    width?: number;
    height?: number;
    onClick?: any;
}

const EmojiIcon = ({
    filled,
    width = 20,
    height = 20,
    onClick = (_: any) => {}
}: EmojiIconProps) => {
    return (
        <svg
            width={width} 
            height={height} 
            stroke={'#fff'}
            viewBox="0 0 24 24"
            fill={'none'} 
            onClick={onClick}
            className='cursor-pointer'
        >
            <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
            <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
            <g id="SVGRepo_iconCarrier">
                <path d="M9 14C9.18131 14.4723 9.47841 14.8915 9.864 15.219C11.0903 16.2483 12.8748 16.2613 14.116 15.25C14.5069 14.9283 14.8109 14.5136 15 14.044" stroke={filled ? "" : "#fff"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M19 12C19 15.866 15.866 19 12 19C8.13401 19 5 15.866 5 12C5 8.13401 8.13401 5 12 5C13.8565 5 15.637 5.7375 16.9497 7.05025C18.2625 8.36301 19 10.1435 19 12Z" stroke={filled ? "" : "#fff"} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
                <path d="M9 11V10" stroke={filled ? "" : "#fff"} stroke-width="1.5" stroke-linecap="round">            
                </path>
                <path d="M15 11V10" stroke={filled ? "" : "#fff"} stroke-width="1.5" stroke-linecap="round">
                </path> 
            </g>
        </svg>
    )
}

export default EmojiIcon;