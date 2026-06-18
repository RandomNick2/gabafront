import React from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import ContactUs from './pages/ContactUs'
import GalleryPage from './pages/GalleryPage'
import './App.css'
import ToursPage from './pages/ToursPage'
import HotelBookingPage from './pages/HotelBookingPage'
import LoginPage from './pages/LoginPage'
import TourDetailPage from './pages/TourDetailPage'
import ProfilePage from './pages/ProfilePage'
// import ProviderPage from './components/Provider'
import VideoTravelPage from './pages/VideoTravelPage'
import EditProfilePage from './pages/EditProfilePage'
import { WeatherProvider } from './components/WeatherContext'
import { UserProvider } from './contexts/UserContext'
import HotelListPage from './pages/HotelListPage'
import HotelDetailPage from './pages/HotelDetailPage'
import BookingRoom from './components/BookingRoom'
// import MyBooking from './components/MyBooking'
import TourBookingPage from './pages/TourBookingPage'
import AIAdvisor from './components/AIAdvisor'
import BookingTourDetail from "./components/BookingTourDetail";
import MyBookingsPage from "./components/MyBookingsPage";
import GuideTours from "./components/GuideTours";
import OwnerHotels from "./components/OwnerHotels";
import Map3DPage from './pages/Map3DPage'

function App() {
  return (
      <Router>
        <UserProvider>
          <WeatherProvider>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/tours" element={<ToursPage />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/auth" element={<LoginPage />} />
              <Route path="/video-travel" element={<VideoTravelPage />} />
              <Route path="/3d-map" element={<Map3DPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/tour/:id" element={<TourDetailPage />} />
              <Route path="/edit-profile" element={<EditProfilePage />} />
              <Route path="/hotels/" element={<HotelListPage />} />
              <Route path="/hotels/:id" element={<HotelDetailPage />} />
              <Route
                path="/hotel-booking/:hotelId/room/:roomId"
                element={<HotelBookingPage />}
              />
              <Route
                path="/booking-room/:bookingId"
                element={<BookingRoom />}
              />
              <Route
                path="/bookings/create/:tourId"
                element={<TourBookingPage />}
              />
              <Route path="/booking-tour/:bookingId" element={<BookingTourDetail />} />
              <Route path="/my-bookings" element={<MyBookingsPage />}/>
              <Route path="/guide/tours" element={<GuideTours />}/>
              <Route path="/owner/hotels" element={<OwnerHotels />}/>
              <Route path="*" element={<h1>404 Not Found</h1>} />
            </Routes>
            <AIAdvisor />
          </WeatherProvider>
        </UserProvider>
      </Router>
  )
}

export default App
