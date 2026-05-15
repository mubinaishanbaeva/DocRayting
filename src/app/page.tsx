import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-ds-gutter py-ds-xxl grid md:grid-cols-2 gap-ds-xl items-center">
        <div className="space-y-ds-lg">
          <h1 className="font-headline-xl text-headline-xl text-primary leading-tight">
            Book Your Doctor Appointment Easily
          </h1>
          <p className="font-body-lg text-body-lg text-secondary max-w-lg">
            Access fast and reliable medical care from the comfort of your home. Find top-rated specialists and manage your health journey in just a few clicks.
          </p>
          <div className="flex items-center gap-ds-md">
            <Link href="/booking" className="bg-primary text-white px-ds-xl py-ds-md rounded-xl font-headline-sm text-headline-sm hover:bg-primary-container transition-colors shadow-lg">
              Book Now
            </Link>
            <Link href="/about" className="bg-secondary-container text-primary px-ds-xl py-ds-md rounded-xl font-headline-sm text-headline-sm hover:bg-outline-variant transition-colors inline-flex items-center justify-center">
              Learn More
            </Link>
          </div>
          <Link href="/booking" className="flex items-center gap-ds-sm pt-ds-md hover:opacity-80 transition-opacity cursor-pointer group">
            <div className="flex -space-x-2 group-hover:scale-105 transition-transform">
              <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-variant overflow-hidden relative shadow-sm">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Doctor avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAZ3CuzNnE9G3Fyon0mDCwx53zSegg716fHlsPhmXbKju8gWxw1DUCrassZLbWZveBLEeqkNpmxBoc8uPfOus6UjtoDKlM5PISsyIRH4WEWob9eIXK1iFGY2tCVAQBlYmmbuvW0t1NEZQVhA8SwOJY3bMw7JEneF99ce_bdW1L3sVXTpE8CpciOei4HU7sS1zCjlKFfhRxfJXx4R8q3q0Uw9tGG3aCFcjMKt0iyZbbfATrR4IvN6QLQbMDMH5PYEuQOfzTBRTCCZGg"
                />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-variant overflow-hidden relative shadow-sm">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Doctor avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC-L8M_RJnzD-Pi6YX6BT4qPt-7MnwPh5GYvzYe28wW-Myj8gjSYpQKvFHCylN9Vv3QpWE3WbYvdu5K1Bh7_qatDY87Ia5Q1VTbaQlssHJbtNyJPlZi_MyhEKX2YHABQQXUpVoU2QN00H08bByIHk5QFkxNqzuQY7m3rriYogyGoIRCprQ5yT763Q8qDIFV5Xq8DgG5IfLlvNaQv9Uc43TTbujzz0rM-417IWuBuoeHf7Fn6N4Mb9T_PF6tjUUGJ0TLrp2pm3GjRZ8"
                />
              </div>
              <div className="w-10 h-10 rounded-full border-2 border-white bg-surface-variant overflow-hidden relative shadow-sm">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Doctor avatar"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBAsxppNhqZdwx3jBfAZPrmMs-VIE_rdFm5q9TC8DV6r3McYmvmU1XziM2Wgpb31LsxfgXsv0aq35aWhT92p1hypBj_5lrJ01DNFH_wgLb0H2zYF11tk2N6xEzcxHs6KnqiD7IcnlBDmUoLWNlgSY5uUNLkFQkbJOwjSHnhsmc1Xa7GnauLx_wLX63vlDAz3S-NGsdoI0Y0Vz88xYQAO1qTnCvKRKbc01jPGU1q6P1WKuhQrmopt-VyUJUuiWxSTNoh_bnddSZuynw"
                />
              </div>
            </div>
            <p className="font-label-md text-label-md text-secondary group-hover:text-primary transition-colors">Joined by 10k+ verified doctors</p>
          </Link>
        </div>
        <div className="relative">
          <div className="absolute -z-10 top-0 right-0 w-72 h-72 bg-tertiary-fixed rounded-full blur-[100px] opacity-20"></div>
          <div className="absolute -z-10 bottom-0 left-0 w-72 h-72 bg-primary-fixed rounded-full blur-[100px] opacity-30"></div>
          <div className="rounded-xxl overflow-hidden shadow-2xl border-8 border-white aspect-[4/3] relative">
            <img 
              className="w-full h-full object-cover" 
              alt="Medical consultation"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUKZQfhk_gL_dPkgWpcul_9bLbkvTXRskYfp36uYCbwVrRZQOSmlklRYqHfH_ypZBfwzt1K4qEv-goE8ybA54qnN3GMm4xzRWZE85l-ZUW31RGX8ePZrqdDxMi7ySKOUxu4ESSGWAlQJD87yq2nExk9QFRpwOKumCrTpsLOmXSU8l4IDxBvTJPsxYUQlyhA9iPSFplylXnlySiNxGiAzc47OU7udlAU8VMVk_9YHApmMaZsPRJalioTFoExrIsE_i7CQzuhKVFpa8"
            />
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-surface-container-low py-ds-xl">
        <div className="max-w-7xl mx-auto px-ds-gutter">
          <p className="text-center font-label-md text-label-md text-outline uppercase tracking-widest mb-ds-lg">Trusted by Leading Medical Institutions</p>
          <div className="flex flex-wrap justify-center items-center gap-ds-xxl opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="font-headline-sm text-headline-sm text-secondary flex items-center gap-ds-xs"><span className="material-symbols-outlined">health_and_safety</span> ClinicPlus</span>
            <span className="font-headline-sm text-headline-sm text-secondary flex items-center gap-ds-xs"><span className="material-symbols-outlined">vaccines</span> HealthCore</span>
            <span className="font-headline-sm text-headline-sm text-secondary flex items-center gap-ds-xs"><span className="material-symbols-outlined">emergency</span> VitalCare</span>
            <span className="font-headline-sm text-headline-sm text-secondary flex items-center gap-ds-xs"><span className="material-symbols-outlined">biotech</span> BioGenics</span>
            <span className="font-headline-sm text-headline-sm text-secondary flex items-center gap-ds-xs"><span className="material-symbols-outlined">medical_services</span> OmniHealth</span>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-ds-gutter py-ds-xxl">
        <div className="text-center mb-ds-xxl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-ds-md">How It Works</h2>
          <p className="font-body-md text-body-md text-secondary max-w-2xl mx-auto">Get the care you need in three simple steps. We've streamlined the process to prioritize your health and time.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-ds-xl relative">
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center mb-ds-lg shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">search</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-ds-sm">1. Find a Doctor</h3>
            <p className="font-body-sm text-body-sm text-secondary px-ds-md">Browse through our extensive directory of verified specialists by expertise and location.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center mb-ds-lg shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">calendar_month</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-ds-sm">2. Select a Slot</h3>
            <p className="font-body-sm text-body-sm text-secondary px-ds-md">Choose a time that fits your schedule from the real-time availability of your preferred doctor.</p>
          </div>
          <div className="flex flex-col items-center text-center group">
            <div className="w-16 h-16 rounded-full bg-primary-container text-white flex items-center justify-center mb-ds-lg shadow-lg group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl">verified</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-ds-sm">3. Confirm Appointment</h3>
            <p className="font-body-sm text-body-sm text-secondary px-ds-md">Receive instant confirmation and medical preparation guidelines directly to your inbox.</p>
          </div>
        </div>
      </section>

      {/* Featured Specialties */}
      <section className="bg-surface-container py-ds-xxl">
        <div className="max-w-7xl mx-auto px-ds-gutter">
          <div className="flex justify-between items-end mb-ds-xxl">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-primary mb-ds-sm">Featured Specialties</h2>
              <p className="font-body-md text-body-md text-secondary">Expert care across all major medical fields.</p>
            </div>
            <button className="text-primary font-label-md text-label-md flex items-center gap-ds-xs hover:underline">
              View All Specialties <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-ds-lg">
            <div className="bg-surface-container-lowest p-ds-lg rounded-xl card-shadow transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-red-50 text-red-600 flex items-center justify-center mb-ds-md">
                <span className="material-symbols-outlined text-2xl">favorite</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm mb-ds-xs">Cardiology</h4>
              <p className="font-body-sm text-body-sm text-secondary mb-ds-md">Heart and cardiovascular health expertise.</p>
              <span className="text-xs font-label-md bg-surface-container px-ds-sm py-1 rounded-full text-secondary">124 Doctors</span>
            </div>
            <div className="bg-surface-container-lowest p-ds-lg rounded-xl card-shadow transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-ds-md">
                <span className="material-symbols-outlined text-2xl">child_care</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm mb-ds-xs">Pediatrics</h4>
              <p className="font-body-sm text-body-sm text-secondary mb-ds-md">Dedicated care for infants and children.</p>
              <span className="text-xs font-label-md bg-surface-container px-ds-sm py-1 rounded-full text-secondary">86 Doctors</span>
            </div>
            <div className="bg-surface-container-lowest p-ds-lg rounded-xl card-shadow transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-ds-md">
                <span className="material-symbols-outlined text-2xl">stethoscope</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm mb-ds-xs">General Practice</h4>
              <p className="font-body-sm text-body-sm text-secondary mb-ds-md">Comprehensive primary health support.</p>
              <span className="text-xs font-label-md bg-surface-container px-ds-sm py-1 rounded-full text-secondary">210 Doctors</span>
            </div>
            <div className="bg-surface-container-lowest p-ds-lg rounded-xl card-shadow transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-yellow-50 text-yellow-600 flex items-center justify-center mb-ds-md">
                <span className="material-symbols-outlined text-2xl">face</span>
              </div>
              <h4 className="font-headline-sm text-headline-sm mb-ds-xs">Dermatology</h4>
              <p className="font-body-sm text-body-sm text-secondary mb-ds-md">Skin, hair, and nail health specialists.</p>
              <span className="text-xs font-label-md bg-surface-container px-ds-sm py-1 rounded-full text-secondary">65 Doctors</span>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-ds-gutter py-ds-xxl">
        <div className="text-center mb-ds-xxl">
          <h2 className="font-headline-lg text-headline-lg text-primary mb-ds-md">What Our Patients Say</h2>
          <div className="flex justify-center gap-ds-xs text-yellow-500">
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
            <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>star</span>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-ds-xl">
          <div className="bg-white p-ds-xl rounded-xxl card-shadow border border-surface-container relative overflow-hidden">
            <span className="material-symbols-outlined absolute -right-4 -top-4 text-primary opacity-5 text-9xl">format_quote</span>
            <p className="font-body-lg text-body-lg text-on-surface-variant italic mb-ds-xl relative z-10">
              "DocRayting made finding a pediatrician for my son so incredibly stress-free. I could see real reviews and book a slot that actually worked for our busy family schedule. The confirmation was instant!"
            </p>
            <div className="flex items-center gap-ds-md">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden relative">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAAiowS72mOze0_ElkxHqmG5QNmarIZ3W4e_5rCn-jU0YeJTWp6LZo2dndQ3Br52AKvK4NKnbed2LXJj4XAmMsNlpJNSfuq1bKp5jXRrpkcbO1k1M1blk87KsmufAMoayTb_p7804IkyFfV_yeqpXjOB-YbBeAxHJLyhTcyeeNUmLuRZDpmCYzK5HpVXKM8wowALlwhjixQcDWy2IA7B9WNw4UEJkWcvnZseMGfrp1dxS7ViKu8sRY4i-Tp7Rjr6dWcCpGhqNLy2oE" alt="Patient" />
              </div>
              <div>
                <h5 className="font-label-md text-label-md text-on-surface">Sarah Mitchell</h5>
                <p className="text-xs text-secondary">Patient since March 2024</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-ds-xl rounded-xxl card-shadow border border-surface-container relative overflow-hidden">
            <span className="material-symbols-outlined absolute -right-4 -top-4 text-primary opacity-5 text-9xl">format_quote</span>
            <p className="font-body-lg text-body-lg text-on-surface-variant italic mb-ds-xl relative z-10">
              "As someone who travels frequently, managing my specialist appointments through this platform has been a game changer. The interface is intuitive, and I always feel like I'm in good hands."
            </p>
            <div className="flex items-center gap-ds-md">
              <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center overflow-hidden relative">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXngYlDM6TAeVQ-Y429flMB2zt4ciAA9P5eXRMe6s-uxlBg9e-E8nMcjN70XDEETd62oGVXoeVEht_hudA_wjYWNNIMTgxA9zMz6T0kNxRysXtWYCHy5f2cfoxtTW0xaad3Ap3RTA6bbtwAul37OYxFiMN9POZUcQO3w1nMsce2L2qfHvqOUzVvY76qnQi0SJNxatdUQzLBGPgQ0O7smuWpbeJhFhhisQvOjdBxipjqM-i3e_Bn-TNBS_nuALC5rjHuJZdcB0tXAk" alt="Patient" />
              </div>
              <div>
                <h5 className="font-label-md text-label-md text-on-surface">James Wilson</h5>
                <p className="text-xs text-secondary">Patient since January 2024</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-ds-gutter mb-ds-xxl">
        <div className="bg-primary-container rounded-xxl p-ds-xxl text-white text-center relative overflow-hidden shadow-xl">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
              <path d="M0 100 C 20 0 50 0 100 100 Z" fill="currentColor"></path>
            </svg>
          </div>
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-headline-xl text-headline-xl mb-ds-md">Ready to prioritize your health?</h2>
            <p className="font-body-lg text-body-lg mb-ds-xl opacity-90">Join thousands of patients who have simplified their medical journey with DocRayting.</p>
            <Link href="/booking" className="bg-white text-primary px-ds-xxl py-ds-md rounded-xl font-headline-sm text-headline-sm hover:bg-surface-bright transition-colors inline-block">
              Book Your First Appointment
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
