import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from '../Pages/Home'
import AboutSection from '../Pages/AboutPage'
import CoachingCards from '../Pages/Coursecards'
import VisaCardsSection from '../Pages/Visacards'
import ContactUs from '../Pages/ContactUs'
import Navbar from '../Layouts/Navbar'
import Footer from '../Layouts/Footer'
import CountryGrid from '../Pages/Country'
import ScrollToTop from '../Components/ScrollUp'
import AuthForm from '../Pages/Signup'
import Cart from '../Pages/Cart'
import Dashboard from '../Pages/Dashboard'

const Routing = () => {
  return (
    <>
    <Navbar/>
    <ScrollToTop/>
    <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/about" element={<AboutSection />} />
      <Route path="/coachingcards" element={<CoachingCards/>} />
      <Route path="/visacards" element={<VisaCardsSection/>} />
      <Route path="/contact" element={<ContactUs/>} />
      <Route path="/country" element={<CountryGrid/>}/>
      <Route path="/signup" element={<AuthForm/>}/>
      <Route path="/cart" element={<Cart/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>



      
      
    </Routes>
    <Footer/>
  </>
  )
}

export default Routing
