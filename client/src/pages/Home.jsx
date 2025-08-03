import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import BlogList from '../components/BlogList'
import NewBlog from '../components/NewBlog'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <div>
        <Navbar></Navbar>
        <Header></Header>
        <BlogList></BlogList>
        <NewBlog></NewBlog>
        <Footer></Footer>
    </div>
  )
}

export default Home