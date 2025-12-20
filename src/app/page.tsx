import { Header } from "../components/layout/Header";
import { Hero } from "../components/sections/Hero";
import { About } from "../components/sections/About";
import { Mission } from "../components/sections/Mission";
import { Rooms } from "../components/sections/Rooms";
import { Contact } from "../components/sections/Contact";
import { Birthdays } from "../components/sections/Birthdays";
import { Booking } from "../components/sections/Booking";
import { Franchising } from "../components/sections/Franchising";
import { FAQ } from "../components/sections/FAQ";
import { Footer } from "../components/layout/Footer";

export default function Home() {
    return (
        <>
            <Header />
            <main>
                <Hero />
                <About />
                <Mission />
                <Rooms />
                <Contact />
                <Birthdays />
                <Booking />
                <Franchising />
                <FAQ />
            </main>
            <Footer />
        </>
    );
}