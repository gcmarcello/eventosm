"use client";
import { Disclosure } from "@headlessui/react";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { OrderSummary } from "./OrderSummary";
import { CheckoutForm } from "./CheckoutForm";
import { MobileOrderSummary } from "./MobileOrderSummary";
import { Organization } from "@prisma/client";
import { PaymentProvider } from "../context/PaymentProvider";
import { useContext } from "react";
import { PaymentContext } from "../context/Payment.ctx";

const subtotal = "$108.00";
const discount = { code: "CHEAPSKATE", amount: "$16.00" };
const taxes = "$9.92";
const shipping = "$8.00";
const total = "$141.92";
const products = [
  {
    id: 1,
    name: "Mountain Mist Artwork Tee",
    href: "#",
    price: "$36.00",
    color: "Birch",
    size: "L",
    imageSrc:
      "https://tailwindui.com/img/ecommerce-images/checkout-form-04-product-01.jpg",
    imageAlt:
      "Off-white t-shirt with circular dot illustration on the front of mountain ridges that fade.",
  },
  // More products...
];

export default function PaymentContainer() {
  const { organization } = useContext(PaymentContext);
  return (
    <>
      <main>
        <h1 className="sr-only">Checkout</h1>
        <MobileOrderSummary products={products} />
        <div className="col-start grid px-3 lg:grid-cols-2">
          <CheckoutForm />
          <OrderSummary products={products} />
        </div>
      </main>
    </>
  );
}
