import Head from "next/head";
import React, { useContext, useEffect, useState } from "react";
import Footer from "../../../components/Footer";
import Navbar from "../../../components/Navbar";
import SellProductsForm from "../../../components/SellProductsForm";
import ShopContext from "../../../context/ShopContext";
import mongoose from 'mongoose'
import User from "../../../models/UserSchema.js";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Sellswags = ({ singleuser, usermail }) => {
    const context = useContext(ShopContext);
    const { productdetails, setproductdetails } = context;
    const [cart, setcart] = useState({ email: "", sellproducts: [] });
    const [newproducts, setnewproducts] = useState([]);

    useEffect(() => {
        console.log(singleuser);
    }, []);



    const refreshData = () => {
        router.replace(router.asPath);
    }

    const addproducttocart = async () => {


        cart.email = usermail;

        cart.sellproducts = singleuser.sellproducts.concat(newproducts);

        fetch(`${process.env.NEXT_PUBLIC_SHOP_URL}/api/products/addproductstocart`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(cart)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            }
            )
            .catch(err => console.log(err));




        // setoldproducts([]);




        toast('🌈 Added to cart !', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            onClose: () => {
                refreshData();
            }
        });
    }

    const setTheProduct = () => {
        console.log("I am at setTheProduct");
        setnewproducts(productdetails);
        addproducttocart();
    };
    return (
        <>
            <Head>
                <title>ShopCoders | Sell swags </title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />

            <div className="container">
                <button
                    type="button"
                    className="btn btn-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#staticBackdrop"
                >
                    Add your product you want to sell
                </button>

                <div
                    className="modal fade"
                    id="staticBackdrop"
                    data-bs-backdrop="static"
                    data-bs-keyboard="false"
                    tabIndex="-1"
                    aria-labelledby="staticBackdropLabel"
                    aria-hidden="true"
                >
                    <div className="modal-dialog modal-dialog-centered  modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="staticBackdropLabel">
                                    Fill in the details for your product
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    data-bs-dismiss="modal"
                                    aria-label="Close"
                                ></button>
                            </div>
                            <div className="modal-body">
                                <SellProductsForm />
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                >
                                    Close
                                </button>
                                <button type="button" className="btn btn-primary" onClick={(e) => {
                                    e.preventDefault();
                                    setTheProduct();
                                }} data-bs-dismiss="modal" >
                                    Add product
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <footer style={{ marginTop: "2rem" }}>
                <Footer />
            </footer>
        </>
    );
};

export default Sellswags;


export async function getServerSideProps(context) {

    if (!mongoose.connections[0].readyState) {
        await mongoose.connect(process.env.MONGO_URI);
    }

    const slug1 = JSON.stringify(context.query.slug);
    const slug2 = slug1.replace(/['"]+/g, '');


    let singleuser = await User.findOne({ email: slug2.split('&')[0] });
    let usermail = slug2.split('&')[0];


    return {
        props: {

            singleuser: JSON.parse(JSON.stringify(singleuser)),
            usermail: usermail,
        }
    }
}