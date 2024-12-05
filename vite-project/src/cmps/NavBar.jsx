import { useEffect, useRef, useState } from "react"
import { filterService } from "../services/filter.service"
import filterIcon from '/filter.svg'
import { useSelector } from "react-redux"

export function NavBar({ setFilteredStays }) {
    const categories = filterService.getPopularCategories()
    const categoryListRef = useRef(null)
    const [isAtStart, setIsAtStart] = useState(true)
    const [isAtEnd, setIsAtEnd] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState(null)
    const stays = useSelector((storeState) => storeState.stayModule.stays)

    const categoryList = document.querySelector('.navBar-container')

    useEffect(() => {
        const handleScroll = () => {
            if (!categoryListRef.current) return
            const scrollLeft = categoryListRef.current.scrollLeft
            const maxScrollLeft = categoryListRef.current.scrollWidth - categoryListRef.current.clientWidth

            setIsAtStart(scrollLeft === 0)
            setIsAtEnd(scrollLeft === maxScrollLeft)
        }

        window.addEventListener('scroll', () => {
            if (categoryList) {
                if (window.scrollY > 0) {
                    categoryList.classList.add('scrolling')
                } else {
                    categoryList.classList.remove('scrolling')
                    categoryList.classList.remove('margin')
                }
            }
        })

        if (categoryListRef.current) {
            categoryListRef.current.addEventListener('scroll', handleScroll)
        }

        return () => {
            if (categoryListRef.current) {
                categoryListRef.current.removeEventListener('scroll', handleScroll)
            }
        }
    }, [])

    function scrollLeft() {
        if (categoryListRef.current) {
            const scrollDistance = calculateScrollDistance()
            categoryListRef.current.scrollLeft -= scrollDistance
        }
    }

    function scrollRight() {
        if (categoryListRef.current) {
            const scrollDistance = calculateScrollDistance()
            categoryListRef.current.scrollLeft += scrollDistance
        }
    }

    function calculateScrollDistance() {
        if (!categoryListRef.current) return 400

        const containerWidth = categoryListRef.current.offsetWidth
        const totalCategories = categories.length
        const scrollDistance = containerWidth / totalCategories * 50

        return scrollDistance
    }

    function onSelectCategory(categoryUrl) {
        setSelectedCategory(categoryUrl)
        const filtered = stays.filter(stay => stay.labels.includes(categoryUrl))
        setFilteredStays(filtered)
    }

    const LeftNavIcon = (
        <div
        className={`scale-on__hover`}
            style={{
                marginTop: '-12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '32px',
                height: '32px',
                border: '1px solid rgb(0 0 0 / 0.3)',
                borderRadius: '50%',
                backgroundColor: 'white',
                zIndex: '5',
                cursor: isAtStart ? 'default' : 'pointer',
                opacity: isAtStart ? 0.0 : 1,
            }}
            onClick={isAtStart ? null : scrollLeft}
        >
            <svg
                viewBox="0 0 18 18"
                role="img"
                aria-label="Previous"
                focusable="false"
                style={{
                    width: '12px',
                    height: '12px',
                    fill: 'currentcolor',
                    cursor: isAtStart ? 'default' : 'pointer',
                }}
            >
                <path
                    d="m13.7 16.29a1 1 0 1 1 -1.42 1.41l-8-8a1 1 0 0 1 0-1.41l8-8a1 1 0 1 1 1.42 1.41l-7.29 7.29z"
                    fillRule="evenodd"
                ></path>
            </svg>
        </div>
    )

    const RightNavIcon = (
        <div
        className={`scale-on__hover`}
            style={{
                marginTop: '-12px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '32px',
                height: '32px',
                border: '1px solid rgb(0 0 0 / 0.3)',
                borderRadius: '50%',
                backgroundColor: 'white',
                zIndex: '5',
                cursor: isAtEnd ? 'default' : 'pointer', 
                opacity: isAtEnd ? 0.0 : 1,
            }}
            onClick={isAtEnd ? null : scrollRight}
        >
            <svg
                viewBox="0 0 18 18"
                role="img"
                aria-label="Next"
                focusable="false"
                style={{
                    width: '12px',
                    height: '12px',
                    fill: "currentcolor",
                    cursor: isAtEnd ? 'default' : 'pointer',
                }}
            >
                <path
                    d="m4.29 1.71a1 1 0 1 1 1.42-1.41l8 8a1 1 0 0 1 0 1.41l-8 8a1 1 0 1 1 -1.42-1.41l7.29-7.29z"
                    fillRule="evenodd"
                ></path>
            </svg>
        </div>
    )

    return (
        <section className="flex navBar-container main-layout">
            <span className="left-icon__list main-layout__navBar2">
                {LeftNavIcon}
            </span>
            <section className="category-list main-layout" ref={categoryListRef}>
                {categories.map((category) => (
                    <div
                        key={category.url}
                        className={`category-item ${category.url === selectedCategory ? 'selected' : ''}`}
                        onClick={() => onSelectCategory(category.url)}
                    >
                        <img className="icon24  clr-secondary text-grey" src={`/img/categories/${category.url}.png`} alt={category.name} />
                        <p className="category-name fs12">{category.name}</p>
                    </div>
                ))}
            </section>
            <span className="right-icon__list main-layout__navBar">
                {RightNavIcon}
            </span>
        </section>
    )
}
