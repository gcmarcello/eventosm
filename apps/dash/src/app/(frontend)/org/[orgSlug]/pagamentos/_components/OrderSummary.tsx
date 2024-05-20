import { useContext } from "react";
import { PaymentContext } from "../context/Payment.ctx";
import { For } from "odinkit";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

export function OrderSummary({ products }: { products: any[] }) {
  const subtotal = "$108.00";
  const discount = { code: "CHEAPSKATE", amount: "$16.00" };
  const taxes = "$9.92";
  const shipping = "$8.00";
  const total = "$141.92";
  const { events, eventGroups, payment } = useContext(PaymentContext);
  return (
    <section
      aria-labelledby="summary-heading"
      className="hidden w-full flex-col bg-gray-50 lg:flex"
    >
      <h2 id="summary-heading" className="sr-only">
        Order summary
      </h2>

      <ul
        role="list"
        className="flex-auto divide-y divide-gray-200 overflow-y-auto px-6"
      >
        {events.map((event) => (
          <li key={event.id} className="flex space-x-6 py-6">
            <img
              src={event.imageUrl ?? ""}
              className="h-40 w-40 flex-none rounded-md bg-gray-200 object-cover object-center"
            />
            <div className="flex flex-col justify-between space-y-4">
              <div className="space-y-1 text-sm font-medium">
                <h3 className="text-gray-900">{event.name}</h3>
                <Disclosure as="div" className="px-6 pb-6" defaultOpen={true}>
                  <DisclosureButton className="group flex w-full items-center justify-between">
                    {
                      payment.EventRegistration.filter(
                        (reg) => reg.eventId === event.id
                      ).length
                    }
                    x Inscrições
                    <ChevronDownIcon className="size-5 fill-white/60 group-data-[open]:rotate-180 group-data-[hover]:fill-white/50" />
                  </DisclosureButton>
                  <DisclosurePanel className="mt-2 text-sm/5 text-white/50">
                    <ul className="list-disc ps-5">
                      <For
                        each={payment.EventRegistration.filter(
                          (reg) => reg.eventId === event.id
                        )}
                      >
                        {(reg) => (
                          <li className="text-gray-500">
                            {reg.user.fullName} - {reg.category.name}
                          </li>
                        )}
                      </For>
                    </ul>
                  </DisclosurePanel>
                </Disclosure>

                {/* <p className="text-gray-900">{product.price}</p>
                <p className="text-gray-500">{product.color}</p>
                <p className="text-gray-500">{product.size}</p> */}
              </div>
              <div className="flex space-x-4">
                <button
                  type="button"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Edit
                </button>
                <div className="flex border-l border-gray-300 pl-4">
                  <button
                    type="button"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="sticky bottom-0 flex-none border-t border-gray-200 bg-gray-50 p-6">
        <form>
          <label
            htmlFor="discount-code"
            className="block text-sm font-medium text-gray-700"
          >
            Discount code
          </label>
          <div className="mt-1 flex space-x-4">
            <input
              type="text"
              id="discount-code"
              name="discount-code"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <button
              type="submit"
              className="rounded-md bg-gray-200 px-4 text-sm font-medium text-gray-600 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-50"
            >
              Apply
            </button>
          </div>
        </form>

        <dl className="mt-10 space-y-6 text-sm font-medium text-gray-500">
          <div className="flex justify-between">
            <dt>Subtotal</dt>
            <dd className="text-gray-900">{subtotal}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="flex">
              Discount
              <span className="ml-2 rounded-full bg-gray-200 px-2 py-0.5 text-xs tracking-wide text-gray-600">
                {discount.code}
              </span>
            </dt>
            <dd className="text-gray-900">-{discount.amount}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Taxes</dt>
            <dd className="text-gray-900">{taxes}</dd>
          </div>
          <div className="flex justify-between">
            <dt>Shipping</dt>
            <dd className="text-gray-900">{shipping}</dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900">
            <dt>Total</dt>
            <dd className="text-base">{total}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
