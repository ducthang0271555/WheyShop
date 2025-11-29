import '../../styles/admin/AdminHeader.css';
import Header from '../../components/header/Header';
import Banner from "../../components/home/Banner";
import QuickNav from "../../components/home/QuickNav";

export default function HomePage() {
    return (
        <>
            <Header/>
            <Banner/>
            <QuickNav/>
        </>
    );
}
