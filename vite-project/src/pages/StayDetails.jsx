import { useEffect, useRef, useState } from "react"
import { HiXMark } from "react-icons/hi2";
import { ImgUseGrid } from "../cmps/ImgUseGrid"
import { stayService } from "../services/stay.service.local"
import { Link, useNavigate, useParams } from "react-router-dom"
import { StayLoader } from "./StayLoader"
import { useHistory } from "../CustomHook/StayHistory"
import { AppFooterDetails } from "../cmps/details/DetailsFooter"
import { DetailsHouse } from "../cmps/details/DetailsHouse"
import { HostedSmallDetails } from "../cmps/details/HostedSmallDetails"
import { StayCalendar } from "../cmps/StayCalendar"
import { OrderModal } from "./OrderModal"
import { AllAmenities } from "../cmps/AllAmenities"
import { AmenitiesList } from "../cmps/AmenitiesList"
import { StayHighlights } from "../cmps/StayHighlights";
import Reviews from "./Reviews";
import { ReviewBar } from "../cmps/reviews/ReviewBar";
import { IndexReviews } from "../cmps/reviews/IndexReviews";

export function StayDetails({ reviews }) {
  const [stay, setStay] = useState(null)
  const { stayId } = useParams()
  const navigate = useNavigate()
  const imgsToDisplay = stay?.imgUrls?.slice(0, 5)
  const { addStayToHistory } = useHistory()
  const reserveBtnRef = useRef()
  const [openTab, setOpenTab] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [component, setComponent] = useState(null);

  const amenitiesToDisplay = stay?.amenities?.slice(0, 10)

  useEffect(() => {
    loadStay()
  }, [])

  async function loadStay() {
    try {
      const stay = await stayService.getById(stayId)
      setStay(stay)
      addStayToHistory(stay)
    } catch (err) {
      console.log('Had issues in stay details', err)
      navigate('/stay')
    }
  }

  function openModal(componentToOpen) {
    console.log('isOpen:', isOpen)
    setIsOpen(true)
    setComponent(componentToOpen)
  }

  function closeModal() {
    setIsOpen(false)
    setComponent(null)
  }

  function onOpenStayGallery() {
    console.log('open gallery')
  }

  if (!stay) {
    return <StayLoader />
  }

  return (
    <section className="">
      <section className="secondary-layout">
        {!stay && <StayLoader />}
        {stay && (
          <>
            <section className="revers-flex__media">
              <div className="controller-layout__details">
                <h1 className="stay-top">{stay.name}</h1>
              </div>
              <div className="sss">
                <ImgUseGrid
                  imgsToDisplay={imgsToDisplay}
                  onOpenStayGallery={onOpenStayGallery}
                />
              </div>
            </section>
          </>
        )}
        <section>
        </section>
      </section>
      <Link to="/history">Go to History</Link>
      <div className="controller-layout__details container-details__split secondary-layout">
        <div className="details-house">
          <DetailsHouse stay={stay} />
          <HostedSmallDetails host={stay.host} />
          <div className='stay-highlights border-buttom'>
                    <StayHighlights />
                  </div>
          <div>
            <div id="amenities" className="stay-amenities border-bottom">
              <h4 className="subheading">What this place offers</h4>
              {amenitiesToDisplay && <AmenitiesList amenitiesToDisplay={amenitiesToDisplay} />}
              {stay.amenities.length > 10 && (
                <div
                  className="rev-btn show-all-amenities  fs16"
                  onClick={() => openModal(<AllAmenities amenities={stay.amenities} />)}
                >
                  Show all {stay.amenities.length} amenities
                </div>
              )}
            </div>
            {isOpen && (
              <section className="amenities-modal__container">
                <div className="modal-overlay" onClick={closeModal}>
                  <div className="modal-content" onClick={(ev) => ev.stopPropagation()}>
                    <button onClick={closeModal} className="modal-close-btn"> <HiXMark style={{ fontSize: '20px' }} /></button>
                    {component}
                  </div>
                </div>
              </section>
            )}
          </div>
          <div className='stay-calendar'>
            <StayCalendar />
          </div>
          
        </div>
        <div className="stay-card">
          {/* <StayCard stay={stay} /> */}

          <div className='stay-review-order'>
            <OrderModal
              stay={stay}
              openTab={openTab}
              setOpenTab={setOpenTab}
              reserveBtnRef={reserveBtnRef}
            />
          </div>
        </div>
      </div>
      <div className="secondary-layout">
        <section className="flex1">
      <ReviewBar reviews={stay.reviews} />
      <IndexReviews reviews={reviews} />
      </section>
          <Reviews reviews={stay.reviews}/>
          </div>
      <AppFooterDetails />
    </section>
  )
}
