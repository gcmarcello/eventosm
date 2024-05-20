import { LockClosedIcon } from "@heroicons/react/24/outline";
import { BarcodeDetector } from "barcode-detector/pure";
import BarcodeIcon from "node_modules/odinkit/src/icons/BarcodeIcon";
import PixIcon from "node_modules/odinkit/src/icons/PixIcon";
import { Button } from "odinkit/client";

export function CheckoutForm() {
  const total = "R$ 141,92";
  return (
    <section
      aria-labelledby="payment-heading"
      className="overflow-y-auto pb-16 pt-12 sm:px-6 sm:pt-16 lg:pb-24 lg:pt-0"
    >
      <h2 id="payment-heading" className="sr-only">
        Payment and shipping details
      </h2>

      <div className="mx-auto max-w-lg lg:pt-8">
        <div className="flex flex-col gap-3">
          <Button className={"w-full"} color="teal">
            <PixIcon />
            <span className="font-semibold">Pagar com Pix</span>
          </Button>

          <Button className={"w-full"} color="black">
            <BarcodeIcon />
            <span className="font-semibold">Pagar com Boleto</span>
          </Button>
        </div>

        <div className="relative mt-8">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-4 text-sm font-medium text-gray-500">
              or
            </span>
          </div>
        </div>

        <form className="mt-6">
          <div className="grid grid-cols-12 gap-x-4 gap-y-6">
            <div className="col-span-full">
              <label
                htmlFor="email-address"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email-address"
                  name="email-address"
                  autoComplete="email"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="name-on-card"
                className="block text-sm font-medium text-gray-700"
              >
                Name on card
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="name-on-card"
                  name="name-on-card"
                  autoComplete="cc-name"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="card-number"
                className="block text-sm font-medium text-gray-700"
              >
                Card number
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="card-number"
                  name="card-number"
                  autoComplete="cc-number"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-8 sm:col-span-9">
              <label
                htmlFor="expiration-date"
                className="block text-sm font-medium text-gray-700"
              >
                Expiration date (MM/YY)
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="expiration-date"
                  id="expiration-date"
                  autoComplete="cc-exp"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-4 sm:col-span-3">
              <label
                htmlFor="cvc"
                className="block text-sm font-medium text-gray-700"
              >
                CVC
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  name="cvc"
                  id="cvc"
                  autoComplete="csc"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-full">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="address"
                  name="address"
                  autoComplete="street-address"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-full sm:col-span-4">
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="city"
                  name="city"
                  autoComplete="address-level2"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-full sm:col-span-4">
              <label
                htmlFor="region"
                className="block text-sm font-medium text-gray-700"
              >
                State / Province
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="region"
                  name="region"
                  autoComplete="address-level1"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="col-span-full sm:col-span-4">
              <label
                htmlFor="postal-code"
                className="block text-sm font-medium text-gray-700"
              >
                Postal code
              </label>
              <div className="mt-1">
                <input
                  type="text"
                  id="postal-code"
                  name="postal-code"
                  autoComplete="postal-code"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          <div className="mt-6 flex space-x-2">
            <div className="flex h-5 items-center">
              <input
                id="same-as-shipping"
                name="same-as-shipping"
                type="checkbox"
                defaultChecked
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
            <label
              htmlFor="same-as-shipping"
              className="text-sm font-medium text-gray-900"
            >
              Billing address is the same as shipping address
            </label>
          </div>

          <button
            type="submit"
            className="mt-6 w-full rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Pay {total}
          </button>

          <p className="mt-6 flex justify-center text-sm font-medium text-gray-500">
            <LockClosedIcon
              className="mr-1.5 h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
            Payment details stored in plain text
          </p>
        </form>
      </div>
    </section>
  );
}
