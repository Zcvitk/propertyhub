import { getHomepageCarouselProperties } from "@/lib/apiProperties";
import HomepageActions from "@/components/home/HomepageActions";

export default async function Homepage() {
  const carouselProperties = await getHomepageCarouselProperties();

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100 px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto flex max-w-6xl flex-col gap-16">
        <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-yellow-500">
            PropertyHub
          </p>

          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">
            Manage properties and bookings in one place.
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg">
            PropertyHub helps owners list properties, manage reservations, and
            keep bookings organized with a clean dashboard experience.
          </p>

          <HomepageActions />
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-100">
              Manage properties
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Create, edit, and organize listings from one dashboard.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-100">
              Track bookings
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              View guest bookings and reservation activity in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-800 bg-gray-900 p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-100">
              Stay organized
            </h2>
            <p className="mt-3 text-sm leading-6 text-gray-400">
              Keep booking dates, property details, and actions easy to manage.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-gray-800 bg-gray-900 px-6 py-10 text-center sm:px-10">
          <p className="text-xl font-semibold leading-tight sm:text-2xl uppercase tracking-[0.2em]">
            Featured properties
          </p>

          <div className="relative mt-8 overflow-hidden rounded-2xl border border-gray-800">
            <div className="pointer-events-none absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-gray-900 to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-gray-900 to-transparent z-10" />

            <div className="flex w-max gap-4 p-2 animate-marquee">
              {[...carouselProperties, ...carouselProperties].map(
                (property, index) => (
                  <a
                    key={`${property.id}-${index}`}
                    href={`/properties/${property.id}`}
                    className="shrink-0 overflow-hidden rounded-2xl"
                  >
                    <img
                      src={property.image}
                      alt={property.title}
                      className="h-40 w-64 object-cover transition-transform duration-300 ease-out hover:scale-105"
                    />
                  </a>
                ),
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
