import React from 'react'
import Banner from '../Layouts/Banner'
import About from '../Components/About'
import VisaServicesSection from '../Components/Visaservice'
import CountrySupportSection from '../Components/Countries'
import Training from '../Components/Training'
import WhyChooseUs from '../Components/Benifits'
import StatsSection from '../Components/Stats'
import VisaProcessSection from '../Components/Process'
import ContactBanner from '../Components/Contactbanner'
import TeamSection from '../Components/Team'
import FAQSection from '../Components/FAQ'
import Testimonials from '../Components/Testimonial'
import VisaCardsSection from './Visacards'
import CoachingCards from './Coursecards'


const Home = () => {
  return (
    <>
    <Banner/>
    <About/>
    <VisaServicesSection/>
    <CountrySupportSection/>
    <Training/>
    <WhyChooseUs/>
    <StatsSection/>
    <VisaProcessSection/>
    <ContactBanner/>
    <TeamSection/>
    <FAQSection/>
    <Testimonials/>
    <VisaCardsSection/>
    <CoachingCards/>
    
   
    
    
    
      
    </>
  )
}

export default Home
